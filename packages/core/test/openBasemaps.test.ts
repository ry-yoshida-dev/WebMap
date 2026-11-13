import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { CommercialUse, openBasemaps } from "../src/index.js";

describe("openBasemaps", () => {
  it("has unique ids", () => {
    const ids: readonly string[] = openBasemaps.map((basemap) => basemap.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it("holds only basemaps free for commercial use with attribution", () => {
    for (const basemap of openBasemaps) {
      assert.equal(basemap.usage.commercialUse, CommercialUse.ALLOWED, basemap.id);
      assert.ok(basemap.attributions.length > 0, basemap.id);
    }
  });
});
