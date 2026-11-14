import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { gsiBasemaps, gsiTerrains, mapzenTerrains } from "@web-map/core";

import { applyTerrain } from "./applyTerrain.js";
import type { TerrainTarget } from "./applyTerrain.js";
import { GSI_ELEVATION_SCHEME } from "./gsiElevationScheme.js";
import { gsiToTerrarium } from "./gsiToTerrarium.js";
import type { MapStyle } from "../style/MapStyle.js";
import { OverlayCarrier } from "../style/OverlayCarrier.js";
import type { OverlayConflictError } from "../style/OverlayConflictError.js";
import { toMapStyle } from "../style/toMapStyle.js";
import { toTerrainSource } from "./toTerrainSource.js";
import { TERRAIN_SOURCE_PREFIX } from "../style/terrainSourceId.js";
import { withTerrain } from "../style/withTerrain.js";

function failOnConflict(error: OverlayConflictError): never {
  throw error;
}

function gsiPixel(meters: number): readonly number[] {
  const units: number = Math.round(meters * 100);
  const value: number = units < 0 ? units + 2 ** 24 : units;
  return [Math.floor(value / 65536), Math.floor(value / 256) % 256, value % 256, 255];
}

function terrariumHeight(pixels: Uint8ClampedArray, index: number): number {
  return (pixels[index] ?? 0) * 256 + (pixels[index + 1] ?? 0) + (pixels[index + 2] ?? 0) / 256 - 32768;
}

function rasterStyle(): MapStyle {
  const style = toMapStyle(gsiBasemaps.pale);
  assert.ok(typeof style !== "string");
  return style;
}

describe("gsiToTerrarium", () => {
  it("keeps heights within the Terrarium resolution, below sea level too", () => {
    const heights: readonly number[] = [0, 3776.12, 0.01, -3.5, 1234.56];
    const pixels: Uint8ClampedArray = new Uint8ClampedArray(heights.flatMap(gsiPixel));
    gsiToTerrarium(pixels);
    heights.forEach((height: number, index: number) => {
      assert.ok(Math.abs(terrariumHeight(pixels, index * 4) - height) <= 1 / 256, `${height}`);
    });
  });

  it("turns no data into sea level and leaves alpha alone", () => {
    const pixels: Uint8ClampedArray = new Uint8ClampedArray([128, 0, 0, 255]);
    gsiToTerrarium(pixels);
    assert.equal(terrariumHeight(pixels, 0), 0);
    assert.equal(pixels[3], 255);
  });

  it("rejects a length that is not whole pixels", () => {
    assert.throws(() => gsiToTerrarium(new Uint8ClampedArray(3)), RangeError);
  });
});

describe("toTerrainSource", () => {
  it("routes GSI tiles through the re-encoding protocol", () => {
    const source = toTerrainSource(gsiTerrains.elevation);
    assert.equal(source.encoding, "terrarium");
    assert.deepEqual(source.tiles, [`${GSI_ELEVATION_SCHEME}://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png`]);
    assert.equal(source.maxzoom, 14);
    assert.ok(source.attribution?.includes("地理院タイル"));
  });

  it("loads Terrarium tiles directly", () => {
    const source = toTerrainSource(mapzenTerrains.terrarium);
    assert.equal(source.encoding, "terrarium");
    assert.deepEqual(source.tiles, [mapzenTerrains.terrarium.tileUrlTemplate]);
  });
});

describe("withTerrain", () => {
  it("adds the terrain's source and points the terrain at it", () => {
    const style: MapStyle = withTerrain(rasterStyle(), gsiTerrains.elevation, 1.5);
    assert.deepEqual(style.terrain, { source: `${TERRAIN_SOURCE_PREFIX}gsi-elevation`, exaggeration: 1.5 });
    assert.ok(`${TERRAIN_SOURCE_PREFIX}gsi-elevation` in style.sources);
  });

  it("replaces the previous terrain and flattens with null", () => {
    const raised: MapStyle = withTerrain(rasterStyle(), gsiTerrains.elevation, 1);
    const switched: MapStyle = withTerrain(raised, mapzenTerrains.terrarium, 1);
    assert.deepEqual(
      Object.keys(switched.sources).filter((id: string) => id.startsWith(TERRAIN_SOURCE_PREFIX)),
      [`${TERRAIN_SOURCE_PREFIX}mapzen-terrarium`],
    );
    const flat: MapStyle = withTerrain(switched, null, 1);
    assert.equal(flat.terrain, undefined);
    assert.ok(!Object.keys(flat.sources).some((id: string) => id.startsWith(TERRAIN_SOURCE_PREFIX)));
  });

  it("keeps the terrain once across a basemap switch that carries overlays", () => {
    const carrier: OverlayCarrier = new OverlayCarrier(failOnConflict);
    const first: MapStyle = withTerrain(carrier.carry(undefined, rasterStyle()), gsiTerrains.elevation, 1);
    const second: MapStyle = withTerrain(carrier.carry(first, rasterStyle()), gsiTerrains.elevation, 1);
    assert.deepEqual(second.terrain, first.terrain);
    assert.equal(Object.keys(second.sources).filter((id: string) => id.startsWith(TERRAIN_SOURCE_PREFIX)).length, 1);
  });

  it("rejects a negative exaggeration", () => {
    assert.throws(() => withTerrain(rasterStyle(), gsiTerrains.elevation, -1), RangeError);
  });
});

/** Map double recording the sources and terrain applyTerrain leaves, and how often it adds a source. */
class FakeTerrainTarget implements TerrainTarget {
  readonly sources: Map<string, unknown> = new Map([["basemap", { type: "raster" }]]);
  terrain: NonNullable<MapStyle["terrain"]> | null = null;
  addedCount: number = 0;

  getStyle(): { readonly sources: Readonly<Record<string, unknown>> } {
    return { sources: Object.fromEntries(this.sources) };
  }
  getSource(id: string): unknown {
    return this.sources.get(id);
  }
  addSource(id: string, source: unknown): void {
    this.addedCount += 1;
    this.sources.set(id, source);
  }
  removeSource(id: string): void {
    this.sources.delete(id);
  }
  setTerrain(terrain: NonNullable<MapStyle["terrain"]> | null): void {
    this.terrain = terrain;
  }
}

describe("applyTerrain", () => {
  it("swaps the terrain source, leaving the basemap's", () => {
    const map: FakeTerrainTarget = new FakeTerrainTarget();
    applyTerrain(map, gsiTerrains.elevation, 1);
    applyTerrain(map, mapzenTerrains.terrarium, 1);
    assert.deepEqual([...map.sources.keys()], ["basemap", `${TERRAIN_SOURCE_PREFIX}mapzen-terrarium`]);
    assert.deepEqual(map.terrain, { source: `${TERRAIN_SOURCE_PREFIX}mapzen-terrarium`, exaggeration: 1 });
  });

  it("keeps the source when only the exaggeration changes", () => {
    const map: FakeTerrainTarget = new FakeTerrainTarget();
    applyTerrain(map, gsiTerrains.elevation, 1);
    applyTerrain(map, gsiTerrains.elevation, 2);
    assert.equal(map.addedCount, 1);
    assert.deepEqual(map.terrain, { source: `${TERRAIN_SOURCE_PREFIX}gsi-elevation`, exaggeration: 2 });
  });

  it("flattens the ground and removes the terrain source", () => {
    const map: FakeTerrainTarget = new FakeTerrainTarget();
    applyTerrain(map, gsiTerrains.elevation, 1);
    applyTerrain(map, null, 1);
    assert.equal(map.terrain, null);
    assert.deepEqual([...map.sources.keys()], ["basemap"]);
  });

  it("rejects a negative exaggeration", () => {
    assert.throws(() => applyTerrain(new FakeTerrainTarget(), gsiTerrains.elevation, -1), RangeError);
  });
});
