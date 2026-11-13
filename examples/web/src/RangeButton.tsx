import type { ReactElement } from "react";
import { IconButton } from "@web-map/web";

import type { RangeButtonProps } from "./RangeButtonProps.js";

/**
 * Button fixing the area on screen as the range to hand on, or releasing a fixed range.
 * Disabled while the map is rotated or tilted, as the area on screen is then not a rectangle.
 *
 * @param props - Whether a range is fixed, whether one can be, and the toggle.
 * @returns The button.
 */
export function RangeButton({ isFixed, canFix, onToggle }: RangeButtonProps): ReactElement {
  return (
    <IconButton
      label={
        isFixed ? "Release the range" : canFix ? "Fix the area on screen as the range" : "Face north and untilt the map to fix the range"
      }
      isDisabled={!isFixed && !canFix}
      onClick={onToggle}
    >
      <svg
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d={isFixed ? "M7 3v14h14M3 7h14v14M4 4l16 16" : "M7 3v14h14M3 7h14v14"} />
      </svg>
    </IconButton>
  );
}
