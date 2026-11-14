# camera

## Overview

Positions on the earth and what part of it a map shows.

## Components

| Component | Responsibility |
|-----------|----------------|
| [LngLat.ts](LngLat.ts) | Longitude and latitude in WGS 84 degrees |
| [MapCamera.ts](MapCamera.ts) | Center, zoom, bearing and pitch |
| [defineMapCamera.ts](defineMapCamera.ts) | Validated camera |
| [MapCameraSpecification.ts](MapCameraSpecification.ts) | Input of `defineMapCamera` |
| [MapExtent.ts](MapExtent.ts) | Rectangle of Web Mercator meters a map shows |
| [defineMapExtent.ts](defineMapExtent.ts) | Validated extent |
| [MapViewport.ts](MapViewport.ts) | Camera, size, corners and extent of a map |
| [ViewportCorners.ts](ViewportCorners.ts) | Corners of a viewport |
| [describeFlatViewport.ts](describeFlatViewport.ts) | Viewport of a map that is not tilted |
| [cameraForExtent.ts](cameraForExtent.ts) | Camera fitting an extent in a map of a given size |
| [defineMapCamera.test.ts](defineMapCamera.test.ts) | Coordinate, zoom and pitch ranges, bearing normalization |
| [viewport.test.ts](viewport.test.ts) | Viewport extents and corners, and cameras restoring extents |
