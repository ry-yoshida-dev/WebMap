import type { ReactElement } from "react";

import { mapStyleSheet } from "./styleSheet.js";

/**
 * Injects the map's style sheet once per document, however many maps render.
 *
 * @returns The hoisted style element.
 */
export function MapStyles(): ReactElement {
  return (
    <style href="web-map" precedence="default">
      {mapStyleSheet}
    </style>
  );
}
