import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";

import { App } from "./App.js";
import "./app.css";

// MapLibre finds its worker next to its own module, which a bundler moves; point it at the emitted file.
setWorkerUrl(workerUrl);

const root: HTMLElement | null = document.getElementById("root");
if (root === null) {
  throw new Error("The page has no #root element");
}
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
