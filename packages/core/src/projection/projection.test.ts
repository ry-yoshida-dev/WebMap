import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { fromWebMercator, MERCATOR_LATITUDE_LIMIT, toWebMercator, webMercatorResolution } from "../index.js";

/** Half the width of the Web Mercator square in meters. */
const HALF_WORLD: number = Math.PI * 6378137;

describe("toWebMercator", () => {
  it("matches EPSG:3857 at known positions", () => {
    const origin = toWebMercator({ lng: 0, lat: 0 });
    assert.equal(origin.x, 0);
    assert.ok(Math.abs(origin.y) < 1e-6);
    assert.ok(Math.abs(toWebMercator({ lng: 180, lat: 0 }).x - 20037508.342789244) < 1e-6);
    // Tokyo Station, as pyproj 3 transforms it from EPSG:4326 to EPSG:3857.
    const tokyo = toWebMercator({ lng: 139.7671, lat: 35.6812 });
    assert.ok(Math.abs(tokyo.x - 15558802.4017) < 1e-3);
    assert.ok(Math.abs(tokyo.y - 4256843.1865) < 1e-3);
  });

  it("keeps longitudes past the antimeridian contiguous", () => {
    assert.ok(toWebMercator({ lng: 190, lat: 0 }).x > HALF_WORLD);
  });

  it("puts the latitude limit on the edge of the square", () => {
    assert.ok(Math.abs(toWebMercator({ lng: 0, lat: MERCATOR_LATITUDE_LIMIT }).y - HALF_WORLD) < 1e-6);
    assert.throws(() => toWebMercator({ lng: 0, lat: 85.051129 }), RangeError);
  });

  it("rejects latitudes beyond the square", () => {
    assert.throws(() => toWebMercator({ lng: 0, lat: 86 }), RangeError);
    assert.throws(() => toWebMercator({ lng: Number.NaN, lat: 0 }), RangeError);
  });
});

describe("fromWebMercator", () => {
  it("inverts toWebMercator", () => {
    const position = fromWebMercator(toWebMercator({ lng: 139.7671, lat: 35.6812 }));
    assert.ok(Math.abs(position.lng - 139.7671) < 1e-12);
    assert.ok(Math.abs(position.lat - 35.6812) < 1e-12);
  });

  it("rejects coordinates that are not finite", () => {
    assert.throws(() => fromWebMercator({ x: Number.POSITIVE_INFINITY, y: 0 }), RangeError);
  });
});

describe("webMercatorResolution", () => {
  it("spans the world with 512 pixels at zoom 0 and halves per zoom level", () => {
    assert.equal(webMercatorResolution(0), (2 * HALF_WORLD) / 512);
    assert.equal(webMercatorResolution(3), webMercatorResolution(0) / 8);
  });
});
