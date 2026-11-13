import type { Basemap } from "@web-map/core";

import type { MapLabels } from "../map/MapLabels.js";
import type { Thumbnail } from "../../thumbnail/Thumbnail.js";

/**
 * Options of {@link BasemapOption}.
 */
export interface BasemapOptionProps {
  readonly basemap: Basemap;
  readonly thumbnail: Thumbnail;
  /** Whether this basemap is on screen. */
  readonly isSelected: boolean;
  readonly onChoose: (basemap: Basemap) => void;
  readonly labels: MapLabels;
}
