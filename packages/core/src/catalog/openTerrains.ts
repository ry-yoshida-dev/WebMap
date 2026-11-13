import type { Terrain } from "../terrain/Terrain.js";
import { gsiTerrains } from "./gsiTerrains.js";
import { mapzenTerrains } from "./mapzenTerrains.js";

/**
 * Every terrain of this package, all free for commercial use with attribution and without a key; GSI first.
 */
export const openTerrains: readonly Terrain[] = [...Object.values(gsiTerrains), ...Object.values(mapzenTerrains)];
