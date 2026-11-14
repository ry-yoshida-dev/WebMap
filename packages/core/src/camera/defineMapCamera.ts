import type { MapCamera } from "./MapCamera.js";
import type { MapCameraSpecification } from "./MapCameraSpecification.js";
import { MERCATOR_LATITUDE_LIMIT } from "../projection/webMercatorSphere.js";
import { HIGHEST_ZOOM, LOWEST_CAMERA_ZOOM } from "../projection/webMercatorZoom.js";

const STEEPEST_PITCH: number = 85;

/**
 * Validate a camera, normalizing the bearing into `[0, 360)`.
 *
 * @param specification - Center, zoom and optional bearing and pitch.
 * @returns The camera.
 * @throws RangeError When a value is not finite or outside what Web Mercator can show.
 */
export function defineMapCamera(specification: MapCameraSpecification): MapCamera {
  const { center, zoom } = specification;
  const bearing: number = specification.bearing ?? 0;
  const pitch: number = specification.pitch ?? 0;
  if (!Number.isFinite(center.lng) || center.lng < -180 || center.lng > 180) {
    throw new RangeError(`Longitude must lie in [-180, 180], got ${center.lng}`);
  }
  if (!Number.isFinite(center.lat) || Math.abs(center.lat) > MERCATOR_LATITUDE_LIMIT) {
    throw new RangeError(`Latitude must lie in [-${MERCATOR_LATITUDE_LIMIT}, ${MERCATOR_LATITUDE_LIMIT}], got ${center.lat}`);
  }
  if (!Number.isFinite(zoom) || zoom < LOWEST_CAMERA_ZOOM || zoom > HIGHEST_ZOOM) {
    throw new RangeError(`Zoom must lie in [${LOWEST_CAMERA_ZOOM}, ${HIGHEST_ZOOM}], got ${zoom}`);
  }
  if (!Number.isFinite(bearing)) {
    throw new RangeError(`Bearing must be finite, got ${bearing}`);
  }
  if (!Number.isFinite(pitch) || pitch < 0 || pitch > STEEPEST_PITCH) {
    throw new RangeError(`Pitch must lie in [0, ${STEEPEST_PITCH}], got ${pitch}`);
  }
  return { center: { lng: center.lng, lat: center.lat }, zoom, bearing: ((bearing % 360) + 360) % 360, pitch };
}
