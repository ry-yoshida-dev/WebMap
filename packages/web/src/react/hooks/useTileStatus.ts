import { useEffect, useState } from "react";
import type { Basemap } from "@web-map/core";

import { isMissingTileError } from "../../status/isMissingTileError.js";
import type { MapErrorEvent } from "./MapErrorEvent.js";
import type { MapInstance } from "./MapInstance.js";
import { MapInstanceStatus } from "./MapInstanceStatus.js";
import { TileStatus } from "./TileStatus.js";

/**
 * Follow the loading and failures of the basemap's tiles; failures are cleared when the basemap changes.
 *
 * Failures of the terrain's or the application's sources, and tiles outside a provider's coverage, are not counted.
 *
 * @param instance - Map to watch; loading until it is ready.
 * @param basemap - Basemap on screen.
 * @returns The tile status.
 */
export function useTileStatus(instance: MapInstance, basemap: Basemap): TileStatus {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [failedBasemap, setFailedBasemap] = useState<Basemap | null>(null);

  useEffect(() => {
    if (instance.status !== MapInstanceStatus.READY) {
      return undefined;
    }
    const { map, isBasemapError } = instance;
    const onDataLoading = (): void => setIsLoading(true);
    const onIdle = (): void => setIsLoading(false);
    const onError = (event: MapErrorEvent): void => {
      if (!isMissingTileError(event.error) && isBasemapError(event)) {
        setFailedBasemap(basemap);
      }
    };
    map.on("dataloading", onDataLoading);
    map.on("idle", onIdle);
    map.on("error", onError);
    return () => {
      map.off("dataloading", onDataLoading);
      map.off("idle", onIdle);
      map.off("error", onError);
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
