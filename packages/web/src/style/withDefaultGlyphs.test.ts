import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { MapStyle } from "./MapStyle.js";
import { requireGlyphsUrl } from "./requireGlyphsUrl.js";
import { withDefaultGlyphs } from "./withDefaultGlyphs.js";

const GLYPHS: string = "https://fonts.example/{fontstack}/{range}.pbf";
const empty: MapStyle = { version: 8, sources: {}, layers: [] };

describe("withDefaultGlyphs", () => {
  it("gives glyphs to a style without any", () => {
    assert.equal(withDefaultGlyphs(empty, GLYPHS).glyphs, GLYPHS);
  });

  it("keeps the glyphs a style has, and a style when there are none to give", () => {
    const own: MapStyle = { ...empty, glyphs: "https://own.example/{fontstack}/{range}.pbf" };
    assert.equal(withDefaultGlyphs(own, GLYPHS), own);
    assert.equal(withDefaultGlyphs(empty, null), empty);
  });
});

describe("requireGlyphsUrl", () => {
  it("needs the font stack and the range", () => {
    assert.doesNotThrow(() => requireGlyphsUrl(GLYPHS));
    assert.throws(() => requireGlyphsUrl("https://fonts.example/{fontstack}.pbf"), RangeError);
    assert.throws(() => requireGlyphsUrl("https://fonts.example/{range}.pbf"), RangeError);
  });
});
