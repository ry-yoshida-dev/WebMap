import { CommercialUse } from "../basemap/CommercialUse.js";
import { defineTerrain } from "../terrain/defineTerrain.js";
import type { Terrain } from "../terrain/Terrain.js";
import { TerrainEncoding } from "../terrain/TerrainEncoding.js";

/**
 * Worldwide elevation of the Mapzen Terrain Tiles, merged from SRTM, GMTED2010, ETOPO1 and national surveys and served
 * on AWS Open Data, up to zoom 15.
 */
export const mapzenTerrains = {
  terrarium: defineTerrain({
    id: "mapzen-terrarium",
    title: "Mapzen Terrain Tiles (World)",
    tileUrlTemplate: "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
    encoding: TerrainEncoding.TERRARIUM,
    minZoom: 0,
    maxZoom: 15,
    attributions: [
      { text: "Mapzen Terrain Tiles and their sources", url: "https://github.com/tilezen/joerd/blob/master/docs/attribution.md" },
    ],
    usage: {
      license: "Open data of each source, credited as listed by Joerd",
      termsUrl: "https://github.com/tilezen/joerd/blob/master/docs/attribution.md",
      commercialUse: CommercialUse.ALLOWED,
      conditions: null,
    },
  }),
} as const satisfies Record<string, Terrain>;
