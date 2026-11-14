# status

## Overview

Following the first load of a map and classifying the errors MapLibre reports while loading.

## Components

| Component | Responsibility |
|-----------|----------------|
| [followFirstLoad.ts](followFirstLoad.ts) | Whether a new map loaded its first style, or why not |
| [isBasemapError.ts](isBasemapError.ts) | Whether an error concerns the basemap, rather than the terrain or the application |
| [isMissingTileError.ts](isMissingTileError.ts) | Whether an error is a tile outside the provider's coverage |
| [followFirstLoad.test.ts](followFirstLoad.test.ts) | A first style failing told from tiles failing later |
| [isBasemapError.test.ts](isBasemapError.test.ts) | Errors of the basemap told from those of the terrain and the application |
