import { AJAXError } from "maplibre-gl";

/**
 * Whether a map error is a tile the provider does not have, which providers
 * with regional coverage, such as GSI outside Japan, answer with 404.
 *
 * @param error - Error MapLibre reported.
 * @returns True for 404 and 204 responses.
 */
export function isMissingTileError(error: unknown): boolean {
  return error instanceof AJAXError && (error.status === 404 || error.status === 204);
}
