/**
 * What a tile URL template may be, beyond `https` and the `{z}`, `{x}` and `{y}` placeholders every one has by default.
 */
export interface TileUrlRules {
  /** Whether an `http` template is accepted; false when omitted. */
  readonly isHttpAllowed?: boolean;
  /** Whether `{bbox-epsg-3857}`, the tile's bounding box as WMS takes it, may replace the three placeholders; false when omitted. */
  readonly isBoundingBoxAllowed?: boolean;
}
