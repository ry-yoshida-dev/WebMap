import type { Map as MapLibreMap } from "maplibre-gl";

import type { MapInstanceStatus } from "./MapInstanceStatus.js";

/**
 * Lifecycle of the MapLibre map behind a {@link WebMap}.
 */
export type MapInstance =
  | { readonly status: MapInstanceStatus.LOADING }
  | { readonly status: MapInstanceStatus.READY; readonly map: MapLibreMap }
  | { readonly status: MapInstanceStatus.FAILED; readonly message: string };
