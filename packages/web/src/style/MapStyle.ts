import type { TransformStyleFunction } from "maplibre-gl";

/**
 * MapLibre style document, as MapLibre GL JS types it.
 */
export type MapStyle = ReturnType<TransformStyleFunction>;
