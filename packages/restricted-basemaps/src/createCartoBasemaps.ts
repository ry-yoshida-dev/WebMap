import { BasemapDefinitionError, CommercialUse, defineRasterTileBasemap } from "@web-map/core";
import type { Attribution, BasemapUsage, RasterTileBasemap } from "@web-map/core";

const attributions: readonly Attribution[] = [
  { text: "© OpenStreetMap contributors", url: "https://www.openstreetmap.org/copyright" },
  { text: "© CARTO", url: "https://carto.com/attributions" },
];
const usage: BasemapUsage = {
  license: "CARTO Basemap Terms; data ODbL 1.0",
  termsUrl: "https://carto.com/legal/basemap-terms/",
  commercialUse: CommercialUse.CONDITIONAL,
  conditions:
    "Requires a CARTO API key. A free key allows commercial use up to 1,000,000 tile requests a month; " +
    "beyond that a paid plan is needed. Proxying, server-side caching and bulk downloads are prohibited.",
};

/**
 * CARTO's worldwide raster basemaps, requested with your API key.
 *
 * The key is sent from the browser with every tile, so use a key CARTO issues for client use,
 * restricted to your domains.
 *
 * @param apiKey - CARTO basemap API key.
 * @returns The Positron, Dark Matter and Voyager basemaps.
 * @throws BasemapDefinitionError When the key is blank.
 */
export function createCartoBasemaps(apiKey: string): {
  readonly positron: RasterTileBasemap;
  readonly darkMatter: RasterTileBasemap;
  readonly voyager: RasterTileBasemap;
} {
  if (apiKey.trim() === "") {
    throw new BasemapDefinitionError("A CARTO API key must not be blank");
  }
  const define = (id: string, title: string, path: string): RasterTileBasemap =>
    defineRasterTileBasemap({
      id: `carto-${id}`,
      title,
      tileUrlTemplate: `https://basemaps.cartocdn.com/${path}/{z}/{x}/{y}.png?key=${encodeURIComponent(apiKey)}`,
      minZoom: 0,
      maxZoom: 20,
      attributions,
      usage,
    });
  return {
    positron: define("positron", "CARTO Positron", "light_all"),
    darkMatter: define("dark-matter", "CARTO Dark Matter", "dark_all"),
    voyager: define("voyager", "CARTO Voyager", "rastertiles/voyager"),
  };
}
