import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { CommercialUse, defineRasterTileBasemap, gsiBasemaps, openFreeMapBasemaps } from "@web-map/core";

import { RASTER_BASEMAP_ID, toMapStyle } from "./toMapStyle.js";

describe("toMapStyle", () => {
  it("builds a raster style with the tile range and attribution", () => {
    const style = toMapStyle(gsiBasemaps.blank);
    assert.ok(typeof style !== "string");
    const source = style.sources[RASTER_BASEMAP_ID];
    assert.ok(source !== undefined && source.type === "raster");
    assert.deepEqual(source.tiles, ["https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png"]);
    assert.equal(source.minzoom, 5);
    assert.equal(source.maxzoom, 14);
    assert.ok(source.attribution?.includes("地理院タイル"));
  });

  it("passes a style basemap's URL through", () => {
    assert.equal(toMapStyle(openFreeMapBasemaps.liberty), "https://tiles.openfreemap.org/styles/liberty");
  });

  it("keeps a bounding box placeholder for MapLibre to fill", () => {
    const wms = defineRasterTileBasemap({
      id: "wms",
      title: "WMS",
      tileUrlTemplate: "https://wms.example.com/map?CRS=EPSG:3857&BBOX={bbox-epsg-3857}",
      minZoom: 0,
      maxZoom: 18,
      attributions: [],
      usage: { license: "Unknown", termsUrl: null, commercialUse: CommercialUse.UNKNOWN, conditions: null },
    });
    const style = toMapStyle(wms);
    assert.ok(typeof style !== "string");
    const source = style.sources[RASTER_BASEMAP_ID];
    assert.ok(source !== undefined && source.type === "raster");
    assert.deepEqual(source.tiles, [wms.tileUrlTemplate]);
  });
});
