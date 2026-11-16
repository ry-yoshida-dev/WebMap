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

  it("rejects URLs without a host or with a placeholder in the host", () => {
    for (const tileUrlTemplate of [
      "https://:443/{z}/{x}/{y}.png",
      "https://{s}.tiles.example.com/{z}/{x}/{y}.png",
      "https:///{z}/{x}/{y}.png",
    ]) {
      assert.throws(() => defineRasterTileBasemap({ ...specification, tileUrlTemplate }), BasemapDefinitionError, tileUrlTemplate);
    }
    assert.doesNotThrow(() =>
      defineRasterTileBasemap({ ...specification, tileUrlTemplate: "https://tiles.example.com:8443/{z}/{x}/{y}.png?key=a" }),
    );
  });

  it("rejects an inverted or fractional zoom range", () => {
    assert.throws(() => defineRasterTileBasemap({ ...specification, minZoom: 10, maxZoom: 5 }), RangeError);
    assert.throws(() => defineRasterTileBasemap({ ...specification, maxZoom: 18.5 }), RangeError);
  });

  it("rejects a blank id", () => {
    assert.throws(() => defineRasterTileBasemap({ ...specification, id: " " }), BasemapDefinitionError);
  });

  it("accepts an http template only when allowed", () => {
    const http = { ...specification, tileUrlTemplate: "http://tiles.example.com/{z}/{x}/{y}.png" };
    assert.throws(() => defineRasterTileBasemap(http), BasemapDefinitionError);
    const basemap = defineRasterTileBasemap({ ...http, isHttpAllowed: true });
    assert.equal(basemap.tileUrlTemplate, http.tileUrlTemplate);
    assert.ok(!("isHttpAllowed" in basemap));
    assert.throws(() => defineRasterTileBasemap({ ...http, isHttpAllowed: true, tileUrlTemplate: "ftp://tiles.example.com/{z}/{x}/{y}" }));
  });

  it("accepts the bounding box of a WMS request instead of the three placeholders", () => {
    const wms = "https://wms.example.com/map?SERVICE=WMS&REQUEST=GetMap&LAYERS=a,b&CRS=EPSG:3857&BBOX={bbox-epsg-3857}";
    assert.equal(defineRasterTileBasemap({ ...specification, tileUrlTemplate: wms }).tileUrlTemplate, wms);
  });
});

describe("credits and terms without a link", () => {
  const unknownTerms: RasterTileBasemapSpecification = {
    ...specification,
    usage: { license: "Unknown", termsUrl: null, commercialUse: CommercialUse.UNKNOWN, conditions: null },
  };

  it("accepts plain text credits and unknown terms", () => {
    const basemap = defineRasterTileBasemap({ ...unknownTerms, attributions: [{ text: "Typed by the user", url: null }] });
    assert.equal(basemap.attributions[0]?.url, null);
    assert.equal(basemap.usage.termsUrl, null);
  });

  it("still rejects a blank credit and a link that is not https", () => {
    assert.throws(() => defineRasterTileBasemap({ ...unknownTerms, attributions: [{ text: " ", url: null }] }), BasemapDefinitionError);
    assert.throws(
      () => defineRasterTileBasemap({ ...unknownTerms, attributions: [{ text: "Credit", url: "http://example.com/" }] }),
      BasemapDefinitionError,
    );
  });
});
