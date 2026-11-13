import type { BasemapOwnership } from "./BasemapOwnership.js";
import type { MapStyle } from "./MapStyle.js";
import { OverlayConflictError } from "./OverlayConflictError.js";

type StyleLayer = MapStyle["layers"][number];

function sourceOf(layer: StyleLayer): string | undefined {
  return "source" in layer && typeof layer.source === "string" ? layer.source : undefined;
}

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
  private readonly onConflict: (error: OverlayConflictError) => void;

  /**
   * @param onConflict - Called when overlays share ids with the next basemap and are left off its style.
   */
  constructor(onConflict: (error: OverlayConflictError) => void) {
    this.onConflict = onConflict;
  }

  /**
   * Merge the overlays of the previous style into the next basemap's style, as `transformStyle` does.
   *
   * An overlay source or layer with the id of one of the next basemap's is left off, together with the overlay
   * layers drawn from such a source, so they never draw the basemap's data, and `onConflict` is called.
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
    const overlaySourceEntries = Object.entries(previous.sources).filter(([id]: [string, unknown]) => !sourceIds.has(id));
    const conflictingSourceIds: readonly string[] = overlaySourceEntries.map(([id]) => id).filter((id: string) => id in next.sources);
    const overlaySources: MapStyle["sources"] = Object.fromEntries(overlaySourceEntries.filter(([id]) => !(id in next.sources)));

    const nextLayerIds: ReadonlySet<string> = this.ownership.layerIds;
    const conflictingSources: ReadonlySet<string> = new Set(conflictingSourceIds);
    const overlayCandidates: readonly StyleLayer[] = previous.layers.filter((layer: StyleLayer) => !layerIds.has(layer.id));
    const conflictingLayerIds: readonly string[] = overlayCandidates
      .map((layer: StyleLayer) => layer.id)
      .filter((id: string) => nextLayerIds.has(id));
    const overlayLayers: StyleLayer[] = overlayCandidates.filter((layer: StyleLayer) => {
      const source: string | undefined = sourceOf(layer);
      return !nextLayerIds.has(layer.id) && (source === undefined || !conflictingSources.has(source));
    });
    if (conflictingSourceIds.length > 0 || conflictingLayerIds.length > 0) {
      this.onConflict(new OverlayConflictError(conflictingSourceIds, conflictingLayerIds));
    }

    const carried: MapStyle = { ...next, sources: { ...next.sources, ...overlaySources }, layers: [...next.layers, ...overlayLayers] };
    return next.glyphs === undefined && previous.glyphs !== undefined ? { ...carried, glyphs: previous.glyphs } : carried;
  }

  /**
   * Whether a source came with the basemap on screen, rather than from the application or the terrain.
   *
   * @param sourceId - Id of a source of the map's style.
   * @returns True for the basemap's sources.
   */
  isBasemapSource(sourceId: string): boolean {
    return this.ownership.sourceIds.has(sourceId);
  }

  private static ownershipOf(style: MapStyle): BasemapOwnership {
    return { sourceIds: new Set(Object.keys(style.sources)), layerIds: new Set(style.layers.map((layer: StyleLayer) => layer.id)) };
  }
}
