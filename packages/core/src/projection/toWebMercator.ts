import type { LngLat } from "../camera/LngLat.js";
import { MERCATOR_LATITUDE_LIMIT, WEB_MERCATOR_RADIUS } from "./webMercatorSphere.js";
import type { WebMercatorPoint } from "./WebMercatorPoint.js";

/**
 * Project a position onto Web Mercator (EPSG:3857).
 *
 * @param position - Position in WGS 84 degrees; the longitude may lie outside `[-180, 180]`.
 * @returns The projected position in meters.
 * @throws RangeError When a coordinate is not finite or the latitude lies beyond the Web Mercator square.
 */
export function toWebMercator(position: LngLat): WebMercatorPoint {
  if (!Number.isFinite(position.lng)) {
    throw new RangeError(`Longitude must be finite, got ${position.lng}`);
  }
  if (!Number.isFinite(position.lat) || Math.abs(position.lat) > MERCATOR_LATITUDE_LIMIT) {
    throw new RangeError(`Latitude must lie in [-${MERCATOR_LATITUDE_LIMIT}, ${MERCATOR_LATITUDE_LIMIT}], got ${position.lat}`);
  }
  const latitude: number = (position.lat * Math.PI) / 180;
  return {
    x: (WEB_MERCATOR_RADIUS * position.lng * Math.PI) / 180,
    y: WEB_MERCATOR_RADIUS * Math.log(Math.tan(Math.PI / 4 + latitude / 2)),
  };
}
