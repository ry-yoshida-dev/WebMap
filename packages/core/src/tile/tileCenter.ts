import type { LngLat } from "../camera/LngLat.js";
import type { TileCoordinate } from "./TileCoordinate.js";

/**
 * Position at the middle of a tile, in Web Mercator.
 *
 * @param tile - Tile on the grid.
 * @returns Its center.
 * @throws RangeError When the tile is not on the grid of its zoom.
 */
export function tileCenter(tile: TileCoordinate): LngLat {
  const count: number = 2 ** tile.zoom;
  const isIndex = (index: number): boolean => Number.isInteger(index) && index >= 0 && index < count;
  if (!Number.isInteger(tile.zoom) || tile.zoom < 0 || !isIndex(tile.x) || !isIndex(tile.y)) {
    throw new RangeError(`Tile ${tile.zoom}/${tile.x}/${tile.y} is not on the grid`);
  }
  const lng: number = ((tile.x + 0.5) / count) * 360 - 180;
  const lat: number = (Math.atan(Math.sinh(Math.PI * (1 - (2 * (tile.y + 0.5)) / count))) * 180) / Math.PI;
  return { lng, lat };
}
