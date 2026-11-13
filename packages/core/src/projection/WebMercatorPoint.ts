/**
 * Position in Web Mercator (EPSG:3857), in meters east and north of where the equator crosses the prime meridian.
 *
 * `x` continues past ±20037508.34 m east of the antimeridian, so that a span crossing it stays contiguous.
 */
export interface WebMercatorPoint {
  readonly x: number;
  readonly y: number;
}
