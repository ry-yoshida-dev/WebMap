import { WEB_MERCATOR_RADIUS, WORLD_SIZE_AT_ZOOM_ZERO } from "./webMercatorSphere.js";

/**
 * Web Mercator meters one CSS pixel spans at a zoom level, as MapLibre draws it.
 *
 * MapLibre spans the world with 512 pixels at zoom 0, so its zoom `z` matches zoom `z + 1` of a 256-pixel
 * `{z}/{x}/{y}` tile grid. The value holds across a map that is not tilted; ground distance is shorter by
 * the cosine of the latitude.
 *
 * @param zoom - MapLibre zoom level.
 * @returns Meters of EPSG:3857 per CSS pixel.
 * @throws RangeError When the zoom is not finite.
 */
export function webMercatorResolution(zoom: number): number {
  if (!Number.isFinite(zoom)) {
    throw new RangeError(`Zoom must be finite, got ${zoom}`);
  }
  return (2 * Math.PI * WEB_MERCATOR_RADIUS) / (WORLD_SIZE_AT_ZOOM_ZERO * 2 ** zoom);
}
