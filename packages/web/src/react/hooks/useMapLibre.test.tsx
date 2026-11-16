import "../testing/installDom.js";

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { cleanup, renderHook } from "@testing-library/react";
import { defineMapCamera, gsiTerrains } from "@web-map/core";

import type { MapAppearance } from "./MapAppearance.js";
import { MapInstanceStatus } from "./MapInstanceStatus.js";
import { sampleRasterBasemaps } from "../testing/sampleBasemaps.js";
import { useMapLibre } from "./useMapLibre.js";

afterEach(cleanup);

const appearance: MapAppearance = { basemap: sampleRasterBasemaps.first, isGrayscale: false, terrain: null, terrainExaggeration: 1 };
const options = {
  camera: defineMapCamera({ center: { lng: 139.7, lat: 35.7 }, zoom: 10 }),
  isHashSynced: false,
  glyphsUrl: null,
  isAttributionCompact: null,
};

/** Render the hook on a container. */
function render() {
  const container: HTMLElement = document.createElement("div");
  return renderHook(({ shown }: { readonly shown: MapAppearance }) => useMapLibre(container, shown, options), {
    initialProps: { shown: appearance },
  });
}

describe("useMapLibre", () => {
  // jsdom has no WebGL, so creating the map always fails, as when a browser has no context left. Each attempt to
  // create it reports a new failure.
  it("fails when the map cannot be created", () => {
    const { result } = render();
    assert.equal(result.current.status, MapInstanceStatus.FAILED);
  });

  it("creates the map again when another basemap is chosen after a failure", () => {
    const { rerender, result } = render();
    const failure = result.current;
    rerender({ shown: { ...appearance, basemap: sampleRasterBasemaps.second } });
    assert.equal(result.current.status, MapInstanceStatus.FAILED);
    assert.notEqual(result.current, failure);
  });

  it("does not create the map again for a terrain or the same basemap rebuilt", () => {
    const { rerender, result } = render();
    const failure = result.current;
    rerender({ shown: { ...appearance, terrain: gsiTerrains.elevation } });
    rerender({ shown: { ...appearance, basemap: { ...sampleRasterBasemaps.first } } });
    assert.equal(result.current, failure);
  });
});
