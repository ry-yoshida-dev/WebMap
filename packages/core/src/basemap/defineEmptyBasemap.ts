import { BasemapKind } from "./BasemapKind.js";
import { CommercialUse } from "./CommercialUse.js";
import type { EmptyBasemap } from "./EmptyBasemap.js";
import type { EmptyBasemapSpecification } from "./EmptyBasemapSpecification.js";
import { requireBasemapIdentity } from "./requireBasemapIdentity.js";

/**
 * Define the choice of showing no basemap.
 *
 * It has no attribution and no terms, so it never raises a usage notice.
 *
 * @param specification - Id and title.
 * @returns The basemap.
 * @throws BasemapDefinitionError When the id or title is blank.
 */
export function defineEmptyBasemap(specification: EmptyBasemapSpecification): EmptyBasemap {
  const basemap: EmptyBasemap = {
    ...specification,
    kind: BasemapKind.NONE,
    attributions: [],
    usage: { license: "None", termsUrl: null, commercialUse: CommercialUse.ALLOWED, conditions: null },
  };
  requireBasemapIdentity(basemap);
  return basemap;
}
