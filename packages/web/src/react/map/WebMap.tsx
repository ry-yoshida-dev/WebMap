"use client";

import { useCallback, useEffectEvent, useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";
import type { Map as MapLibreMap, MapMouseEvent } from "maplibre-gl";
import { defineMapCamera, openBasemaps, openTerrains } from "@web-map/core";
import type { Basemap, LngLat, MapCamera, Terrain } from "@web-map/core";

import { defaultMapLabels } from "./defaultMapLabels.js";
import { MapContext } from "./MapContext.js";
import type { MapContextValue } from "./MapContextValue.js";
import { MapInstanceStatus } from "../hooks/MapInstanceStatus.js";
import type { MapAppearance } from "../hooks/MapAppearance.js";
import type { MapInstance } from "../hooks/MapInstance.js";
import type { MapLabels } from "./MapLabels.js";
import { MapColorScheme } from "../styles/MapColorScheme.js";
import { MapStyles } from "../styles/MapStyles.js";
import { MapToolbar } from "../controls/MapToolbar.js";
import { readViewport } from "../../camera/readViewport.js";
import { requireTerrainExaggeration } from "../../terrain/requireTerrainExaggeration.js";
import { DEFAULT_THUMBNAIL_CENTER, requireThumbnailCenter } from "../../thumbnail/thumbnailView.js";
import { useControllableState } from "../hooks/useControllableState.js";
import { useMapLibre } from "../hooks/useMapLibre.js";
import { useTileStatus } from "../hooks/useTileStatus.js";
import type { TileStatus } from "../hooks/TileStatus.js";
import type { WebMapProps } from "./WebMapProps.js";

const japanCamera: MapCamera = defineMapCamera({ center: { lng: 137.5, lat: 37.5 }, zoom: 4.5 });

function requireFirstOfUnique(basemaps: readonly Basemap[]): Basemap {
  const [first] = basemaps;
  if (first === undefined) {
    throw new RangeError("WebMap needs at least one basemap");
  }
  const ids: ReadonlySet<string> = new Set(basemaps.map((basemap: Basemap) => basemap.id));
  if (ids.size !== basemaps.length) {
    throw new RangeError("WebMap basemap ids must be unique");
  }
  return first;
}

function requireUniqueTerrains(terrains: readonly Terrain[]): void {
  const ids: ReadonlySet<string> = new Set(terrains.map((terrain: Terrain) => terrain.id));
  if (ids.size !== terrains.length) {
    throw new RangeError("WebMap terrain ids must be unique");
  }
}

function requireKnownId(items: readonly { readonly id: string }[], id: string | undefined, kind: string): string | undefined {
  if (id !== undefined && !items.some((item: { readonly id: string }) => item.id === id)) {
    throw new RangeError(`${kind} ${id} is not one of the map's ${kind.toLowerCase()}s`);
  }
  return id;
}

/** Classes of the root element, picking the color scheme the style sheet draws. */
function rootClassName(colorScheme: MapColorScheme, className: string | undefined): string {
  const scheme: string | null = colorScheme === MapColorScheme.SYSTEM ? null : `wmap-${colorScheme}`;
  return ["wmap-root", scheme, className].filter((name: string | null | undefined) => name != null).join(" ");
}

function findTerrain(terrains: readonly Terrain[], id: string | undefined): Terrain | null {
  return terrains.find((terrain: Terrain) => terrain.id === id) ?? terrains[0] ?? null;
}

/**
 * Interactive map showing one of several basemaps, flat or raised in 3D from a terrain, with a toolbar below it to
 * choose the basemap, turn 3D terrain on and off, choose its elevation data, read the position under the pointer and
 * navigate.
 *
 * It draws nothing over the basemap by itself; children add overlays on the
 * MapLibre map from {@link useMapContext} and controls through
 * {@link MapControlSlot}. With the toolbar hidden, children lay out their own
 * controls; the map is their containing block, so they can float over it. Overlays stay on top when the user switches basemaps.
 * Each basemap's and terrain's attribution is shown on the map, and restricted terms are
 * flagged next to the menu.
 *
 * @param props - Basemaps, initial view, callbacks and presentation.
 * @returns The map element.
 * @throws RangeError When `basemaps` is empty or has duplicate ids, `terrains` has duplicate ids, a basemap or
 *   terrain id given is not among them, the terrain exaggeration is negative, or the thumbnail center is outside
 *   Web Mercator.
 */
export function WebMap(props: WebMapProps): ReactElement {
  const basemaps: readonly Basemap[] = props.basemaps ?? openBasemaps;
  const firstBasemap: Basemap = requireFirstOfUnique(basemaps);
  const labels: MapLabels = useMemo(() => ({ ...defaultMapLabels, ...props.labels }), [props.labels]);

  const [shownId, keepBasemapId] = useControllableState<string | undefined>(requireKnownId(basemaps, props.basemapId, "Basemap"), () =>
    requireKnownId(basemaps, props.initialBasemapId, "Basemap"),
  );
  const basemap: Basemap = basemaps.find((candidate: Basemap) => candidate.id === shownId) ?? firstBasemap;
  const terrains: readonly Terrain[] = props.terrains ?? openTerrains;
  requireUniqueTerrains(terrains);
  const terrainExaggeration: number = props.terrainExaggeration ?? 1;
  requireTerrainExaggeration(terrainExaggeration);
  const thumbnailCenter: LngLat = props.thumbnailCenter ?? DEFAULT_THUMBNAIL_CENTER;
  requireThumbnailCenter(thumbnailCenter);
  const [terrainId, keepTerrainId] = useControllableState<string | undefined>(requireKnownId(terrains, props.terrainId, "Terrain"), () =>
    requireKnownId(terrains, props.initialTerrainId, "Terrain"),
  );
  const terrain: Terrain | null = findTerrain(terrains, terrainId);
  const [isTerrainShown, keepIsTerrainShown] = useControllableState<boolean>(
    props.isTerrainShown,
    () => props.initialIsTerrainShown ?? false,
  );
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [controlSlot, setControlSlot] = useState<HTMLElement | null>(null);

  const appearance: MapAppearance = {
    basemap,
    isGrayscale: props.isGrayscale ?? false,
    terrain: isTerrainShown ? terrain : null,
    terrainExaggeration,
  };
  const instance: MapInstance = useMapLibre(container, appearance, {
    camera: props.initialCamera ?? japanCamera,
    isHashSynced: props.isHashSynced ?? false,
  });
  const map: MapLibreMap | null = instance.status === MapInstanceStatus.READY ? instance.map : null;
  const tileStatus: TileStatus = useTileStatus(instance, basemap);

  const notifyViewport = useEffectEvent((): void => {
    if (map !== null) {
      props.onViewportChange?.(readViewport(map));
    }
  });
  const notifyClick = useEffectEvent((event: MapMouseEvent): void => {
    const { lng, lat } = event.lngLat.wrap();
    props.onMapClick?.({ lng, lat });
  });
  useEffect(() => {
    if (map === null) {
      return undefined;
    }
    const onViewChange = (): void => notifyViewport();
    const onClick = (event: MapMouseEvent): void => notifyClick(event);
    map.on("moveend", onViewChange);
    map.on("resize", onViewChange);
    map.on("click", onClick);
    notifyViewport();
    return () => {
      map.off("moveend", onViewChange);
      map.off("resize", onViewChange);
      map.off("click", onClick);
    };
  }, [map]);

  const onBasemapChange: ((basemap: Basemap) => void) | undefined = props.onBasemapChange;
  const changeBasemap = useCallback(
    (next: Basemap): void => {
      if (!basemaps.some((candidate: Basemap) => candidate.id === next.id)) {
        throw new RangeError(`Basemap ${next.id} is not one of the map's basemaps`);
      }
      keepBasemapId(next.id);
      onBasemapChange?.(next);
    },
    [basemaps, keepBasemapId, onBasemapChange],
  );

  const onTerrainChange: ((terrain: Terrain) => void) | undefined = props.onTerrainChange;
  const changeTerrain = useCallback(
    (next: Terrain): void => {
      if (!terrains.some((candidate: Terrain) => candidate.id === next.id)) {
        throw new RangeError(`Terrain ${next.id} is not one of the map's terrains`);
      }
      keepTerrainId(next.id);
      onTerrainChange?.(next);
    },
    [terrains, keepTerrainId, onTerrainChange],
  );

  const onTerrainShownChange: ((isShown: boolean) => void) | undefined = props.onTerrainShownChange;
  const changeTerrainShown = useCallback(
    (isShown: boolean): void => {
      keepIsTerrainShown(isShown);
      onTerrainShownChange?.(isShown);
    },
    [keepIsTerrainShown, onTerrainShownChange],
  );

  const isToolbarShown: boolean = props.isToolbarShown ?? true;
  const context: MapContextValue | null = useMemo(
    () =>
      map === null
        ? null
        : {
            map,
            basemaps,
            basemap,
            changeBasemap,
            terrains,
            terrain,
            changeTerrain,
            isTerrainShown,
            changeTerrainShown,
            tileStatus,
            labels,
            thumbnailCenter,
            controlSlot: isToolbarShown ? controlSlot : null,
          },
    [
      map,
      basemaps,
      basemap,
      changeBasemap,
      terrains,
      terrain,
      changeTerrain,
      isTerrainShown,
      changeTerrainShown,
      tileStatus,
      labels,
      thumbnailCenter,
      controlSlot,
      isToolbarShown,
    ],
  );

  return (
    <div className={rootClassName(props.colorScheme ?? MapColorScheme.SYSTEM, props.className)} style={props.style}>
      <MapStyles />
      <div className="wmap-stage">
        <div className="wmap-canvas" ref={setContainer} />
        {instance.status === MapInstanceStatus.FAILED ? (
          <div className="wmap-failure" role="alert">
            {labels.mapError}: {instance.message}
          </div>
        ) : null}
      </div>
      {isToolbarShown ? (
        <MapToolbar
          map={map}
          basemaps={basemaps}
          basemap={basemap}
          onBasemapChange={changeBasemap}
          terrains={terrains}
          terrain={terrain}
          onTerrainChange={changeTerrain}
          isTerrainShown={isTerrainShown}
          onTerrainShownChange={changeTerrainShown}
          tileStatus={tileStatus}
          labels={labels}
          thumbnailCenter={thumbnailCenter}
          slotRef={setControlSlot}
        />
      ) : null}
      {context === null ? null : <MapContext value={context}>{props.children}</MapContext>}
    </div>
  );
}
