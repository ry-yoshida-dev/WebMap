import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { toAttributionControl } from "./toAttributionControl.js";

describe("toAttributionControl", () => {
  it("leaves the choice to MapLibre unless the application makes it", () => {
    assert.deepEqual(toAttributionControl(null), {});
    assert.deepEqual(toAttributionControl(true), { compact: true });
    assert.deepEqual(toAttributionControl(false), { compact: false });
  });
});
