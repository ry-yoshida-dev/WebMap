import type { ReactNode } from "react";

/**
 * Options of {@link IconButton}.
 */
export interface IconButtonProps {
  /** Accessible name, also shown as the tooltip. */
  readonly label: string;
  readonly onClick: () => void;
  readonly isDisabled?: boolean;
  /** Whether a toggle button is on; omit for a plain button. */
  readonly isPressed?: boolean;
  /** The glyph. */
  readonly children: ReactNode;
}
