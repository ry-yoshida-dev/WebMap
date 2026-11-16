# attribution

## Overview

Credits the map on screen owes, and writing them as HTML for MapLibre's attribution control or as plain text for
output that cannot carry links.

## Components

| Component | Responsibility |
|-----------|----------------|
| [collectAttributions.ts](collectAttributions.ts) | Credits owed by the basemap and terrain on screen |
| [formatAttributionHtml.ts](formatAttributionHtml.ts) | Escaped attribution links |
| [formatAttributionText.ts](formatAttributionText.ts) | Attributions as plain text, for printed output |
| [collectAttributions.test.ts](collectAttributions.test.ts) | Credits without repeats, and none for no basemap |
| [formatAttributionHtml.test.ts](formatAttributionHtml.test.ts) | Attribution links, credits without a link and escaping |
| [formatAttributionText.test.ts](formatAttributionText.test.ts) | Texts joined without links |
