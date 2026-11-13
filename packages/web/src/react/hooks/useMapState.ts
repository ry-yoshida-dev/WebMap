import { useCallback, useSyncExternalStore } from "react";
import type { Map as MapLibreMap, MapEventType } from "maplibre-gl";

/**
 * Read a value of the map, re-rendering when one of the events fires.
 *
 * @param map - Map to read.
 * @param events - Events after which the value may change; keep the array constant, as a new one resubscribes.
 * @param read - Reads the value; must return the same primitive while nothing changed.
 * @returns The current value.
 */
export function useMapState<TValue extends string | number | boolean>(
  map: MapLibreMap,
  events: readonly (keyof MapEventType)[],
  read: (map: MapLibreMap) => TValue,
): TValue {
  const subscribe = useCallback(
    (notify: () => void): (() => void) => {
      for (const name of events) {
        map.on(name, notify);
      }
      return () => {
        for (const name of events) {
          map.off(name, notify);
        }
      };
    },
    [map, events],
  );
  return useSyncExternalStore(subscribe, () => read(map));
}
