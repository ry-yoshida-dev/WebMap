/**
 * Whether the tiles of the view have arrived.
 */
export enum TileStatus {
  IDLE = "idle",
  LOADING = "loading",
  /**
   * The basemap's style or a tile failed for a reason other than missing coverage, and none of its tiles has loaded
   * since.
   */
  FAILED = "failed",
}
