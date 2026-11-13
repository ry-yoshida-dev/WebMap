/**
 * Tile on the Web Mercator `{z}/{x}/{y}` grid, counted from the north-west corner.
 */
export interface TileCoordinate {
  readonly zoom: number;
  readonly x: number;
  readonly y: number;
}
