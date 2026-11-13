import type { ReactElement } from "react";

import type { LiveMapControlsProps } from "./LiveMapControlsProps.js";
import { NavigationButtons } from "./NavigationButtons.js";
import { PositionReadout } from "./PositionReadout.js";
import { TileStatusIndicator } from "./TileStatusIndicator.js";

/**
 * Toolbar controls that follow a loaded map: pointer readout, tile status and navigation.
 *
 * @param props - Map, tile status and labels.
 * @returns The controls.
 */
export function LiveMapControls({ map, tileStatus, labels }: LiveMapControlsProps): ReactElement {
  return (
    <>
      <PositionReadout map={map} labels={labels} />
      <TileStatusIndicator status={tileStatus} labels={labels} />
      <NavigationButtons map={map} labels={labels} />
    </>
  );
}
