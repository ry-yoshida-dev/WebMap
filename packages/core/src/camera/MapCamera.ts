import type { LngLat } from "./LngLat.js";

/**
 * What part of the earth a map shows and from which angle.
 */
export interface MapCamera {
  readonly center: LngLat;
  /** Web Mercator zoom level; each step halves the scale. */
  readonly zoom: number;
  /** Clockwise rotation from north in degrees. */
  readonly bearing: number;
  /** Tilt from looking straight down in degrees. */
  readonly pitch: number;
}
