/**
 * Whether the tiles of the view have arrived.
 */
export enum TileStatus {
  IDLE = "idle",
  LOADING = "loading",
  /** At least one tile failed for a reason other than missing coverage, since the basemap was chosen. */
  FAILED = "failed",
}
