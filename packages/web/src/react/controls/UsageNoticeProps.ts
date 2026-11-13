import type { BasemapUsage } from "@web-map/core";

import type { MapLabels } from "../map/MapLabels.js";

/**
 * Options of {@link UsageNotice}.
 */
export interface UsageNoticeProps {
  readonly usage: BasemapUsage;
  readonly labels: MapLabels;
}
