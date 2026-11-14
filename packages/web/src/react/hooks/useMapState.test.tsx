import "../testing/installDom.js";

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { act, cleanup, renderHook } from "@testing-library/react";
import type { MapEventType } from "maplibre-gl";

import { FakeMap } from "../testing/FakeMap.js";
import { useMapState } from "./useMapState.js";

afterEach(cleanup);

const ZOOM_EVENTS: readonly (keyof MapEventType)[] = ["zoom"];
const readZoom = (map: FakeMap): number => map.getZoom();

describe("useMapState", () => {
  it("re-reads the value when one of the events fires", () => {
    const map: FakeMap = new FakeMap();
    const { result } = renderHook(() => useMapState(map, ZOOM_EVENTS, readZoom));
    assert.equal(result.current, 0);
    map.zoom = 5;
    act(() => map.fire("zoom"));
    assert.equal(result.current, 5);
  });

  it("stops listening when unmounted", () => {
    const map: FakeMap = new FakeMap();
    const { unmount } = renderHook(() => useMapState(map, ZOOM_EVENTS, readZoom));
    assert.equal(map.listenerCount("zoom"), 1);
    unmount();
    assert.equal(map.listenerCount("zoom"), 0);
  });
});
