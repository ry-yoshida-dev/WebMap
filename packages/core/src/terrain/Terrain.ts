import type { BasemapIdentity } from "../basemap/BasemapIdentity.js";
import type { TerrainEncoding } from "./TerrainEncoding.js";

/**
 * Elevation served as raster tiles on the Web Mercator grid, from which the map raises its ground.
 */
export interface Terrain extends BasemapIdentity {
  /** `https` URL with `{z}`, `{x}` and `{y}` placeholders, in any order. */
  readonly tileUrlTemplate: string;
  readonly encoding: TerrainEncoding;
  /** Edge of a tile in pixels. */
  readonly tileSize: number;
  /** Lowest zoom level the provider serves. */
  readonly minZoom: number;
  /** Highest zoom level the provider serves; tiles are enlarged beyond it. */
  readonly maxZoom: number;
}
