import { AJAXError } from "maplibre-gl";
import type { ErrorEvent } from "maplibre-gl";

/**
 * Whether an `error` event of a map concerns the basemap on screen, rather than the terrain or the application.
 *
 * A source's error concerns the basemap when the source came with it. An error without a source does while the
 * basemap's style document is being fetched, and when it is a failed request, as of the basemap's sprite or glyphs;
 * other errors, such as a layer the application added twice, do not.
 *
 * @param event - Error event of the map, with the id of the source that failed, if any.
 * @param isBasemapSource - Whether a source came with the basemap.
 * @param isStyleFetching - Whether the basemap's style document has been asked for and not yet arrived.
 * @returns True when the error concerns the basemap.
 */
export function isBasemapError(
  event: ErrorEvent & { readonly sourceId?: string },
  isBasemapSource: (sourceId: string) => boolean,
  isStyleFetching: boolean,
): boolean {
  if (event.sourceId !== undefined) {
    return isBasemapSource(event.sourceId);
  }
  return isStyleFetching || event.error instanceof AJAXError;
}
