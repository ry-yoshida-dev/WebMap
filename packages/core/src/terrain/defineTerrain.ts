import { requireBasemapIdentity } from "../basemap/requireBasemapIdentity.js";
import { requireTileRange } from "../basemap/requireTileRange.js";
import type { Terrain } from "./Terrain.js";
import type { TerrainSpecification } from "./TerrainSpecification.js";

/**
 * Validate a terrain, for a catalog or for elevation tiles of your own.
 *
 * @param specification - Template, encoding, zoom range, attribution and terms.
 * @returns The terrain.
 * @throws BasemapDefinitionError When a URL is not `https`, the template lacks `{z}`, `{x}` or `{y}`, or the id or title is blank.
 * @throws RangeError When the zoom range or tile size is out of range.
 */
export function defineTerrain(specification: TerrainSpecification): Terrain {
  const tileSize: number = specification.tileSize ?? 256;
  requireBasemapIdentity(specification);
  requireTileRange(specification.id, specification.tileUrlTemplate, specification.minZoom, specification.maxZoom, tileSize);
  return { ...specification, tileSize };
}
