/**
 * Overlays left off a basemap's style because the basemap brings sources or layers with the same ids.
 *
 * {@link WebMap} reports it as an `error` event of the MapLibre map when the user switches basemaps. The overlays it
 * names, and the layers drawn from its sources, are no longer on the map; give overlays ids no basemap uses, such as
 * ids with the application's prefix.
 */
export class OverlayConflictError extends Error {
  override readonly name: string = "OverlayConflictError";
  /** Ids of overlay sources the next basemap also has. */
  readonly sourceIds: readonly string[];
  /** Ids of overlay layers the next basemap also has. */
  readonly layerIds: readonly string[];

  /**
   * @param sourceIds - Ids of overlay sources the next basemap also has.
   * @param layerIds - Ids of overlay layers the next basemap also has.
   */
  constructor(sourceIds: readonly string[], layerIds: readonly string[]) {
    const ids: string = [...sourceIds.map((id: string) => `source "${id}"`), ...layerIds.map((id: string) => `layer "${id}"`)].join(", ");
    super(`Overlays not carried onto the basemap, which uses the same ids: ${ids}`);
    this.sourceIds = sourceIds;
    this.layerIds = layerIds;
  }
}
