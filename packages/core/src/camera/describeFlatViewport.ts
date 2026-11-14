import { defineMapCamera } from "./defineMapCamera.js";
import type { MapCamera } from "./MapCamera.js";
import type { MapViewport } from "./MapViewport.js";
import { toWebMercator } from "../projection/toWebMercator.js";
import { WEB_MERCATOR_HALF_EDGE } from "../projection/webMercatorSphere.js";
import type { WebMercatorPoint } from "../projection/WebMercatorPoint.js";
import { webMercatorResolution } from "../projection/webMercatorResolution.js";

/**
 * Compute what a map that is not tilted shows, as MapLibre lays it out.
 *
 * A view crossing the antimeridian is placed so that it starts west of it, continuing east past 20037508.34 m, as
 * `MapExtent` describes.
 *
 * @param camera - Camera of the map; it may be rotated.
 * @param width - Width of the map in CSS pixels.
 * @param height - Height of the map in CSS pixels.
 * @returns The viewport, with the camera validated and its bearing normalized, and an extent when it faces north.
 * @throws RangeError When the camera is invalid or tilted, or a size is not positive and finite.
 */
export function describeFlatViewport(camera: MapCamera, width: number, height: number): MapViewport {
  const valid: MapCamera = defineMapCamera(camera);
  if (valid.pitch !== 0) {
    throw new RangeError(`The camera must not be tilted, got a pitch of ${valid.pitch}`);
  }
  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
    throw new RangeError(`Viewport size must be positive and finite, got ${width} x ${height}`);
  }
  const projected: WebMercatorPoint = toWebMercator(valid.center);
  const resolution: number = webMercatorResolution(valid.zoom);
  const halfWidth: number = (width / 2) * resolution;
  const halfHeight: number = (height / 2) * resolution;
  const bearing: number = (valid.bearing * Math.PI) / 180;
  // Screen axes in map meters: the bearing turns the map so that it points up.
  const right: WebMercatorPoint = { x: Math.cos(bearing), y: -Math.sin(bearing) };
  const up: WebMercatorPoint = { x: Math.sin(bearing), y: Math.cos(bearing) };
  // The view reaches this far west of its center, along whichever corner lies furthest west.
  const westReach: number = Math.abs(right.x) * halfWidth + Math.abs(up.x) * halfHeight;
  const worldEdge: number = 2 * WEB_MERCATOR_HALF_EDGE;
  const overshoot: number = -WEB_MERCATOR_HALF_EDGE - (projected.x - westReach);
  const center: WebMercatorPoint = {
    x: overshoot > 0 ? projected.x + Math.ceil(overshoot / worldEdge) * worldEdge : projected.x,
    y: projected.y,
  };
  const corner = (rightward: number, upward: number): WebMercatorPoint => ({
    x: center.x + right.x * rightward + up.x * upward,
    y: center.y + right.y * rightward + up.y * upward,
  });
  return {
    camera: valid,
    width,
    height,
    corners: {
      topLeft: corner(-halfWidth, halfHeight),
      topRight: corner(halfWidth, halfHeight),
      bottomRight: corner(halfWidth, -halfHeight),
      bottomLeft: corner(-halfWidth, -halfHeight),
    },
    extent:
      valid.bearing === 0
        ? { minX: center.x - halfWidth, minY: center.y - halfHeight, maxX: center.x + halfWidth, maxY: center.y + halfHeight }
        : null,
  };
}
