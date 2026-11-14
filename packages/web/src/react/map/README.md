# map

## Overview

The `WebMap` component and what it offers its children.

## Components

| Component | Responsibility |
|-----------|----------------|
| [WebMap.tsx](WebMap.tsx) | Map with its optional toolbar |
| [WebMapProps.ts](WebMapProps.ts) | Basemaps, terrains, initial view, callbacks and presentation |
| [MapContext.ts](MapContext.ts) | Context serving children |
| [MapContextValue.ts](MapContextValue.ts) | MapLibre map, basemaps, terrains and changing them, labels and toolbar slot |
| [MissingMapContextError.ts](MissingMapContextError.ts) | Error of a hook or component used outside a `WebMap` |
| [MapLabels.ts](MapLabels.ts) | Text of controls and messages |
| [defaultMapLabels.ts](defaultMapLabels.ts) | English labels |
