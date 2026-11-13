import type { ReactElement } from "react";

import { Icon } from "../icons/Icon.js";
import { IconButton } from "./IconButton.js";
import { IconName } from "../icons/IconName.js";
import type { TerrainToggleProps } from "./TerrainToggleProps.js";

/** Tilt given to a map viewed from straight above when 3D terrain is turned on, so the relief shows. */
const TERRAIN_PITCH: number = 50;

/**
 * Toggle button turning 3D terrain on and off. Turning it on tilts a map viewed from straight above, as the relief
 * shows only on a tilted map; turning it off leaves the camera as it is.
 *
 * @param props - Map, whether 3D terrain is on, the change handler and labels.
 * @returns The button.
 */
export function TerrainToggle({ map, isShown, onChange, labels }: TerrainToggleProps): ReactElement {
  const toggle = (): void => {
    if (!isShown && map !== null && map.getPitch() === 0) {
      map.easeTo({ pitch: TERRAIN_PITCH });
    }
    onChange(!isShown);
  };
  return (
    <IconButton label={labels.terrainShown} isPressed={isShown} isDisabled={map === null} onClick={toggle}>
      <Icon name={IconName.MOUNTAIN} />
    </IconButton>
  );
}
