import type { WebMercatorPoint } from "../projection/WebMercatorPoint.js";

/**
 * Where the corners of a map's viewport fall, in Web Mercator meters.
 */
export interface ViewportCorners {
  readonly topLeft: WebMercatorPoint;
  readonly topRight: WebMercatorPoint;
  readonly bottomRight: WebMercatorPoint;
  readonly bottomLeft: WebMercatorPoint;
}
