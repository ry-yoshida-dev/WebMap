# @web-map/web

## Overview

React DOM `WebMap` on MapLibre GL JS. The map fills the space it is given; the toolbar below it holds the basemap menu,
which opens a panel of thumbnails, with a notice for restricted terms, the 3D terrain button and elevation data menu, extension controls, the position under the pointer, the zoom level, tile loading
and failure status, and zoom and north buttons. Attribution and a scale bar sit on the map; MapLibre folds the attribution behind a button on narrow maps, and
`isAttributionCompact` folds it always, open until the map is first dragged, or never. Children extend it: they
draw on the MapLibre map from `useMapContext`, and their overlays are carried onto the next basemap when the user
switches. Give overlays ids no basemap uses: an overlay sharing an id with the next basemap's sources or layers is
left off it and reported as an `OverlayConflictError` `error` event of the map. Overlays are carried above all of the next
basemap's layers, so one placed beneath the basemap's labels with `beforeId` ends up over them after a switch. The menu's thumbnails show the area
around Tokyo, which every bundled basemap covers; set `thumbnailCenter` to a place your own basemaps cover. The map's style stays loaded while the basemap changes, so overlays can be updated at any time, and images
added with `map.addImage` are kept. Raster basemaps have no glyphs of their own: give `glyphsUrl`, with `{fontstack}` and `{range}`, so an overlay with
text renders over every basemap that has none, raster basemaps and no basemap included, from the first style on. Set `isGrayscale` to show the basemap in shades of gray so overlays stand out; overlays, sprite icons and
colors written as legacy `stops` functions keep their colors. The toolbar follows the system's light or dark
preference; set `colorScheme` to `MapColorScheme.LIGHT` or `MapColorScheme.DARK` to follow the app's own setting.

The 3D terrain button raises the ground, tilting the map if it is viewed from straight above, and the menu beside it
chooses the elevation data: GSI elevation tiles, covering Japan, by default, or worldwide Mapzen Terrain Tiles. Any
basemap can be shown over either. `terrains`, `terrainId` and `onTerrainChange` work as their basemap counterparts do,
and `isTerrainShown`, `initialIsTerrainShown` and `onTerrainShownChange` do the same for the button; 3D terrain starts
off. The terrain stays when the basemap changes. To stand 3D objects on the ground, read the height with
`map.queryTerrainElevation`, which includes `terrainExaggeration` and returns null while 3D terrain is off. A layer
that needs the elevation itself, such as a 3D layer drawing the ground's depth, gets one tile of any terrain as
Terrarium pixels from `fetchTerrainTile`, GSI re-encoding included.

The map's style is a complete document: `map.getStyle()` holds the basemap, its grayscale, the terrain and the
overlays, so a second map created from it, as for rendering a print at a higher resolution, shows the same, provided
the page has created a `WebMap` so the GSI elevation protocol is registered.

Offer `noBasemap` from `@web-map/core` among the `basemaps` to let users see their data alone: it has an empty swatch in
the menu and no credit or terms. A basemap a user added by an address, with `defineRasterTileBasemap`, may be a WMS
(`{bbox-epsg-3857}` in the URL, which MapLibre and the menu's thumbnails fill with the tile's bounding box), may have
credits without a link and `CommercialUse.UNKNOWN` terms, shown as "Terms unknown", and may be `http` when defined with
`isHttpAllowed`; `https` stays the default, as a page served over `https` cannot load `http` tiles.

An app listing basemaps in a panel of its own gets the menu's previews from `useBasemapThumbnails(basemaps, isRequested,
center)`, which needs no `WebMap` or context: raster basemaps give the URL of one of their tiles at once, and style
basemaps, such as OpenFreeMap, are drawn on a hidden map once `isRequested` is true. It returns a lookup from a basemap
to a `Thumbnail`, a `ThumbnailStatus` of `PENDING`, `READY` with an image `url`, `EMPTY` for no basemap or `FAILED`;
show an empty swatch or a placeholder for the last two. `center` is the position every thumbnail shows, such as the
map's `thumbnailCenter`.

Where the screen has no room for the bar, set `isToolbarShown={false}` and lay out the exported controls
(`BasemapPicker`, `UsageNotice`, `TerrainToggle`, `TerrainPicker`, `PositionReadout`, `TileStatusIndicator`, `NavigationButtons`, `IconButton`) yourself.
`useMapContext` gives them the map, the basemaps and terrains, the chosen ones, whether 3D terrain is on and its
exaggeration, the functions changing them, the credits the map on screen owes (`attributions`, which
`formatAttributionText` writes as plain text for printed output), the status of the basemap's tiles and the labels. The map is the
containing block of its children, so absolutely positioned controls float over it. To keep the basemap choice in the
app's state, pass `basemapId` and update it from `onBasemapChange`. Basemaps and terrains are told apart by id and
by the URLs they load, so building new objects for them on every render reloads nothing, while one redefined under
its id, as with a new API key, loads from its new URL. When the first basemap cannot be shown, the map shows
the error, and choosing another basemap tries again. The types of `@web-map/core` that the props use, such as `Basemap`,
`Terrain` and `MapViewport`, are exported from this package too.
Modules using React state, context or events are marked `"use client"`, so React Server Components frameworks such
as the Next.js App Router can import them; callbacks such as `onMapClick` still have to come from a client component.

`onViewportChange` reports exactly what the map shows, so that another module, such as one printing the map, covers
the same area: the size in CSS pixels, the corners, and, while the map faces north and is not tilted, the extent as a
rectangle of Web Mercator (EPSG:3857) meters. The extent's width over the pixel width is the resolution. To hand on a
range the user fixed rather than the screen, keep that extent and show it with `MapExtentFrame`, which dims the rest
of the map; `cameraForExtent` from `@web-map/core` brings the range back into view.

## Components

| Component | Responsibility |
|-----------|----------------|
| [src/react/map](src/react/map) | `WebMap`, its props and labels, and the context offered to children |
| [src/react/controls](src/react/controls) | Toolbar, basemap menu, usage notice, 3D terrain button and menu, readout, tile status and buttons |
| [src/react/extensions](src/react/extensions) | `MapControlSlot`, placing children's controls in the built-in toolbar, and `MapExtentFrame` |
| [src/react/hooks](src/react/hooks) | `useMapContext` and `useMapState`, and the map's lifecycle, tile status and thumbnails behind `WebMap` |
| [src/react/icons](src/react/icons) | Glyphs of the controls |
| [src/react/styles](src/react/styles) | Style sheet themed through `--wmap-*` custom properties |
| [src/style](src/style) | Basemaps to MapLibre styles, grayscale styles, terrain, attribution HTML and carrying overlays across styles |
| [src/terrain](src/terrain) | Terrains to MapLibre elevation sources, re-encoding GSI elevation tiles |
| [src/camera](src/camera) | Reading the camera of a MapLibre map |
| [src/status](src/status) | Following a map's first load, and telling the basemap's failures from others and from missing coverage |
| [src/thumbnail](src/thumbnail) | Previews of basemaps: a tile of a raster basemap, or a style drawn on a hidden map |

## Examples

An extension adding a toolbar button:

```tsx
function FitJapan() {
  const { map } = useMapContext();
  return (
    <MapControlSlot>
      <IconButton label="Fit Japan" onClick={() => map.fitBounds([[122, 24], [146, 46]])}>
        <Icon name={IconName.LAYERS} />
      </IconButton>
    </MapControlSlot>
  );
}
```

A toolbar of its own, floating over the top of a map whose built-in toolbar is hidden:

```tsx
function FloatingToolbar() {
  const { map, basemaps, basemap, changeBasemap, labels } = useMapContext();
  return (
    <div style={{ position: "absolute", top: 8, left: 8, display: "flex", background: "white" }}>
      <BasemapPicker basemaps={basemaps} basemap={basemap} onChange={changeBasemap} labels={labels} />
      <NavigationButtons map={map} labels={labels} />
    </div>
  );
}

<WebMap isToolbarShown={false}>
  <FloatingToolbar />
</WebMap>;
```

A marker standing on the ground shown, wherever the terrain or its exaggeration puts it:

```tsx
const IDLE: readonly (keyof MapEventType)[] = ["idle"];

function GroundHeight({ position }: { readonly position: LngLat }) {
  const { map, isTerrainShown } = useMapContext();
  const height = useMapState(map, IDLE, (map) => map.queryTerrainElevation([position.lng, position.lat]) ?? 0);
  return <span>{isTerrainShown ? `${height.toFixed(1)} m on screen` : "Flat ground"}</span>;
}
```
