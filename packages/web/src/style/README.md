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
| [BasemapOwnership.ts](BasemapOwnership.ts) | Sources and layers that came with a basemap |
| [MapStyle.ts](MapStyle.ts) | Style document type of MapLibre GL JS |
