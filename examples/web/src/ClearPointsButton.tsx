import type { ReactElement } from "react";
import { IconButton } from "@web-map/web";

import type { ClearPointsButtonProps } from "./ClearPointsButtonProps.js";

/**
 * Button removing the clicked points, disabled while there are none.
 *
 * @param props - Number of points and the clear action.
 * @returns The button.
 */
export function ClearPointsButton({ count, onClear }: ClearPointsButtonProps): ReactElement {
  return (
    <IconButton label={`Clear ${count} clicked points`} isDisabled={count === 0} onClick={onClear}>
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
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </IconButton>
  );
}
