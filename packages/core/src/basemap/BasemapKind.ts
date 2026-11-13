/**
 * How a basemap is delivered.
 */
export enum BasemapKind {
  /** Raster tiles on the Web Mercator `{z}/{x}/{y}` grid. */
  RASTER_TILES = "raster-tiles",
  /** A MapLibre style document, usually drawing vector tiles. */
  STYLE = "style",
}
