"use client";

import type { ReactElement } from "react";
import type { Map as MapLibreMap, MapEventType } from "maplibre-gl";

import { Icon } from "../icons/Icon.js";
import { IconButton } from "./IconButton.js";
import { IconName } from "../icons/IconName.js";
import type { NavigationButtonsProps } from "./NavigationButtonsProps.js";
import { useMapState } from "../hooks/useMapState.js";

const CAMERA_EVENTS: readonly (keyof MapEventType)[] = ["move"];
const readBearing = (map: MapLibreMap): number => map.getBearing();
const readZoom = (map: MapLibreMap): number => map.getZoom();
const readIsUpright = (map: MapLibreMap): boolean => map.getBearing() === 0 && map.getPitch() === 0;

/**
 * Zoom out, zoom in and reset north; the compass needle follows the bearing.
 *
 * @param props - Map and labels.
 * @returns The buttons.
 */
export function NavigationButtons({ map, labels }: NavigationButtonsProps): ReactElement {
  const bearing: number = useMapState(map, CAMERA_EVENTS, readBearing);
  const zoom: number = useMapState(map, CAMERA_EVENTS, readZoom);
  const isUpright: boolean = useMapState(map, CAMERA_EVENTS, readIsUpright);
  return (
    <>
      <IconButton label={labels.zoomOut} isDisabled={zoom <= map.getMinZoom()} onClick={() => map.zoomOut()}>
        <Icon name={IconName.ZOOM_OUT} />
      </IconButton>
      <IconButton label={labels.zoomIn} isDisabled={zoom >= map.getMaxZoom()} onClick={() => map.zoomIn()}>
        <Icon name={IconName.ZOOM_IN} />
      </IconButton>
      <IconButton label={labels.resetNorth} isDisabled={isUpright} onClick={() => map.resetNorthPitch()}>
        <Icon name={IconName.NORTH} rotation={-bearing} />
      </IconButton>
    </>
  );
}
