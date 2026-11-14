/**
 * What a map must do to go from one {@link MapAppearance} to another.
 */
export enum AppearanceChange {
  /** Nothing differs. */
  NONE = "none",
  /** The basemap or grayscale differs: diff the basemap's style in, which also sets the terrain. */
  RELOAD_STYLE = "reload-style",
  /** Only the terrain or its exaggeration differs: swap the terrain on the loaded style. */
  SWAP_TERRAIN = "swap-terrain",
}
