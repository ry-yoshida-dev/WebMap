import type { Attribution } from "../basemap/Attribution.js";
import type { BasemapUsage } from "../basemap/BasemapUsage.js";
import { CommercialUse } from "../basemap/CommercialUse.js";
import { defineRasterTileBasemap } from "../basemap/defineRasterTileBasemap.js";
import type { RasterTileBasemap } from "../basemap/RasterTileBasemap.js";

const attributions: readonly Attribution[] = [{ text: "地理院タイル", url: "https://maps.gsi.go.jp/development/ichiran.html" }];
const usage: BasemapUsage = {
  license: "GSI Content Terms of Use (compatible with CC BY 4.0)",
  termsUrl: "https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html",
  commercialUse: CommercialUse.ALLOWED,
  conditions: null,
};

function defineGsiBasemap(
  id: string,
  title: string,
  layer: string,
  extension: string,
  minZoom: number,
  maxZoom: number,
): RasterTileBasemap {
  return defineRasterTileBasemap({
    id: `gsi-${id}`,
    title,
    tileUrlTemplate: `https://cyberjapandata.gsi.go.jp/xyz/${layer}/{z}/{x}/{y}.${extension}`,
    minZoom,
    maxZoom,
    attributions,
    usage,
  });
}

/**
 * Tiles of the Geospatial Information Authority of Japan (地理院タイル), covering Japan and,
 * for the standard, pale and photo maps at low zoom, the world.
 */
export const gsiBasemaps = {
  standard: defineGsiBasemap("standard", "GSI Standard", "std", "png", 2, 18),
  pale: defineGsiBasemap("pale", "GSI Pale", "pale", "png", 2, 18),
  blank: defineGsiBasemap("blank", "GSI Blank", "blank", "png", 5, 14),
  english: defineGsiBasemap("english", "GSI English", "english", "png", 5, 11),
  photo: defineGsiBasemap("photo", "GSI Photo", "seamlessphoto", "jpg", 2, 18),
  relief: defineGsiBasemap("relief", "GSI Relief", "relief", "png", 5, 15),
  hillshade: defineGsiBasemap("hillshade", "GSI Hillshade", "hillshademap", "png", 2, 16),
} as const satisfies Record<string, RasterTileBasemap>;
