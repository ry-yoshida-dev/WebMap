import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import type { Map as MapLibreMap, MapEventType, MapMouseEvent } from "maplibre-gl";

import type { PositionReadoutProps } from "./PositionReadoutProps.js";
import { useMapState } from "../hooks/useMapState.js";

const ZOOM_EVENTS: readonly (keyof MapEventType)[] = ["zoom"];
const readZoom = (map: MapLibreMap): string => map.getZoom().toFixed(1);
/** Five decimals resolve about a meter. */
const COORDINATE_DECIMALS: number = 5;

/**
 * Latitude and longitude under the pointer, and the zoom level.
 *
 * @param props - Map and labels.
 * @returns The readout.
 */
export function PositionReadout({ map, labels }: PositionReadoutProps): ReactElement {
  const [pointer, setPointer] = useState<string | null>(null);
  const zoom: string = useMapState(map, ZOOM_EVENTS, readZoom);

  useEffect(() => {
    const onMove = (event: MapMouseEvent): void => {
      const { lat, lng } = event.lngLat.wrap();
      setPointer(`${lat.toFixed(COORDINATE_DECIMALS)}, ${lng.toFixed(COORDINATE_DECIMALS)}`);
    };
    const onLeave = (): void => setPointer(null);
    map.on("mousemove", onMove);
    map.on("mouseout", onLeave);
    return () => {
      map.off("mousemove", onMove);
      map.off("mouseout", onLeave);
    };
  }, [map]);

  return (
    <span className="wmap-readout">
      <span className="wmap-pointer" title={labels.pointer}>
        {pointer ?? "—"}
      </span>
      <span className="wmap-zoom" title={labels.zoomLevel}>
        z{zoom}
      </span>
    </span>
  );
}
