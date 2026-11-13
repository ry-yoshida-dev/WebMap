import type { Attribution } from "./Attribution.js";
import type { BasemapUsage } from "./BasemapUsage.js";

/**
 * Fields every basemap and terrain has, whatever its delivery.
 */
export interface BasemapIdentity {
  /** Identifier unique within the basemaps, or the terrains, offered together. */
  readonly id: string;
  /** Name shown to the user. */
  readonly title: string;
  readonly attributions: readonly Attribution[];
  readonly usage: BasemapUsage;
}
