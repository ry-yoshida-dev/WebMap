import type { MapExtent } from "./MapExtent.js";

/**
 * Validate an extent.
 *
 * @param extent - Bounds in Web Mercator meters.
 * @returns A copy of the extent.
 * @throws RangeError When a bound is not finite or a minimum is not below its maximum.
 */
export function defineMapExtent(extent: MapExtent): MapExtent {
  const { minX, minY, maxX, maxY } = extent;
  if (![minX, minY, maxX, maxY].every(Number.isFinite)) {
    throw new RangeError(`Extent bounds must be finite, got (${minX}, ${minY}, ${maxX}, ${maxY})`);
  }
  if (minX >= maxX || minY >= maxY) {
    throw new RangeError(`Extent minimums must lie below its maximums, got (${minX}, ${minY}, ${maxX}, ${maxY})`);
  }
  return { minX, minY, maxX, maxY };
}
