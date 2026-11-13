# test

## Overview

Tests of the framework-independent code of `@web-map/web`, run with `node --test`.

## Components

| Component | Responsibility |
|-----------|----------------|
| [toMapStyle.test.ts](toMapStyle.test.ts) | Raster styles and style URLs |
| [toGrayscaleStyle.test.ts](toGrayscaleStyle.test.ts) | Gray rasters and colors, validated and evaluated with the MapLibre style specification |
| [formatAttributionHtml.test.ts](formatAttributionHtml.test.ts) | Attribution links and escaping |
| [OverlayCarrier.test.ts](OverlayCarrier.test.ts) | Overlays and glyphs carried across basemap switches |
| [terrain.test.ts](terrain.test.ts) | GSI elevation re-encoding, terrain sources, terrains kept across basemap switches and swapped on a loaded map |
