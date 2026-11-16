import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { defineEmptyBasemap, gsiBasemaps, gsiTerrains, mapzenTerrains, noBasemap } from "@web-map/core";

import { collectAttributions } from "./collectAttributions.js";

describe("collectAttributions", () => {
  it("lists the basemap's credits, then the terrain's while it is shown, without repeats", () => {
    const flat = collectAttributions(gsiBasemaps.pale, null);
    assert.deepEqual(flat, gsiBasemaps.pale.attributions);
    // GSI credits itself once for tiles and elevation.
    assert.deepEqual(collectAttributions(gsiBasemaps.pale, gsiTerrains.elevation), flat);
  });

  it("adds the credits of another provider's terrain", () => {
    const credits = collectAttributions(gsiBasemaps.pale, mapzenTerrains.terrarium);
    assert.ok(credits.length > gsiBasemaps.pale.attributions.length);
  });

  it("has nothing to credit for no basemap over flat ground", () => {
    assert.deepEqual(collectAttributions(noBasemap, null), []);
    assert.deepEqual(collectAttributions(defineEmptyBasemap({ id: "x", title: "X" }), null), []);
  });
});
