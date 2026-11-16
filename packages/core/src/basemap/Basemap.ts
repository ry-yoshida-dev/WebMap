import type { EmptyBasemap } from "./EmptyBasemap.js";
import type { RasterTileBasemap } from "./RasterTileBasemap.js";
import type { StyleBasemap } from "./StyleBasemap.js";

/**
 * Map shown beneath everything else, discriminated by {@link BasemapKind}.
 */
export type Basemap = RasterTileBasemap | StyleBasemap | EmptyBasemap;
