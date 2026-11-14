import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { BasemapDefinitionError, BasemapKind, CommercialUse, defineStyleBasemap } from "../index.js";
import type { StyleBasemapSpecification } from "../index.js";

const specification: StyleBasemapSpecification = {
  id: "example-style",
  title: "Example style",
  styleUrl: "https://tiles.example.com/style.json",
  attributions: [],
  usage: { license: "ODbL 1.0", termsUrl: "https://example.com/terms", commercialUse: CommercialUse.ALLOWED, conditions: null },
};

describe("defineStyleBasemap", () => {
  it("returns a style basemap", () => {
    assert.equal(defineStyleBasemap(specification).kind, BasemapKind.STYLE);
  });

  it("rejects a style URL that is not https", () => {
    assert.throws(() => defineStyleBasemap({ ...specification, styleUrl: "http://tiles.example.com/style.json" }), BasemapDefinitionError);
    assert.throws(() => defineStyleBasemap({ ...specification, styleUrl: "not a url" }), BasemapDefinitionError);
  });
});
