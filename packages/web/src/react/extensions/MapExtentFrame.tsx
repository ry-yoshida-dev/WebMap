"use client";

import { useCallback } from "react";
import { createPortal } from "react-dom";
import type { ReactPortal } from "react";
import type { Map as MapLibreMap, MapEventType } from "maplibre-gl";
import { fromWebMercator } from "@web-map/core";
import type { LngLat, MapExtent, WebMercatorPoint } from "@web-map/core";

import type { MapExtentFrameProps } from "./MapExtentFrameProps.js";
import { useMapContext } from "../hooks/useMapContext.js";
import { useMapState } from "../hooks/useMapState.js";

const FRAME_EVENTS: readonly (keyof MapEventType)[] = ["move", "resize"];

function framePath(map: MapLibreMap, extent: MapExtent): string {
  const { clientWidth: width, clientHeight: height } = map.getContainer();
  const corners: readonly WebMercatorPoint[] = [
    { x: extent.minX, y: extent.maxY },
    { x: extent.maxX, y: extent.maxY },
    { x: extent.maxX, y: extent.minY },
    { x: extent.minX, y: extent.minY },
  ];
  const points: readonly string[] = corners.map((corner: WebMercatorPoint) => {
    const position: LngLat = fromWebMercator(corner);
    const { x, y } = map.project([position.lng, position.lat]);
    return `${x.toFixed(2)} ${y.toFixed(2)}`;
  });
  return `M0 0H${width}V${height}H0Z M${points.join(" L")}Z`;
}

/**
 * Frame of an extent over the map, dimming everything outside it, so that what is inside reads as the area
 * handed on, such as to print. It follows the camera, and is drawn above the map, not in it, so it never
 * appears in the map's canvas.
 *
 * @param props - The extent.
 * @returns A portal into the map's container.
 */
export function MapExtentFrame({ extent }: MapExtentFrameProps): ReactPortal {
  const { map } = useMapContext();
  const read = useCallback((target: MapLibreMap): string => framePath(target, extent), [extent]);
  const path: string = useMapState(map, FRAME_EVENTS, read);
  return createPortal(
    <svg className="wmap-extent-frame" aria-hidden="true">
      <path d={path} fillRule="evenodd" />
    </svg>,
    map.getContainer(),
  );
}
