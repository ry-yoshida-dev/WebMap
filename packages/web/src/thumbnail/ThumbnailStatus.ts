/**
 * Progress of a basemap's thumbnail.
 */
export enum ThumbnailStatus {
  /** Not drawn yet. */
  PENDING = "pending",
  /** Has an image URL. */
  READY = "ready",
  /** Could not be drawn; show a placeholder. */
  FAILED = "failed",
}
