import "../react/testing/installDom.js";

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { StyleThumbnailRenderer } from "./StyleThumbnailRenderer.js";
import { DEFAULT_THUMBNAIL_CENTER, styleThumbnailCamera } from "./thumbnailView.js";

describe("StyleThumbnailRenderer", () => {
  it("leaves no hidden container behind when the map cannot be created", async () => {
    // jsdom has no WebGL, so the hidden map cannot be created, as when a browser has no context left.
    const renderer: StyleThumbnailRenderer = new StyleThumbnailRenderer();
    assert.equal(await renderer.render("https://tiles.example/first.json", styleThumbnailCamera(DEFAULT_THUMBNAIL_CENTER)), null);
    assert.equal(await renderer.render("https://tiles.example/second.json", styleThumbnailCamera(DEFAULT_THUMBNAIL_CENTER)), null);
    assert.equal(document.body.querySelector("[aria-hidden=true]"), null);
    renderer.dispose();
  });
});
