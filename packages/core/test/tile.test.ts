import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatTileUrl, gsiBasemaps, nasaGibsBasemaps, tileCenter, tileContaining } from "../src/index.js";

describe("tileContaining", () => {
  it("finds the tile of a position", () => {
    assert.deepEqual(tileContaining({ lng: 139.767, lat: 35.681 }, 5), { zoom: 5, x: 28, y: 12 });
    assert.deepEqual(tileContaining({ lng: 0, lat: 0 }, 0), { zoom: 0, x: 0, y: 0 });
  });

  it("puts the east and south edges in the last tile", () => {
    assert.deepEqual(tileContaining({ lng: 180, lat: -85.051129 }, 2), { zoom: 2, x: 3, y: 3 });
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
});
