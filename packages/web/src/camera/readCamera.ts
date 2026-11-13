import type { Map as MapLibreMap } from "maplibre-gl";
import { defineMapCamera } from "@web-map/core";
import type { MapCamera } from "@web-map/core";

/**
 * Read a MapLibre map's camera, wrapping the longitude into `[-180, 180]`.
 *
 * @param map - Map to read.
 * @returns The camera.
 */
export function readCamera(map: MapLibreMap): MapCamera {
  const center = map.getCenter().wrap();
  return defineMapCamera({
    center: { lng: center.lng, lat: center.lat },
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
  });
}
