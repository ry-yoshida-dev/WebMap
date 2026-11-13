# @web-map/restricted-basemaps

## Overview

Optional basemaps whose terms restrict commercial use, cap usage or require a key, kept out of `@web-map/core` so that
an app offers them only by choice. Each states its restriction in `usage`, which `WebMap` flags next to the basemap
menu. Install it only if your use complies with the terms of the basemaps you take from it; see
[docs/basemaps.md](../../docs/basemaps.md#restricted-basemaps).

## Components

| Component | Responsibility |
|-----------|----------------|
| [src](src) | Restricted basemaps by provider |
| [test](test) | Checks that every basemap states its restriction |

## Examples

```tsx
<WebMap basemaps={[...openBasemaps, ...Object.values(createCartoBasemaps(cartoKey))]} />
```
