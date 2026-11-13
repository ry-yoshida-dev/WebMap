import type { ErrorEvent } from "maplibre-gl";

/**
 * `error` event of a MapLibre map; errors of a source carry the source's id.
 */
export type MapErrorEvent = ErrorEvent & { readonly sourceId?: string };
