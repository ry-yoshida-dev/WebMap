import { formatTileUrl, tileCenter, tileContaining } from "@web-map/core";
import type { LngLat, RasterTileBasemap, TileCoordinate } from "@web-map/core";

/**
 * Every thumbnail shows the tile around Tokyo, which all bundled basemaps cover. It is mostly
 * land, so photo and night imagery show their land and city lights rather than dark sea.
 */
const THUMBNAIL_POSITION: LngLat = { lng: 139.7, lat: 35.7 };
const THUMBNAIL_TILE_ZOOM: number = 7;
/**
 * Edge in pixels a style basemap is drawn at before the menu scales it down: the
 * size of a raster tile, so labels shrink as much as on raster thumbnails.
 */
export const STYLE_THUMBNAIL_RENDER_SIZE: number = 256;
/** MapLibre's zoom counts the world as 512-pixel tiles. */
const MAPLIBRE_TILE_PIXELS: number = 512;

const thumbnailTile: TileCoordinate = tileContaining(THUMBNAIL_POSITION, THUMBNAIL_TILE_ZOOM);

/**
 * URL of the one tile a raster basemap's thumbnail shows.
 *
 * @param basemap - Raster basemap.
 * @returns The tile URL, at the nearest zoom the basemap serves.
 */
export function rasterThumbnailUrl(basemap: RasterTileBasemap): string {
  const zoom: number = Math.min(basemap.maxZoom, Math.max(basemap.minZoom, THUMBNAIL_TILE_ZOOM));
  return formatTileUrl(basemap, tileContaining(THUMBNAIL_POSITION, zoom));
}

/** Where a style basemap's thumbnail is drawn, framing the same area as {@link rasterThumbnailUrl}. */
export const styleThumbnailCamera: { readonly center: LngLat; readonly zoom: number } = {
  center: tileCenter(thumbnailTile),
  zoom: THUMBNAIL_TILE_ZOOM + Math.log2(STYLE_THUMBNAIL_RENDER_SIZE / MAPLIBRE_TILE_PIXELS),
};
