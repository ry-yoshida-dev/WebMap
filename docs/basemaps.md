# Basemaps and terrains

Terms summarized from each provider's pages on 2026-11-13. The summaries help choosing a basemap; they do not replace
the providers' terms, which you must follow and which may change. [Verification](#verification) records which facts
were checked against the providers' own pages and when.

## Open basemaps

In `@web-map/core`, listed together as `openBasemaps`. All are free for commercial use with attribution and without a
key.

| Export | Coverage | Zoom | Delivery | License |
|--------|----------|------|----------|---------|
| `gsiBasemaps.standard`, `.pale` | Japan; world at zoom 2–8 | 2–18 | Raster | [GSI terms](https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html) |
| `gsiBasemaps.blank` | Japan | 5–14 | Raster | GSI terms |
| `gsiBasemaps.english` | Japan | 5–11 | Raster | GSI terms |
| `gsiBasemaps.photo` | Japan; world mosaic at low zoom | 2–18 | Raster | GSI terms |
| `gsiBasemaps.relief` | Japan | 5–15 | Raster | GSI terms |
| `gsiBasemaps.hillshade` | Japan | 2–16 | Raster | GSI terms |
| `openFreeMapBasemaps.liberty`, `.bright`, `.positron`, `.dark` | World | Any (vector) | Vector style | [ODbL 1.0](https://openfreemap.org/tos/) (OpenStreetMap data) |
| `openTopoMapBasemaps.topographic` | World | 0–17 | Raster | [CC BY-SA 3.0](https://opentopomap.org/about) |
| `nasaGibsBasemaps.blueMarble`, `.blackMarble` | World | 0–8 | Raster | [NASA open data](https://www.earthdata.nasa.gov/engage/open-data-services-software-policies) |

- GSI asks for 「地理院タイル」 linking to the tile list as the credit, which WebMap shows. Standard, pale and English tiles
  at zoom 5–8 also carry GEBCO, Japan Coast Guard and VMAP0 credits listed on the
  [tile list](https://maps.gsi.go.jp/development/ichiran.html); add them when your app shows those zooms prominently.
  Tiles outside Japan answer 404, which WebMap treats as missing coverage rather than an error.
- OpenTopoMap is a best-effort service; do not overload it, for example with bulk downloads.

## Restricted basemaps

In `@web-map/restricted-basemaps`, installed separately. WebMap flags them next to the basemap menu, linking to their
terms.

| Export | Coverage | Restriction |
|--------|----------|-------------|
| `openStreetMapBasemaps.standard` | World | [OSMF tile policy](https://operations.osmfoundation.org/policies/tiles/): light use only, no bulk downloads, no service guarantee, access may be blocked. OpenFreeMap serves the same data without these limits. |
| `createCartoBasemaps(apiKey)` | World | [CARTO terms](https://carto.com/legal/basemap-terms/): API key required; a free key allows commercial use up to 1,000,000 tile requests a month. |
| `eoxBasemaps.sentinel2Cloudless2024` | World | [CC BY-NC-SA 4.0](https://cloudless.eox.at/documentation/license): non-commercial; commercial use needs a license from EOX. |
| `eoxBasemaps.sentinel2Cloudless2016` | World | Layer description says CC BY 4.0, but EOX's license summary names CC BY-NC-SA 4.0; confirm with EOX before commercial use. |

Esri, Google, Mapbox and MapTiler maps are not included: their terms require accounts or keys of their own. Define
them, or tiles of your own, with `defineRasterTileBasemap` or `defineStyleBasemap`.

## Terrains

In `@web-map/core`, listed together as `openTerrains`, GSI first. Both are free for commercial use with attribution and
without a key. Either can be shown under any basemap; when 3D terrain is on, `WebMap` raises the ground from the first
unless told otherwise.

| Export | Coverage | Zoom | Encoding | License |
|--------|----------|------|----------|---------|
| `gsiTerrains.elevation` | Japan's land, 10 m grid (DEM10B) | 1–14 | GSI elevation PNG | [GSI terms](https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html) |
| `mapzenTerrains.terrarium` | World | 0–15 | Terrarium | [Per source](https://github.com/tilezen/joerd/blob/master/docs/attribution.md) |

- MapLibre cannot decode GSI elevation tiles by itself; `@web-map/web` re-encodes them as Terrarium in the browser.
  Points without data, such as the sea, become 0 m. Tiles outside Japan answer 404 and stay flat.
- The Mapzen Terrain Tiles merge SRTM, GMTED2010, ETOPO1 and national surveys, each with its own credit; the attribution
  links to Joerd's list of them. Add the credits of the sources your app shows prominently.
- Define elevation tiles of your own with `defineTerrain`, giving their `TerrainEncoding`.

## Verification

Facts checked against the providers' own pages. Reviews take a row as settled and do not check it again until it is a
year old, or until a tile, style or terms URL stops answering. Re-check a row only then, and update its date.

| Provider | Facts | Sources | Checked |
|----------|-------|---------|---------|
| CARTO | API key required, passed as `?key=`; a free key allows commercial use up to 1,000,000 tile requests a month; proxying, server-side caching and bulk downloads prohibited | [Basemap terms](https://carto.com/legal/basemap-terms/) §8, §9.c, §12.d; [basemap-styles](https://github.com/CartoDB/basemap-styles) | 2026-11-13 |
| EOX | `s2cloudless_3857` (2016) is CC BY 4.0 and `s2cloudless-2024_3857` is CC BY-NC-SA 4.0 per the WMTS layer descriptions; the license summary names CC BY-NC-SA 4.0 without splitting by year; both layers exist with `{z}/{y}/{x}` order | [WMTS capabilities](https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml); [license summary](https://cloudless.eox.at/documentation/license) | 2026-11-13 |
| OpenFreeMap | Terms page exists; it calls the service free and caps offline downloads, but does not mention commercial use or keys | [Terms](https://openfreemap.org/tos/) | 2026-11-13 |

GSI, NASA GIBS, OpenTopoMap, the OpenStreetMap tile policy and the Mapzen Terrain Tiles were summarized when the
catalog was written but are not yet in this table.
