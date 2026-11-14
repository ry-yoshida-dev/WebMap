import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { BasemapDefinitionError, BasemapKind, CommercialUse, defineRasterTileBasemap } from "../index.js";
import type { RasterTileBasemapSpecification } from "../index.js";

const specification: RasterTileBasemapSpecification = {
  id: "example",
  title: "Example",
  tileUrlTemplate: "https://tiles.example.com/{z}/{x}/{y}.png",
  minZoom: 0,
  maxZoom: 18,
  attributions: [{ text: "Example", url: "https://example.com/" }],
  usage: { license: "CC BY 4.0", termsUrl: "https://example.com/terms", commercialUse: CommercialUse.ALLOWED, conditions: null },
};

describe("defineRasterTileBasemap", () => {
  it("returns a raster tile basemap with a 256 pixel default tile size", () => {
    const basemap = defineRasterTileBasemap(specification);
    assert.equal(basemap.kind, BasemapKind.RASTER_TILES);
    assert.equal(basemap.tileSize, 256);
  });

  it("accepts the placeholders in any order", () => {
    assert.doesNotThrow(() => defineRasterTileBasemap({ ...specification, tileUrlTemplate: "https://tiles.example.com/{z}/{y}/{x}.png" }));
  });

  it("rejects a template without a placeholder", () => {
    assert.throws(
      () => defineRasterTileBasemap({ ...specification, tileUrlTemplate: "https://tiles.example.com/{z}/{x}.png" }),
      BasemapDefinitionError,
    );
  });

  it("rejects URLs that are not https", () => {
    assert.throws(
      () => defineRasterTileBasemap({ ...specification, tileUrlTemplate: "http://tiles.example.com/{z}/{x}/{y}.png" }),
      BasemapDefinitionError,
    );
    assert.throws(
      () => defineRasterTileBasemap({ ...specification, attributions: [{ text: "Example", url: "javascript:alert(1)" }] }),
      BasemapDefinitionError,
    );
  });

  it("rejects an inverted or fractional zoom range", () => {
    assert.throws(() => defineRasterTileBasemap({ ...specification, minZoom: 10, maxZoom: 5 }), RangeError);
    assert.throws(() => defineRasterTileBasemap({ ...specification, maxZoom: 18.5 }), RangeError);
  });

  it("rejects a blank id", () => {
    assert.throws(() => defineRasterTileBasemap({ ...specification, id: " " }), BasemapDefinitionError);
  });
});
