import { HIGHEST_ZOOM } from "../projection/webMercatorZoom.js";
import type { TileCoordinate } from "./TileCoordinate.js";

/**
 * Require a tile that exists on the grid of its zoom.
 *
 * @param tile - Tile to check.
 * @throws RangeError When the zoom is not an integer in [0, 24], or the column or row is not an integer in
 *   `[0, 2^zoom)`.
 */
export function requireTileOnGrid(tile: TileCoordinate): void {
  if (!Number.isInteger(tile.zoom) || tile.zoom < 0 || tile.zoom > HIGHEST_ZOOM) {
    throw new RangeError(`Tile zoom must be an integer in [0, ${HIGHEST_ZOOM}], got ${tile.zoom}`);
  }
  const count: number = 2 ** tile.zoom;
  const isIndex = (index: number): boolean => Number.isInteger(index) && index >= 0 && index < count;
  if (!isIndex(tile.x) || !isIndex(tile.y)) {
    throw new RangeError(`Tile ${tile.zoom}/${tile.x}/${tile.y} is not on the grid`);
  }
}
