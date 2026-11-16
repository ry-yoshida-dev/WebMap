import type { MapStyle } from "./MapStyle.js";

/**
 * Give a basemap's style the application's glyphs when it has none of its own, as raster and empty basemaps do, so
 * the application's text layers render over them from the first style on.
 *
 * @param style - Style of a basemap.
 * @param glyphsUrl - URL of the application's glyphs, or null for none.
 * @returns The style itself when it has glyphs or there are none to give, otherwise a copy with the glyphs.
 */
export function withDefaultGlyphs(style: MapStyle, glyphsUrl: string | null): MapStyle {
  return style.glyphs === undefined && glyphsUrl !== null ? { ...style, glyphs: glyphsUrl } : style;
}
