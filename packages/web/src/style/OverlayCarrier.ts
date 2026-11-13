import type { BasemapOwnership } from "./BasemapOwnership.js";
import type { MapStyle } from "./MapStyle.js";

/**
 * Keeps the application's overlays when the basemap's style is replaced.
 *
 * Swapping a style replaces its sources and layers; the carrier remembers
 * which ones the basemap brought and moves all others onto the next style,
 * above its layers. A next style without glyphs, as a raster basemap's, keeps
 * the previous glyphs, so the overlays' text still renders.
 */
export class OverlayCarrier {
  private ownership: BasemapOwnership = { sourceIds: new Set(), layerIds: new Set() };

  /**
   * Merge the overlays of the previous style into the next basemap's style, as `transformStyle` does.
   *
   * @param previous - Style shown so far, or undefined before the first style.
   * @param next - Style of the next basemap.
   * @returns The next style with the overlays on top.
   */
  carry(previous: MapStyle | undefined, next: MapStyle): MapStyle {
    const { sourceIds, layerIds }: BasemapOwnership = this.ownership;
    this.ownership = OverlayCarrier.ownershipOf(next);
    if (previous === undefined) {
      return next;
    }
    const overlaySources: MapStyle["sources"] = Object.fromEntries(
      Object.entries(previous.sources).filter(([id]: [string, unknown]) => !sourceIds.has(id) && !(id in next.sources)),
    );
    const nextLayerIds: ReadonlySet<string> = new Set(next.layers.map((layer) => layer.id));
    const overlayLayers: MapStyle["layers"] = previous.layers.filter((layer) => !layerIds.has(layer.id) && !nextLayerIds.has(layer.id));
    const carried: MapStyle = { ...next, sources: { ...next.sources, ...overlaySources }, layers: [...next.layers, ...overlayLayers] };
    return next.glyphs === undefined && previous.glyphs !== undefined ? { ...carried, glyphs: previous.glyphs } : carried;
  }

  private static ownershipOf(style: MapStyle): BasemapOwnership {
    return { sourceIds: new Set(Object.keys(style.sources)), layerIds: new Set(style.layers.map((layer) => layer.id)) };
  }
}
