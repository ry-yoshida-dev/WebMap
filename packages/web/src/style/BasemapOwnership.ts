/**
 * Sources and layers that came from the basemap's style, as opposed to overlays added by the application.
 */
export interface BasemapOwnership {
  readonly sourceIds: ReadonlySet<string>;
  readonly layerIds: ReadonlySet<string>;
}
