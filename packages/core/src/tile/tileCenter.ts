import type { LngLat } from "../camera/LngLat.js";
import { requireTileOnGrid } from "./requireTileOnGrid.js";
import type { TileCoordinate } from "./TileCoordinate.js";

/**
 * Position at the middle of a tile, in Web Mercator.
 *
 * @param tile - Tile on the grid.
 * @returns Its center.
 * @throws RangeError When the tile is not on the grid of its zoom, or the zoom is not an integer in [0, 24].
 */
export function tileCenter(tile: TileCoordinate): LngLat {
  requireTileOnGrid(tile);
  const count: number = 2 ** tile.zoom;
  const lng: number = ((tile.x + 0.5) / count) * 360 - 180;
  const lat: number = (Math.atan(Math.sinh(Math.PI * (1 - (2 * (tile.y + 0.5)) / count))) * 180) / Math.PI;
  return { lng, lat };
}
