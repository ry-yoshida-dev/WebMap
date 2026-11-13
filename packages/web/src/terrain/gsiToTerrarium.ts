/** Value of `R * 65536 + G * 256 + B` GSI uses for no data, `(128, 0, 0)`. */
const NO_DATA: number = 2 ** 23;
const WRAP: number = 2 ** 24;
/** Meters per unit of a GSI elevation tile. */
const GSI_RESOLUTION: number = 0.01;
/** Offset of the Terrarium encoding, which stores `height + 32768`. */
const TERRARIUM_OFFSET: number = 32768;

/**
 * Re-encode the RGBA pixels of a GSI elevation tile as Terrarium, in place, so MapLibre can read the heights.
 *
 * GSI stores hundredths of a meter as a 24-bit two's complement over red, green and blue; no data, as at sea, becomes
 * 0 m so the ground does not jump. Alpha is left as it is.
 *
 * @param pixels - RGBA bytes of the tile, four per pixel.
 * @throws RangeError When the length is not a multiple of four.
 */
export function gsiToTerrarium(pixels: Uint8ClampedArray): void {
  if (pixels.length % 4 !== 0) {
    throw new RangeError(`RGBA pixels need a length divisible by 4, got ${pixels.length}`);
  }
  for (let index: number = 0; index < pixels.length; index += 4) {
    const value: number = (pixels[index] ?? 0) * 65536 + (pixels[index + 1] ?? 0) * 256 + (pixels[index + 2] ?? 0);
    const units: number = value === NO_DATA ? 0 : value > NO_DATA ? value - WRAP : value;
    const shifted: number = units * GSI_RESOLUTION + TERRARIUM_OFFSET;
    const whole: number = Math.floor(shifted);
    pixels[index] = Math.floor(whole / 256);
    pixels[index + 1] = whole % 256;
    pixels[index + 2] = Math.floor((shifted - whole) * 256);
  }
}
