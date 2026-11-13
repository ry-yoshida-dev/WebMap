# test

## Overview

Tests of the framework-independent code of `@web-map/web`, run with `node --test`.

## Components

| Component | Responsibility |
|-----------|----------------|
| [toMapStyle.test.ts](toMapStyle.test.ts) | Raster styles and style URLs |
| [toGrayscaleStyle.test.ts](toGrayscaleStyle.test.ts) | Gray rasters and colors, validated and evaluated with the MapLibre style specification |
| [formatAttributionHtml.test.ts](formatAttributionHtml.test.ts) | Attribution links and escaping |
| [OverlayCarrier.test.ts](OverlayCarrier.test.ts) | Overlays and glyphs carried across basemap switches, conflicting ids and the basemap's sources |
| [isBasemapError.test.ts](isBasemapError.test.ts) | Errors of the basemap told from those of the terrain and the application |
| [followFirstLoad.test.ts](followFirstLoad.test.ts) | A first style failing told from tiles failing later |
| [terrain.test.ts](terrain.test.ts) | GSI elevation re-encoding, terrain sources, terrains kept across basemap switches and swapped on a loaded map |
