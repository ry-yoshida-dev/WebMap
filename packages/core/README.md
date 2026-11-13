# @web-map/core

## Overview

Platform-independent model of basemaps, terrains and the camera, and the default catalog of open basemaps and
terrains. Basemaps, terrains and cameras are validated when defined, so URLs are always `https` and zoom ranges and
coordinates are always in range.

## Components

| Component | Responsibility |
|-----------|----------------|
| [src/basemap](src/basemap) | Basemap types, their attribution and terms, and validating definitions |
| [src/camera](src/camera) | Positions and the camera of a map |
| [src/terrain](src/terrain) | Terrain types and how their tiles encode elevation |
| [src/catalog](src/catalog) | Open basemaps and terrains by provider, `openBasemaps` and `openTerrains` |
| [src/tile](src/tile) | Web Mercator tile grid and tile URLs |
| [test](test) | Definition, camera, catalog and tile tests |

## Examples

```ts
const tiles = defineRasterTileBasemap({
  id: "survey-2026",
  title: "Survey 2026",
  tileUrlTemplate: "https://tiles.example.com/survey/{z}/{x}/{y}.png",
  minZoom: 10,
  maxZoom: 20,
  attributions: [{ text: "Example Survey", url: "https://example.com/" }],
  usage: { license: "Internal", termsUrl: "https://example.com/terms", commercialUse: CommercialUse.ALLOWED, conditions: null },
});
```
