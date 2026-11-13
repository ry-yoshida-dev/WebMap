import type { Terrain } from "@web-map/core";

/** Start of the id of the source a terrain is raised from; the terrain's id follows. */
export const TERRAIN_SOURCE_PREFIX: string = "web-map-terrain-";

/**
 * Id of the source a terrain is raised from.
 *
 * @param terrain - Terrain to show.
 * @returns The source id.
 */
export function terrainSourceId(terrain: Terrain): string {
  return `${TERRAIN_SOURCE_PREFIX}${terrain.id}`;
}
