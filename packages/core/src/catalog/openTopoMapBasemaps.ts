import { CommercialUse } from "../basemap/CommercialUse.js";
import { defineRasterTileBasemap } from "../basemap/defineRasterTileBasemap.js";
import type { RasterTileBasemap } from "../basemap/RasterTileBasemap.js";

/**
 * Worldwide topographic map rendered from OpenStreetMap and SRTM elevation by OpenTopoMap.
 */
export const openTopoMapBasemaps = {
  topographic: defineRasterTileBasemap({
    id: "opentopomap",
    title: "OpenTopoMap",
    tileUrlTemplate: "https://tile.opentopomap.org/{z}/{x}/{y}.png",
    minZoom: 0,
    maxZoom: 17,
    attributions: [
      { text: "© OpenStreetMap contributors, SRTM", url: "https://www.openstreetmap.org/copyright" },
      { text: "© OpenTopoMap (CC-BY-SA)", url: "https://opentopomap.org/" },
    ],
    usage: {
      license: "CC BY-SA 3.0",
      termsUrl: "https://opentopomap.org/about",
      commercialUse: CommercialUse.ALLOWED,
      conditions: "Best-effort service; do not overload it, for example with bulk downloads.",
    },
  }),
} as const satisfies Record<string, RasterTileBasemap>;
