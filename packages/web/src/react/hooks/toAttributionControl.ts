import type { AttributionControlOptions } from "maplibre-gl";

/**
 * Turn the application's choice of a compact attribution into MapLibre's `attributionControl` option.
 *
 * @param isCompact - True for the compact control always, which MapLibre folds behind a button once the map is first
 *   dragged, false for the expanded one always, null for MapLibre's choice, which makes it compact on narrow maps.
 * @returns The option: the default control, or one with `compact` set.
 */
export function toAttributionControl(isCompact: boolean | null): AttributionControlOptions {
  return isCompact === null ? {} : { compact: isCompact };
}
