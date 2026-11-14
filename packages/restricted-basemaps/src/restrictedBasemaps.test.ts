import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { BasemapDefinitionError, CommercialUse } from "@web-map/core";
import type { Basemap } from "@web-map/core";

import { createCartoBasemaps, eoxBasemaps, openStreetMapBasemaps } from "./index.js";

describe("restricted basemaps", () => {
  it("state a restriction and its conditions for every basemap", () => {
    const basemaps: readonly Basemap[] = [
      ...Object.values(openStreetMapBasemaps),
      ...Object.values(eoxBasemaps),
      ...Object.values(createCartoBasemaps("key")),
    ];
    for (const basemap of basemaps) {
      assert.notEqual(basemap.usage.commercialUse, CommercialUse.ALLOWED, basemap.id);
      assert.ok(basemap.usage.conditions !== null, basemap.id);
    }
  });

  it("encodes the CARTO key into the tile URL", () => {
    const { positron } = createCartoBasemaps("a&b");
    assert.ok(positron.tileUrlTemplate.endsWith("?key=a%26b"));
  });

  it("rejects a blank CARTO key", () => {
    assert.throws(() => createCartoBasemaps(" "), BasemapDefinitionError);
  });
});
