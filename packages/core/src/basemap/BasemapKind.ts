/**
 * How a basemap is delivered.
 */
export enum BasemapKind {
  /** Raster tiles on the Web Mercator grid, addressed by `{z}/{x}/{y}` or by the bounding box of the tile. */
  RASTER_TILES = "raster-tiles",
  /** A MapLibre style document, usually drawing vector tiles. */
  STYLE = "style",
}
