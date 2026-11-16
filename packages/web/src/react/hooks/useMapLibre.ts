"use client";

import { useEffect, useRef, useState } from "react";
import { ErrorEvent, Map as MapLibreMap, ScaleControl } from "maplibre-gl";

import { AppearanceChange } from "./AppearanceChange.js";
import { applyTerrain } from "../../terrain/applyTerrain.js";
import { compareAppearance } from "./compareAppearance.js";
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
import { withDefaultGlyphs } from "../../style/withDefaultGlyphs.js";
import { withTerrain } from "../../style/withTerrain.js";
import type { MapStyle } from "../../style/MapStyle.js";

/**
 * Create a MapLibre map in a container and keep its basemap, grayscale and terrain in step with `appearance`,
 * carrying the application's overlays across basemap changes.
 *
 * A new basemap or grayscale setting diffs the basemap's style into the map, so the style stays loaded throughout
 * and overlays, their images and their feature states are kept; a new terrain or exaggeration only swaps the terrain.
 * Overlays sharing ids with the next basemap are left off and reported as an `OverlayConflictError` `error` event.
 * When the map cannot be created or its first style cannot be loaded, choosing another basemap or grayscale setting
 * creates it again, since MapLibre cannot replace a style that never loaded.
 *
 * @param container - Element the map fills, or null before it mounts.
 * @param appearance - Basemap, grayscale and terrain to show; the map is created with the first one given.
 * @param options - Camera, hash setting and default glyphs the map starts with.
 * @returns The map's lifecycle; failed when the map cannot be created or its first style cannot be loaded, until
 *   another basemap or grayscale setting is chosen.
 */
export function useMapLibre(container: HTMLElement | null, appearance: MapAppearance, options: MapLibreOptions): MapInstance {
  const [instance, setInstance] = useState<MapInstance>({ status: MapInstanceStatus.LOADING });
  const initialOptionsRef: { current: MapLibreOptions } = useRef(options);
  const shownRef: { current: MapAppearance } = useRef(appearance);
  // True from asking for a style URL until its document has arrived or failed, while errors without a source are the
  // style's. Each request is numbered, so the end of one that failed does not end a later one.
  const isStyleFetchingRef: { current: boolean } = useRef(false);
  const styleRequestRef: { current: number } = useRef(0);
  // Counts the maps created after a failure, so changing it creates the map again.
  const [attempt, setAttempt] = useState<number>(0);

  useEffect(() => {
    if (container === null) {
      return undefined;
    }
    const { camera, isHashSynced, glyphsUrl }: MapLibreOptions = initialOptionsRef.current;
    registerGsiElevationProtocol();
    let map: MapLibreMap | null = null;
    const carrier: OverlayCarrier = new OverlayCarrier((error: Error) => map?.fire(new ErrorEvent(error)));
    const style: MapStyle | string = toMapStyle(shownRef.current.basemap);
    isStyleFetchingRef.current = typeof style === "string";
    styleRequestRef.current += 1;
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
          const basemapStyle: MapStyle = withDefaultGlyphs(isGrayscale ? toGrayscaleStyle(next) : next, glyphsUrl);
          return withTerrain(carrier.carry(previous, basemapStyle), terrain, terrainExaggeration);
        },
      });
    } catch (error: unknown) {
      setInstance({ status: MapInstanceStatus.FAILED, message: error instanceof Error ? error.message : String(error) });
      return undefined;
    }
    const created: MapLibreMap = map;
    const isBasemapSource = (sourceId: string): boolean => carrier.isBasemapSource(sourceId);
    const isShownBasemapError = (event: MapErrorEvent): boolean => isBasemapError(event, isBasemapSource, isStyleFetchingRef.current);
    const onError = (event: MapErrorEvent): void => {
      if (event.sourceId !== undefined || !isStyleFetchingRef.current) {
        return;
      }
      // The style document failed. The fetch ends once every listener, as the tile status's, has classified this
      // error as the basemap's.
      const request: number = styleRequestRef.current;
      queueMicrotask(() => {
        if (styleRequestRef.current === request) {
          isStyleFetchingRef.current = false;
        }
      });
    };
    created.on("error", onError);
    created.addControl(new ScaleControl(), "bottom-left");
    followFirstLoad(
      created,
      () => setInstance({ status: MapInstanceStatus.READY, map: created, isBasemapError: isShownBasemapError, isBasemapSource }),
      (message: string) => setInstance({ status: MapInstanceStatus.FAILED, message }),
    );
    return () => {
      setInstance({ status: MapInstanceStatus.LOADING });
      created.off("error", onError);
      created.remove();
    };
  }, [container, attempt]);

  const map: MapLibreMap | null = instance.status === MapInstanceStatus.READY ? instance.map : null;
  const isFailed: boolean = instance.status === MapInstanceStatus.FAILED;
  const { basemap, isGrayscale, terrain, terrainExaggeration }: MapAppearance = appearance;
  useEffect(() => {
    if (!isFailed) {
      return;
    }
    const next: MapAppearance = { basemap, isGrayscale, terrain, terrainExaggeration };
    const change: AppearanceChange = compareAppearance(shownRef.current, next);
    shownRef.current = next;
    if (change === AppearanceChange.RELOAD_STYLE) {
      setAttempt((count: number) => count + 1);
    }
  }, [isFailed, basemap, isGrayscale, terrain, terrainExaggeration]);

  useEffect(() => {
    // While the map loads, `shownRef` keeps what it was created with, so changes made meanwhile are applied here
    // once it is ready.
    if (map === null) {
      return;
    }
    const next: MapAppearance = { basemap, isGrayscale, terrain, terrainExaggeration };
    const change: AppearanceChange = compareAppearance(shownRef.current, next);
    shownRef.current = next;
    switch (change) {
      case AppearanceChange.RELOAD_STYLE: {
        // A diff keeps the style loaded, so overlays can be changed while a style basemap's document is fetched, and
        // keeps images the application added. `transformStyle` reads the terrain from `shownRef` when the diff applies.
        const style: MapStyle | string = toMapStyle(basemap);
        isStyleFetchingRef.current = typeof style === "string";
        styleRequestRef.current += 1;
        map.setStyle(style, { diff: true });
        break;
      }
      case AppearanceChange.SWAP_TERRAIN:
        applyTerrain(map, terrain, terrainExaggeration);
        break;
      case AppearanceChange.NONE:
        break;
      default: {
        const unreachable: never = change;
        throw new TypeError(`Unknown appearance change ${String(unreachable)}`);
      }
    }
  }, [map, basemap, isGrayscale, terrain, terrainExaggeration]);

  return instance;
}
