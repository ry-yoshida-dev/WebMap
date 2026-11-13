import type { Map as MapLibreMap } from "maplibre-gl";

import type { MapErrorEvent } from "./MapErrorEvent.js";
import type { MapInstanceStatus } from "./MapInstanceStatus.js";

/**
 * Lifecycle of the MapLibre map behind a {@link WebMap}.
 */
export type MapInstance =
  | { readonly status: MapInstanceStatus.LOADING }
  | {
      readonly status: MapInstanceStatus.READY;
      readonly map: MapLibreMap;
      /**
       * Whether an `error` event of the map concerns the basemap on screen: its style, sprite or one of its sources,
       * rather than the terrain or the application's overlays.
       */
      readonly isBasemapError: (event: MapErrorEvent) => boolean;
    }
  | { readonly status: MapInstanceStatus.FAILED; readonly message: string };
