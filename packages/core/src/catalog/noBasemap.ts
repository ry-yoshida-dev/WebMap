import { defineEmptyBasemap } from "../basemap/defineEmptyBasemap.js";
import type { EmptyBasemap } from "../basemap/EmptyBasemap.js";

/**
 * The choice of showing no basemap. Not part of {@link openBasemaps}; add it to the `basemaps` of a map whose users
 * may want to see their data alone.
 */
export const noBasemap: EmptyBasemap = defineEmptyBasemap({ id: "none", title: "No basemap" });
