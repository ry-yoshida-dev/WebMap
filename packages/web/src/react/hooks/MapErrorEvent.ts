import type { ErrorEvent } from "maplibre-gl";

/**
 * `error` event of a MapLibre map; errors of a source carry the source's id, and those of a tile the tile.
 */
export type MapErrorEvent = ErrorEvent & { readonly sourceId?: string; readonly tile?: unknown };
