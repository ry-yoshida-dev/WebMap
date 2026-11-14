import { defineMapCamera } from "./defineMapCamera.js";
import { defineMapExtent } from "./defineMapExtent.js";
import { fromWebMercator } from "../projection/fromWebMercator.js";
import type { LngLat } from "./LngLat.js";
import type { MapCamera } from "./MapCamera.js";
import type { MapExtent } from "./MapExtent.js";
import { webMercatorResolution } from "../projection/webMercatorResolution.js";

/**
 * Camera, facing north and not tilted, that fits an extent in a map of the given size.
 *
 * When the map has the extent's aspect ratio it shows exactly the extent; otherwise the extent fills the map
 * along one axis and is centered along the other.
 *
 * @param extent - Area to show, in Web Mercator meters.
 * @param width - Width of the map in CSS pixels.
 * @param height - Height of the map in CSS pixels.
 * @returns The camera.
 * @throws RangeError When the extent or a size is invalid, or the camera would leave what Web Mercator can show, as
 *   when the map is too small to fit the extent even at the lowest camera zoom, -2.
 */
export function cameraForExtent(extent: MapExtent, width: number, height: number): MapCamera {
  const { minX, minY, maxX, maxY }: MapExtent = defineMapExtent(extent);
  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
    throw new RangeError(`Viewport size must be positive and finite, got ${width} x ${height}`);
  }
  const resolution: number = Math.max((maxX - minX) / width, (maxY - minY) / height);
  const center: LngLat = fromWebMercator({ x: (minX + maxX) / 2, y: (minY + maxY) / 2 });
  return defineMapCamera({
    center: { lng: ((((center.lng + 180) % 360) + 360) % 360) - 180, lat: center.lat },
    zoom: Math.log2(webMercatorResolution(0) / resolution),
  });
}
