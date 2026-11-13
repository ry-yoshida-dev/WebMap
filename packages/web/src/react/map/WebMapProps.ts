import type { CSSProperties, ReactNode } from "react";
import type { Basemap, LngLat, MapCamera, MapViewport, Terrain } from "@web-map/core";

import type { MapLabels } from "./MapLabels.js";

/**
 * Options of {@link WebMap}.
 */
export interface WebMapProps {
  /** Basemaps the user can choose from, in menu order; `openBasemaps` when omitted. Ids must be unique. */
  readonly basemaps?: readonly Basemap[];
  /**
   * Basemap on screen, for an app that keeps the choice in its own state; it then
   * changes only when this prop does, so update it from {@link onBasemapChange}.
   * The first of {@link basemaps} when unknown.
   */
  readonly basemapId?: string;
  /** Basemap shown first when {@link basemapId} is omitted; the first of {@link basemaps} when omitted or unknown. */
  readonly initialBasemapId?: string;
  /**
   * Elevation data the user can raise the ground from, in menu order; `openTerrains`, GSI first, when omitted. Ids
   * must be unique. When empty, the 3D terrain controls are left out and the ground stays flat.
   */
  readonly terrains?: readonly Terrain[];
  /**
   * Id of the chosen terrain, for an app that keeps the choice in its own state; it then changes only when this prop
   * does, so update it from {@link onTerrainChange}. The first of {@link terrains} when unknown.
   */
  readonly terrainId?: string;
  /** Terrain chosen first when {@link terrainId} is omitted; the first of {@link terrains} when omitted or unknown. */
  readonly initialTerrainId?: string;
  /**
   * Whether the ground is raised in 3D from the chosen terrain, for an app that keeps the setting in its own state;
   * it then changes only when this prop does, so update it from {@link onTerrainShownChange}.
   */
  readonly isTerrainShown?: boolean;
  /** Whether 3D terrain is on at first when {@link isTerrainShown} is omitted; false when omitted. */
  readonly initialIsTerrainShown?: boolean;
  /**
   * Factor the terrain's heights are multiplied by; 1 when omitted. `map.queryTerrainElevation` returns heights
   * multiplied by it, which is where 3D objects must stand to touch the ground on screen.
   */
  readonly terrainExaggeration?: number;
  /** Camera shown first; Japan when omitted. Ignored while the URL hash holds a camera and {@link isHashSynced} is set. */
  readonly initialCamera?: MapCamera;
  /** Keep the camera in the page URL's hash as `#zoom/lat/lng/bearing/pitch`, so links reopen the same view. */
  readonly isHashSynced?: boolean;
  /**
   * Show the basemap in shades of gray, so the application's overlays stand out; false when omitted. Overlays keep
   * their colors, and so do sprite icons and colors a style writes as legacy `stops` functions. Changing it reloads the
   * basemap's style.
   */
  readonly isGrayscale?: boolean;
  /** Called with the chosen basemap whenever the user or a child changes it. */
  readonly onBasemapChange?: (basemap: Basemap) => void;
  /** Called with the chosen terrain whenever the user or a child changes it. */
  readonly onTerrainChange?: (terrain: Terrain) => void;
  /** Called whenever the user or a child turns 3D terrain on or off. */
  readonly onTerrainShownChange?: (isShown: boolean) => void;
  /**
   * Called with exactly what the map shows once it has loaded, then whenever the camera comes to rest after a
   * movement or the map is resized. Its extent is what to hand on, as to print, to cover what is on screen.
   */
  readonly onViewportChange?: (viewport: MapViewport) => void;
  /** Called with the clicked position. */
  readonly onMapClick?: (position: LngLat) => void;
  /**
   * Show the built-in toolbar below the map; true when omitted. Without it,
   * {@link MapControlSlot} renders nothing, and children build their own controls
   * from the exported ones and {@link useMapContext}.
   */
  readonly isToolbarShown?: boolean;
  /** Text overriding the English defaults. */
  readonly labels?: Partial<MapLabels>;
  readonly className?: string;
  /** Size of the map; give it a height, as the map fills the space it is given. */
  readonly style?: CSSProperties;
  /** Extensions, such as overlays drawn with {@link useMapContext} and controls in {@link MapControlSlot}. */
  readonly children?: ReactNode;
}
