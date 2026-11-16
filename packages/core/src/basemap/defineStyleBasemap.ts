import { BasemapKind } from "./BasemapKind.js";
import { requireBasemapIdentity } from "./requireBasemapIdentity.js";
import { requireHttpsUrl } from "./requireHttpsUrl.js";
import type { StyleBasemap } from "./StyleBasemap.js";
import type { StyleBasemapSpecification } from "./StyleBasemapSpecification.js";

/**
 * Validate a basemap given by a MapLibre style document.
 *
 * @param specification - Style URL, attribution and terms.
 * @returns The basemap.
 * @throws BasemapDefinitionError When a URL is not `https` (the style URL may be `http` when allowed) or the id or title is blank.
 */
export function defineStyleBasemap(specification: StyleBasemapSpecification): StyleBasemap {
  requireBasemapIdentity(specification);
  const { isHttpAllowed, ...basemap } = specification;
  requireHttpsUrl(specification.styleUrl, `style of ${specification.id}`, isHttpAllowed ?? false);
  return { ...basemap, kind: BasemapKind.STYLE };
}
