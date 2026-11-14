# projection

## Overview

Web Mercator (EPSG:3857), the projection maps are drawn in and extents are measured in.

## Components

| Component | Responsibility |
|-----------|----------------|
| [WebMercatorPoint.ts](WebMercatorPoint.ts) | Position in meters |
| [toWebMercator.ts](toWebMercator.ts) | Longitude and latitude to meters |
| [fromWebMercator.ts](fromWebMercator.ts) | Meters to longitude and latitude |
| [webMercatorResolution.ts](webMercatorResolution.ts) | Meters per CSS pixel at a MapLibre zoom level |
| [webMercatorSphere.ts](webMercatorSphere.ts) | Radius, world size and latitude limit |
| [webMercatorZoom.ts](webMercatorZoom.ts) | Highest zoom level |
| [projection.test.ts](projection.test.ts) | Web Mercator meters against pyproj, and meters per pixel |
