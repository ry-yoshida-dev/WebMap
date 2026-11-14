import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ErrorEvent } from "maplibre-gl";

import { followFirstLoad } from "./followFirstLoad.js";
import type { FirstLoadTarget } from "./followFirstLoad.js";

class FakeMap implements FirstLoadTarget {
  private readonly listeners: Map<string, Set<(event: ErrorEvent) => void>> = new Map();

  on(type: string, listener: (event: ErrorEvent) => void): void {
    this.listeners.set(type, (this.listeners.get(type) ?? new Set()).add(listener));
  }

  off(type: string, listener: (event: ErrorEvent) => void): void {
    this.listeners.get(type)?.delete(listener);
  }

  once(type: string, listener: () => void): void {
    const onFire = (): void => {
      this.off(type, onFire);
      listener();
    };
    this.on(type, onFire);
  }

  fire(type: string, event: ErrorEvent = new ErrorEvent(new Error(type))): void {
    for (const listener of [...(this.listeners.get(type) ?? [])]) {
      listener(event);
    }
  }
}

function follow(map: FakeMap): { readonly failures: string[]; readonly isLoaded: () => boolean } {
  const failures: string[] = [];
  let isLoaded: boolean = false;
  followFirstLoad(
    map,
    () => {
      isLoaded = true;
    },
    (message: string) => failures.push(message),
  );
  return { failures, isLoaded: () => isLoaded };
}

describe("followFirstLoad", () => {
  it("reports an error before the style loads as a failure", () => {
    const map: FakeMap = new FakeMap();
    const { failures, isLoaded } = follow(map);
    map.fire("error", new ErrorEvent(new Error("Style not found")));
    assert.deepEqual(failures, ["Style not found"]);
    assert.equal(isLoaded(), false);
  });

  it("reports the load and ignores errors once the style has loaded", () => {
    const map: FakeMap = new FakeMap();
    const { failures, isLoaded } = follow(map);
    map.fire("style.load");
    map.fire("error", new ErrorEvent(new Error("Tile failed")));
    map.fire("load");
    assert.deepEqual(failures, []);
    assert.equal(isLoaded(), true);
  });
});
