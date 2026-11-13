# src

## Overview

React app of the demo page.

## Components

| Component | Responsibility |
|-----------|----------------|
| [main.tsx](main.tsx) | Entry point: MapLibre worker and style sheet, then `App` |
| [App.tsx](App.tsx) | Page with the map, the grayscale switch, the clicked points and the area on screen or the fixed range |
| [ClickedPoints.tsx](ClickedPoints.tsx) | Overlay of clicked points |
| [ClearPointsButton.tsx](ClearPointsButton.tsx) | Button removing the clicked points |
| [FloatingToolbar.tsx](FloatingToolbar.tsx) | Toolbar floating over the map in place of the built-in one |
| [RangeButton.tsx](RangeButton.tsx) | Button fixing the area on screen as a framed range |
| `*Props.ts` | Props of the component of the same name |
| [pointsLayer.ts](pointsLayer.ts) | GeoJSON of the clicked points |
| [app.css](app.css) | Page layout |
