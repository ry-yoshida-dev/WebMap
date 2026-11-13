# terrain

## Overview

Terrains to the raster-dem sources MapLibre raises the ground from, swapped on a loaded map, including reading GSI elevation tiles, which
MapLibre cannot decode by itself.

## Components

| Component | Responsibility |
|-----------|----------------|
| [toTerrainSource.ts](toTerrainSource.ts) | Terrain to a raster-dem source |
| [applyTerrain.ts](applyTerrain.ts) | Swapping the terrain of a loaded map without reloading its style |
| [requireTerrainExaggeration.ts](requireTerrainExaggeration.ts) | Check of the factor heights are multiplied by |
| [gsiElevationProtocol.ts](gsiElevationProtocol.ts) | MapLibre protocol loading GSI elevation tiles as Terrarium |
| [gsiElevationScheme.ts](gsiElevationScheme.ts) | URL scheme of that protocol |
| [gsiToTerrarium.ts](gsiToTerrarium.ts) | Re-encoding GSI elevation pixels as Terrarium |
