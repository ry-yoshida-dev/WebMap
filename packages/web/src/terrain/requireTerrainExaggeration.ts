/**
 * Require a factor the terrain's heights can be multiplied by.
 *
 * @param exaggeration - Factor to check.
 * @throws RangeError When the exaggeration is negative or not finite.
 */
export function requireTerrainExaggeration(exaggeration: number): void {
  if (!Number.isFinite(exaggeration) || exaggeration < 0) {
    throw new RangeError(`Terrain exaggeration must be finite and not negative, got ${exaggeration}`);
  }
}
