import type { ReactElement } from "react";

import { BasemapPicker } from "./BasemapPicker.js";
import { Icon } from "../icons/Icon.js";
import { IconButton } from "./IconButton.js";
import { IconName } from "../icons/IconName.js";
import { LiveMapControls } from "./LiveMapControls.js";
import type { MapToolbarProps } from "./MapToolbarProps.js";
import { TerrainPicker } from "./TerrainPicker.js";
import { TerrainToggle } from "./TerrainToggle.js";
import { TileStatusIndicator } from "./TileStatusIndicator.js";
import { UsageNotice } from "./UsageNotice.js";

const ignore = (): void => undefined;

/**
 * Bar below the map: basemap menu and terms, 3D terrain button and elevation data menu, extension controls, pointer readout, tile status and navigation.
 * Until the map has loaded, the navigation shows disabled.
 *
 * @param props - Map, basemaps, terrains and labels.
 * @returns The toolbar.
 */
export function MapToolbar(props: MapToolbarProps): ReactElement {
  const { map, basemaps, basemap, onBasemapChange, terrain, labels, slotRef }: MapToolbarProps = props;
  return (
    <div className="wmap-toolbar">
      <BasemapPicker basemaps={basemaps} basemap={basemap} onChange={onBasemapChange} labels={labels} />
      <UsageNotice usage={basemap.usage} labels={labels} />
      {terrain === null ? null : (
        <span className="wmap-terrain">
          <TerrainToggle map={map} isShown={props.isTerrainShown} onChange={props.onTerrainShownChange} labels={labels} />
          <TerrainPicker
            terrains={props.terrains}
            terrain={terrain}
            isEnabled={props.isTerrainShown}
            onChange={props.onTerrainChange}
            labels={labels}
          />
        </span>
      )}
      <div className="wmap-slot" ref={slotRef} />
      <span className="wmap-spacer" />
      {map === null ? (
        <>
          <span className="wmap-readout" />
          <TileStatusIndicator status={props.tileStatus} labels={labels} />
          <IconButton label={labels.zoomOut} isDisabled onClick={ignore}>
            <Icon name={IconName.ZOOM_OUT} />
          </IconButton>
          <IconButton label={labels.zoomIn} isDisabled onClick={ignore}>
            <Icon name={IconName.ZOOM_IN} />
          </IconButton>
          <IconButton label={labels.resetNorth} isDisabled onClick={ignore}>
            <Icon name={IconName.NORTH} />
          </IconButton>
        </>
      ) : (
        <LiveMapControls map={map} tileStatus={props.tileStatus} labels={labels} />
      )}
    </div>
  );
}
