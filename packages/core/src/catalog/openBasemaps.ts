import type { Basemap } from "../basemap/Basemap.js";
import { gsiBasemaps } from "./gsiBasemaps.js";
import { nasaGibsBasemaps } from "./nasaGibsBasemaps.js";
import { openFreeMapBasemaps } from "./openFreeMapBasemaps.js";
import { openTopoMapBasemaps } from "./openTopoMapBasemaps.js";

/**
 * Every basemap of this package, all free for commercial use with attribution and without a key.
 */
export const openBasemaps: readonly Basemap[] = [
  ...Object.values(gsiBasemaps),
  ...Object.values(openFreeMapBasemaps),
  ...Object.values(openTopoMapBasemaps),
  ...Object.values(nasaGibsBasemaps),
];
