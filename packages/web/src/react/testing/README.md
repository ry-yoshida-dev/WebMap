# testing

## Overview

Helpers for the React tests of `@web-map/web`; they are not part of the published package.

## Components

| Component | Responsibility |
|-----------|----------------|
| [installDom.ts](installDom.ts) | Browser globals from jsdom, imported before React DOM |
| [FakeMap.ts](FakeMap.ts) | Map whose events a test fires |
| [sampleBasemaps.ts](sampleBasemaps.ts) | Raster and style basemaps of an imaginary provider |
