import { useEffect, useState } from "react";
import type { ErrorEvent, Map as MapLibreMap } from "maplibre-gl";
import type { Basemap } from "@web-map/core";

import { isMissingTileError } from "../../status/isMissingTileError.js";
import { TileStatus } from "./TileStatus.js";

/**
 * Follow tile loading and failures of a map; failures are cleared when the basemap changes.
 *
 * @param map - Map to watch.
 * @param basemap - Basemap on screen.
 * @returns The tile status.
 */
export function useTileStatus(map: MapLibreMap, basemap: Basemap): TileStatus {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [failedBasemap, setFailedBasemap] = useState<Basemap | null>(null);

  useEffect(() => {
    const onDataLoading = (): void => setIsLoading(true);
    const onIdle = (): void => setIsLoading(false);
    const onError = (event: ErrorEvent): void => {
      if (!isMissingTileError(event.error)) {
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
  }, [map, basemap]);

  if (failedBasemap === basemap) {
    return TileStatus.FAILED;
  }
  return isLoading ? TileStatus.LOADING : TileStatus.IDLE;
}
