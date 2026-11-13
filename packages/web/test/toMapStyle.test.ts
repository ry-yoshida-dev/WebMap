import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { gsiBasemaps, openFreeMapBasemaps } from "@web-map/core";

import { RASTER_BASEMAP_ID, toMapStyle } from "../src/style/toMapStyle.js";

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
});
