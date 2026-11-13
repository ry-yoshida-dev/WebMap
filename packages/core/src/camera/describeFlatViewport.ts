import type { MapCamera } from "./MapCamera.js";
import type { MapViewport } from "./MapViewport.js";
import { toWebMercator } from "../projection/toWebMercator.js";
import type { WebMercatorPoint } from "../projection/WebMercatorPoint.js";
import { webMercatorResolution } from "../projection/webMercatorResolution.js";

/**
 * Compute what a map that is not tilted shows, as MapLibre lays it out.
 *
 * @param camera - Camera of the map; it may be rotated.
 * @param width - Width of the map in CSS pixels.
 * @param height - Height of the map in CSS pixels.
 * @returns The viewport, with an extent when the bearing is zero.
 * @throws RangeError When the camera is tilted or a size is not positive and finite.
 */
export function describeFlatViewport(camera: MapCamera, width: number, height: number): MapViewport {
  if (camera.pitch !== 0) {
    throw new RangeError(`The camera must not be tilted, got a pitch of ${camera.pitch}`);
  }
  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
    throw new RangeError(`Viewport size must be positive and finite, got ${width} x ${height}`);
  }
  const center: WebMercatorPoint = toWebMercator(camera.center);
  const resolution: number = webMercatorResolution(camera.zoom);
  const halfWidth: number = (width / 2) * resolution;
  const halfHeight: number = (height / 2) * resolution;
  const bearing: number = (camera.bearing * Math.PI) / 180;
  // Screen axes in map meters: the bearing turns the map so that it points up.
  const right: WebMercatorPoint = { x: Math.cos(bearing), y: -Math.sin(bearing) };
  const up: WebMercatorPoint = { x: Math.sin(bearing), y: Math.cos(bearing) };
  const corner = (rightward: number, upward: number): WebMercatorPoint => ({
    x: center.x + right.x * rightward + up.x * upward,
    y: center.y + right.y * rightward + up.y * upward,
  });
  return {
    camera,
    width,
    height,
    corners: {
      topLeft: corner(-halfWidth, halfHeight),
      topRight: corner(halfWidth, halfHeight),
      bottomRight: corner(halfWidth, -halfHeight),
      bottomLeft: corner(-halfWidth, -halfHeight),
    },
    extent:
      camera.bearing === 0
        ? { minX: center.x - halfWidth, minY: center.y - halfHeight, maxX: center.x + halfWidth, maxY: center.y + halfHeight }
        : null,
  };
}
