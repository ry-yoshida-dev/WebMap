import type { Terrain } from "@web-map/core";

import type { MapStyle } from "./MapStyle.js";
import { requireTerrainExaggeration } from "../terrain/requireTerrainExaggeration.js";
import { TERRAIN_SOURCE_PREFIX, terrainSourceId } from "./terrainSourceId.js";
import { toTerrainSource } from "../terrain/toTerrainSource.js";

/**
 * Raise a style's ground from a terrain, or flatten it.
 *
 * Terrain sources already in the style, such as those carried from the previous style, are replaced, so only the
 * given terrain remains.
 *
 * @param style - Style of the basemap with the application's overlays.
 * @param terrain - Terrain to show, or null for flat ground.
 * @param exaggeration - Factor the heights are multiplied by.
 * @returns A new style.
 * @throws RangeError When the exaggeration is negative or not finite.
 */
export function withTerrain(style: MapStyle, terrain: Terrain | null, exaggeration: number): MapStyle {
  requireTerrainExaggeration(exaggeration);
  const sources: MapStyle["sources"] = Object.fromEntries(
    Object.entries(style.sources).filter(([id]: [string, unknown]) => !id.startsWith(TERRAIN_SOURCE_PREFIX)),
  );
  if (terrain === null) {
    const flat: MapStyle = { ...style, sources };
    delete flat.terrain;
    return flat;
  }
  const sourceId: string = terrainSourceId(terrain);
  return { ...style, sources: { ...sources, [sourceId]: toTerrainSource(terrain) }, terrain: { source: sourceId, exaggeration } };
}
