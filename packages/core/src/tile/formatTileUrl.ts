import type { RasterTileBasemap } from "../basemap/RasterTileBasemap.js";
import type { TileCoordinate } from "./TileCoordinate.js";

/**
 * Fill a raster basemap's URL template for one tile.
 *
 * @param basemap - Basemap whose tiles to address.
 * @param tile - Tile to fetch.
 * @returns The tile's URL.
 * @throws RangeError When the tile's zoom is outside the basemap's zoom range.
 */
export function formatTileUrl(basemap: RasterTileBasemap, tile: TileCoordinate): string {
  if (tile.zoom < basemap.minZoom || tile.zoom > basemap.maxZoom) {
    throw new RangeError(`Basemap ${basemap.id} serves zooms ${basemap.minZoom} to ${basemap.maxZoom}, not ${tile.zoom}`);
  }
  return basemap.tileUrlTemplate.replaceAll("{z}", String(tile.zoom)).replaceAll("{x}", String(tile.x)).replaceAll("{y}", String(tile.y));
}
