import type { Attribution } from "../basemap/Attribution.js";
import type { BasemapUsage } from "../basemap/BasemapUsage.js";
import { CommercialUse } from "../basemap/CommercialUse.js";
import { defineRasterTileBasemap } from "../basemap/defineRasterTileBasemap.js";
import type { RasterTileBasemap } from "../basemap/RasterTileBasemap.js";

const attributions: readonly Attribution[] = [{ text: "NASA GIBS", url: "https://nasa-gibs.github.io/gibs-api-docs/" }];
const usage: BasemapUsage = {
  license: "NASA open data, no access constraints",
  termsUrl: "https://www.earthdata.nasa.gov/engage/open-data-services-software-policies",
  commercialUse: CommercialUse.ALLOWED,
  conditions: null,
};

function defineGibsBasemap(id: string, title: string, layer: string, extension: string): RasterTileBasemap {
  return defineRasterTileBasemap({
    id: `nasa-gibs-${id}`,
    title,
    tileUrlTemplate: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layer}/default/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.${extension}`,
    minZoom: 0,
    maxZoom: 8,
    attributions,
    usage,
  });
}

/**
 * Worldwide satellite composites from NASA's Global Imagery Browse Services, up to zoom 8.
 */
export const nasaGibsBasemaps = {
  blueMarble: defineGibsBasemap("blue-marble", "NASA Blue Marble", "BlueMarble_ShadedRelief_Bathymetry", "jpeg"),
  blackMarble: defineGibsBasemap("black-marble", "NASA Black Marble (night)", "VIIRS_Black_Marble", "png"),
} as const satisfies Record<string, RasterTileBasemap>;
