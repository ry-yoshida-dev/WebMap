import type { ErrorEvent } from "maplibre-gl";

/**
 * What {@link followFirstLoad} uses of a MapLibre map.
 */
export interface FirstLoadTarget {
  on(type: "error", listener: (event: ErrorEvent) => void): unknown;
  off(type: "error", listener: (event: ErrorEvent) => void): unknown;
  once(type: "style.load" | "load", listener: () => void): unknown;
}

/**
 * Report when a new map has loaded its first style, or why it could not.
 *
 * Sources only load once the style has, so any error before the style loads is the style failing: its document could
 * not be fetched or is not a valid style. Errors after it, as of tiles, are not reported.
 *
 * @param map - Map just created.
 * @param onLoad - Called once the map has loaded.
 * @param onFailure - Called with the message of the error that kept the first style from loading.
 */
export function followFirstLoad(map: FirstLoadTarget, onLoad: () => void, onFailure: (message: string) => void): void {
  const onError = (event: ErrorEvent): void => onFailure(event.error.message);
  map.on("error", onError);
  map.once("style.load", () => map.off("error", onError));
  map.once("load", onLoad);
}
