# WebMap

## Overview

WebMap is a React map view for building web GIS tools. It shows one of several basemaps, worldwide and of Japan, flat or
over 3D terrain from elevation data of Japan or the world, lets the user switch basemaps, 3D terrain and its data from a
toolbar below the map, and reports clicks and exactly what it shows, as an extent in
Web Mercator meters that another module, such as one printing the map, can cover without gaining or losing area. A tool short of room can
hide the toolbar and lay out its controls itself, and can show the basemap in gray so its data stands out. It draws nothing over
the basemap itself: the tool built on it draws its own data on the [MapLibre GL JS](https://maplibre.org/) map it
exposes, and that data stays on top when the user switches basemaps.

Every basemap and terrain carries its attribution, which is shown on the map, and a summary of its terms. Only those
free for commercial use with attribution and without a key are included by default; restricted basemaps are in a
separate, optional package. See [docs/basemaps.md](docs/basemaps.md) for each one's coverage, zoom range and terms.

| Package | Role |
|---------|------|
| [packages/core](packages/core) | Platform-independent basemap, terrain, camera and extent model, and the default catalog of open basemaps and terrains |
| [packages/restricted-basemaps](packages/restricted-basemaps) | Optional basemaps whose terms restrict commercial use or require a key |
| [packages/web](packages/web) | React DOM `WebMap` on MapLibre GL JS, with terrain, its toolbar and extension points |
| [examples/web](examples/web) | Demo app drawing clicked points over the basemaps, optionally with a floating toolbar |

## Installation

The packages are not on the npm registry. Build them and pack them as tarballs:

```bash
npm install
npm run build
npm pack --workspace packages/core --workspace packages/web
```

Install the tarballs in your app together with the peer dependencies `react`, `react-dom` and `maplibre-gl`.
Pack and install `packages/restricted-basemaps` only if your use complies with the terms of the basemaps you take from
it ([docs/basemaps.md](docs/basemaps.md#restricted-basemaps)).

## Usage

```tsx
import { setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url"; // Vite; other bundlers emit the file their own way
import { WebMap } from "@web-map/web";

setWorkerUrl(workerUrl);

<WebMap style={{ height: 480 }} isHashSynced onMapClick={(position) => console.log(position)} />;
```

MapLibre GL JS looks for its worker next to its own module, which bundlers move, so the app points it at the emitted
worker file once. A GIS tool draws through the MapLibre map from `useMapContext`:

```tsx
function Survey({ points }: { readonly points: FeatureCollection }) {
  const { map } = useMapContext();
  useEffect(() => {
    map.addSource("survey", { type: "geojson", data: points });
    map.addLayer({ id: "survey", type: "circle", source: "survey" });
    return () => {
      map.removeLayer("survey");
      map.removeSource("survey");
    };
  }, [map, points]);
  return null;
}

<WebMap basemaps={[gsiBasemaps.photo, openFreeMapBasemaps.liberty]}>
  <Survey points={points} />
</WebMap>;
```

## Development

```bash
npm install
npm run build
npm run dev --workspace examples/web
```

`.npmrc` skips releases newer than 7 days with npm 11.10 or later; with older npm, pass `--before` with a date a week
ago when adding dependencies. GitHub Actions runs the `typecheck`, `lint`, `format:check` and `test` scripts on every
push and pull request.
