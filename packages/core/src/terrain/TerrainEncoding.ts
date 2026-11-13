/**
 * How the pixels of an elevation tile hold the height.
 */
export enum TerrainEncoding {
  /** Mapzen Terrarium: `R * 256 + G + B / 256 - 32768` meters. */
  TERRARIUM = "terrarium",
  /** Mapbox Terrain-RGB: `(R * 65536 + G * 256 + B) * 0.1 - 10000` meters. */
  TERRAIN_RGB = "terrain-rgb",
  /**
   * GSI elevation tiles (標高タイル): `R * 65536 + G * 256 + B` hundredths of a meter as a 24-bit two's complement,
   * with `(128, 0, 0)` for no data.
   */
  GSI = "gsi",
}
