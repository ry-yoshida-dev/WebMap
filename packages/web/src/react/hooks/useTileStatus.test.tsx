import "../testing/installDom.js";

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { act, cleanup, renderHook } from "@testing-library/react";
import { AJAXError } from "maplibre-gl";
import type { Basemap } from "@web-map/core";

import { FakeMap } from "../testing/FakeMap.js";
import { MapInstanceStatus } from "./MapInstanceStatus.js";
import { sampleRasterBasemaps, sampleStyleBasemap } from "../testing/sampleBasemaps.js";
import { TileStatus } from "./TileStatus.js";
import type { TileStatusSource } from "./TileStatusSource.js";
import { useTileStatus } from "./useTileStatus.js";

afterEach(cleanup);

const BASEMAP_SOURCE: string = "basemap";

function readyInstance(map: FakeMap): TileStatusSource {
  return {
    status: MapInstanceStatus.READY,
    map,
    isBasemapError: (event) => event.sourceId === BASEMAP_SOURCE,
    isBasemapSource: (sourceId: string) => sourceId === BASEMAP_SOURCE,
  };
}

function render(map: FakeMap, basemap: Basemap = sampleRasterBasemaps.first) {
  const instance: TileStatusSource = readyInstance(map);
  return renderHook(({ shown }: { readonly shown: Basemap }) => useTileStatus(instance, shown), {
    initialProps: { shown: basemap },
  });
}

describe("useTileStatus", () => {
  it("is loading until the map is ready", () => {
    const { result } = renderHook(() => useTileStatus({ status: MapInstanceStatus.LOADING }, sampleRasterBasemaps.first));
    assert.equal(result.current, TileStatus.LOADING);
  });

  it("follows tiles loading and the map going idle", () => {
    const map: FakeMap = new FakeMap();
    const { result } = render(map);
    assert.equal(result.current, TileStatus.IDLE);
    act(() => map.fire("dataloading"));
    assert.equal(result.current, TileStatus.LOADING);
    act(() => map.fire("idle"));
    assert.equal(result.current, TileStatus.IDLE);
  });

  it("fails on errors of the basemap, but not on missing coverage or other sources", () => {
    const map: FakeMap = new FakeMap();
    const { result } = render(map);
    act(() =>
      map.fire("error", {
        error: new AJAXError(404, "Not Found", "https://tiles.example/1.png", new Blob()),
        sourceId: BASEMAP_SOURCE,
        tile: {},
      }),
    );
    act(() => map.fire("error", { error: new Error("overlay"), sourceId: "overlay" }));
    assert.equal(result.current, TileStatus.IDLE);
    act(() => map.fire("error", { error: new Error("server"), sourceId: BASEMAP_SOURCE }));
    assert.equal(result.current, TileStatus.FAILED);
  });

  it("fails when the style document of the basemap is missing", () => {
    const map: FakeMap = new FakeMap();
    // The map counts an error without a source as the basemap's while its style document is fetched.
    const instance: TileStatusSource = {
      status: MapInstanceStatus.READY,
      map,
      isBasemapError: (event) => event.sourceId === undefined,
      isBasemapSource: (sourceId: string) => sourceId === BASEMAP_SOURCE,
    };
    const { result } = renderHook(() => useTileStatus(instance, sampleStyleBasemap));
    act(() => map.fire("error", { error: new AJAXError(404, "Not Found", "https://tiles.example/style.json", new Blob()) }));
    assert.equal(result.current, TileStatus.FAILED);
  });

  it("keeps a failure when the same basemap comes as a new object", () => {
    const map: FakeMap = new FakeMap();
    const { result, rerender } = render(map);
    act(() => map.fire("error", { error: new Error("server"), sourceId: BASEMAP_SOURCE }));
    rerender({ shown: { ...sampleRasterBasemaps.first } });
    assert.equal(result.current, TileStatus.FAILED);
  });

  it("recovers when a tile of the basemap loads after a failure", () => {
    const map: FakeMap = new FakeMap();
    const { result } = render(map);
    act(() => map.fire("error", { error: new Error("offline"), sourceId: BASEMAP_SOURCE }));
    act(() => map.fire("sourcedata", { sourceId: "overlay", tile: {} }));
    act(() => map.fire("sourcedata", { sourceId: BASEMAP_SOURCE }));
    assert.equal(result.current, TileStatus.FAILED);
    act(() => map.fire("sourcedata", { sourceId: BASEMAP_SOURCE, tile: {} }));
    assert.equal(result.current, TileStatus.IDLE);
  });

  it("clears a failure when the basemap changes", () => {
    const map: FakeMap = new FakeMap();
    const { result, rerender } = render(map);
    act(() => map.fire("error", { error: new Error("server"), sourceId: BASEMAP_SOURCE }));
    rerender({ shown: sampleRasterBasemaps.second });
    assert.equal(result.current, TileStatus.IDLE);
  });
});
