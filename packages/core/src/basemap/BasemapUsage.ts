import type { CommercialUse } from "./CommercialUse.js";

/**
 * Terms under which a basemap or terrain may be shown, summarized from its provider.
 *
 * A summary helps choosing a basemap or terrain; it does not replace the provider's terms.
 */
export interface BasemapUsage {
  /** License of the imagery or data, such as `CC BY 4.0`. */
  readonly license: string;
  /** `https` URL of the provider's terms, or null when there are none to link, as for a basemap a user added. */
  readonly termsUrl: string | null;
  readonly commercialUse: CommercialUse;
  /** Conditions beyond attribution, such as quotas, or null when there are none. */
  readonly conditions: string | null;
}
