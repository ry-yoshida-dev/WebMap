import { formatTileUrl, tileCenter, tileContaining } from "@web-map/core";
import type { LngLat, RasterTileBasemap } from "@web-map/core";

/**
 * Where thumbnails are centered unless told otherwise: Tokyo, which all bundled basemaps cover. It is mostly land, so
 * photo and night imagery show their land and city lights rather than dark sea.
 */
export const DEFAULT_THUMBNAIL_CENTER: LngLat = { lng: 139.7, lat: 35.7 };
const THUMBNAIL_TILE_ZOOM: number = 7;
/**
 * Edge in pixels a style basemap is drawn at before the menu scales it down: the
 * size of a raster tile, so labels shrink as much as on raster thumbnails.
 */
export const STYLE_THUMBNAIL_RENDER_SIZE: number = 256;
/** MapLibre's zoom counts the world as 512-pixel tiles. */
const MAPLIBRE_TILE_PIXELS: number = 512;

/** Camera of a map drawing a thumbnail. */
export interface ThumbnailCamera {
  readonly center: LngLat;
  readonly zoom: number;
}

/**
 * Require a position thumbnails can be centered on.
 *
 * @param center - Position to check.
 * @throws RangeError When the position is outside Web Mercator.
 */
export function requireThumbnailCenter(center: LngLat): void {
  tileContaining(center, THUMBNAIL_TILE_ZOOM);
}

/**
 * URL of the one tile a raster basemap's thumbnail shows.
 *
 * @param basemap - Raster basemap.
 * @param center - Position the thumbnail shows.
 * @returns The URL of the tile containing it, at the nearest zoom the basemap serves.
 * @throws RangeError When the position is outside Web Mercator.
 */
export function rasterThumbnailUrl(basemap: RasterTileBasemap, center: LngLat): string {
  const zoom: number = Math.min(basemap.maxZoom, Math.max(basemap.minZoom, THUMBNAIL_TILE_ZOOM));
  return formatTileUrl(basemap, tileContaining(center, zoom));
}

/**
 * Where a style basemap's thumbnail is drawn, framing the same area as {@link rasterThumbnailUrl}.
 *
 * @param center - Position the thumbnail shows.
 * @returns The camera, centered on the tile containing the position.
 * @throws RangeError When the position is outside Web Mercator.
 */
export function styleThumbnailCamera(center: LngLat): ThumbnailCamera {
  return {
    center: tileCenter(tileContaining(center, THUMBNAIL_TILE_ZOOM)),
    zoom: THUMBNAIL_TILE_ZOOM + Math.log2(STYLE_THUMBNAIL_RENDER_SIZE / MAPLIBRE_TILE_PIXELS),
  };
}
