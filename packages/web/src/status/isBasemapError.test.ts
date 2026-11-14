import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { AJAXError, ErrorEvent } from "maplibre-gl";

import { isBasemapError } from "./isBasemapError.js";

const basemapSources: ReadonlySet<string> = new Set(["openmaptiles"]);
const isBasemapSource = (sourceId: string): boolean => basemapSources.has(sourceId);

function sourceError(sourceId: string): ErrorEvent & { readonly sourceId: string } {
  return Object.assign(new ErrorEvent(new AJAXError(500, "Server Error", "https://tiles.example/1/1/1.pbf", new Blob())), {
    sourceId,
  });
}

describe("isBasemapError", () => {
  it("counts failures of the basemap's sources only", () => {
    assert.equal(isBasemapError(sourceError("openmaptiles"), isBasemapSource, false), true);
    assert.equal(isBasemapError(sourceError("web-map-terrain-gsi"), isBasemapSource, false), false);
    assert.equal(isBasemapError(sourceError("survey"), isBasemapSource, false), false);
  });

  it("counts failed requests without a source, as of a sprite", () => {
    const sprite = new ErrorEvent(new AJAXError(404, "Not Found", "https://styles.example/sprite.json", new Blob()));
    assert.equal(isBasemapError(sprite, isBasemapSource, false), true);
  });

  it("counts any error while the basemap's style is fetched, and no application error afterwards", () => {
    const network = new ErrorEvent(new TypeError("Failed to fetch"));
    assert.equal(isBasemapError(network, isBasemapSource, true), true);
    const misuse = new ErrorEvent(new Error('Layer "survey" already exists on this map.'));
    assert.equal(isBasemapError(misuse, isBasemapSource, false), false);
  });
});
