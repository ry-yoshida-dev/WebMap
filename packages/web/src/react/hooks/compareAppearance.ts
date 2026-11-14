import type { Basemap, Terrain } from "@web-map/core";

import { AppearanceChange } from "./AppearanceChange.js";
import type { MapAppearance } from "./MapAppearance.js";
import { toMapStyle } from "../../style/toMapStyle.js";
import { terrainSourceId } from "../../style/terrainSourceId.js";

function isSameBasemap(shown: Basemap, next: Basemap): boolean {
  return shown === next || (shown.id === next.id && JSON.stringify(toMapStyle(shown)) === JSON.stringify(toMapStyle(next)));
}

function terrainSourceIdOf(terrain: Terrain | null): string | null {
  return terrain === null ? null : terrainSourceId(terrain);
}

/**
 * Tell what a map showing one appearance must do to show another.
 *
 * Basemaps and terrains are compared by id and by what the map loads from them, so new objects for the same ones, as
 * a parent may build on every render, change nothing, while the same id with another URL, as after replacing an API
 * key, loads the new one.
 *
 * @param shown - Appearance on the map.
 * @param next - Appearance to show.
 * @returns The change needed; a style reload covers a terrain change made at the same time.
 */
export function compareAppearance(shown: MapAppearance, next: MapAppearance): AppearanceChange {
  if (!isSameBasemap(shown.basemap, next.basemap) || shown.isGrayscale !== next.isGrayscale) {
    return AppearanceChange.RELOAD_STYLE;
  }
  if (terrainSourceIdOf(shown.terrain) !== terrainSourceIdOf(next.terrain) || shown.terrainExaggeration !== next.terrainExaggeration) {
    return AppearanceChange.SWAP_TERRAIN;
  }
  return AppearanceChange.NONE;
}
