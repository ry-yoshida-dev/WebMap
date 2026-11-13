import type { Attribution } from "../basemap/Attribution.js";
import type { BasemapUsage } from "../basemap/BasemapUsage.js";
import { CommercialUse } from "../basemap/CommercialUse.js";
import { defineStyleBasemap } from "../basemap/defineStyleBasemap.js";
import type { StyleBasemap } from "../basemap/StyleBasemap.js";

const attributions: readonly Attribution[] = [
  { text: "OpenFreeMap", url: "https://openfreemap.org/" },
  { text: "© OpenMapTiles", url: "https://www.openmaptiles.org/" },
  { text: "Data from OpenStreetMap", url: "https://www.openstreetmap.org/copyright" },
];
const usage: BasemapUsage = {
  license: "ODbL 1.0 (OpenStreetMap data)",
  termsUrl: "https://openfreemap.org/tos/",
  commercialUse: CommercialUse.ALLOWED,
  conditions: null,
};

function defineOpenFreeMapBasemap(style: string, title: string): StyleBasemap {
  return defineStyleBasemap({
    id: `openfreemap-${style}`,
    title,
    styleUrl: `https://tiles.openfreemap.org/styles/${style}`,
    attributions,
    usage,
  });
}

/**
 * Worldwide vector maps of OpenStreetMap data from OpenFreeMap, free of keys and view limits.
 */
export const openFreeMapBasemaps = {
  liberty: defineOpenFreeMapBasemap("liberty", "OpenFreeMap Liberty"),
  bright: defineOpenFreeMapBasemap("bright", "OpenFreeMap Bright"),
  positron: defineOpenFreeMapBasemap("positron", "OpenFreeMap Positron"),
  dark: defineOpenFreeMapBasemap("dark", "OpenFreeMap Dark"),
} as const satisfies Record<string, StyleBasemap>;
