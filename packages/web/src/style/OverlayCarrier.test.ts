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

/** A style on screen with the application's point overlay added. */
function withPoints(style: MapStyle): MapStyle {
  return { ...style, sources: { ...style.sources, points: overlaySource }, layers: [...style.layers, overlayLayer] };
}

function layerIds(style: MapStyle): readonly string[] {
  return style.layers.map((layer) => layer.id);
}

describe("OverlayCarrier", () => {
  it("moves overlays onto the next basemap, above its layers", () => {
    const carrier: OverlayCarrier = new OverlayCarrier(failOnConflict);
    const shown: MapStyle = withPoints(carrier.carry(undefined, rasterStyle("first")));

    const next: MapStyle = carrier.carry(shown, rasterStyle("second"));

    assert.deepEqual(Object.keys(next.sources), ["second", "points"]);
    assert.deepEqual(layerIds(next), ["second", "points"]);
  });

  it("drops the previous basemap after several switches", () => {
    const carrier: OverlayCarrier = new OverlayCarrier(failOnConflict);
    const first: MapStyle = carrier.carry(undefined, rasterStyle("first"));
    const second: MapStyle = carrier.carry(first, rasterStyle("second"));
    const third: MapStyle = carrier.carry(second, rasterStyle("third"));
    assert.deepEqual(Object.keys(third.sources), ["third"]);
  });

  it("gives the same style when MapLibre transforms the same switch again", () => {
    const carrier: OverlayCarrier = new OverlayCarrier(failOnConflict);
    const shown: MapStyle = withPoints(carrier.carry(undefined, rasterStyle("first")));
    const next: MapStyle = rasterStyle("second");

    const diffed: MapStyle = carrier.carry(shown, next);
    // The diff failed, so MapLibre rebuilds the style from the same two styles.
    const rebuilt: MapStyle = carrier.carry(shown, next);

    assert.deepEqual(rebuilt, diffed);
    assert.deepEqual(layerIds(rebuilt), ["second", "points"]);
  });

  it("keeps the basemap on screen apart when a style carried before was never applied", () => {
    const carrier: OverlayCarrier = new OverlayCarrier(failOnConflict);
    const shown: MapStyle = withPoints(carrier.carry(undefined, rasterStyle("first")));
    // MapLibre rejects this style as invalid and keeps showing the first.
    carrier.carry(shown, rasterStyle("invalid"));

    const next: MapStyle = carrier.carry(shown, rasterStyle("third"));

    assert.deepEqual(Object.keys(next.sources), ["third", "points"]);
    assert.deepEqual(layerIds(next), ["third", "points"]);
  });

  it("keeps an overlay layer drawn from a basemap source attached to that source", () => {
    const carrier: OverlayCarrier = new OverlayCarrier(failOnConflict);
    const first: MapStyle = carrier.carry(undefined, rasterStyle("shared"));
    const shown: MapStyle = { ...first, layers: [...first.layers, { id: "highlight", type: "raster", source: "shared" }] };

    const next: MapStyle = carrier.carry(shown, rasterStyle("shared"));

    assert.deepEqual(Object.keys(next.sources), ["shared"]);
    assert.deepEqual(layerIds(next), ["shared", "highlight"]);
  });

  it("drops a basemap source none of its layers draw", () => {
    const carrier: OverlayCarrier = new OverlayCarrier(failOnConflict);
    const style: MapStyle = { ...rasterStyle("first"), sources: { ...rasterStyle("first").sources, unused: overlaySource } };
    const shown: MapStyle = withPoints(carrier.carry(undefined, style));

    const next: MapStyle = carrier.carry(shown, rasterStyle("second"));

    assert.deepEqual(Object.keys(next.sources), ["second", "points"]);
  });

  it("marks the basemap's layers and keeps their own metadata", () => {
    const carrier: OverlayCarrier = new OverlayCarrier(failOnConflict);
    const style: MapStyle = {
      ...rasterStyle("first"),
      layers: [{ id: "first", type: "raster", source: "first", metadata: { group: "base" } }],
    };

    const [layer] = carrier.carry(undefined, style).layers;

    assert.deepEqual(layer?.metadata, { group: "base", "web-map:basemap": true });
  });

  it("keeps the previous glyphs when the next basemap has none", () => {
    const carrier: OverlayCarrier = new OverlayCarrier(failOnConflict);
    const vector: MapStyle = carrier.carry(undefined, {
      ...rasterStyle("vector"),
      glyphs: "https://fonts.example/{fontstack}/{range}.pbf",
    });
    assert.equal(carrier.carry(vector, rasterStyle("raster")).glyphs, vector.glyphs);
    const own: MapStyle = { ...rasterStyle("own"), glyphs: "https://other.example/{fontstack}/{range}.pbf" };
    assert.equal(carrier.carry(vector, own).glyphs, own.glyphs);
  });

  it("leaves off overlays sharing ids with the next basemap, with the layers drawn from them, and reports them", () => {
    const conflicts: OverlayConflictError[] = [];
    const carrier: OverlayCarrier = new OverlayCarrier((error: OverlayConflictError) => conflicts.push(error));
    const first: MapStyle = carrier.carry(undefined, rasterStyle("first"));
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

  it("tells the sources of the basemap last carried from overlays", () => {
    const carrier: OverlayCarrier = new OverlayCarrier(failOnConflict);
    const shown: MapStyle = withPoints(carrier.carry(undefined, rasterStyle("first")));
    carrier.carry(shown, rasterStyle("second"));
    assert.equal(carrier.isBasemapSource("second"), true);
    assert.equal(carrier.isBasemapSource("first"), false);
    assert.equal(carrier.isBasemapSource("points"), false);
  });
});
