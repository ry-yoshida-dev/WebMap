import "../testing/installDom.js";

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { cleanup, render } from "@testing-library/react";

import { MapColorScheme } from "../styles/MapColorScheme.js";
import { sampleRasterBasemaps } from "../testing/sampleBasemaps.js";
import { WebMap } from "./WebMap.js";

afterEach(cleanup);

function rootClasses(colorScheme?: MapColorScheme): readonly string[] {
  // jsdom has no WebGL, so the map itself fails; the root element is still drawn.
  const { container } = render(
    <WebMap
      basemaps={[sampleRasterBasemaps.first]}
      terrains={[]}
      className="app-map"
      {...(colorScheme === undefined ? {} : { colorScheme })}
    />,
  );
  return [...(container.firstElementChild?.classList ?? [])];
}

describe("WebMap", () => {
  it("follows the system's colors unless a scheme is set", () => {
    assert.deepEqual(rootClasses(), ["wmap-root", "app-map"]);
    assert.deepEqual(rootClasses(MapColorScheme.SYSTEM), ["wmap-root", "app-map"]);
  });

  it("marks a light or dark scheme set by the application", () => {
    assert.deepEqual(rootClasses(MapColorScheme.LIGHT), ["wmap-root", "wmap-light", "app-map"]);
    assert.deepEqual(rootClasses(MapColorScheme.DARK), ["wmap-root", "wmap-dark", "app-map"]);
  });

  it("rejects a thumbnail center outside Web Mercator", () => {
    assert.throws(
      () => render(<WebMap basemaps={[sampleRasterBasemaps.first]} terrains={[]} thumbnailCenter={{ lng: 0, lat: 89 }} />),
      RangeError,
    );
  });
});
