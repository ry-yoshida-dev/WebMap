# tile

## Overview

The Web Mercator tile grid that raster basemaps are served on.

## Components

| Component | Responsibility |
|-----------|----------------|
| [TileCoordinate.ts](TileCoordinate.ts) | Zoom, column and row of a tile |
| [requireTileOnGrid.ts](requireTileOnGrid.ts) | Check that a tile exists on the grid of its zoom |
| [tileContaining.ts](tileContaining.ts) | Tile a position falls in |
| [tileCenter.ts](tileCenter.ts) | Position at the middle of a tile |
| [tileExtent.ts](tileExtent.ts) | Rectangle a tile covers in Web Mercator meters |
| [formatTileUrl.ts](formatTileUrl.ts) | URL of one tile of a raster basemap |
| [tile.test.ts](tile.test.ts) | Tiles of positions, tile centers and extents, and tile URLs |
