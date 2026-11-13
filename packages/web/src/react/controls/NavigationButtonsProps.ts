import type { Map as MapLibreMap } from "maplibre-gl";

import type { MapLabels } from "../map/MapLabels.js";

/**
 * Options of {@link NavigationButtons}.
 */
export interface NavigationButtonsProps {
  readonly map: MapLibreMap;
  readonly labels: MapLabels;
}
