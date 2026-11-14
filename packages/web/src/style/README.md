# style

## Overview

MapLibre style documents of basemaps, the terrain set on them, and the overlays carried between them.

## Components

| Component | Responsibility |
|-----------|----------------|
| [toMapStyle.ts](toMapStyle.ts) | Basemap to a style document or style URL |
| [toGrayscaleStyle.ts](toGrayscaleStyle.ts) | Basemap style in shades of gray |
| [withTerrain.ts](withTerrain.ts) | Raising a style's ground from a terrain, or flattening it |
| [terrainSourceId.ts](terrainSourceId.ts) | Id of the source a terrain is raised from |
| [formatAttributionHtml.ts](formatAttributionHtml.ts) | Escaped attribution links |
| [OverlayCarrier.ts](OverlayCarrier.ts) | Moving the application's sources, layers and glyphs onto the next basemap's style |
| [OverlayConflictError.ts](OverlayConflictError.ts) | Overlays left off because the basemap uses the same ids |
| [MapStyle.ts](MapStyle.ts) | Style document type of MapLibre GL JS |
| [OverlayCarrier.test.ts](OverlayCarrier.test.ts) | Overlays and glyphs carried across basemap switches and repeated transforms, conflicting ids and the basemap's sources |
| [formatAttributionHtml.test.ts](formatAttributionHtml.test.ts) | Attribution links and escaping |
| [toGrayscaleStyle.test.ts](toGrayscaleStyle.test.ts) | Gray rasters and colors, validated and evaluated with the MapLibre style specification |
| [toMapStyle.test.ts](toMapStyle.test.ts) | Raster styles and style URLs |
