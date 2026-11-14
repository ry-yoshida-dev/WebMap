import { AppearanceChange } from "./AppearanceChange.js";
import type { MapAppearance } from "./MapAppearance.js";

/**
 * Tell what a map showing one appearance must do to show another.
 *
 * @param shown - Appearance on the map.
 * @param next - Appearance to show.
 * @returns The change needed; a style reload covers a terrain change made at the same time.
 */
export function compareAppearance(shown: MapAppearance, next: MapAppearance): AppearanceChange {
  if (shown.basemap !== next.basemap || shown.isGrayscale !== next.isGrayscale) {
    return AppearanceChange.RELOAD_STYLE;
  }
  if (shown.terrain !== next.terrain || shown.terrainExaggeration !== next.terrainExaggeration) {
    return AppearanceChange.SWAP_TERRAIN;
  }
  return AppearanceChange.NONE;
}
