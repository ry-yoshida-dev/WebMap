import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { defineMapCamera } from "../src/index.js";

describe("defineMapCamera", () => {
  it("defaults bearing and pitch to zero", () => {
    assert.deepEqual(defineMapCamera({ center: { lng: 139.7, lat: 35.7 }, zoom: 10 }), {
      center: { lng: 139.7, lat: 35.7 },
      zoom: 10,
      bearing: 0,
      pitch: 0,
    });
  });

  it("normalizes the bearing into [0, 360)", () => {
    assert.equal(defineMapCamera({ center: { lng: 0, lat: 0 }, zoom: 1, bearing: -90 }).bearing, 270);
    assert.equal(defineMapCamera({ center: { lng: 0, lat: 0 }, zoom: 1, bearing: 720 }).bearing, 0);
  });

  it("rejects positions Web Mercator cannot show", () => {
    assert.throws(() => defineMapCamera({ center: { lng: 181, lat: 0 }, zoom: 1 }), RangeError);
    assert.throws(() => defineMapCamera({ center: { lng: 0, lat: 89 }, zoom: 1 }), RangeError);
    assert.throws(() => defineMapCamera({ center: { lng: Number.NaN, lat: 0 }, zoom: 1 }), RangeError);
  });

  it("rejects out-of-range zoom and pitch", () => {
    assert.throws(() => defineMapCamera({ center: { lng: 0, lat: 0 }, zoom: -1 }), RangeError);
    assert.throws(() => defineMapCamera({ center: { lng: 0, lat: 0 }, zoom: 1, pitch: 90 }), RangeError);
  });
});
