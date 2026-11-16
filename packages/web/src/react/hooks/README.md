# hooks

## Overview

Hooks binding the MapLibre map to React.

## Components

| Component | Responsibility |
|-----------|----------------|
| [useMapLibre.ts](useMapLibre.ts) | Creating the map, swapping basemaps and terrains, graying basemaps and carrying overlays |
| [MapAppearance.ts](MapAppearance.ts) | Basemap, grayscale and terrain kept on screen |
| [compareAppearance.ts](compareAppearance.ts) | What a map must do to show a new appearance |
| [AppearanceChange.ts](AppearanceChange.ts) | Nothing, a style reload or a terrain swap |
| [MapLibreOptions.ts](MapLibreOptions.ts) | What the map is created with |
| [MapInstance.ts](MapInstance.ts) | Lifecycle of the map |
| [MapInstanceStatus.ts](MapInstanceStatus.ts) | Loading, ready or failed |
| [MapErrorEvent.ts](MapErrorEvent.ts) | Error event of the map, with the source and tile that failed |
| [useControllableState.ts](useControllableState.ts) | A value kept by the application or by the component |
| [useMapContext.ts](useMapContext.ts) | Services of the enclosing `WebMap` |
| [useMapState.ts](useMapState.ts) | A map value re-read on events |
| [useTileStatus.ts](useTileStatus.ts) | Loading and failures of the basemap's tiles |
| [TileStatus.ts](TileStatus.ts) | Idle, loading or failed |
| [TileStatusSource.ts](TileStatusSource.ts) | What tile status follows of a map |
| [useBasemapThumbnails.ts](useBasemapThumbnails.ts) | Thumbnails of basemaps, drawing style basemaps on request |
| [useMapLibre.test.tsx](useMapLibre.test.tsx) | Creating the map again after a failure only for another basemap |
| [compareAppearance.test.ts](compareAppearance.test.ts) | Style reloads and terrain swaps told apart, by id |
| [useControllableState.test.tsx](useControllableState.test.tsx) | Values kept by the application or by the component |
| [useMapState.test.tsx](useMapState.test.tsx) | Values re-read on events and listeners removed |
| [useTileStatus.test.tsx](useTileStatus.test.tsx) | Loading, failures of the basemap and its style only, and recovering from them |
| [useBasemapThumbnails.test.tsx](useBasemapThumbnails.test.tsx) | Raster tiles, no basemap, and styles that cannot be drawn reported as failed |
| [useMapContext.test.tsx](useMapContext.test.tsx) | The error outside a `WebMap` |
