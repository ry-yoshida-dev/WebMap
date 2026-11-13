import type { BasemapIdentity } from "./BasemapIdentity.js";
import type { BasemapKind } from "./BasemapKind.js";

/**
 * Basemap served as raster tiles on the Web Mercator grid.
 */
export interface RasterTileBasemap extends BasemapIdentity {
  readonly kind: BasemapKind.RASTER_TILES;
  /** `https` URL with `{z}`, `{x}` and `{y}` placeholders, in any order. */
  readonly tileUrlTemplate: string;
  /** Edge of a tile in pixels. */
  readonly tileSize: number;
  /** Lowest zoom level the provider serves. */
  readonly minZoom: number;
  /** Highest zoom level the provider serves; tiles are enlarged beyond it. */
  readonly maxZoom: number;
}
