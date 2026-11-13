import type { Basemap, Terrain } from "@web-map/core";

/**
 * What {@link useMapLibre} keeps on screen; changing any field updates the map.
 */
export interface MapAppearance {
  readonly basemap: Basemap;
  /** Show the basemap in gray, leaving overlays in color. */
  readonly isGrayscale: boolean;
  /** Terrain the ground is raised from, or null for flat ground. */
  readonly terrain: Terrain | null;
  /** Factor the terrain's heights are multiplied by. */
  readonly terrainExaggeration: number;
}
