import { CommercialUse, defineRasterTileBasemap, defineStyleBasemap } from "@web-map/core";
import type { BasemapUsage, RasterTileBasemap, StyleBasemap } from "@web-map/core";

const usage: BasemapUsage = {
  license: "Test",
  termsUrl: "https://tiles.example/terms",
  commercialUse: CommercialUse.ALLOWED,
  conditions: null,
};

function defineSample(id: string): RasterTileBasemap {
  return defineRasterTileBasemap({
    id,
    title: `Sample ${id}`,
    tileUrlTemplate: `https://tiles.example/${id}/{z}/{x}/{y}.png`,
    minZoom: 0,
    maxZoom: 18,
    attributions: [{ text: "Sample", url: "https://tiles.example/" }],
    usage,
  });
}

/** Raster basemaps that need no hidden map to preview. */
export const sampleRasterBasemaps: {
  readonly first: RasterTileBasemap;
  readonly second: RasterTileBasemap;
  readonly third: RasterTileBasemap;
} = { first: defineSample("first"), second: defineSample("second"), third: defineSample("third") };

/** A style basemap, previewed by drawing it on a hidden map. */
export const sampleStyleBasemap: StyleBasemap = defineStyleBasemap({
  id: "vector",
  title: "Sample vector",
  styleUrl: "https://tiles.example/style.json",
  attributions: [{ text: "Sample", url: "https://tiles.example/" }],
  usage,
});
