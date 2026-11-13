import { BasemapDefinitionError } from "./BasemapDefinitionError.js";
import type { BasemapIdentity } from "./BasemapIdentity.js";
import { requireHttpsUrl } from "./requireHttpsUrl.js";

/**
 * Validate the id, title, attribution and terms every basemap and terrain has.
 *
 * @param identity - Fields to check.
 * @throws BasemapDefinitionError When the id, title or an attribution is blank, or a URL is not `https`.
 */
export function requireBasemapIdentity(identity: BasemapIdentity): void {
  if (identity.id.trim() === "") {
    throw new BasemapDefinitionError("A basemap or terrain id must not be blank");
  }
  if (identity.title.trim() === "") {
    throw new BasemapDefinitionError(`${identity.id} has a blank title`);
  }
  requireHttpsUrl(identity.usage.termsUrl, `terms of ${identity.id}`);
  for (const attribution of identity.attributions) {
    if (attribution.text.trim() === "") {
      throw new BasemapDefinitionError(`${identity.id} has a blank attribution`);
    }
    requireHttpsUrl(attribution.url, `attribution of ${identity.id}`);
  }
}
