# terrain

## Overview

Terrains to the raster-dem sources MapLibre raises the ground from, swapped on a loaded map, including reading GSI
elevation tiles, which MapLibre cannot decode by itself, and reading any terrain's tiles as Terrarium pixels for layers
that need the heights themselves.

## Components

| Component | Responsibility |
|-----------|----------------|
| [toTerrainSource.ts](toTerrainSource.ts) | Terrain to a raster-dem source |
| [applyTerrain.ts](applyTerrain.ts) | Swapping the terrain of a loaded map without reloading its style |
| [requireTerrainExaggeration.ts](requireTerrainExaggeration.ts) | Check of the factor heights are multiplied by |
| [fetchTerrainTile.ts](fetchTerrainTile.ts) | One elevation tile of any terrain as Terrarium pixels, for 3D layers and profiles |
| [readElevationImage.ts](readElevationImage.ts) | Fetching an elevation tile and reading its pixels untouched |
| [terrainRgbToTerrarium.ts](terrainRgbToTerrarium.ts) | Re-encoding Mapbox Terrain-RGB pixels as Terrarium |
| [gsiElevationProtocol.ts](gsiElevationProtocol.ts) | MapLibre protocol loading GSI elevation tiles as Terrarium |
| [gsiElevationScheme.ts](gsiElevationScheme.ts) | URL scheme of that protocol |
| [gsiToTerrarium.ts](gsiToTerrarium.ts) | Re-encoding GSI elevation pixels as Terrarium |
| [terrain.test.ts](terrain.test.ts) | GSI and Terrain-RGB re-encoding, terrain sources, terrains kept across basemap switches and swapped on a loaded map |
