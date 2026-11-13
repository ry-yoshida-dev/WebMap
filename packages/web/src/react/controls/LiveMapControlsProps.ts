import type { Map as MapLibreMap } from "maplibre-gl";

import type { MapLabels } from "../map/MapLabels.js";
import type { TileStatus } from "../hooks/TileStatus.js";

/**
 * Options of {@link LiveMapControls}.
 */
export interface LiveMapControlsProps {
  readonly map: MapLibreMap;
  readonly tileStatus: TileStatus;
  readonly labels: MapLabels;
}
