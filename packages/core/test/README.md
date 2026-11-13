# test

## Overview

Tests of `@web-map/core`, run with `node --test`.

## Components

| Component | Responsibility |
|-----------|----------------|
| [defineRasterTileBasemap.test.ts](defineRasterTileBasemap.test.ts) | Template placeholders, `https` URLs and zoom ranges |
| [defineStyleBasemap.test.ts](defineStyleBasemap.test.ts) | Style URLs |
| [defineTerrain.test.ts](defineTerrain.test.ts) | Terrain definitions and the terrain catalog |
| [defineMapCamera.test.ts](defineMapCamera.test.ts) | Coordinate, zoom and pitch ranges, bearing normalization |
| [openBasemaps.test.ts](openBasemaps.test.ts) | Unique ids and unrestricted terms of the catalog |
| [tile.test.ts](tile.test.ts) | Tiles of positions, tile centers and tile URLs |
| [projection.test.ts](projection.test.ts) | Web Mercator meters against pyproj, and meters per pixel |
| [viewport.test.ts](viewport.test.ts) | Viewport extents and corners, and cameras restoring extents |
