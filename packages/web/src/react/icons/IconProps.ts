import type { IconName } from "./IconName.js";

/**
 * Options of {@link Icon}.
 */
export interface IconProps {
  readonly name: IconName;
  /** Edge in pixels; 20 when omitted. */
  readonly size?: number;
  /** Clockwise rotation in degrees. */
  readonly rotation?: number;
}
