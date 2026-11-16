import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  defineRasterTileBasemap,
  CommercialUse,
  formatTileUrl,
  tileExtent,
  gsiBasemaps,
  MERCATOR_LATITUDE_LIMIT,
  nasaGibsBasemaps,
  tileCenter,
  tileContaining,
} from "../index.js";

describe("tileContaining", () => {
  it("finds the tile of a position", () => {
    assert.deepEqual(tileContaining({ lng: 139.767, lat: 35.681 }, 5), { zoom: 5, x: 28, y: 12 });
    assert.deepEqual(tileContaining({ lng: 0, lat: 0 }, 0), { zoom: 0, x: 0, y: 0 });
  });

  it("puts the east and south edges in the last tile", () => {
    assert.deepEqual(tileContaining({ lng: 180, lat: -MERCATOR_LATITUDE_LIMIT }, 2), { zoom: 2, x: 3, y: 3 });
  });

  it("rejects positions and zooms off the grid", () => {
    assert.throws(() => tileContaining({ lng: 181, lat: 0 }, 1), RangeError);
    assert.throws(() => tileContaining({ lng: 0, lat: 86 }, 1), RangeError);
    assert.throws(() => tileContaining({ lng: 0, lat: 0 }, 1.5), RangeError);
  });
});

describe("tileCenter", () => {
  it("returns a position inside the tile", () => {
    const center = tileCenter({ zoom: 5, x: 28, y: 12 });
    assert.equal(center.lng, 140.625);
    assert.deepEqual(tileContaining(center, 5), { zoom: 5, x: 28, y: 12 });
  });

  it("rejects tiles off the grid", () => {
    assert.throws(() => tileCenter({ zoom: 1, x: 2, y: 0 }), RangeError);
    assert.throws(() => tileCenter({ zoom: 25, x: 0, y: 0 }), RangeError);
    assert.throws(() => tileCenter({ zoom: 2000, x: 0, y: 0 }), RangeError);
  });
});

describe("formatTileUrl", () => {
  it("fills the placeholders in any order", () => {
    assert.equal(formatTileUrl(gsiBasemaps.standard, { zoom: 5, x: 28, y: 12 }), "https://cyberjapandata.gsi.go.jp/xyz/std/5/28/12.png");
    assert.match(formatTileUrl(nasaGibsBasemaps.blueMarble, { zoom: 3, x: 7, y: 2 }), /\/3\/2\/7\.jpeg$/);
  });

  it("rejects zooms the basemap does not serve", () => {
    assert.throws(() => formatTileUrl(nasaGibsBasemaps.blueMarble, { zoom: 9, x: 0, y: 0 }), RangeError);
  });

  it("rejects tiles off the grid", () => {
    assert.throws(() => formatTileUrl(gsiBasemaps.standard, { zoom: Number.NaN, x: 0, y: 0 }), RangeError);
    assert.throws(() => formatTileUrl(gsiBasemaps.standard, { zoom: 5.5, x: 0, y: 0 }), RangeError);
    assert.throws(() => formatTileUrl(gsiBasemaps.standard, { zoom: 5, x: -1, y: 0 }), RangeError);
    assert.throws(() => formatTileUrl(gsiBasemaps.standard, { zoom: 5, x: 0, y: 32 }), RangeError);
  });
});

describe("tileExtent", () => {
  it("covers the whole square at zoom 0 and halves it at zoom 1", () => {
    const edge = 20037508.342789244;
    assert.deepEqual(tileExtent({ zoom: 0, x: 0, y: 0 }), { minX: -edge, minY: -edge, maxX: edge, maxY: edge });
    assert.deepEqual(tileExtent({ zoom: 1, x: 1, y: 0 }), { minX: 0, minY: 0, maxX: edge, maxY: edge });
  });

  it("rejects tiles off the grid", () => {
    assert.throws(() => tileExtent({ zoom: 1, x: 2, y: 0 }), RangeError);
  });
});

describe("formatTileUrl of a WMS template", () => {
  const wms = defineRasterTileBasemap({
    id: "wms",
    title: "WMS",
    tileUrlTemplate: "https://wms.example.com/map?LAYERS=a&CRS=EPSG:3857&BBOX={bbox-epsg-3857}",
    minZoom: 0,
    maxZoom: 18,
    attributions: [],
    usage: { license: "Unknown", termsUrl: null, commercialUse: CommercialUse.UNKNOWN, conditions: null },
  });

  it("fills the bounding box of the tile in Web Mercator meters", () => {
    const { minX, minY, maxX, maxY } = tileExtent({ zoom: 7, x: 113, y: 50 });
    assert.equal(
      formatTileUrl(wms, { zoom: 7, x: 113, y: 50 }),
      `https://wms.example.com/map?LAYERS=a&CRS=EPSG:3857&BBOX=${minX},${minY},${maxX},${maxY}`,
    );
  });
});
