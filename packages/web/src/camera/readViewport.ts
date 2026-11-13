import type { Map as MapLibreMap } from "maplibre-gl";
import { describeFlatViewport, MERCATOR_LATITUDE_LIMIT, toWebMercator } from "@web-map/core";
import type { MapCamera, MapViewport, WebMercatorPoint } from "@web-map/core";

import { readCamera } from "./readCamera.js";

/**
 * Read exactly what a MapLibre map shows, from its camera and the size of its container.
 *
 * @param map - Map to read.
 * @returns The viewport; its extent is null while the map is rotated or tilted.
 */
export function readViewport(map: MapLibreMap): MapViewport {
  const camera: MapCamera = readCamera(map);
  const container: HTMLElement = map.getContainer();
  const width: number = Math.max(container.clientWidth, 1);
  const height: number = Math.max(container.clientHeight, 1);
  if (camera.pitch === 0) {
    return describeFlatViewport(camera, width, height);
  }
  const unproject = (x: number, y: number): WebMercatorPoint => {
    const { lng, lat } = map.unproject([x, y]);
    return toWebMercator({ lng, lat: Math.max(-MERCATOR_LATITUDE_LIMIT, Math.min(MERCATOR_LATITUDE_LIMIT, lat)) });
  };
  return {
    camera,
    width,
    height,
    corners: {
      topLeft: unproject(0, 0),
      topRight: unproject(width, 0),
      bottomRight: unproject(width, height),
      bottomLeft: unproject(0, height),
    },
    extent: null,
  };
}
