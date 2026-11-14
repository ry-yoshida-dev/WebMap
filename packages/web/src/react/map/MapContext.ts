"use client";

import { createContext } from "react";
import type { Context } from "react";

import type { MapContextValue } from "./MapContextValue.js";

/**
 * Context through which {@link WebMap} serves its children; read it with {@link useMapContext}.
 */
export const MapContext: Context<MapContextValue | null> = createContext<MapContextValue | null>(null);
