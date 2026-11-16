# src

## Overview

Source of `@web-map/web`. The top-level directories are framework-independent code on MapLibre GL JS; [react](react)
holds the React DOM map built on them.

## Components

| Component | Responsibility |
|-----------|----------------|
| [attribution](attribution) | Credits owed by the map on screen, as HTML or plain text |
| [camera](camera) | Reading the camera and the viewport of a MapLibre map |
| [react](react) | React DOM map and its extension points |
| [status](status) | Following a map's first load, and telling the basemap's failures from others and from missing coverage |
| [style](style) | Basemaps to MapLibre styles, terrain, default glyphs and carrying overlays across styles |
| [terrain](terrain) | Terrains to MapLibre elevation sources, including GSI elevation tiles, and reading elevation tiles directly |
| [thumbnail](thumbnail) | Previews of basemaps for the basemap menu |
