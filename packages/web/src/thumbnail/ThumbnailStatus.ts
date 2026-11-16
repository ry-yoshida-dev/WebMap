/**
 * Progress of a basemap's thumbnail.
 */
export enum ThumbnailStatus {
  /** Not drawn yet. */
  PENDING = "pending",
  /** Has an image URL. */
  READY = "ready",
  /** There is nothing to preview, as for no basemap; show an empty swatch. */
  EMPTY = "empty",
  /** Could not be drawn; show a placeholder. */
  FAILED = "failed",
}
