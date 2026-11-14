import type { Terrain } from "@web-map/core";

import { toTerrainSource } from "../terrain/toTerrainSource.js";

/** Start of the id of the source a terrain is raised from; the terrain's id and a digest of its source follow. */
export const TERRAIN_SOURCE_PREFIX: string = "web-map-terrain-";

const FNV_OFFSET_BASIS: number = 0x811c9dc5;
const FNV_PRIME: number = 0x01000193;

/** 32-bit FNV-1a digest, telling sources apart, not guarding against collisions crafted on purpose. */
function digest(text: string): string {
  let hash: number = FNV_OFFSET_BASIS;
  for (let index: number = 0; index < text.length; index += 1) {
    hash = Math.imul(hash ^ text.charCodeAt(index), FNV_PRIME);
  }
  return (hash >>> 0).toString(36);
}

/**
 * Id of the source a terrain is raised from.
 *
 * The id changes with what the source loads, so a terrain redefined under its id, as with another URL, gets a new
 * source instead of keeping the old one's tiles.
 *
 * @param terrain - Terrain to show.
 * @returns The source id.
 */
export function terrainSourceId(terrain: Terrain): string {
  return `${TERRAIN_SOURCE_PREFIX}${terrain.id}-${digest(JSON.stringify(toTerrainSource(terrain)))}`;
}
