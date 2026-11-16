/**
 * Text of the built-in controls and messages, for translation.
 */
export interface MapLabels {
  readonly basemap: string;
  /** Button turning 3D terrain on and off. */
  readonly terrainShown: string;
  /** Menu of the elevation data. */
  readonly terrain: string;
  readonly zoomIn: string;
  readonly zoomOut: string;
  readonly resetNorth: string;
  readonly pointer: string;
  readonly zoomLevel: string;
  readonly loading: string;
  readonly tileError: string;
  readonly mapError: string;
  readonly nonCommercialOnly: string;
  readonly conditional: string;
  /** Flag on a basemap whose terms are not known, as one the user added by its address. */
  readonly unknownTerms: string;
}
