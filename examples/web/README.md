# examples/web

## Overview

Demo of `@web-map/web`. Clicked points are drawn as an overlay, the way a GIS tool draws its data, and stay on top when
the basemap changes. The page offers the open basemaps; add `?restricted` to the URL to also offer OpenStreetMap
standard tiles and Sentinel-2 cloudless 2024, and `?floating` to replace the built-in toolbar with one the app builds
from the exported controls, floating over the map. A checkbox turns the basemap gray while the points keep their color. The mountain button turns 3D terrain on, and the menu beside it
switches its elevation data between GSI elevation tiles and Mapzen Terrain Tiles.

## Components

| Component | Responsibility |
|-----------|----------------|
| [src](src) | The React app |
| [index.html](index.html) | Page loading the app |
| [vite.config.ts](vite.config.ts) | Vite configuration with the React plugin |

## Examples

```bash
npm run build
npm run dev --workspace examples/web
```
