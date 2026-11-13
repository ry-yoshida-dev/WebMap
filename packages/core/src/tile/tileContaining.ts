import type { LngLat } from "../camera/LngLat.js";
import type { TileCoordinate } from "./TileCoordinate.js";
import { MERCATOR_LATITUDE_LIMIT } from "../projection/webMercatorSphere.js";
import { HIGHEST_ZOOM } from "../projection/webMercatorZoom.js";

/**
 * Find the tile a position falls in.
 *
 * @param position - Position on the earth.
 * @param zoom - Integer zoom level of the grid.
 * @returns The tile; positions on the east or south edge fall in the last tile.
 * @throws RangeError When the position is outside Web Mercator or the zoom is not an integer in [0, 24].
 */
export function tileContaining(position: LngLat, zoom: number): TileCoordinate {
  if (!Number.isFinite(position.lng) || position.lng < -180 || position.lng > 180) {
    throw new RangeError(`Longitude must lie in [-180, 180], got ${position.lng}`);
  }
  if (!Number.isFinite(position.lat) || Math.abs(position.lat) > MERCATOR_LATITUDE_LIMIT) {
    throw new RangeError(`Latitude must lie in [-${MERCATOR_LATITUDE_LIMIT}, ${MERCATOR_LATITUDE_LIMIT}], got ${position.lat}`);
  }
  if (!Number.isInteger(zoom) || zoom < 0 || zoom > HIGHEST_ZOOM) {
    throw new RangeError(`Zoom must be an integer in [0, ${HIGHEST_ZOOM}], got ${zoom}`);
  }
  const count: number = 2 ** zoom;
  const latitude: number = (position.lat * Math.PI) / 180;
  const column: number = ((position.lng + 180) / 360) * count;
  const row: number = ((1 - Math.asinh(Math.tan(latitude)) / Math.PI) / 2) * count;
  const clamp = (index: number): number => Math.min(count - 1, Math.max(0, Math.floor(index)));
  return { zoom, x: clamp(column), y: clamp(row) };
}
