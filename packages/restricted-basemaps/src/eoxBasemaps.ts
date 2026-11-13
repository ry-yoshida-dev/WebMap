import { CommercialUse, defineRasterTileBasemap } from "@web-map/core";
import type { RasterTileBasemap } from "@web-map/core";

const TERMS_URL: string = "https://cloudless.eox.at/documentation/license";

function defineSentinel2Cloudless(
  year: number,
  layer: string,
  license: string,
  commercialUse: CommercialUse,
  conditions: string,
): RasterTileBasemap {
  return defineRasterTileBasemap({
    id: `eox-sentinel-2-cloudless-${year}`,
    title: `Sentinel-2 cloudless ${year}`,
    tileUrlTemplate: `https://tiles.maps.eox.at/wmts/1.0.0/${layer}/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg`,
    minZoom: 0,
    maxZoom: 14,
    attributions: [
      {
        text: `Sentinel-2 cloudless by EOX IT Services GmbH (Contains modified Copernicus Sentinel data ${year})`,
        url: "https://cloudless.eox.at/",
      },
    ],
    usage: { license, termsUrl: TERMS_URL, commercialUse, conditions },
  });
}

/**
 * EOX's worldwide cloudless Sentinel-2 mosaics, at about 10 m resolution.
 */
export const eoxBasemaps = {
  sentinel2Cloudless2024: defineSentinel2Cloudless(
    2024,
    "s2cloudless-2024_3857",
    "CC BY-NC-SA 4.0",
    CommercialUse.NON_COMMERCIAL_ONLY,
    "Commercial use requires a license purchased from EOX.",
  ),
  sentinel2Cloudless2016: defineSentinel2Cloudless(
    2016,
    "s2cloudless_3857",
    "CC BY 4.0 (per the layer description)",
    CommercialUse.CONDITIONAL,
    "The layer description states CC BY 4.0, while EOX's license summary names CC BY-NC-SA 4.0 for non-commercial use; " +
      "confirm with EOX before commercial use.",
  ),
} as const satisfies Record<string, RasterTileBasemap>;
