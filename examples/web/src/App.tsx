import { useState } from "react";
import type { ReactElement } from "react";
import { openBasemaps } from "@web-map/core";
import type { Basemap, LngLat, MapExtent, MapViewport } from "@web-map/core";
import { eoxBasemaps, openStreetMapBasemaps } from "@web-map/restricted-basemaps";
import { MapControlSlot, MapExtentFrame, WebMap } from "@web-map/web";

import { ClearPointsButton } from "./ClearPointsButton.js";
import { ClickedPoints } from "./ClickedPoints.js";
import { FloatingToolbar } from "./FloatingToolbar.js";
import { RangeButton } from "./RangeButton.js";

const searchParams: URLSearchParams = new URLSearchParams(window.location.search);
/** Restricted basemaps are opt-in: add `?restricted` to the page URL to offer them. */
const isRestrictedOffered: boolean = searchParams.has("restricted");
/** Add `?floating` to replace the built-in toolbar with one floating over the map. */
const isToolbarFloating: boolean = searchParams.has("floating");
const basemaps: readonly Basemap[] = isRestrictedOffered
  ? [...openBasemaps, openStreetMapBasemaps.standard, eoxBasemaps.sentinel2Cloudless2024]
  : openBasemaps;

function describeExtent(extent: MapExtent, width: number): string {
  const metersPerPixel: number = (extent.maxX - extent.minX) / width;
  return `EPSG:3857 [${extent.minX.toFixed(2)}, ${extent.minY.toFixed(2)}, ${extent.maxX.toFixed(2)}, ${extent.maxY.toFixed(2)}] · ${metersPerPixel.toFixed(3)} m/px`;
}

function describeViewport(viewport: MapViewport | null, range: MapExtent | null): string {
  if (range !== null) {
    return `Fixed range ${describeExtent(range, viewport?.width ?? 1)}`;
  }
  if (viewport === null) {
    return "Loading the map…";
  }
  const { width, height, extent, camera } = viewport;
  const area: string =
    extent === null ? `rotated ${camera.bearing.toFixed(0)}°, tilted ${camera.pitch.toFixed(0)}°` : describeExtent(extent, width);
  return `On screen ${width} × ${height} px · ${area}`;
}

/**
 * Demo page: the map with every open basemap, optionally in gray, clicked points drawn as an overlay, and the
 * area on screen, which can be fixed as a framed range.
 *
 * @returns The page.
 */
export function App(): ReactElement {
  const [points, setPoints] = useState<readonly LngLat[]>([]);
  const [viewport, setViewport] = useState<MapViewport | null>(null);
  const [range, setRange] = useState<MapExtent | null>(null);
  const [isGrayscale, setIsGrayscale] = useState<boolean>(false);
  const controls: ReactElement = (
    <>
      <ClearPointsButton count={points.length} onClear={() => setPoints([])} />
      <RangeButton
        isFixed={range !== null}
        canFix={(viewport?.extent ?? null) !== null}
        onToggle={() => setRange(range === null ? (viewport?.extent ?? null) : null)}
      />
    </>
  );
  return (
    <main className="page">
      <h1>WebMap</h1>
      <p>
        Click the map to drop points; they stay on top when you switch the basemap. Add ?restricted to the URL to offer restricted basemaps,
        and ?floating to float the toolbar over the map.
      </p>
      <label className="option">
        <input type="checkbox" checked={isGrayscale} onChange={(event) => setIsGrayscale(event.target.checked)} />
        Grayscale basemap
      </label>
      <WebMap
        className="map"
        basemaps={basemaps}
        isHashSynced
        isGrayscale={isGrayscale}
        isToolbarShown={!isToolbarFloating}
        onViewportChange={setViewport}
        onMapClick={(position: LngLat) => setPoints((previous) => [...previous, position])}
      >
        <ClickedPoints points={points} />
        {range === null ? null : <MapExtentFrame extent={range} />}
        {isToolbarFloating ? <FloatingToolbar>{controls}</FloatingToolbar> : <MapControlSlot>{controls}</MapControlSlot>}
      </WebMap>
      <p className="camera">{describeViewport(viewport, range)}</p>
    </main>
  );
}
