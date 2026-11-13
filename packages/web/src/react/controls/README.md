# controls

## Overview

The toolbar below the map and its controls. The controls apps lay out in their own toolbar are exported: the basemap
and terrain menus, the usage notice, the terrain button, the readout, the tile status and the buttons.

## Components

| Component | Responsibility |
|-----------|----------------|
| [MapToolbar.tsx](MapToolbar.tsx) | Layout of the toolbar, with disabled navigation until the map loads |
| [LiveMapControls.tsx](LiveMapControls.tsx) | Controls following a loaded map |
| [BasemapPicker.tsx](BasemapPicker.tsx) | Basemap menu: a button opening a panel of thumbnails on the roomier side |
| [BasemapOption.tsx](BasemapOption.tsx) | One basemap in the panel, with its thumbnail and restriction |
| [describeRestriction.ts](describeRestriction.ts) | Label of restricted commercial use |
| [UsageNotice.tsx](UsageNotice.tsx) | Badge linking to restricted terms |
| [TerrainToggle.tsx](TerrainToggle.tsx) | Button turning 3D terrain on and off, tilting a flat view |
| [TerrainPicker.tsx](TerrainPicker.tsx) | Menu of the elevation data, disabled while 3D terrain is off |
| [PositionReadout.tsx](PositionReadout.tsx) | Position under the pointer and zoom level |
| [TileStatusIndicator.tsx](TileStatusIndicator.tsx) | Loading spinner and failure warning |
| [NavigationButtons.tsx](NavigationButtons.tsx) | Zoom out, zoom in and reset north |
| [IconButton.tsx](IconButton.tsx) | Toolbar button holding a glyph |
| `*Props.ts` | Props of the component of the same name |
