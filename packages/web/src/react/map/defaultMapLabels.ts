import type { MapLabels } from "./MapLabels.js";

/**
 * English labels used for any label not given.
 */
export const defaultMapLabels: MapLabels = {
  basemap: "Basemap",
  terrainShown: "3D terrain",
  terrain: "Elevation data",
  zoomIn: "Zoom in (+)",
  zoomOut: "Zoom out (-)",
  resetNorth: "Reset north and tilt",
  pointer: "Pointer position (latitude, longitude)",
  zoomLevel: "Zoom level",
  loading: "Loading tiles",
  tileError: "Some tiles failed to load",
  mapError: "The map could not be shown",
  nonCommercialOnly: "Non-commercial only",
  conditional: "Conditions apply",
  unknownTerms: "Terms unknown",
};
