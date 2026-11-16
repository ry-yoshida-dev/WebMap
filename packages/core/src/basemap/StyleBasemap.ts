import type { BasemapIdentity } from "./BasemapIdentity.js";
import type { BasemapKind } from "./BasemapKind.js";

/**
 * Basemap described by a MapLibre style document, which carries its own sources and attribution.
 */
export interface StyleBasemap extends BasemapIdentity {
  readonly kind: BasemapKind.STYLE;
  /** `https` URL of the style document; `http` only when the basemap was defined with `isHttpAllowed`. */
  readonly styleUrl: string;
}
