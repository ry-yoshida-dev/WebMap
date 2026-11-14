"use client";

import { createPortal } from "react-dom";
import type { ReactPortal } from "react";

import type { MapContextValue } from "../map/MapContextValue.js";
import type { MapControlSlotProps } from "./MapControlSlotProps.js";
import { useMapContext } from "../hooks/useMapContext.js";

/**
 * Places an extension's controls in the map's toolbar, after the basemap menu.
 *
 * @param props - The controls.
 * @returns A portal into the toolbar, or null before it mounts.
 */
export function MapControlSlot({ children }: MapControlSlotProps): ReactPortal | null {
  const { controlSlot }: MapContextValue = useMapContext();
  return controlSlot === null ? null : createPortal(children, controlSlot);
}
