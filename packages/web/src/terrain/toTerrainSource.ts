import { TerrainEncoding } from "@web-map/core";
import type { Terrain } from "@web-map/core";
import type { RasterDEMSourceSpecification } from "maplibre-gl";

import { formatAttributionHtml } from "../attribution/formatAttributionHtml.js";
import { GSI_ELEVATION_SCHEME } from "./gsiElevationScheme.js";

/**
 * Turn a terrain into the raster-dem source MapLibre raises the ground from.
 *
 * GSI tiles are routed through {@link GSI_ELEVATION_SCHEME}, which re-encodes them as Terrarium; register it with
 * `registerGsiElevationProtocol` before the map loads them.
 *
 * @param terrain - Terrain to show.
 * @returns The source.
 */
export function toTerrainSource(terrain: Terrain): RasterDEMSourceSpecification {
  const source: RasterDEMSourceSpecification = {
    type: "raster-dem",
    tiles: [terrain.tileUrlTemplate],
    tileSize: terrain.tileSize,
    minzoom: terrain.minZoom,
    maxzoom: terrain.maxZoom,
    attribution: formatAttributionHtml(terrain.attributions),
  };
  switch (terrain.encoding) {
    case TerrainEncoding.TERRARIUM:
      return { ...source, encoding: "terrarium" };
    case TerrainEncoding.TERRAIN_RGB:
      return { ...source, encoding: "mapbox" };
    case TerrainEncoding.GSI:
      return { ...source, tiles: [terrain.tileUrlTemplate.replace(/^https:/, `${GSI_ELEVATION_SCHEME}:`)], encoding: "terrarium" };
    default: {
      const unreachable: never = terrain.encoding;
      throw new TypeError(`Unknown terrain encoding ${String(unreachable)}`);
    }
  }
}
