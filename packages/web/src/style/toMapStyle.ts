import { BasemapKind } from "@web-map/core";
import type { Basemap } from "@web-map/core";

import { formatAttributionHtml } from "./formatAttributionHtml.js";
import type { MapStyle } from "./MapStyle.js";

/** Id of the source and layer a raster basemap is drawn from. */
export const RASTER_BASEMAP_ID: string = "web-map-basemap";

/**
 * Turn a basemap into what `Map.setStyle` accepts.
 *
 * @param basemap - Basemap to show.
 * @returns A style document for raster tiles, or the style URL of a style basemap.
 */
export function toMapStyle(basemap: Basemap): MapStyle | string {
  switch (basemap.kind) {
    case BasemapKind.RASTER_TILES:
      return {
        version: 8,
        sources: {
          [RASTER_BASEMAP_ID]: {
            type: "raster",
            tiles: [basemap.tileUrlTemplate],
            tileSize: basemap.tileSize,
            minzoom: basemap.minZoom,
            maxzoom: basemap.maxZoom,
            attribution: formatAttributionHtml(basemap.attributions),
          },
        },
        layers: [{ id: RASTER_BASEMAP_ID, type: "raster", source: RASTER_BASEMAP_ID }],
      };
    case BasemapKind.STYLE:
      return basemap.styleUrl;
    default: {
      const unreachable: never = basemap;
      throw new TypeError(`Unknown basemap ${String(unreachable)}`);
    }
  }
}
