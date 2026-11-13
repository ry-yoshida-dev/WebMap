import type { FeatureCollection, Point } from "geojson";
import type { LngLat } from "@web-map/core";

/** Id of the source and layer the clicked points are drawn from. */
export const POINTS_ID: string = "example-clicked-points";

/**
 * GeoJSON of clicked points, as a MapLibre GeoJSON source takes it.
 *
 * @param points - Clicked positions.
 * @returns A feature collection of points.
 */
export function toPointCollection(points: readonly LngLat[]): FeatureCollection<Point> {
  return {
    type: "FeatureCollection",
    features: points.map((point: LngLat) => ({
      type: "Feature",
      properties: {},
      geometry: { type: "Point", coordinates: [point.lng, point.lat] },
    })),
  };
}
