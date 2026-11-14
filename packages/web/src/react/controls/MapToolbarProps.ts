import type { Map as MapLibreMap } from "maplibre-gl";
import type { Basemap, LngLat, Terrain } from "@web-map/core";

import type { MapLabels } from "../map/MapLabels.js";
import type { TileStatus } from "../hooks/TileStatus.js";

/**
 * Options of {@link MapToolbar}.
 */
export interface MapToolbarProps {
  readonly map: MapLibreMap | null;
  readonly basemaps: readonly Basemap[];
  readonly basemap: Basemap;
  readonly onBasemapChange: (basemap: Basemap) => void;
  /** Elevation data to choose from; the 3D terrain controls are left out when empty. */
  readonly terrains: readonly Terrain[];
  readonly terrain: Terrain | null;
  readonly onTerrainChange: (terrain: Terrain) => void;
  readonly isTerrainShown: boolean;
  readonly onTerrainShownChange: (isShown: boolean) => void;
  readonly tileStatus: TileStatus;
  readonly labels: MapLabels;
  /** Position the basemap menu's thumbnails show. */
  readonly thumbnailCenter: LngLat;
  /** Receives the element extensions render their controls into. */
  readonly slotRef: (element: HTMLElement | null) => void;
}
