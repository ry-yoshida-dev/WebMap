import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { OverlayCarrier } from "./OverlayCarrier.js";
import type { MapStyle } from "./MapStyle.js";
import { OverlayConflictError } from "./OverlayConflictError.js";

function rasterStyle(id: string): MapStyle {
  return {
    version: 8,
    sources: { [id]: { type: "raster", tiles: [`https://${id}.example/{z}/{x}/{y}.png`] } },
    layers: [{ id, type: "raster", source: id }],
  };
}

function failOnConflict(error: OverlayConflictError): never {
  throw error;
}

const overlaySource = { type: "geojson", data: { type: "FeatureCollection", features: [] } } as const;
const overlayLayer = { id: "points", type: "circle", source: "points" } as const;

describe("OverlayCarrier", () => {
  it("moves overlays onto the next basemap, above its layers", () => {
    const carrier: OverlayCarrier = new OverlayCarrier(failOnConflict);
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
    const carrier: OverlayCarrier = new OverlayCarrier(failOnConflict);
    carrier.carry(undefined, rasterStyle("first"));
    const second: MapStyle = carrier.carry(rasterStyle("first"), rasterStyle("second"));
    const third: MapStyle = carrier.carry(second, rasterStyle("third"));
    assert.deepEqual(Object.keys(third.sources), ["third"]);
  });

  it("keeps the previous glyphs when the next basemap has none", () => {
    const carrier: OverlayCarrier = new OverlayCarrier(failOnConflict);
    const vector: MapStyle = { ...rasterStyle("vector"), glyphs: "https://fonts.example/{fontstack}/{range}.pbf" };
    carrier.carry(undefined, vector);
    assert.equal(carrier.carry(vector, rasterStyle("raster")).glyphs, vector.glyphs);
    const own: MapStyle = { ...rasterStyle("own"), glyphs: "https://other.example/{fontstack}/{range}.pbf" };
    assert.equal(carrier.carry(vector, own).glyphs, own.glyphs);
  });

  it("returns the next style unchanged before any style", () => {
    const next: MapStyle = rasterStyle("first");
    assert.equal(new OverlayCarrier(failOnConflict).carry(undefined, next), next);
  });

  it("leaves off overlays sharing ids with the next basemap, with the layers drawn from them, and reports them", () => {
    const conflicts: OverlayConflictError[] = [];
    const carrier: OverlayCarrier = new OverlayCarrier((error: OverlayConflictError) => conflicts.push(error));
    const first: MapStyle = rasterStyle("first");
    carrier.carry(undefined, first);
    const shown: MapStyle = {
      ...first,
      sources: { ...first.sources, shared: overlaySource, points: overlaySource },
      layers: [
        ...first.layers,
        { id: "shared-circles", type: "circle", source: "shared" },
        { id: "second", type: "circle", source: "points" },
        overlayLayer,
      ],
    };
    const next: MapStyle = {
      version: 8,
      sources: { shared: { type: "raster", tiles: ["https://shared.example/{z}/{x}/{y}.png"] } },
      layers: [{ id: "second", type: "raster", source: "shared" }],
    };

    const carried: MapStyle = carrier.carry(shown, next);

    assert.deepEqual(Object.keys(carried.sources), ["shared", "points"]);
    assert.equal(carried.sources["shared"], next.sources["shared"]);
    assert.deepEqual(
      carried.layers.map((layer) => [layer.id, layer.type]),
      [
        ["second", "raster"],
        ["points", "circle"],
      ],
    );
    assert.equal(conflicts.length, 1);
    assert.ok(conflicts[0] instanceof OverlayConflictError);
    assert.deepEqual(conflicts[0].sourceIds, ["shared"]);
    assert.deepEqual(conflicts[0].layerIds, ["second"]);
  });

  it("tells the sources of the basemap on screen from overlays", () => {
    const carrier: OverlayCarrier = new OverlayCarrier(failOnConflict);
    const first: MapStyle = rasterStyle("first");
    carrier.carry(undefined, first);
    const shown: MapStyle = { ...first, sources: { ...first.sources, points: overlaySource }, layers: [...first.layers, overlayLayer] };
    carrier.carry(shown, rasterStyle("second"));
    assert.equal(carrier.isBasemapSource("second"), true);
    assert.equal(carrier.isBasemapSource("first"), false);
    assert.equal(carrier.isBasemapSource("points"), false);
  });
});
