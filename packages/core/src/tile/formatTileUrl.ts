import type { RasterTileBasemap } from "../basemap/RasterTileBasemap.js";
import { BOUNDING_BOX_PLACEHOLDER } from "../basemap/boundingBoxPlaceholder.js";
import { requireTileOnGrid } from "./requireTileOnGrid.js";
import type { TileCoordinate } from "./TileCoordinate.js";
import { tileExtent } from "./tileExtent.js";

/** What addresses a tile: a raster basemap, or a terrain. */
type TileSource = Pick<RasterTileBasemap, "id" | "tileUrlTemplate" | "minZoom" | "maxZoom">;

/**
 * Fill a raster basemap's URL template for one tile, with the tile's bounding box in Web Mercator meters where the
 * template asks for it, as a WMS does.
 *
 * @param basemap - Raster basemap, or terrain, whose tiles to address.
 * @param tile - Tile to fetch.
 * @returns The tile's URL.
 * @throws RangeError When the tile is not on the grid of its zoom, or its zoom is outside the zoom range of the basemap or terrain.
 */
export function formatTileUrl(basemap: TileSource, tile: TileCoordinate): string {
  requireTileOnGrid(tile);
  if (tile.zoom < basemap.minZoom || tile.zoom > basemap.maxZoom) {
    throw new RangeError(`Tiles of ${basemap.id} are served at zooms ${basemap.minZoom} to ${basemap.maxZoom}, not ${tile.zoom}`);
  }
  const { minX, minY, maxX, maxY } = tileExtent(tile);
  return basemap.tileUrlTemplate
    .replaceAll("{z}", String(tile.zoom))
    .replaceAll("{x}", String(tile.x))
    .replaceAll("{y}", String(tile.y))
    .replaceAll(BOUNDING_BOX_PLACEHOLDER, [minX, minY, maxX, maxY].join(","));
}
