import { useEffect } from "react";
import type { GeoJSONSource } from "maplibre-gl";
import { useMapContext } from "@web-map/web";

import type { ClickedPointsProps } from "./ClickedPointsProps.js";
import { POINTS_ID, toPointCollection } from "./pointsLayer.js";

/**
 * Example of what a GIS tool adds on top of WebMap: an overlay drawn on the
 * MapLibre map. WebMap itself only shows the basemap.
 *
 * @param props - Points to draw.
 * @returns Nothing; the points are drawn on the map.
 */
export function ClickedPoints({ points }: ClickedPointsProps): null {
  const { map } = useMapContext();

  useEffect(() => {
    map.addSource(POINTS_ID, { type: "geojson", data: toPointCollection([]) });
    map.addLayer({
      id: POINTS_ID,
      type: "circle",
      source: POINTS_ID,
      paint: { "circle-radius": 6, "circle-color": "#e8590c", "circle-stroke-width": 2, "circle-stroke-color": "#ffffff" },
    });
    return () => {
      map.removeLayer(POINTS_ID);
      map.removeSource(POINTS_ID);
    };
  }, [map]);

  useEffect(() => {
    void map.getSource<GeoJSONSource>(POINTS_ID)?.setData(toPointCollection(points));
  }, [map, points]);

  return null;
}
