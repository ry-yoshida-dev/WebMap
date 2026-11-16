/**
 * Require a glyphs URL MapLibre can fill: one with the `{fontstack}` and `{range}` placeholders.
 *
 * @param glyphsUrl - URL to check.
 * @throws RangeError When the URL lacks `{fontstack}` or `{range}`.
 */
export function requireGlyphsUrl(glyphsUrl: string): void {
  const missing: readonly string[] = ["{fontstack}", "{range}"].filter((placeholder: string) => !glyphsUrl.includes(placeholder));
  if (missing.length > 0) {
    throw new RangeError(`The glyphs URL lacks ${missing.join(", ")}: ${glyphsUrl}`);
  }
}
