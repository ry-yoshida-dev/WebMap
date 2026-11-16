import type { MapCamera } from "@web-map/core";

/**
 * What {@link useMapLibre} creates the map with, besides its appearance; read once at creation.
 */
export interface MapLibreOptions {
  readonly camera: MapCamera;
  readonly isHashSynced: boolean;
  /** Glyphs for styles that have none of their own, such as raster and empty basemaps, or null for none. */
  readonly glyphsUrl: string | null;
  /** Whether the attribution control is always compact or expanded, or null to make it compact on narrow maps. */
  readonly isAttributionCompact: boolean | null;
}
