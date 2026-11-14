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

/** Color property whose name does not end in `-color`: an interpolation of colors along a line. */
const LINE_GRADIENT: string = "line-gradient";

const INTERPOLATE_OPERATORS: ReadonlySet<string> = new Set(["interpolate", "interpolate-hcl", "interpolate-lab"]);

/** Weights of the Rec. 709 luma, as the CSS `grayscale()` filter uses. */
const RED_WEIGHT: number = 0.2126;
const GREEN_WEIGHT: number = 0.7152;
const BLUE_WEIGHT: number = 0.0722;

/**
 * Turn a basemap's style into shades of gray.
 *
 * Raster layers lose their saturation, and every color paint property, constant, zoom-dependent or data-driven, as
 * well as line gradients and the colors of the sky and the light, is replaced by an expression computing the luma of
 * the original color. Colors written as legacy `stops` functions, the colors listed in
 * {@link UNCONVERTED_COLOR_PROPERTIES} and sprite icons keep their colors.
 *
 * @param style - Style of a basemap, without the application's overlays.
 * @returns A new style with the same sources and layers in gray.
 */
export function toGrayscaleStyle(style: MapStyle): MapStyle {
  const gray: MapStyle = { ...style, layers: style.layers.map(toGrayscaleLayer) };
  if (style.sky !== undefined) {
    gray.sky = toGrayscaleProperties(style.sky);
  }
  if (style.light !== undefined) {
    gray.light = toGrayscaleProperties(style.light);
  }
  return gray;
}

/**
 * Gray the color properties of a paint, the sky or the light, keeping the others.
 *
 * @param properties - Properties by name.
 * @returns A copy with each color property converted.
 */
function toGrayscaleProperties<TProperties extends object>(properties: TProperties): TProperties {
  return Object.fromEntries(
    Object.entries(properties).map(([name, value]: [string, unknown]) => [
      name,
      isConvertedColorProperty(name) ? toGrayscaleColor(value) : value,
    ]),
  ) as TProperties;
}

function toGrayscaleLayer(layer: MapLayer): MapLayer {
  if (layer.type === "raster") {
    return { ...layer, paint: { ...layer.paint, "raster-saturation": -1 } };
  }
  if (layer.paint === undefined) {
    return layer;
  }
  const paint: Readonly<Record<string, unknown>> = toGrayscaleProperties(layer.paint);
  return { ...layer, paint };
}

function isConvertedColorProperty(name: string): boolean {
  // The light's own color is named `color` alone.
  return (name === "color" || name.endsWith("-color") || name === LINE_GRADIENT) && !UNCONVERTED_COLOR_PROPERTIES.has(name);
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
