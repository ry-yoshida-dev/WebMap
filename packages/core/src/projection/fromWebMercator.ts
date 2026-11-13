import type { LngLat } from "../camera/LngLat.js";
import { WEB_MERCATOR_RADIUS } from "./webMercatorSphere.js";
import type { WebMercatorPoint } from "./WebMercatorPoint.js";

/**
 * Unproject a Web Mercator (EPSG:3857) position.
 *
 * @param point - Position in meters.
 * @returns The position in WGS 84 degrees; the longitude is not wrapped, so it lies outside `[-180, 180]` past the antimeridian.
 * @throws RangeError When a coordinate is not finite.
 */
export function fromWebMercator(point: WebMercatorPoint): LngLat {
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    throw new RangeError(`Web Mercator coordinates must be finite, got (${point.x}, ${point.y})`);
  }
  return {
    lng: (point.x / WEB_MERCATOR_RADIUS) * (180 / Math.PI),
    lat: (2 * Math.atan(Math.exp(point.y / WEB_MERCATOR_RADIUS)) - Math.PI / 2) * (180 / Math.PI),
  };
}
