import type { MapCamera } from "@web-map/core";

/**
 * What {@link useMapLibre} creates the map with, besides its appearance; read once at creation.
 */
export interface MapLibreOptions {
  readonly camera: MapCamera;
  readonly isHashSynced: boolean;
}
