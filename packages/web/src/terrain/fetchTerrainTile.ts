import { formatTileUrl, TerrainEncoding } from "@web-map/core";
import type { Terrain, TileCoordinate } from "@web-map/core";

import { gsiToTerrarium } from "./gsiToTerrarium.js";
import { readElevationImage } from "./readElevationImage.js";
import { terrainRgbToTerrarium } from "./terrainRgbToTerrarium.js";

/**
 * Fetch one tile of a terrain's elevation as Terrarium pixels, whatever the terrain's encoding, for what needs the
 * heights themselves: a 3D layer drawing the ground's depth, or an elevation profile.
 *
 * The height of a pixel is `R * 256 + G + B / 256 - 32768` meters, which is the decoder a deck.gl `TerrainLayer`
 * takes as `{ rScaler: 256, gScaler: 1, bScaler: 1 / 256, offset: -32768 }`. GSI pixels without data, as at sea, are
 * 0 m. The heights are not multiplied by the map's terrain exaggeration.
 *
 * @param terrain - Terrain whose tile to read.
 * @param tile - Tile to fetch, within the terrain's zoom range.
 * @param signal - Aborts the request.
 * @returns The Terrarium RGBA pixels.
 * @throws RangeError When the tile is not on the grid or its zoom is outside the terrain's zoom range.
 * @throws AJAXError When the server answers with an error, as 404 for a tile outside a provider's coverage; treat
 *   such a tile as flat ground at 0 m, as the map does.
 */
export async function fetchTerrainTile(terrain: Terrain, tile: TileCoordinate, signal?: AbortSignal): Promise<ImageData> {
  const image: ImageData = await readElevationImage(formatTileUrl(terrain, tile), signal);
  switch (terrain.encoding) {
    case TerrainEncoding.TERRARIUM:
      break;
    case TerrainEncoding.TERRAIN_RGB:
      terrainRgbToTerrarium(image.data);
      break;
    case TerrainEncoding.GSI:
      gsiToTerrarium(image.data);
      break;
    default: {
      const unreachable: never = terrain.encoding;
      throw new TypeError(`Unknown terrain encoding ${String(unreachable)}`);
    }
  }
  return image;
}
