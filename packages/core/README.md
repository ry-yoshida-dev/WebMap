# @web-map/core

## Overview

Platform-independent model of basemaps, terrains and the camera, and the default catalog of open basemaps and
terrains. Basemaps, terrains and cameras are validated when defined, so URLs are `https` unless a basemap is defined to accept `http`, and zoom ranges and
coordinates are always in range.

## Components

| Component | Responsibility |
|-----------|----------------|
| [src/basemap](src/basemap) | Basemap types, their attribution and terms, and validating definitions |
| [src/camera](src/camera) | Positions and the camera of a map |
| [src/terrain](src/terrain) | Terrain types and how their tiles encode elevation |
| [src/catalog](src/catalog) | Open basemaps and terrains by provider, `openBasemaps` and `openTerrains` |
| [src/tile](src/tile) | Web Mercator tile grid and tile URLs |

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

// A WMS the user typed in: no terms to link, the credit as plain text, tiles asked for by their bounding box.
const wms = defineRasterTileBasemap({
  id: "added-wms",
  title: "Added service",
  tileUrlTemplate:
    "http://wms.example.com/map?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=roads&STYLES=&FORMAT=image/png&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}",
  minZoom: 0,
  maxZoom: 18,
  attributions: [{ text: "Example Survey", url: null }],
  usage: { license: "Unknown", termsUrl: null, commercialUse: CommercialUse.UNKNOWN, conditions: null },
  isHttpAllowed: true,
});
```
