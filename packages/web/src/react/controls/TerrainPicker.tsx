import type { ChangeEvent, ReactElement } from "react";
import type { Terrain } from "@web-map/core";

import type { TerrainPickerProps } from "./TerrainPickerProps.js";

/**
 * Menu choosing the elevation data 3D terrain is raised from, disabled while 3D terrain is off.
 *
 * @param props - Terrains, the chosen one, whether 3D terrain is on, the change handler and labels.
 * @returns The menu.
 */
export function TerrainPicker({ terrains, terrain, isEnabled, onChange, labels }: TerrainPickerProps): ReactElement {
  const choose = (event: ChangeEvent<HTMLSelectElement>): void => {
    const chosen: Terrain | undefined = terrains.find((candidate: Terrain) => candidate.id === event.target.value);
    if (chosen !== undefined) {
      onChange(chosen);
    }
  };
  return (
    <select
      className="wmap-terrain-select"
      aria-label={labels.terrain}
      title={labels.terrain}
      value={terrain.id}
      disabled={!isEnabled}
      onChange={choose}
    >
      {terrains.map((candidate: Terrain) => (
        <option key={candidate.id} value={candidate.id}>
          {candidate.title}
        </option>
      ))}
    </select>
  );
}
