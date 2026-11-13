import type { MapExtent } from "@web-map/core";

/**
 * Options of {@link MapExtentFrame}.
 */
export interface MapExtentFrameProps {
  /** Area to frame, in Web Mercator meters. */
  readonly extent: MapExtent;
}
