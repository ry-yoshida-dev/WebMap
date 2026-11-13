import type { Terrain } from "@web-map/core";
import type { RasterDEMSourceSpecification } from "maplibre-gl";

import type { MapStyle } from "../style/MapStyle.js";
import { requireTerrainExaggeration } from "./requireTerrainExaggeration.js";
import { TERRAIN_SOURCE_PREFIX, terrainSourceId } from "../style/terrainSourceId.js";
import { toTerrainSource } from "./toTerrainSource.js";

/**
 * What {@link applyTerrain} uses of a MapLibre map.
 */
export interface TerrainTarget {
  getStyle(): { readonly sources: Readonly<Record<string, unknown>> };
  getSource(id: string): unknown;
  addSource(id: string, source: RasterDEMSourceSpecification): unknown;
  removeSource(id: string): unknown;
  setTerrain(terrain: NonNullable<MapStyle["terrain"]> | null): unknown;
}

/**
 * Raise the ground of a loaded map from a terrain, or flatten it, without reloading the basemap's style.
 *
 * The terrain's source is kept while only the exaggeration changes, so its tiles are not fetched again; sources of
 * other terrains are removed.
 *
 * @param map - Map whose style has loaded.
 * @param terrain - Terrain to show, or null for flat ground.
 * @param exaggeration - Factor the heights are multiplied by.
 * @throws RangeError When the exaggeration is negative or not finite.
 */
export function applyTerrain(map: TerrainTarget, terrain: Terrain | null, exaggeration: number): void {
  requireTerrainExaggeration(exaggeration);
  let keptSourceId: string | null = null;
  if (terrain === null) {
    map.setTerrain(null);
  } else {
    keptSourceId = terrainSourceId(terrain);
    if (map.getSource(keptSourceId) === undefined) {
      map.addSource(keptSourceId, toTerrainSource(terrain));
    }
    map.setTerrain({ source: keptSourceId, exaggeration });
  }
  for (const id of Object.keys(map.getStyle().sources)) {
    if (id.startsWith(TERRAIN_SOURCE_PREFIX) && id !== keptSourceId) {
      map.removeSource(id);
    }
  }
}
