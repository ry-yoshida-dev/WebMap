import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { OverlayCarrier } from "../src/style/OverlayCarrier.js";
import type { MapStyle } from "../src/style/MapStyle.js";

function rasterStyle(id: string): MapStyle {
  return {
    version: 8,
    sources: { [id]: { type: "raster", tiles: [`https://${id}.example/{z}/{x}/{y}.png`] } },
    layers: [{ id, type: "raster", source: id }],
  };
}

const overlaySource = { type: "geojson", data: { type: "FeatureCollection", features: [] } } as const;
const overlayLayer = { id: "points", type: "circle", source: "points" } as const;

describe("OverlayCarrier", () => {
  it("moves overlays onto the next basemap, above its layers", () => {
    const carrier: OverlayCarrier = new OverlayCarrier();
    const first: MapStyle = rasterStyle("first");
    carrier.carry(undefined, first);
    const shown: MapStyle = { ...first, sources: { ...first.sources, points: overlaySource }, layers: [...first.layers, overlayLayer] };

    const next: MapStyle = carrier.carry(shown, rasterStyle("second"));

    assert.deepEqual(Object.keys(next.sources), ["second", "points"]);
    assert.deepEqual(
      next.layers.map((layer) => layer.id),
      ["second", "points"],
    );
  });

  it("drops the previous basemap after several switches", () => {
    const carrier: OverlayCarrier = new OverlayCarrier();
    carrier.carry(undefined, rasterStyle("first"));
    const second: MapStyle = carrier.carry(rasterStyle("first"), rasterStyle("second"));
    const third: MapStyle = carrier.carry(second, rasterStyle("third"));
    assert.deepEqual(Object.keys(third.sources), ["third"]);
  });

  it("keeps the previous glyphs when the next basemap has none", () => {
    const carrier: OverlayCarrier = new OverlayCarrier();
    const vector: MapStyle = { ...rasterStyle("vector"), glyphs: "https://fonts.example/{fontstack}/{range}.pbf" };
    carrier.carry(undefined, vector);
    assert.equal(carrier.carry(vector, rasterStyle("raster")).glyphs, vector.glyphs);
    const own: MapStyle = { ...rasterStyle("own"), glyphs: "https://other.example/{fontstack}/{range}.pbf" };
    assert.equal(carrier.carry(vector, own).glyphs, own.glyphs);
  });

  it("returns the next style unchanged before any style", () => {
    const next: MapStyle = rasterStyle("first");
    assert.equal(new OverlayCarrier().carry(undefined, next), next);
  });
});
