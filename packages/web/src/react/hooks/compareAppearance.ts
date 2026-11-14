import { AppearanceChange } from "./AppearanceChange.js";
import type { MapAppearance } from "./MapAppearance.js";

/**
 * Tell what a map showing one appearance must do to show another.
 *
 * Basemaps and terrains are compared by id, so new objects for the same ones, as a parent may build on every
 * render, change nothing.
 *
 * @param shown - Appearance on the map.
 * @param next - Appearance to show.
 * @returns The change needed; a style reload covers a terrain change made at the same time.
 */
export function compareAppearance(shown: MapAppearance, next: MapAppearance): AppearanceChange {
  if (shown.basemap.id !== next.basemap.id || shown.isGrayscale !== next.isGrayscale) {
    return AppearanceChange.RELOAD_STYLE;
  }
  if (shown.terrain?.id !== next.terrain?.id || shown.terrainExaggeration !== next.terrainExaggeration) {
    return AppearanceChange.SWAP_TERRAIN;
  }
  return AppearanceChange.NONE;
}
