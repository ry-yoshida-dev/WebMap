import { AJAXError } from "maplibre-gl";

import type { MapErrorEvent } from "../react/hooks/MapErrorEvent.js";

/**
 * Whether a map error is a tile the provider does not have, which providers
 * with regional coverage, such as GSI outside Japan, answer with 404.
 *
 * A style, sprite or glyph request answered with 404 is not a tile, so it is not missing coverage.
 *
 * @param event - Error event MapLibre reported.
 * @returns True for 404 and 204 responses to tile requests.
 */
export function isMissingTileError(event: MapErrorEvent): boolean {
  return event.tile !== undefined && event.error instanceof AJAXError && (event.error.status === 404 || event.error.status === 204);
}
