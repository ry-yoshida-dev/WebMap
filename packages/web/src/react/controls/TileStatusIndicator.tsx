import type { ReactElement } from "react";

import { Icon } from "../icons/Icon.js";
import { IconName } from "../icons/IconName.js";
import { TileStatus } from "../hooks/TileStatus.js";
import type { TileStatusIndicatorProps } from "./TileStatusIndicatorProps.js";

/**
 * Spinner while tiles load and a warning after a tile failed, in a fixed-size box.
 *
 * @param props - Tile status and labels.
 * @returns The indicator.
 */
export function TileStatusIndicator({ status, labels }: TileStatusIndicatorProps): ReactElement {
  switch (status) {
    case TileStatus.IDLE:
      return <span className="wmap-status" />;
    case TileStatus.LOADING:
      return (
        <span className="wmap-status" role="status" aria-label={labels.loading} title={labels.loading}>
          <span className="wmap-spinner" />
        </span>
      );
    case TileStatus.FAILED:
      return (
        <span className="wmap-status" data-failed="true" role="status" aria-label={labels.tileError} title={labels.tileError}>
          <Icon name={IconName.WARNING} size={18} />
        </span>
      );
    default: {
      const unreachable: never = status;
      throw new TypeError(`Unknown tile status ${String(unreachable)}`);
    }
  }
}
