import type { ReactElement } from "react";

import { IconName } from "./IconName.js";
import type { IconProps } from "./IconProps.js";

function paths(name: IconName): ReactElement {
  switch (name) {
    case IconName.ZOOM_IN:
      return <path d="M12 5v14M5 12h14" />;
    case IconName.ZOOM_OUT:
      return <path d="M5 12h14" />;
    case IconName.NORTH:
      return (
        <>
          <path d="M12 3l4 9h-8z" fill="currentColor" />
          <path d="M8 12l4 9 4-9" />
        </>
      );
    case IconName.FOLDED_MAP:
      return (
        <>
          <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z" />
          <path d="M9 3v15M15 6v15" />
        </>
      );
    case IconName.LAYERS:
      return (
        <>
          <path d="M12 4l8 4-8 4-8-4z" />
          <path d="M4 12l8 4 8-4M4 16l8 4 8-4" />
        </>
      );
    case IconName.WARNING:
      return (
        <>
          <path d="M12 4l9 16H3z" />
          <path d="M12 10v4M12 17v.5" />
        </>
      );
    case IconName.CHEVRON_UP:
      return <path d="M6 15l6-6 6 6" />;
    case IconName.MOUNTAIN:
      return <path d="M3 19l6-11 4 6 3-4 5 9z" />;
    default: {
      const unreachable: never = name;
      throw new TypeError(`Unknown icon ${String(unreachable)}`);
    }
  }
}

/**
 * Monochrome glyph drawn in the current text color.
 *
 * @param props - Glyph, size and rotation.
 * @returns The SVG element.
 */
export function Icon({ name, size = 20, rotation = 0 }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={rotation === 0 ? undefined : { transform: `rotate(${rotation}deg)` }}
    >
      {paths(name)}
    </svg>
  );
}
