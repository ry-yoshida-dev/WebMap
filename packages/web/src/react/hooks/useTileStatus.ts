import { useEffect, useState } from "react";
import type { MapSourceDataEvent } from "maplibre-gl";
import type { Basemap } from "@web-map/core";

import { isMissingTileError } from "../../status/isMissingTileError.js";
import type { MapErrorEvent } from "./MapErrorEvent.js";
import { MapInstanceStatus } from "./MapInstanceStatus.js";
import { TileStatus } from "./TileStatus.js";
import type { TileStatusSource } from "./TileStatusSource.js";

/**
 * Follow the loading and failures of the basemap's tiles; a failure is cleared when the basemap changes or one of
 * its tiles loads afterwards.
 *
 * Failures of the terrain's or the application's sources, and tiles outside a provider's coverage, are not counted.
 *
 * @param instance - Map to watch, such as a {@link MapInstance}; loading until it is ready.
 * @param basemap - Basemap on screen.
 * @returns The tile status.
 */
export function useTileStatus(instance: TileStatusSource, basemap: Basemap): TileStatus {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [failedBasemap, setFailedBasemap] = useState<Basemap | null>(null);

  useEffect(() => {
    if (instance.status !== MapInstanceStatus.READY) {
      return undefined;
    }
    const { map, isBasemapError, isBasemapSource } = instance;
    const onDataLoading = (): void => setIsLoading(true);
    const onIdle = (): void => setIsLoading(false);
    const onError = (event: MapErrorEvent): void => {
      if (!isMissingTileError(event.error) && isBasemapError(event)) {
        setFailedBasemap(basemap);
      }
    };
    const onSourceData = (event: MapSourceDataEvent): void => {
      if (event.tile !== undefined && isBasemapSource(event.sourceId)) {
        setFailedBasemap(null);
      }
    };
    map.on("dataloading", onDataLoading);
    map.on("idle", onIdle);
    map.on("error", onError);
    map.on("sourcedata", onSourceData);
    return () => {
      map.off("dataloading", onDataLoading);
      map.off("idle", onIdle);
      map.off("error", onError);
      map.off("sourcedata", onSourceData);
    };
  }, [instance, basemap]);

  if (instance.status !== MapInstanceStatus.READY) {
    return TileStatus.LOADING;
  }
  if (failedBasemap === basemap) {
    return TileStatus.FAILED;
  }
  return isLoading ? TileStatus.LOADING : TileStatus.IDLE;
}
