import { useEffect, useRef, useState } from "react";
import { ErrorEvent, Map as MapLibreMap, ScaleControl } from "maplibre-gl";

import { applyTerrain } from "../../terrain/applyTerrain.js";
import { followFirstLoad } from "../../status/followFirstLoad.js";
import { isBasemapError } from "../../status/isBasemapError.js";
import type { MapAppearance } from "./MapAppearance.js";
import type { MapErrorEvent } from "./MapErrorEvent.js";
import type { MapInstance } from "./MapInstance.js";
import { MapInstanceStatus } from "./MapInstanceStatus.js";
import type { MapLibreOptions } from "./MapLibreOptions.js";
import { OverlayCarrier } from "../../style/OverlayCarrier.js";
import { registerGsiElevationProtocol } from "../../terrain/gsiElevationProtocol.js";
import { toGrayscaleStyle } from "../../style/toGrayscaleStyle.js";
import { toMapStyle } from "../../style/toMapStyle.js";
import { withTerrain } from "../../style/withTerrain.js";
import type { MapStyle } from "../../style/MapStyle.js";

/**
 * Create a MapLibre map in a container and keep its basemap, grayscale and terrain in step with `appearance`,
 * carrying the application's overlays across basemap changes.
 *
 * A new basemap or grayscale setting diffs the basemap's style into the map, so the style stays loaded throughout
 * and overlays, their images and their feature states are kept; a new terrain or exaggeration only swaps the terrain.
 * Overlays sharing ids with the next basemap are left off and reported as an `OverlayConflictError` `error` event.
 *
 * @param container - Element the map fills, or null before it mounts.
 * @param appearance - Basemap, grayscale and terrain to show; the map is created with the first one given.
 * @param options - Camera and hash setting the map starts with.
 * @returns The map's lifecycle; failed when the map cannot be created or its first style cannot be loaded.
 */
export function useMapLibre(container: HTMLElement | null, appearance: MapAppearance, options: MapLibreOptions): MapInstance {
  const [instance, setInstance] = useState<MapInstance>({ status: MapInstanceStatus.LOADING });
  const initialOptionsRef: { current: MapLibreOptions } = useRef(options);
  const shownRef: { current: MapAppearance } = useRef(appearance);
  // True from asking for a style URL until its document has arrived, while errors without a source are the style's.
  const isStyleFetchingRef: { current: boolean } = useRef(false);

  useEffect(() => {
    if (container === null) {
      return undefined;
    }
    const { camera, isHashSynced }: MapLibreOptions = initialOptionsRef.current;
    registerGsiElevationProtocol();
    let map: MapLibreMap | null = null;
    const carrier: OverlayCarrier = new OverlayCarrier((error: Error) => map?.fire(new ErrorEvent(error)));
    const style: MapStyle | string = toMapStyle(shownRef.current.basemap);
    isStyleFetchingRef.current = typeof style === "string";
    try {
      map = new MapLibreMap({
        container,
        style,
        center: [camera.center.lng, camera.center.lat],
        zoom: camera.zoom,
        bearing: camera.bearing,
        pitch: camera.pitch,
        hash: isHashSynced,
        // Also applied by every later `setStyle`: the basemap is turned gray before the overlays are carried onto it,
        // and the terrain is set last, so it is never mistaken for the basemap's or an overlay.
        transformStyle: (previous, next) => {
          isStyleFetchingRef.current = false;
          const { isGrayscale, terrain, terrainExaggeration }: MapAppearance = shownRef.current;
          return withTerrain(carrier.carry(previous, isGrayscale ? toGrayscaleStyle(next) : next), terrain, terrainExaggeration);
        },
      });
    } catch (error: unknown) {
      setInstance({ status: MapInstanceStatus.FAILED, message: error instanceof Error ? error.message : String(error) });
      return undefined;
    }
    const created: MapLibreMap = map;
    const isShownBasemapError = (event: MapErrorEvent): boolean =>
      isBasemapError(event, (sourceId: string) => carrier.isBasemapSource(sourceId), isStyleFetchingRef.current);
    created.addControl(new ScaleControl(), "bottom-left");
    followFirstLoad(
      created,
      () => setInstance({ status: MapInstanceStatus.READY, map: created, isBasemapError: isShownBasemapError }),
      (message: string) => setInstance({ status: MapInstanceStatus.FAILED, message }),
    );
    return () => {
      setInstance({ status: MapInstanceStatus.LOADING });
      created.remove();
    };
  }, [container]);

  const map: MapLibreMap | null = instance.status === MapInstanceStatus.READY ? instance.map : null;
  const { basemap, isGrayscale, terrain, terrainExaggeration }: MapAppearance = appearance;
  useEffect(() => {
    const shown: MapAppearance = shownRef.current;
    if (map === null) {
      return;
    }
    const isBasemapReloaded: boolean = shown.basemap !== basemap || shown.isGrayscale !== isGrayscale;
    const isTerrainChanged: boolean = shown.terrain !== terrain || shown.terrainExaggeration !== terrainExaggeration;
    shownRef.current = { basemap, isGrayscale, terrain, terrainExaggeration };
    if (isBasemapReloaded) {
      // A diff keeps the style loaded, so overlays can be changed while a style basemap's document is fetched, and
      // keeps images the application added. `transformStyle` reads the terrain from `shownRef` when the diff applies.
      const style: MapStyle | string = toMapStyle(basemap);
      isStyleFetchingRef.current = typeof style === "string";
      map.setStyle(style, { diff: true });
    } else if (isTerrainChanged) {
      applyTerrain(map, terrain, terrainExaggeration);
    }
  }, [map, basemap, isGrayscale, terrain, terrainExaggeration]);

  return instance;
}
