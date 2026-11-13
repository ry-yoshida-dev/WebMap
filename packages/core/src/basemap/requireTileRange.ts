import { BasemapDefinitionError } from "./BasemapDefinitionError.js";
import { HIGHEST_ZOOM } from "../projection/webMercatorZoom.js";
import { requireHttpsUrl } from "./requireHttpsUrl.js";

const PLACEHOLDERS: readonly string[] = ["{z}", "{x}", "{y}"];

/**
 * Validate the tiles of a raster tile basemap or a terrain: an `https` template, its zoom range and its tile size.
 *
 * @param id - Id of the basemap or terrain, used in error messages.
 * @param tileUrlTemplate - URL with `{z}`, `{x}` and `{y}` placeholders.
 * @param minZoom - Lowest zoom level served.
 * @param maxZoom - Highest zoom level served.
 * @param tileSize - Edge of a tile in pixels.
 * @throws BasemapDefinitionError When the template is not `https` or lacks `{z}`, `{x}` or `{y}`.
 * @throws RangeError When the zoom range or tile size is out of range.
 */
export function requireTileRange(id: string, tileUrlTemplate: string, minZoom: number, maxZoom: number, tileSize: number): void {
  requireHttpsUrl(tileUrlTemplate, `tiles of ${id}`);
  const missing: readonly string[] = PLACEHOLDERS.filter((placeholder: string) => !tileUrlTemplate.includes(placeholder));
  if (missing.length > 0) {
    throw new BasemapDefinitionError(`The tile URL of ${id} lacks ${missing.join(", ")}`);
  }
  const isZoom = (zoom: number): boolean => Number.isInteger(zoom) && zoom >= 0 && zoom <= HIGHEST_ZOOM;
  if (!isZoom(minZoom) || !isZoom(maxZoom) || minZoom > maxZoom) {
    throw new RangeError(`${id} needs integer zooms with 0 <= minZoom <= maxZoom <= ${HIGHEST_ZOOM}, got ${minZoom} to ${maxZoom}`);
  }
  if (!Number.isInteger(tileSize) || tileSize <= 0) {
    throw new RangeError(`${id} needs a positive integer tile size, got ${tileSize}`);
  }
}
