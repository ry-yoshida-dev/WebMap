import type { MapSourceDataEvent } from "maplibre-gl";

import type { MapErrorEvent } from "./MapErrorEvent.js";
import type { MapInstanceStatus } from "./MapInstanceStatus.js";

/**
 * What {@link useTileStatus} uses of a map's events.
 */
export interface TileEventTarget {
  on(type: "dataloading" | "idle", listener: () => void): unknown;
  on(type: "error", listener: (event: MapErrorEvent) => void): unknown;
  on(type: "sourcedata", listener: (event: MapSourceDataEvent) => void): unknown;
  off(type: "dataloading" | "idle", listener: () => void): unknown;
  off(type: "error", listener: (event: MapErrorEvent) => void): unknown;
  off(type: "sourcedata", listener: (event: MapSourceDataEvent) => void): unknown;
}

/**
 * What {@link useTileStatus} uses of a map's lifecycle; a {@link MapInstance} is one.
 */
export type TileStatusSource =
  | { readonly status: MapInstanceStatus.LOADING | MapInstanceStatus.FAILED }
  | {
      readonly status: MapInstanceStatus.READY;
      readonly map: TileEventTarget;
      readonly isBasemapError: (event: MapErrorEvent) => boolean;
      readonly isBasemapSource: (sourceId: string) => boolean;
    };
