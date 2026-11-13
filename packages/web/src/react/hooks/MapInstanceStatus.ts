/**
 * Stage of a {@link MapInstance}.
 */
export enum MapInstanceStatus {
  /** Created, waiting for the first style. */
  LOADING = "loading",
  /** First style loaded; overlays may be added. */
  READY = "ready",
  /** The map could not be created, for example without WebGL. */
  FAILED = "failed",
}
