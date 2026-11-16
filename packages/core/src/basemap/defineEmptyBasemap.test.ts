import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { BasemapDefinitionError, BasemapKind, CommercialUse, defineEmptyBasemap, noBasemap } from "../index.js";

describe("defineEmptyBasemap", () => {
  it("has no credit and no terms to show", () => {
    const basemap = defineEmptyBasemap({ id: "blank", title: "Blank" });
    assert.equal(basemap.kind, BasemapKind.NONE);
    assert.deepEqual(basemap.attributions, []);
    assert.equal(basemap.usage.termsUrl, null);
    assert.equal(basemap.usage.commercialUse, CommercialUse.ALLOWED);
  });

  it("rejects a blank id or title", () => {
    assert.throws(() => defineEmptyBasemap({ id: " ", title: "Blank" }), BasemapDefinitionError);
    assert.throws(() => defineEmptyBasemap({ id: "blank", title: "" }), BasemapDefinitionError);
  });

  it("is offered by the catalog", () => {
    assert.equal(noBasemap.kind, BasemapKind.NONE);
  });
});
