import type { RasterTileBasemap } from "./RasterTileBasemap.js";

/**
 * Fields of a {@link RasterTileBasemap} given to {@link defineRasterTileBasemap}; the tile size defaults to 256.
 */
export type RasterTileBasemapSpecification = Omit<RasterTileBasemap, "kind" | "tileSize"> & { readonly tileSize?: number };
