import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { gsiTerrains, mapzenTerrains } from "@web-map/core";

import { AppearanceChange } from "./AppearanceChange.js";
import { compareAppearance } from "./compareAppearance.js";
import type { MapAppearance } from "./MapAppearance.js";
import { sampleRasterBasemaps } from "../testing/sampleBasemaps.js";

const shown: MapAppearance = {
  basemap: sampleRasterBasemaps.first,
  isGrayscale: false,
  terrain: gsiTerrains.elevation,
  terrainExaggeration: 1,
};

describe("compareAppearance", () => {
  it("needs nothing for the same appearance", () => {
    assert.equal(compareAppearance(shown, { ...shown }), AppearanceChange.NONE);
  });

  it("needs nothing for new objects of the same basemap and terrain", () => {
    const next: MapAppearance = { ...shown, basemap: { ...shown.basemap }, terrain: { ...gsiTerrains.elevation } };
    assert.equal(compareAppearance(shown, next), AppearanceChange.NONE);
  });

  it("reloads the style for another basemap or grayscale", () => {
    assert.equal(compareAppearance(shown, { ...shown, basemap: sampleRasterBasemaps.second }), AppearanceChange.RELOAD_STYLE);
    assert.equal(compareAppearance(shown, { ...shown, isGrayscale: true }), AppearanceChange.RELOAD_STYLE);
  });

  it("swaps only the terrain for another terrain, exaggeration or flat ground", () => {
    assert.equal(compareAppearance(shown, { ...shown, terrain: mapzenTerrains.terrarium }), AppearanceChange.SWAP_TERRAIN);
    assert.equal(compareAppearance(shown, { ...shown, terrainExaggeration: 2 }), AppearanceChange.SWAP_TERRAIN);
    assert.equal(compareAppearance(shown, { ...shown, terrain: null }), AppearanceChange.SWAP_TERRAIN);
  });

  it("covers a terrain change made with a basemap change by reloading the style", () => {
    const next: MapAppearance = { ...shown, basemap: sampleRasterBasemaps.second, terrain: null };
    assert.equal(compareAppearance(shown, next), AppearanceChange.RELOAD_STYLE);
  });
});
