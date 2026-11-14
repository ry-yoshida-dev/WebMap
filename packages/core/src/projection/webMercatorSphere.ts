/** Radius of the sphere EPSG:3857 projects onto, in meters. */
export const WEB_MERCATOR_RADIUS: number = 6378137;

/** Distance from the prime meridian to the antimeridian, in meters: half the edge of the Web Mercator square. */
export const WEB_MERCATOR_HALF_EDGE: number = WEB_MERCATOR_RADIUS * Math.PI;

/** Edge in CSS pixels of the whole world at zoom 0, the basis of MapLibre's zoom levels. */
export const WORLD_SIZE_AT_ZOOM_ZERO: number = 512;

/** Latitude where the Web Mercator square ends, about 85.0511287798 degrees. */
export const MERCATOR_LATITUDE_LIMIT: number = (Math.atan(Math.sinh(Math.PI)) * 180) / Math.PI;
