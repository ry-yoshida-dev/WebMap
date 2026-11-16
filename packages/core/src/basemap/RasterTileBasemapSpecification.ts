import type { RasterTileBasemap } from "./RasterTileBasemap.js";

/**
 * Fields of a {@link RasterTileBasemap} given to {@link defineRasterTileBasemap}; the tile size defaults to 256.
 */
export type RasterTileBasemapSpecification = Omit<RasterTileBasemap, "kind" | "tileSize"> & {
  readonly tileSize?: number;
  /**
   * Accept an `http` tile URL; false when omitted. A page served over `https` cannot load `http` tiles, and the
   * tiles can be read or altered on the way, so allow it only for services that offer nothing else, on pages served
   * over `http`, as a local tool is.
   */
  readonly isHttpAllowed?: boolean;
};
