import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { Color, createExpression, validateStyleMin } from "@maplibre/maplibre-gl-style-spec";
import type { StylePropertySpecification } from "@maplibre/maplibre-gl-style-spec";

import { toGrayscaleStyle } from "./toGrayscaleStyle.js";
import type { MapStyle } from "./MapStyle.js";

const style: MapStyle = {
  version: 8,
  sources: {
    tiles: { type: "raster", tiles: ["https://tiles.example/{z}/{x}/{y}.png"] },
    shapes: { type: "geojson", data: { type: "FeatureCollection", features: [] } },
  },
  layers: [
    { id: "background", type: "background", paint: { "background-color": "#f8f4f0" } },
    { id: "satellite", type: "raster", source: "tiles" },
    {
      id: "water",
      type: "fill",
      source: "shapes",
      paint: {
        "fill-color": ["interpolate", ["linear"], ["zoom"], 5, "hsl(205, 56%, 73%)", 12, "rgba(10, 120, 200, 0.5)"],
        "fill-opacity": 0.8,
      },
    },
    {
      id: "roads",
      type: "line",
      source: "shapes",
      paint: { "line-color": ["step", ["zoom"], "red", 10, ["match", ["get", "class"], "motorway", "#e892a2", "#fc8"]] },
    },
    {
      id: "labels",
      type: "symbol",
      source: "shapes",
      layout: { "text-field": ["get", "name"] },
      paint: { "text-color": "#333", "text-halo-width": 1 },
    },
  ],
};

/** Data-driven, zoom-interpolated color, the most permissive kind; `validateStyleMin` checks each property's own rules. */
const colorSpecification: StylePropertySpecification = {
  type: "color",
  "property-type": "data-driven",
  expression: { interpolated: true, parameters: ["zoom", "feature"] },
  transition: false,
  overridable: false,
};

function evaluateColor(value: unknown, zoom: number, properties: Record<string, unknown> = {}): Color {
  const parsed = createExpression(value, "color", colorSpecification);
  assert.equal(parsed.result, "success", JSON.stringify(parsed.value));
  const color: unknown = parsed.value.evaluate({ zoom }, { type: "Point", properties, geometry: [] });
  assert.ok(color instanceof Color);
  return color;
}

function assertGray(color: Color, alpha: number = 1): void {
  assert.ok(Math.abs(color.r - color.g) < 1e-9 && Math.abs(color.g - color.b) < 1e-9, `${color.toString()} is not gray`);
  assert.ok(Math.abs(color.a - alpha) < 1e-9, `${color.toString()} lost its alpha`);
}

describe("toGrayscaleStyle", () => {
  const gray: MapStyle = toGrayscaleStyle(style);
  const paintOf = (id: string): Record<string, unknown> => {
    const layer = gray.layers.find((candidate) => candidate.id === id);
    assert.ok(layer?.paint !== undefined);
    return { ...layer.paint };
  };

  it("keeps a valid style with the same sources and layers", () => {
    assert.deepEqual(validateStyleMin(gray), []);
    assert.deepEqual(gray.sources, style.sources);
    assert.deepEqual(
      gray.layers.map((layer) => layer.id),
      style.layers.map((layer) => layer.id),
    );
  });

  it("desaturates raster layers", () => {
    assert.deepEqual(paintOf("satellite"), { "raster-saturation": -1 });
  });

  it("turns constant colors into their luma", () => {
    const background: Color = evaluateColor(paintOf("background")["background-color"], 0);
    assertGray(background);
    const expectedLuma: number = (0.2126 * 0xf8 + 0.7152 * 0xf4 + 0.0722 * 0xf0) / 255;
    assert.ok(Math.abs(background.r - expectedLuma) < 1e-9);
    assertGray(evaluateColor(paintOf("labels")["text-color"], 0));
  });

  it("converts the outputs of zoom-dependent and data-driven colors, keeping alpha", () => {
    const water: unknown = paintOf("water")["fill-color"];
    assertGray(evaluateColor(water, 5));
    assertGray(evaluateColor(water, 12), 0.5);
    const roads: unknown = paintOf("roads")["line-color"];
    assertGray(evaluateColor(roads, 4));
    assertGray(evaluateColor(roads, 14, { class: "motorway" }));
    assert.equal(paintOf("water")["fill-opacity"], 0.8);
  });

  it("leaves other paint properties and the input style untouched", () => {
    assert.equal(paintOf("labels")["text-halo-width"], 1);
    const original: MapStyle = structuredClone(style);
    toGrayscaleStyle(style);
    assert.deepEqual(style, original);
  });
});
