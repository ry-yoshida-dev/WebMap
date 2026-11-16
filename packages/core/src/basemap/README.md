# basemap

## Overview

What a basemap is: how it is delivered, whom it credits and under which terms it may be shown.

## Components

| Component | Responsibility |
|-----------|----------------|
| [Basemap.ts](Basemap.ts) | Union of the basemap kinds |
| [BasemapKind.ts](BasemapKind.ts) | Raster tiles, a style document or no basemap |
| [BasemapIdentity.ts](BasemapIdentity.ts) | Id, title, attribution and terms shared by every basemap and terrain |
| [RasterTileBasemap.ts](RasterTileBasemap.ts) | Basemap of Web Mercator raster tiles |
| [StyleBasemap.ts](StyleBasemap.ts) | Basemap described by a MapLibre style document |
| [EmptyBasemap.ts](EmptyBasemap.ts) | The choice of showing no basemap |
| [Attribution.ts](Attribution.ts) | Credit linking to its source |
| [BasemapUsage.ts](BasemapUsage.ts) | License, terms URL and conditions |
| [CommercialUse.ts](CommercialUse.ts) | Whether commercial products may show the basemap |
| [defineRasterTileBasemap.ts](defineRasterTileBasemap.ts) | Validated raster tile basemap |
| [RasterTileBasemapSpecification.ts](RasterTileBasemapSpecification.ts) | Input of `defineRasterTileBasemap` |
| [defineEmptyBasemap.ts](defineEmptyBasemap.ts) | Validated empty basemap |
| [EmptyBasemapSpecification.ts](EmptyBasemapSpecification.ts) | Input of `defineEmptyBasemap` |
| [TileUrlRules.ts](TileUrlRules.ts) | What a tile URL template may be beyond the default: `http`, a bounding box placeholder |
| [boundingBoxPlaceholder.ts](boundingBoxPlaceholder.ts) | `{bbox-epsg-3857}`, a WMS tile address in a URL template |
| [defineStyleBasemap.ts](defineStyleBasemap.ts) | Validated style basemap |
| [StyleBasemapSpecification.ts](StyleBasemapSpecification.ts) | Input of `defineStyleBasemap` |
| [requireBasemapIdentity.ts](requireBasemapIdentity.ts) | Checks of the shared fields, also of terrains |
| [requireTileRange.ts](requireTileRange.ts) | Checks of a tile template, zoom range and tile size, also of terrains |
| [requireHttpsUrl.ts](requireHttpsUrl.ts) | Check that a URL is `https`, or `http` where allowed |
| [BasemapDefinitionError.ts](BasemapDefinitionError.ts) | Error of a malformed basemap or terrain definition |
| [defineRasterTileBasemap.test.ts](defineRasterTileBasemap.test.ts) | Template placeholders, bounding box templates, `https` and allowed `http` URLs, zoom ranges, and credits and terms without a link |
| [defineStyleBasemap.test.ts](defineStyleBasemap.test.ts) | Style URLs |
| [defineEmptyBasemap.test.ts](defineEmptyBasemap.test.ts) | The empty basemap and its blank id or title |
