import type { Terrain } from "@web-map/core";

import type { MapLabels } from "../map/MapLabels.js";

/**
 * Options of {@link TerrainPicker}.
 */
export interface TerrainPickerProps {
  readonly terrains: readonly Terrain[];
  /** Chosen terrain. */
  readonly terrain: Terrain;
  /** Whether 3D terrain is on; the menu is disabled while it is off. */
  readonly isEnabled: boolean;
  readonly onChange: (terrain: Terrain) => void;
  readonly labels: MapLabels;
}
