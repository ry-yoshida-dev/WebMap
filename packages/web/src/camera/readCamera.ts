import type { Map as MapLibreMap } from "maplibre-gl";
import { defineMapCamera, MERCATOR_LATITUDE_LIMIT } from "@web-map/core";
import type { MapCamera } from "@web-map/core";

/**
 * Read a MapLibre map's camera, wrapping the longitude into `[-180, 180]` and keeping the latitude within Web Mercator,
 * which MapLibre's own limit, rounded to 85.051129, slightly exceeds.
 *
 * @param map - Map to read.
 * @returns The camera.
 */
export function readCamera(map: MapLibreMap): MapCamera {
  const center = map.getCenter().wrap();
  return defineMapCamera({
    center: { lng: center.lng, lat: Math.max(-MERCATOR_LATITUDE_LIMIT, Math.min(MERCATOR_LATITUDE_LIMIT, center.lat)) },
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
  });
}
