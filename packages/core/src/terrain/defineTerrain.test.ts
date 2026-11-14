import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { BasemapDefinitionError, CommercialUse, defineTerrain, openTerrains, TerrainEncoding } from "../index.js";
import type { TerrainSpecification } from "../index.js";

const specification: TerrainSpecification = {
  id: "example-dem",
  title: "Example elevation",
  tileUrlTemplate: "https://tiles.example.com/dem/{z}/{x}/{y}.png",
  encoding: TerrainEncoding.TERRARIUM,
  minZoom: 0,
  maxZoom: 14,
  attributions: [{ text: "Example", url: "https://example.com/" }],
  usage: { license: "CC BY 4.0", termsUrl: "https://example.com/terms", commercialUse: CommercialUse.ALLOWED, conditions: null },
};

describe("defineTerrain", () => {
  it("returns a terrain with a 256 pixel default tile size", () => {
    assert.equal(defineTerrain(specification).tileSize, 256);
  });

  it("rejects a template without a placeholder or not https", () => {
    assert.throws(
      () => defineTerrain({ ...specification, tileUrlTemplate: "https://tiles.example.com/{z}/{x}.png" }),
      BasemapDefinitionError,
    );
    assert.throws(
      () => defineTerrain({ ...specification, tileUrlTemplate: "http://tiles.example.com/{z}/{x}/{y}.png" }),
      BasemapDefinitionError,
    );
  });

  it("rejects an inverted zoom range and a blank title", () => {
    assert.throws(() => defineTerrain({ ...specification, minZoom: 15, maxZoom: 14 }), RangeError);
    assert.throws(() => defineTerrain({ ...specification, title: "" }), BasemapDefinitionError);
  });
});

describe("openTerrains", () => {
  it("starts with the GSI elevation tiles and has unique ids", () => {
    assert.equal(openTerrains[0]?.encoding, TerrainEncoding.GSI);
    const ids: readonly string[] = openTerrains.map((terrain) => terrain.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it("holds only terrains free for commercial use with attribution", () => {
    for (const terrain of openTerrains) {
      assert.equal(terrain.usage.commercialUse, CommercialUse.ALLOWED, terrain.id);
      assert.ok(terrain.attributions.length > 0, terrain.id);
    }
  });
});
