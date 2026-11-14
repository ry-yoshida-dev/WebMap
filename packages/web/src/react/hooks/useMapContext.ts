"use client";

import { useContext } from "react";

import { MapContext } from "../map/MapContext.js";
import type { MapContextValue } from "../map/MapContextValue.js";
import { MissingMapContextError } from "../map/MissingMapContextError.js";

/**
 * Services of the enclosing {@link WebMap}.
 *
 * @returns The MapLibre map, the basemaps and the change of basemap, the labels and the toolbar slot.
 * @throws MissingMapContextError When called outside a {@link WebMap}'s children.
 */
export function useMapContext(): MapContextValue {
  const value: MapContextValue | null = useContext(MapContext);
  if (value === null) {
    throw new MissingMapContextError("useMapContext");
  }
  return value;
}
