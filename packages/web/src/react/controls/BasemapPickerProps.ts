import type { Basemap } from "@web-map/core";

import type { MapLabels } from "../map/MapLabels.js";

/**
 * Options of {@link BasemapPicker}.
 */
export interface BasemapPickerProps {
  readonly basemaps: readonly Basemap[];
  readonly basemap: Basemap;
  readonly onChange: (basemap: Basemap) => void;
  readonly labels: MapLabels;
}
