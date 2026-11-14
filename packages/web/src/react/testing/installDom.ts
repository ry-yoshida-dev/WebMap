import { JSDOM } from "jsdom";

/**
 * Give Node the browser globals React DOM and Testing Library need, from a jsdom window.
 *
 * Import it before React DOM, as the first import of a test. Globals Node already has, such as `navigator`, are kept.
 */
const dom: JSDOM = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost/", pretendToBeVisual: true });

for (const name of Object.getOwnPropertyNames(dom.window)) {
  if (!(name in globalThis)) {
    Object.defineProperty(globalThis, name, { configurable: true, get: (): unknown => Reflect.get(dom.window, name) });
  }
}
Object.defineProperty(globalThis, "window", { configurable: true, value: dom.window });
// Tells React that updates are wrapped in `act`, as Testing Library does.
Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", { configurable: true, writable: true, value: true });
