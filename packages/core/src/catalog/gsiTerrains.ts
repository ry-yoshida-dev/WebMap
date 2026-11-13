import { CommercialUse } from "../basemap/CommercialUse.js";
import { defineTerrain } from "../terrain/defineTerrain.js";
import type { Terrain } from "../terrain/Terrain.js";
import { TerrainEncoding } from "../terrain/TerrainEncoding.js";

/**
 * Elevation tiles of the Geospatial Information Authority of Japan (標高タイル), covering Japan's land at a 10 m grid
 * (DEM10B) up to zoom 14. The sea and the world outside Japan stay flat.
 */
export const gsiTerrains = {
  elevation: defineTerrain({
    id: "gsi-elevation",
    title: "GSI Elevation (Japan)",
    tileUrlTemplate: "https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png",
    encoding: TerrainEncoding.GSI,
    minZoom: 1,
    maxZoom: 14,
    attributions: [{ text: "地理院タイル", url: "https://maps.gsi.go.jp/development/ichiran.html" }],
    usage: {
      license: "GSI Content Terms of Use (compatible with CC BY 4.0)",
      termsUrl: "https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html",
      commercialUse: CommercialUse.ALLOWED,
      conditions: null,
    },
  }),
} as const satisfies Record<string, Terrain>;
