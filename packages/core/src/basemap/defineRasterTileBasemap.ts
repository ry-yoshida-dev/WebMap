import { BasemapKind } from "./BasemapKind.js";
import { requireBasemapIdentity } from "./requireBasemapIdentity.js";
import { requireTileRange } from "./requireTileRange.js";
import type { RasterTileBasemap } from "./RasterTileBasemap.js";
import type { RasterTileBasemapSpecification } from "./RasterTileBasemapSpecification.js";

/**
 * Validate a raster tile basemap, for a catalog or for tiles of your own.
 *
 * @param specification - Template, zoom range, attribution and terms.
 * @returns The basemap.
 * @throws BasemapDefinitionError When a URL is not `https` or the template lacks `{z}`, `{x}` or `{y}`.
 * @throws RangeError When the zoom range or tile size is out of range.
 */
export function defineRasterTileBasemap(specification: RasterTileBasemapSpecification): RasterTileBasemap {
  const tileSize: number = specification.tileSize ?? 256;
  requireBasemapIdentity(specification);
  requireTileRange(specification.id, specification.tileUrlTemplate, specification.minZoom, specification.maxZoom, tileSize);
  return { ...specification, kind: BasemapKind.RASTER_TILES, tileSize };
}
