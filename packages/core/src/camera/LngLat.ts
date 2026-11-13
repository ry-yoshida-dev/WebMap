/**
 * Position on the earth in WGS 84 degrees.
 */
export interface LngLat {
  /** Longitude, east positive. */
  readonly lng: number;
  /** Latitude, north positive. */
  readonly lat: number;
}
