import "../testing/installDom.js";

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { cleanup, renderHook } from "@testing-library/react";

import { MissingMapContextError } from "../map/MissingMapContextError.js";
import { useMapContext } from "./useMapContext.js";

afterEach(cleanup);

describe("useMapContext", () => {
  it("throws a MissingMapContextError outside a WebMap", () => {
    const originalError = console.error;
    // React logs the error it rethrows; keep the test output clean.
    console.error = (): void => undefined;
    try {
      assert.throws(() => renderHook(() => useMapContext()), MissingMapContextError);
    } finally {
      console.error = originalError;
    }
  });
});
