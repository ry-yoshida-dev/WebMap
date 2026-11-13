import type { MapLabels } from "../map/MapLabels.js";
import type { TileStatus } from "../hooks/TileStatus.js";

/**
 * Options of {@link TileStatusIndicator}.
 */
export interface TileStatusIndicatorProps {
  readonly status: TileStatus;
  readonly labels: MapLabels;
}
