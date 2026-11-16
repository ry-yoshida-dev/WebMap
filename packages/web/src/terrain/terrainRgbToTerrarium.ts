/** Meters per unit of a Terrain-RGB value, and the height of value 0. */
const TERRAIN_RGB_RESOLUTION: number = 0.1;
const TERRAIN_RGB_BASE: number = -10000;
/** Offset of the Terrarium encoding, which stores `height + 32768`. */
const TERRARIUM_OFFSET: number = 32768;

/**
 * Re-encode the RGBA pixels of a Mapbox Terrain-RGB tile as Terrarium, in place, so every elevation tile is read the
 * same way.
 *
 * @param pixels - RGBA bytes of the tile, four per pixel.
 * @throws RangeError When the length is not a multiple of four.
 */
export function terrainRgbToTerrarium(pixels: Uint8ClampedArray): void {
  if (pixels.length % 4 !== 0) {
    throw new RangeError(`RGBA pixels need a length divisible by 4, got ${pixels.length}`);
  }
  for (let index: number = 0; index < pixels.length; index += 4) {
    const value: number = (pixels[index] ?? 0) * 65536 + (pixels[index + 1] ?? 0) * 256 + (pixels[index + 2] ?? 0);
    const shifted: number = value * TERRAIN_RGB_RESOLUTION + TERRAIN_RGB_BASE + TERRARIUM_OFFSET;
    const whole: number = Math.floor(shifted);
    pixels[index] = Math.floor(whole / 256);
    pixels[index + 1] = whole % 256;
    pixels[index + 2] = Math.floor((shifted - whole) * 256);
  }
}
