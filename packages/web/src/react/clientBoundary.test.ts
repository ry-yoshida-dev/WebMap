import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

/** Hooks, context and event handlers, which only run in a client component. */
const CLIENT_ONLY: RegExp = /\buse[A-Z]\w*\(|\bcreateContext\(|\bon[A-Z]\w*=\{/;
const DIRECTIVE: string = '"use client";';

function sourceFiles(): readonly string[] {
  return readdirSync(import.meta.dirname, { recursive: true, encoding: "utf8" }).filter(
    (path: string) => /\.tsx?$/.test(path) && !/\.test\.tsx?$/.test(path) && !path.startsWith("testing"),
  );
}

describe("client boundary", () => {
  it('marks every module using hooks, context or event handlers with "use client"', () => {
    const unmarked: readonly string[] = sourceFiles().filter((path: string) => {
      const source: string = readFileSync(join(import.meta.dirname, path), "utf8");
      return CLIENT_ONLY.test(source) && !source.startsWith(DIRECTIVE);
    });
    assert.deepEqual(unmarked, []);
  });
});
