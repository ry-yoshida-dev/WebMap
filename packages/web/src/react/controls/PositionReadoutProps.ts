import type { Map as MapLibreMap } from "maplibre-gl";

import type { MapLabels } from "../map/MapLabels.js";

/**
 * Options of {@link PositionReadout}.
 */
export interface PositionReadoutProps {
  readonly map: MapLibreMap;
  readonly labels: MapLabels;
}
