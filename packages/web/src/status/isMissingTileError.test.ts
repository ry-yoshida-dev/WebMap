import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { AJAXError, ErrorEvent } from "maplibre-gl";

import { isMissingTileError } from "./isMissingTileError.js";
import type { MapErrorEvent } from "../react/hooks/MapErrorEvent.js";

function errorEvent(status: number, extra: { readonly sourceId?: string; readonly tile?: unknown }): MapErrorEvent {
  return Object.assign(new ErrorEvent(new AJAXError(status, "", "https://tiles.example/x", new Blob())), extra);
}

describe("isMissingTileError", () => {
  it("accepts tiles the provider does not have", () => {
    assert.equal(isMissingTileError(errorEvent(404, { sourceId: "basemap", tile: {} })), true);
    assert.equal(isMissingTileError(errorEvent(204, { sourceId: "basemap", tile: {} })), true);
  });

  it("rejects a missing style document and failing tiles", () => {
    assert.equal(isMissingTileError(errorEvent(404, {})), false);
    assert.equal(isMissingTileError(errorEvent(500, { sourceId: "basemap", tile: {} })), false);
  });
});
