import { CommercialUse } from "@web-map/core";
import type { BasemapUsage } from "@web-map/core";

import type { MapLabels } from "../map/MapLabels.js";

/**
 * Short label flagging a basemap whose commercial use is restricted.
 *
 * @param usage - Terms of the basemap.
 * @param labels - Text of the controls.
 * @returns The label, or null when commercial use is allowed.
 */
export function describeRestriction(usage: BasemapUsage, labels: MapLabels): string | null {
  switch (usage.commercialUse) {
    case CommercialUse.ALLOWED:
      return null;
    case CommercialUse.CONDITIONAL:
      return labels.conditional;
    case CommercialUse.NON_COMMERCIAL_ONLY:
      return labels.nonCommercialOnly;
    default: {
      const unreachable: never = usage.commercialUse;
      throw new TypeError(`Unknown commercial use ${String(unreachable)}`);
    }
  }
}
