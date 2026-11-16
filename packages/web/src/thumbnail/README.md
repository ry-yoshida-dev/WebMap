# thumbnail

## Overview

Small previews of basemaps for the basemap menu: a raster basemap shows one of its tiles, and a style basemap is drawn
on a hidden map; no basemap has an empty swatch. All frame the same area, around Tokyo unless
the map is given another `thumbnailCenter`.

## Components

| Component | Responsibility |
|-----------|----------------|
| [thumbnailView.ts](thumbnailView.ts) | Size and framing of thumbnails, and the tile a raster basemap shows |
| [StyleThumbnailRenderer.ts](StyleThumbnailRenderer.ts) | Drawing style basemaps into images on one hidden map |
| [Thumbnail.ts](Thumbnail.ts) | A thumbnail and its image |
| [ThumbnailStatus.ts](ThumbnailStatus.ts) | Pending, ready, empty or failed |
| [StyleThumbnailRenderer.test.ts](StyleThumbnailRenderer.test.ts) | No hidden container left when the map cannot be created |
