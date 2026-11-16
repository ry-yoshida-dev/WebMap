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
 * @throws BasemapDefinitionError When a URL is not `https` (the tile URL may be `http` when allowed), or the template
 *   lacks `{z}`, `{x}` or `{y}` and has no `{bbox-epsg-3857}`.
 * @throws RangeError When the zoom range or tile size is out of range.
 */
export function defineRasterTileBasemap(specification: RasterTileBasemapSpecification): RasterTileBasemap {
  const tileSize: number = specification.tileSize ?? 256;
  requireBasemapIdentity(specification);
  const { isHttpAllowed, ...basemap } = specification;
  requireTileRange(specification.id, specification.tileUrlTemplate, specification.minZoom, specification.maxZoom, tileSize, {
    isHttpAllowed: isHttpAllowed ?? false,
    isBoundingBoxAllowed: true,
  });
  return { ...basemap, kind: BasemapKind.RASTER_TILES, tileSize };
}
