import type { Basemap, LngLat } from "@web-map/core";

import type { MapLabels } from "../map/MapLabels.js";

/**
 * Options of {@link BasemapPicker}.
 */
export interface BasemapPickerProps {
  readonly basemaps: readonly Basemap[];
  readonly basemap: Basemap;
  readonly onChange: (basemap: Basemap) => void;
  readonly labels: MapLabels;
  /** Position every thumbnail shows; Tokyo when omitted. Must lie within Web Mercator. */
  readonly thumbnailCenter?: LngLat;
}
