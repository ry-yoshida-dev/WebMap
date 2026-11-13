import type { Map as MapLibreMap } from "maplibre-gl";
import type { Basemap } from "@web-map/core";

import type { MapLabels } from "../map/MapLabels.js";

/**
 * Options of {@link LiveMapControls}.
 */
export interface LiveMapControlsProps {
  readonly map: MapLibreMap;
  readonly basemap: Basemap;
  readonly labels: MapLabels;
}
