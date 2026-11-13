import { useEffect, useState } from "react";
import { BasemapKind } from "@web-map/core";
import type { Basemap } from "@web-map/core";

import { rasterThumbnailUrl } from "../../thumbnail/thumbnailView.js";
import { StyleThumbnailRenderer } from "../../thumbnail/StyleThumbnailRenderer.js";
import type { Thumbnail } from "../../thumbnail/Thumbnail.js";
import { ThumbnailStatus } from "../../thumbnail/ThumbnailStatus.js";

/**
 * Thumbnails of basemaps. Raster basemaps point at one of their tiles; style
 * basemaps are drawn on a hidden map, only once `isRequested` turns true, as that
 * downloads their styles and tiles.
 *
 * @param basemaps - Basemaps to preview.
 * @param isRequested - Whether to start drawing style basemaps; it can be left true afterwards.
 * @returns A lookup of the thumbnail of a basemap.
 */
export function useBasemapThumbnails(basemaps: readonly Basemap[], isRequested: boolean): (basemap: Basemap) => Thumbnail {
  const [drawn, setDrawn] = useState<ReadonlyMap<string, string | null>>(new Map());
  const styleUrls: readonly string[] = basemaps.flatMap((basemap: Basemap) =>
    basemap.kind === BasemapKind.STYLE ? [basemap.styleUrl] : [],
  );
  const styleUrlsKey: string = styleUrls.join("\n");

  useEffect(() => {
    if (!isRequested || styleUrlsKey === "") {
      return undefined;
    }
    const renderer: StyleThumbnailRenderer = new StyleThumbnailRenderer();
    let isCurrent: boolean = true;
    for (const styleUrl of styleUrlsKey.split("\n")) {
      void renderer.render(styleUrl).then((image: string | null) => {
        if (isCurrent) {
          setDrawn((previous: ReadonlyMap<string, string | null>) => new Map(previous).set(styleUrl, image));
        }
      });
    }
    return () => {
      isCurrent = false;
      renderer.dispose();
    };
  }, [isRequested, styleUrlsKey]);

  return (basemap: Basemap): Thumbnail => {
    switch (basemap.kind) {
      case BasemapKind.RASTER_TILES:
        return { status: ThumbnailStatus.READY, url: rasterThumbnailUrl(basemap) };
      case BasemapKind.STYLE: {
        const image: string | null | undefined = drawn.get(basemap.styleUrl);
        if (image === undefined) {
          return { status: ThumbnailStatus.PENDING };
        }
        return image === null ? { status: ThumbnailStatus.FAILED } : { status: ThumbnailStatus.READY, url: image };
      }
      default: {
        const unreachable: never = basemap;
        throw new TypeError(`Unknown basemap ${String(unreachable)}`);
      }
    }
  };
}
