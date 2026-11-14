# styles

## Overview

Style sheet of the map, themed through `--wmap-*` custom properties, with a dark variant following the system or
set by the map.

## Components

| Component | Responsibility |
|-----------|----------------|
| [styleSheet.ts](styleSheet.ts) | Style sheet text |
| [MapStyles.tsx](MapStyles.tsx) | Injecting it once per document |
| [MapColorScheme.ts](MapColorScheme.ts) | System, light or dark colors |
