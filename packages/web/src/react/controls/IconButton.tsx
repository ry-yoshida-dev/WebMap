"use client";

import type { ReactElement } from "react";

import type { IconButtonProps } from "./IconButtonProps.js";

/**
 * Square, borderless toolbar button holding a single glyph, with its label as the tooltip; a toggle when `isPressed`
 * is given.
 *
 * @param props - Label, glyph, action and state.
 * @returns The button element.
 */
export function IconButton({ label, onClick, isDisabled = false, isPressed, children }: IconButtonProps): ReactElement {
  return (
    <button
      type="button"
      className="wmap-button"
      aria-label={label}
      aria-pressed={isPressed}
      title={label}
      disabled={isDisabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
