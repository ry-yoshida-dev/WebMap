import type { MapStyle } from "./MapStyle.js";
import { OverlayConflictError } from "./OverlayConflictError.js";

type StyleLayer = MapStyle["layers"][number];

/** Key in a layer's `metadata` marking it as the basemap's, so later styles tell it from the application's. */
const BASEMAP_LAYER_KEY: string = "web-map:basemap";

function sourceOf(layer: StyleLayer): string | undefined {
  return "source" in layer && typeof layer.source === "string" ? layer.source : undefined;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isBasemapLayer(layer: StyleLayer): boolean {
  return isRecord(layer.metadata) && layer.metadata[BASEMAP_LAYER_KEY] === true;
}

function markAsBasemap(layer: StyleLayer): StyleLayer {
  // Metadata that is not an object, which no style in use has, is replaced.
  return { ...layer, metadata: { ...(isRecord(layer.metadata) ? layer.metadata : {}), [BASEMAP_LAYER_KEY]: true } };
}

/**
 * Keeps the application's overlays when the basemap's style is replaced.
 *
 * Swapping a style replaces its sources and layers; the carrier marks the
 * layers the basemap brought in their metadata and moves all others, with
 * their sources, onto the next style, above its layers. Reading the marks
 * from the style on screen, rather than remembering the last style carried,
 * keeps the overlays apart when MapLibre transforms a style again after its
 * diff fails, or never applies a style that is invalid. A next style without
 * glyphs, as a raster basemap's, keeps the previous glyphs, so the overlays'
 * text still renders.
 */
export class OverlayCarrier {
  private readonly onConflict: (error: OverlayConflictError) => void;
  /** Sources of every basemap style carried, to recognize a basemap's sources that none of its layers draw. */
  private readonly knownBasemapSourceIds: Set<string> = new Set();
  private latestBasemapSourceIds: ReadonlySet<string> = new Set();

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
   * @param previous - Style shown so far, as MapLibre serializes it, or undefined before the first style.
   * @param next - Style of the next basemap.
   * @returns The next style, its layers marked as the basemap's, with the overlays on top.
   */
  carry(previous: MapStyle | undefined, next: MapStyle): MapStyle {
    const nextSourceIds: ReadonlySet<string> = new Set(Object.keys(next.sources));
    for (const id of nextSourceIds) {
      this.knownBasemapSourceIds.add(id);
    }
    this.latestBasemapSourceIds = nextSourceIds;
    const basemap: MapStyle = { ...next, layers: next.layers.map(markAsBasemap) };
    if (previous === undefined) {
      return basemap;
    }

    const overlayCandidates: readonly StyleLayer[] = previous.layers.filter((layer: StyleLayer) => !isBasemapLayer(layer));
    const drawnSourceIds: ReadonlySet<string> = new Set(previous.layers.map(sourceOf).filter((id) => id !== undefined));
    const basemapSourceIds: ReadonlySet<string> = new Set(
      previous.layers
        .filter(isBasemapLayer)
        .map(sourceOf)
        .filter((id) => id !== undefined),
    );
    const isOverlaySource = (id: string): boolean =>
      !basemapSourceIds.has(id) && (drawnSourceIds.has(id) || !this.knownBasemapSourceIds.has(id));
    const overlaySourceEntries = Object.entries(previous.sources).filter(([id]: [string, unknown]) => isOverlaySource(id));
    const conflictingSourceIds: readonly string[] = overlaySourceEntries.map(([id]) => id).filter((id: string) => nextSourceIds.has(id));
    const overlaySources: MapStyle["sources"] = Object.fromEntries(overlaySourceEntries.filter(([id]) => !nextSourceIds.has(id)));

    const nextLayerIds: ReadonlySet<string> = new Set(next.layers.map((layer: StyleLayer) => layer.id));
    const conflictingSources: ReadonlySet<string> = new Set(conflictingSourceIds);
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

    const carried: MapStyle = {
      ...basemap,
      sources: { ...next.sources, ...overlaySources },
      layers: [...basemap.layers, ...overlayLayers],
    };
    return next.glyphs === undefined && previous.glyphs !== undefined ? { ...carried, glyphs: previous.glyphs } : carried;
  }

  /**
   * Whether a source came with the basemap last carried, rather than from the application or the terrain.
   *
   * @param sourceId - Id of a source of the map's style.
   * @returns True for the basemap's sources.
   */
  isBasemapSource(sourceId: string): boolean {
    return this.latestBasemapSourceIds.has(sourceId);
  }
}
