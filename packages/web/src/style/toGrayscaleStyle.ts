import type { MapStyle } from "./MapStyle.js";

type MapLayer = MapStyle["layers"][number];

/**
 * Color properties left as they are: their expressions may only read the heatmap density or the elevation at the
 * top level, and the hillshade colors may be arrays of colors, so none can be wrapped in an expression.
 */
const UNCONVERTED_COLOR_PROPERTIES: ReadonlySet<string> = new Set([
  "heatmap-color",
  "color-relief-color",
  "hillshade-highlight-color",
  "hillshade-shadow-color",
]);

const INTERPOLATE_OPERATORS: ReadonlySet<string> = new Set(["interpolate", "interpolate-hcl", "interpolate-lab"]);

/** Weights of the Rec. 709 luma, as the CSS `grayscale()` filter uses. */
const RED_WEIGHT: number = 0.2126;
const GREEN_WEIGHT: number = 0.7152;
const BLUE_WEIGHT: number = 0.0722;

/**
 * Turn a basemap's style into shades of gray.
 *
 * Raster layers lose their saturation, and every color paint property, constant, zoom-dependent or data-driven, is
 * replaced by an expression computing the luma of the original color. Colors written as legacy `stops` functions,
 * the colors listed in {@link UNCONVERTED_COLOR_PROPERTIES} and sprite icons keep their colors.
 *
 * @param style - Style of a basemap, without the application's overlays.
 * @returns A new style with the same sources and layers in gray.
 */
export function toGrayscaleStyle(style: MapStyle): MapStyle {
  return { ...style, layers: style.layers.map(toGrayscaleLayer) };
}

function toGrayscaleLayer(layer: MapLayer): MapLayer {
  if (layer.type === "raster") {
    return { ...layer, paint: { ...layer.paint, "raster-saturation": -1 } };
  }
  if (layer.paint === undefined) {
    return layer;
  }
  const paint: Readonly<Record<string, unknown>> = Object.fromEntries(
    Object.entries(layer.paint).map(([name, value]: [string, unknown]) => [
      name,
      isConvertedColorProperty(name) ? toGrayscaleColor(value) : value,
    ]),
  );
  return { ...layer, paint };
}

function isConvertedColorProperty(name: string): boolean {
  return name.endsWith("-color") && !UNCONVERTED_COLOR_PROPERTIES.has(name);
}

function toGrayscaleColor(value: unknown): unknown {
  if (typeof value === "string") {
    return lumaExpression(value);
  }
  if (!Array.isArray(value)) {
    return value;
  }
  // "zoom" may only be the input of a top-level interpolate or step, so convert their outputs instead of wrapping them.
  const operator: unknown = value[0];
  if (typeof operator === "string" && INTERPOLATE_OPERATORS.has(operator)) {
    return value.map((item: unknown, index: number) => (index >= 4 && index % 2 === 0 ? toGrayscaleColor(item) : item));
  }
  if (operator === "step") {
    return value.map((item: unknown, index: number) => (index >= 2 && index % 2 === 0 ? toGrayscaleColor(item) : item));
  }
  return lumaExpression(value);
}

function lumaExpression(color: unknown): unknown {
  const channel = (index: number): unknown => ["at", index, ["var", "rgba"]];
  return [
    "let",
    "rgba",
    ["to-rgba", ["to-color", color]],
    [
      "let",
      "luma",
      ["+", ["*", RED_WEIGHT, channel(0)], ["*", GREEN_WEIGHT, channel(1)], ["*", BLUE_WEIGHT, channel(2)]],
      ["rgba", ["var", "luma"], ["var", "luma"], ["var", "luma"], channel(3)],
    ],
  ];
}
