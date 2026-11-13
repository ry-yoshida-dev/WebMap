/**
 * Rectangle of Web Mercator (EPSG:3857), in meters: the area a map shows when it is not rotated or tilted.
 *
 * Its edges run along meridians and parallels, so the same rectangle in longitude and latitude bounds exactly the
 * same area. `maxX` exceeds 20037508.34 m when the extent crosses the antimeridian.
 */
export interface MapExtent {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}
