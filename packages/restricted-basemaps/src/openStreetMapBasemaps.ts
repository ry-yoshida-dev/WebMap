import { CommercialUse, defineRasterTileBasemap } from "@web-map/core";
import type { RasterTileBasemap } from "@web-map/core";

/**
 * Standard tiles of openstreetmap.org, served by the OpenStreetMap Foundation for light use only.
 */
export const openStreetMapBasemaps = {
  standard: defineRasterTileBasemap({
    id: "openstreetmap-standard",
    title: "OpenStreetMap",
    tileUrlTemplate: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    minZoom: 0,
    maxZoom: 19,
    attributions: [{ text: "© OpenStreetMap contributors", url: "https://www.openstreetmap.org/copyright" }],
    usage: {
      license: "ODbL 1.0",
      termsUrl: "https://operations.osmfoundation.org/policies/tiles/",
      commercialUse: CommercialUse.CONDITIONAL,
      conditions:
        "Light use only under the OSMF tile usage policy: no bulk or offline downloads, no service guarantee, " +
        "and access may be blocked without notice. Prefer OpenFreeMap for the same data in products.",
    },
  }),
} as const satisfies Record<string, RasterTileBasemap>;
