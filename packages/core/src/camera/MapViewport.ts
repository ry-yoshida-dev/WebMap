import type { MapCamera } from "./MapCamera.js";
import type { MapExtent } from "./MapExtent.js";
import type { ViewportCorners } from "./ViewportCorners.js";

/**
 * Exactly what a map shows: its camera, its size and the area its edges enclose.
 */
export interface MapViewport {
  readonly camera: MapCamera;
  /** Width of the map in CSS pixels. */
  readonly width: number;
  /** Height of the map in CSS pixels. */
  readonly height: number;
  /** Corners of the viewport; with a tilt, the top ones are approximate, and clamped at the horizon. */
  readonly corners: ViewportCorners;
  /**
   * Area shown, when the map is neither rotated nor tilted; null otherwise, as the area is then not such a rectangle.
   * Its width and height divided by {@link width} and {@link height} give the same meters per pixel.
   */
  readonly extent: MapExtent | null;
}
