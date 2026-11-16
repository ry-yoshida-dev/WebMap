import type { BasemapIdentity } from "./BasemapIdentity.js";
import type { BasemapKind } from "./BasemapKind.js";

/**
 * The absence of a basemap, offered as a choice so the user can see the application's data alone.
 */
export interface EmptyBasemap extends BasemapIdentity {
  readonly kind: BasemapKind.NONE;
}
