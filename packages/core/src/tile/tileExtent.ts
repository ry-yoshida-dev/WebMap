import type { MapExtent } from "../camera/MapExtent.js";
import { WEB_MERCATOR_HALF_EDGE } from "../projection/webMercatorSphere.js";
import { requireTileOnGrid } from "./requireTileOnGrid.js";
import type { TileCoordinate } from "./TileCoordinate.js";

/**
 * Rectangle a tile covers, in Web Mercator meters.
 *
 * @param tile - Tile on the grid.
 * @returns Its extent.
 * @throws RangeError When the tile is not on the grid of its zoom.
 */
export function tileExtent(tile: TileCoordinate): MapExtent {
  requireTileOnGrid(tile);
  const edge: number = (2 * WEB_MERCATOR_HALF_EDGE) / 2 ** tile.zoom;
  const minX: number = -WEB_MERCATOR_HALF_EDGE + tile.x * edge;
  const maxY: number = WEB_MERCATOR_HALF_EDGE - tile.y * edge;
  return { minX, minY: maxY - edge, maxX: minX + edge, maxY };
}
