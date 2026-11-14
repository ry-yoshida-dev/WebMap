# src

## Overview

Source of `@web-map/restricted-basemaps`, one file per provider.

## Components

| Component | Responsibility |
|-----------|----------------|
| [openStreetMapBasemaps.ts](openStreetMapBasemaps.ts) | openstreetmap.org standard tiles, for light use |
| [createCartoBasemaps.ts](createCartoBasemaps.ts) | CARTO Positron, Dark Matter and Voyager with your API key |
| [eoxBasemaps.ts](eoxBasemaps.ts) | EOX Sentinel-2 cloudless mosaics |
| [restrictedBasemaps.test.ts](restrictedBasemaps.test.ts) | Every basemap states a restriction; CARTO key handling |
