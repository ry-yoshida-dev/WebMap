# src

## Overview

Source of `@web-map/web`. The top-level directories are framework-independent code on MapLibre GL JS; [react](react)
holds the React DOM map built on them.

## Components

| Component | Responsibility |
|-----------|----------------|
| [camera](camera) | Reading the camera and the viewport of a MapLibre map |
| [react](react) | React DOM map and its extension points |
| [status](status) | Telling missing coverage from failed tiles |
| [style](style) | Basemaps to MapLibre styles, terrain, attribution HTML and carrying overlays across styles |
| [terrain](terrain) | Terrains to MapLibre elevation sources, including GSI elevation tiles |
| [thumbnail](thumbnail) | Previews of basemaps for the basemap menu |
