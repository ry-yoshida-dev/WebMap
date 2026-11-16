import "../testing/installDom.js";

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { noBasemap } from "@web-map/core";
import type { Basemap } from "@web-map/core";

import { sampleRasterBasemaps, sampleStyleBasemap } from "../testing/sampleBasemaps.js";
import { ThumbnailStatus } from "../../thumbnail/ThumbnailStatus.js";
import { DEFAULT_THUMBNAIL_CENTER } from "../../thumbnail/thumbnailView.js";
import { useBasemapThumbnails } from "./useBasemapThumbnails.js";

afterEach(cleanup);

const basemaps: readonly Basemap[] = [sampleRasterBasemaps.first, sampleStyleBasemap];

describe("useBasemapThumbnails", () => {
  it("points raster basemaps at a tile and leaves style basemaps pending until requested", () => {
    const { result } = renderHook(() => useBasemapThumbnails(basemaps, false, DEFAULT_THUMBNAIL_CENTER));
    assert.deepEqual(result.current(sampleRasterBasemaps.first), {
      status: ThumbnailStatus.READY,
      url: "https://tiles.example/first/7/113/50.png",
    });
    assert.equal(document.body.childElementCount, 1);
  });

  it("has nothing to preview for no basemap", () => {
    const { result } = renderHook(() => useBasemapThumbnails([noBasemap], true, DEFAULT_THUMBNAIL_CENTER));
    assert.deepEqual(result.current(noBasemap), { status: ThumbnailStatus.EMPTY });
  });

  it("shows the tile around the center it is given", () => {
    const { result } = renderHook(() => useBasemapThumbnails(basemaps, false, { lng: 2.35, lat: 48.85 }));
    assert.deepEqual(result.current(sampleRasterBasemaps.first), {
      status: ThumbnailStatus.READY,
      url: "https://tiles.example/first/7/64/44.png",
    });
  });

  it("rejects a center outside Web Mercator", () => {
    assert.throws(() => renderHook(() => useBasemapThumbnails(basemaps, false, { lng: 0, lat: 89 })), RangeError);
  });

  it("reports a style that cannot be drawn as failed and removes the hidden map", async () => {
    // jsdom has no WebGL, so the hidden map cannot be created, as when a browser has no context left.
    const { result } = renderHook(() => useBasemapThumbnails(basemaps, true, DEFAULT_THUMBNAIL_CENTER));
    await waitFor(() => assert.equal(result.current(sampleStyleBasemap).status, ThumbnailStatus.FAILED));
    assert.equal(document.body.querySelector("[aria-hidden=true]"), null);
  });
});
