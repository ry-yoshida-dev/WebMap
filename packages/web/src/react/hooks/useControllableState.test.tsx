import "../testing/installDom.js";

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { act, cleanup, renderHook } from "@testing-library/react";

import { useControllableState } from "./useControllableState.js";

afterEach(cleanup);

describe("useControllableState", () => {
  it("keeps the value itself when the application leaves it", () => {
    const { result } = renderHook(() => useControllableState<string | undefined>(undefined, () => "first"));
    assert.equal(result.current[0], "first");
    act(() => result.current[1]("second"));
    assert.equal(result.current[0], "second");
  });

  it("shows only the application's value while it is given", () => {
    const { result, rerender } = renderHook(
      ({ controlled }: { readonly controlled: string | undefined }) => useControllableState(controlled, () => "initial"),
      { initialProps: { controlled: "app" } },
    );
    act(() => result.current[1]("ignored"));
    assert.equal(result.current[0], "app");
    rerender({ controlled: "changed by app" });
    assert.equal(result.current[0], "changed by app");
  });

  it("reads the initial value once", () => {
    let reads: number = 0;
    const { rerender } = renderHook(() =>
      useControllableState<boolean>(undefined, () => {
        reads += 1;
        return false;
      }),
    );
    rerender();
    assert.equal(reads, 1);
  });
});
