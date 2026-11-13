import { useEffect, useRef, useState } from "react";
import { Map as MapLibreMap, ScaleControl } from "maplibre-gl";

import { applyTerrain } from "../../terrain/applyTerrain.js";
import type { MapAppearance } from "./MapAppearance.js";
import type { MapInstance } from "./MapInstance.js";
import { MapInstanceStatus } from "./MapInstanceStatus.js";
import type { MapLibreOptions } from "./MapLibreOptions.js";
import { OverlayCarrier } from "../../style/OverlayCarrier.js";
import { registerGsiElevationProtocol } from "../../terrain/gsiElevationProtocol.js";
import { toGrayscaleStyle } from "../../style/toGrayscaleStyle.js";
import { toMapStyle } from "../../style/toMapStyle.js";
import { withTerrain } from "../../style/withTerrain.js";

/**
 * Create a MapLibre map in a container and keep its basemap, grayscale and terrain in step with `appearance`,
 * carrying the application's overlays across basemap changes.
 *
 * A new basemap or grayscale setting diffs the basemap's style into the map, so the style stays loaded throughout
 * and overlays, their images and their feature states are kept; a new terrain or exaggeration only swaps the terrain.
 *
 * @param container - Element the map fills, or null before it mounts.
 * @param appearance - Basemap, grayscale and terrain to show; the map is created with the first one given.
 * @param options - Camera and hash setting the map starts with.
 * @returns The map's lifecycle.
 */
export function useMapLibre(container: HTMLElement | null, appearance: MapAppearance, options: MapLibreOptions): MapInstance {
  const [instance, setInstance] = useState<MapInstance>({ status: MapInstanceStatus.LOADING });
  const initialOptionsRef: { current: MapLibreOptions } = useRef(options);
  const carrierRef: { current: OverlayCarrier } = useRef(new OverlayCarrier());
  const shownRef: { current: MapAppearance } = useRef(appearance);

  useEffect(() => {
    if (container === null) {
      return undefined;
    }
    const { camera, isHashSynced }: MapLibreOptions = initialOptionsRef.current;
    const carrier: OverlayCarrier = carrierRef.current;
    registerGsiElevationProtocol();
    let map: MapLibreMap;
    try {
      map = new MapLibreMap({
        container,
        style: toMapStyle(shownRef.current.basemap),
        center: [camera.center.lng, camera.center.lat],
        zoom: camera.zoom,
        bearing: camera.bearing,
        pitch: camera.pitch,
        hash: isHashSynced,
        // Also applied by every later `setStyle`: the basemap is turned gray before the overlays are carried onto it,
        // and the terrain is set last, so it is never mistaken for the basemap's or an overlay.
        transformStyle: (previous, next) => {
          const { isGrayscale, terrain, terrainExaggeration }: MapAppearance = shownRef.current;
          return withTerrain(carrier.carry(previous, isGrayscale ? toGrayscaleStyle(next) : next), terrain, terrainExaggeration);
        },
      });
    } catch (error: unknown) {
      setInstance({ status: MapInstanceStatus.FAILED, message: error instanceof Error ? error.message : String(error) });
      return undefined;
    }
    map.addControl(new ScaleControl(), "bottom-left");
    map.once("load", () => {
      setInstance({ status: MapInstanceStatus.READY, map });
    });
    return () => {
      setInstance({ status: MapInstanceStatus.LOADING });
      map.remove();
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
      map.setStyle(toMapStyle(basemap), { diff: true });
    } else if (isTerrainChanged) {
      applyTerrain(map, terrain, terrainExaggeration);
    }
  }, [map, basemap, isGrayscale, terrain, terrainExaggeration]);

  return instance;
}
