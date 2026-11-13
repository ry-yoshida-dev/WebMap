import type { Map as MapLibreMap } from "maplibre-gl";

import type { MapLabels } from "../map/MapLabels.js";

/**
 * Options of {@link TerrainToggle}.
 */
export interface TerrainToggleProps {
  /** Map to tilt when 3D terrain is turned on, or null before it loads, which disables the button. */
  readonly map: MapLibreMap | null;
  readonly isShown: boolean;
  readonly onChange: (isShown: boolean) => void;
  readonly labels: MapLabels;
}
