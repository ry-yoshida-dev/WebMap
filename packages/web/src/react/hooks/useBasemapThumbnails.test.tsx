import "../testing/installDom.js";

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { cleanup, renderHook, waitFor } from "@testing-library/react";
import type { Basemap } from "@web-map/core";

import { sampleRasterBasemaps, sampleStyleBasemap } from "../testing/sampleBasemaps.js";
import { ThumbnailStatus } from "../../thumbnail/ThumbnailStatus.js";
import { useBasemapThumbnails } from "./useBasemapThumbnails.js";

afterEach(cleanup);

const basemaps: readonly Basemap[] = [sampleRasterBasemaps.first, sampleStyleBasemap];

describe("useBasemapThumbnails", () => {
  it("points raster basemaps at a tile and leaves style basemaps pending until requested", () => {
    const { result } = renderHook(() => useBasemapThumbnails(basemaps, false));
    assert.deepEqual(result.current(sampleRasterBasemaps.first), {
      status: ThumbnailStatus.READY,
      url: "https://tiles.example/first/7/113/50.png",
    });
    assert.equal(document.body.childElementCount, 1);
  });

  it("reports a style that cannot be drawn as failed and removes the hidden map", async () => {
    // jsdom has no WebGL, so the hidden map cannot be created, as when a browser has no context left.
    const { result } = renderHook(() => useBasemapThumbnails(basemaps, true));
    await waitFor(() => assert.equal(result.current(sampleStyleBasemap).status, ThumbnailStatus.FAILED));
    assert.equal(document.body.querySelector("[aria-hidden=true]"), null);
  });
});
