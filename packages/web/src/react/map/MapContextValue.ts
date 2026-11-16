import type { Map as MapLibreMap } from "maplibre-gl";
import type { Attribution, Basemap, LngLat, Terrain } from "@web-map/core";

import type { MapLabels } from "./MapLabels.js";
import type { TileStatus } from "../hooks/TileStatus.js";

/**
 * What a {@link WebMap} offers its children.
 */
export interface MapContextValue {
  /**
   * The MapLibre map, with its first style loaded. Sources and layers added to
   * it are overlays: they stay on top when the basemap changes.
   */
  readonly map: MapLibreMap;
  /** Basemaps the user can choose from, in menu order. */
  readonly basemaps: readonly Basemap[];
  /** Basemap on screen. */
  readonly basemap: Basemap;
  /**
   * Show another of {@link basemaps}, as the built-in menu does.
   *
   * @throws RangeError When the basemap is not one of {@link basemaps}.
   */
  readonly changeBasemap: (basemap: Basemap) => void;
  /** Elevation data the user can choose from, in menu order. */
  readonly terrains: readonly Terrain[];
  /** Chosen terrain, used while {@link isTerrainShown}; null only when {@link terrains} is empty. */
  readonly terrain: Terrain | null;
  /**
   * Choose another of {@link terrains}, as the built-in menu does.
   *
   * @throws RangeError When the terrain is not one of {@link terrains}.
   */
  readonly changeTerrain: (terrain: Terrain) => void;
  /**
   * Whether the ground is raised in 3D from {@link terrain}. While it is, `map.queryTerrainElevation` gives the
   * height, exaggeration included, at which a 3D object touches the ground; otherwise it returns null.
   */
  readonly isTerrainShown: boolean;
  /** Turn 3D terrain on or off, as the built-in button does. */
  readonly changeTerrainShown: (isShown: boolean) => void;
  /**
   * Factor the terrain's heights are multiplied by, as {@link WebMapProps.terrainExaggeration} gave it; 1 when
   * omitted. Applies while {@link isTerrainShown}.
   */
  readonly terrainExaggeration: number;
  /**
   * Credits the map on screen owes: the basemap's, and the terrain's while {@link isTerrainShown}. Write them with
   * `formatAttributionText` for output that cannot carry links, such as a printed map.
   */
  readonly attributions: readonly Attribution[];
  /**
   * Whether the basemap's tiles are loading or have failed since it was chosen, for {@link TileStatusIndicator}.
   * Failures of the terrain and of the application's overlays are not counted.
   */
  readonly tileStatus: TileStatus;
  /** Text of the controls, with the map's overrides applied. */
  readonly labels: MapLabels;
  /** Position the basemap menu's thumbnails show, to hand to a {@link BasemapPicker} of the application's own. */
  readonly thumbnailCenter: LngLat;
  /** Element of the toolbar that {@link MapControlSlot} renders into, or null before it mounts or while the toolbar is hidden. */
  readonly controlSlot: HTMLElement | null;
}
