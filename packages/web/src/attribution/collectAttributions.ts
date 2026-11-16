import type { Attribution, Basemap, Terrain } from "@web-map/core";

/**
 * List the credits the map on screen owes: the basemap's, and the terrain's while the ground is raised from it.
 *
 * Credits for the application's own data are not known here; add them where the result is used.
 *
 * @param basemap - Basemap on screen.
 * @param terrain - Terrain the ground is raised from, or null for flat ground.
 * @returns The credits without repeats, the basemap's first.
 */
export function collectAttributions(basemap: Basemap, terrain: Terrain | null): readonly Attribution[] {
  const all: readonly Attribution[] = [...basemap.attributions, ...(terrain === null ? [] : terrain.attributions)];
  return all.filter(
    (attribution: Attribution, index: number) =>
      all.findIndex((other: Attribution) => other.text === attribution.text && other.url === attribution.url) === index,
  );
}
