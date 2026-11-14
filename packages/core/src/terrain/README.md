# terrain

## Overview

What a terrain is: elevation tiles, how their pixels hold the height, whom they credit and under which terms they may be
shown. Attribution and terms share the types of [basemap](../basemap).

## Components

| Component | Responsibility |
|-----------|----------------|
| [Terrain.ts](Terrain.ts) | Elevation tiles with their encoding, zoom range, attribution and terms |
| [TerrainEncoding.ts](TerrainEncoding.ts) | Terrarium, Terrain-RGB or GSI elevation tiles |
| [defineTerrain.ts](defineTerrain.ts) | Validated terrain |
| [TerrainSpecification.ts](TerrainSpecification.ts) | Input of `defineTerrain` |
| [defineTerrain.test.ts](defineTerrain.test.ts) | Terrain definitions and the terrain catalog |
