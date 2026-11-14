import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { cameraForExtent, defineMapCamera, defineMapExtent, describeFlatViewport, toWebMercator, webMercatorResolution } from "../index.js";
import type { MapExtent, WebMercatorPoint } from "../index.js";

/** Half the width of the Web Mercator square in meters. */
const HALF_WORLD: number = Math.PI * 6378137;

const near = (actual: number, expected: number, tolerance: number = 1e-6): void => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not within ${tolerance} of ${expected}`);
};
const nearPoint = (actual: WebMercatorPoint, expected: WebMercatorPoint): void => {
  near(actual.x, expected.x);
  near(actual.y, expected.y);
};

describe("describeFlatViewport", () => {
  const camera = defineMapCamera({ center: { lng: 139.7671, lat: 35.6812 }, zoom: 12 });

  it("spans the size in pixels times the resolution, around the center", () => {
    const viewport = describeFlatViewport(camera, 800, 600);
    const center = toWebMercator(camera.center);
    const resolution = webMercatorResolution(12);
    assert.ok(viewport.extent !== null);
    near(viewport.extent.maxX - viewport.extent.minX, 800 * resolution);
    near(viewport.extent.maxY - viewport.extent.minY, 600 * resolution);
    near((viewport.extent.minX + viewport.extent.maxX) / 2, center.x);
    nearPoint(viewport.corners.topLeft, { x: viewport.extent.minX, y: viewport.extent.maxY });
    nearPoint(viewport.corners.bottomRight, { x: viewport.extent.maxX, y: viewport.extent.minY });
  });

  it("turns the corners with the bearing and gives no extent", () => {
    const viewport = describeFlatViewport({ ...camera, bearing: 90 }, 800, 600);
    const center = toWebMercator(camera.center);
    const resolution = webMercatorResolution(12);
    assert.equal(viewport.extent, null);
    // Facing east, the top of the screen is east and its left is north.
    nearPoint(viewport.corners.topLeft, { x: center.x + 300 * resolution, y: center.y + 400 * resolution });
  });

  it("rejects tilted cameras and empty sizes", () => {
    assert.throws(() => describeFlatViewport({ ...camera, pitch: 30 }, 800, 600), RangeError);
    assert.throws(() => describeFlatViewport(camera, 0, 600), RangeError);
  });
});

describe("cameraForExtent", () => {
  it("restores the camera of a viewport of the same size", () => {
    const camera = defineMapCamera({ center: { lng: 139.7671, lat: 35.6812 }, zoom: 12.37 });
    const extent: MapExtent | null = describeFlatViewport(camera, 1024, 700).extent;
    assert.ok(extent !== null);
    const restored = cameraForExtent(extent, 1024, 700);
    near(restored.zoom, 12.37, 1e-9);
    near(restored.center.lng, 139.7671, 1e-9);
    near(restored.center.lat, 35.6812, 1e-9);
  });

  it("fits the extent along its tighter axis in a map of another shape", () => {
    const extent = defineMapExtent({ minX: 0, minY: 0, maxX: 2000, maxY: 1000 });
    const viewport = describeFlatViewport(cameraForExtent(extent, 500, 500), 500, 500);
    assert.ok(viewport.extent !== null);
    near(viewport.extent.minX, 0);
    near(viewport.extent.maxX, 2000);
    near(viewport.extent.maxY - viewport.extent.minY, 2000);
  });

  it("fits the whole world in a map narrower than the world at zoom 0", () => {
    const extent = defineMapExtent({ minX: -HALF_WORLD, minY: -HALF_WORLD, maxX: HALF_WORLD, maxY: HALF_WORLD });
    const camera = cameraForExtent(extent, 256, 256);
    near(camera.zoom, -1, 1e-9);
    assert.throws(() => cameraForExtent(extent, 100, 100), RangeError);
  });

  it("keeps an extent crossing the antimeridian east of it", () => {
    const extent = defineMapExtent({ minX: HALF_WORLD - 1000, minY: -1000, maxX: HALF_WORLD + 1000, maxY: 1000 });
    const viewport = describeFlatViewport(cameraForExtent(extent, 200, 200), 200, 200);
    assert.ok(viewport.extent !== null);
    near(viewport.extent.minX, extent.minX, 1e-3);
    near(viewport.extent.maxX, extent.maxX, 1e-3);
    nearPoint(viewport.corners.topLeft, { x: extent.minX, y: extent.maxY });
  });

  it("starts a rotated view crossing the antimeridian west of it", () => {
    const viewport = describeFlatViewport(defineMapCamera({ center: { lng: -180, lat: 0 }, zoom: 10, bearing: 45 }), 200, 200);
    const xs: readonly number[] = Object.values(viewport.corners).map((corner: WebMercatorPoint) => corner.x);
    assert.ok(Math.min(...xs) >= -HALF_WORLD);
    assert.ok(Math.max(...xs) > HALF_WORLD);
  });

  it("treats a full turn as facing north", () => {
    const camera = { center: { lng: 0, lat: 0 }, zoom: 3, bearing: 360, pitch: 0 };
    const viewport = describeFlatViewport(camera, 100, 100);
    assert.equal(viewport.camera.bearing, 0);
    assert.ok(viewport.extent !== null);
  });

  it("rejects empty extents", () => {
    assert.throws(() => defineMapExtent({ minX: 1, minY: 0, maxX: 1, maxY: 1 }), RangeError);
    assert.throws(() => cameraForExtent({ minX: 0, minY: 0, maxX: 1, maxY: 1 }, 0, 1), RangeError);
  });
});
