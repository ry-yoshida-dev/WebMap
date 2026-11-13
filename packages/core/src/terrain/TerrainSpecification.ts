import type { Terrain } from "./Terrain.js";

/**
 * Fields of a {@link Terrain} given to {@link defineTerrain}; the tile size defaults to 256.
 */
export type TerrainSpecification = Omit<Terrain, "tileSize"> & { readonly tileSize?: number };
