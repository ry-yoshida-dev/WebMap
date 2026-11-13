import { useCallback, useEffectEvent, useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";
import type { Map as MapLibreMap, MapMouseEvent } from "maplibre-gl";
import { defineMapCamera, openBasemaps, openTerrains } from "@web-map/core";
import type { Basemap, MapCamera, Terrain } from "@web-map/core";

import { defaultMapLabels } from "./defaultMapLabels.js";
import { MapContext } from "./MapContext.js";
import type { MapContextValue } from "./MapContextValue.js";
import { MapInstanceStatus } from "../hooks/MapInstanceStatus.js";
import type { MapAppearance } from "../hooks/MapAppearance.js";
import type { MapInstance } from "../hooks/MapInstance.js";
import type { MapLabels } from "./MapLabels.js";
import { MapStyles } from "../styles/MapStyles.js";
import { MapToolbar } from "../controls/MapToolbar.js";
import { readViewport } from "../../camera/readViewport.js";
import { requireTerrainExaggeration } from "../../terrain/requireTerrainExaggeration.js";
import { useMapLibre } from "../hooks/useMapLibre.js";
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
 * @throws RangeError When `basemaps` is empty or has duplicate ids, `terrains` has duplicate ids, or the terrain
 *   exaggeration is negative.
 */
export function WebMap(props: WebMapProps): ReactElement {
  const basemaps: readonly Basemap[] = props.basemaps ?? openBasemaps;
  const firstBasemap: Basemap = requireFirstOfUnique(basemaps);
  const labels: MapLabels = useMemo(() => ({ ...defaultMapLabels, ...props.labels }), [props.labels]);

  const [chosenId, setChosenId] = useState<string | undefined>(props.initialBasemapId);
  const shownId: string | undefined = props.basemapId ?? chosenId;
  const basemap: Basemap = basemaps.find((candidate: Basemap) => candidate.id === shownId) ?? firstBasemap;
  const terrains: readonly Terrain[] = props.terrains ?? openTerrains;
  requireUniqueTerrains(terrains);
  const terrainExaggeration: number = props.terrainExaggeration ?? 1;
  requireTerrainExaggeration(terrainExaggeration);
  const [chosenTerrainId, setChosenTerrainId] = useState<string | undefined>(props.initialTerrainId);
  const terrain: Terrain | null = findTerrain(terrains, props.terrainId ?? chosenTerrainId);
  const [chosenIsTerrainShown, setChosenIsTerrainShown] = useState<boolean>(props.initialIsTerrainShown ?? false);
  const isTerrainShown: boolean = props.isTerrainShown ?? chosenIsTerrainShown;
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

  const isBasemapControlled: boolean = props.basemapId !== undefined;
  const onBasemapChange: ((basemap: Basemap) => void) | undefined = props.onBasemapChange;
  const changeBasemap = useCallback(
    (next: Basemap): void => {
      if (!basemaps.some((candidate: Basemap) => candidate.id === next.id)) {
        throw new RangeError(`Basemap ${next.id} is not one of the map's basemaps`);
      }
      if (!isBasemapControlled) {
        setChosenId(next.id);
      }
      onBasemapChange?.(next);
    },
    [basemaps, isBasemapControlled, onBasemapChange],
  );

  const isTerrainControlled: boolean = props.terrainId !== undefined;
  const onTerrainChange: ((terrain: Terrain) => void) | undefined = props.onTerrainChange;
  const changeTerrain = useCallback(
    (next: Terrain): void => {
      if (!terrains.some((candidate: Terrain) => candidate.id === next.id)) {
        throw new RangeError(`Terrain ${next.id} is not one of the map's terrains`);
      }
      if (!isTerrainControlled) {
        setChosenTerrainId(next.id);
      }
      onTerrainChange?.(next);
    },
    [terrains, isTerrainControlled, onTerrainChange],
  );

  const isTerrainShownControlled: boolean = props.isTerrainShown !== undefined;
  const onTerrainShownChange: ((isShown: boolean) => void) | undefined = props.onTerrainShownChange;
  const changeTerrainShown = useCallback(
    (isShown: boolean): void => {
      if (!isTerrainShownControlled) {
        setChosenIsTerrainShown(isShown);
      }
      onTerrainShownChange?.(isShown);
    },
    [isTerrainShownControlled, onTerrainShownChange],
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
            labels,
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
      labels,
      controlSlot,
      isToolbarShown,
    ],
  );

  return (
    <div className={props.className === undefined ? "wmap-root" : `wmap-root ${props.className}`} style={props.style}>
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
          labels={labels}
          slotRef={setControlSlot}
        />
      ) : null}
      {context === null ? null : <MapContext value={context}>{props.children}</MapContext>}
    </div>
  );
}
