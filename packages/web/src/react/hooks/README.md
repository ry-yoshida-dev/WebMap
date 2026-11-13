# hooks

## Overview

Hooks binding the MapLibre map to React.

## Components

| Component | Responsibility |
|-----------|----------------|
| [useMapLibre.ts](useMapLibre.ts) | Creating the map, swapping basemaps and terrains, graying basemaps and carrying overlays |
| [MapAppearance.ts](MapAppearance.ts) | Basemap, grayscale and terrain kept on screen |
| [MapLibreOptions.ts](MapLibreOptions.ts) | What the map is created with |
| [MapInstance.ts](MapInstance.ts) | Lifecycle of the map |
| [MapInstanceStatus.ts](MapInstanceStatus.ts) | Loading, ready or failed |
| [MapErrorEvent.ts](MapErrorEvent.ts) | Error event of the map, with the source that failed |
| [useMapContext.ts](useMapContext.ts) | Services of the enclosing `WebMap` |
| [useMapState.ts](useMapState.ts) | A map value re-read on events |
| [useTileStatus.ts](useTileStatus.ts) | Loading and failures of the basemap's tiles |
| [TileStatus.ts](TileStatus.ts) | Idle, loading or failed |
| [useBasemapThumbnails.ts](useBasemapThumbnails.ts) | Thumbnails of basemaps, drawing style basemaps on request |
