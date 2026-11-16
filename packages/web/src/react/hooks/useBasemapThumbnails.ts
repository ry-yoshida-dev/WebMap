"use client";

import { useEffect, useState } from "react";
import { BasemapKind } from "@web-map/core";
import type { Basemap, LngLat } from "@web-map/core";

import { rasterThumbnailUrl, styleThumbnailCamera } from "../../thumbnail/thumbnailView.js";
import type { ThumbnailCamera } from "../../thumbnail/thumbnailView.js";
import { StyleThumbnailRenderer } from "../../thumbnail/StyleThumbnailRenderer.js";
import type { Thumbnail } from "../../thumbnail/Thumbnail.js";
import { ThumbnailStatus } from "../../thumbnail/ThumbnailStatus.js";

/**
 * Thumbnails of basemaps. Raster basemaps point at one of their tiles; style
 * basemaps are drawn on a hidden map, only once `isRequested` turns true, as that
 * downloads their styles and tiles. A style that cannot be drawn is reported as failed.
 *
 * @param basemaps - Basemaps to preview.
 * @param isRequested - Whether to start drawing style basemaps; it can be left true afterwards.
 * @param center - Position every thumbnail shows.
 * @returns A lookup of the thumbnail of a basemap.
 * @throws RangeError When the center is outside Web Mercator.
 */
export function useBasemapThumbnails(basemaps: readonly Basemap[], isRequested: boolean, center: LngLat): (basemap: Basemap) => Thumbnail {
  const camera: ThumbnailCamera = styleThumbnailCamera(center);
  // Images are kept by camera and style, so moving the center never shows an image of the previous one.
  const { lng, lat }: LngLat = camera.center;
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
    const shownCamera: ThumbnailCamera = { center: { lng, lat }, zoom: camera.zoom };
    let isCurrent: boolean = true;
    const drawings: readonly Promise<void>[] = styleUrlsKey.split("\n").map(async (styleUrl: string): Promise<void> => {
      const image: string | null = await renderer.render(styleUrl, shownCamera);
      if (isCurrent) {
        setDrawn((previous: ReadonlyMap<string, string | null>) => new Map(previous).set(`${lng},${lat}\n${styleUrl}`, image));
      }
    });
    // Release the hidden map and its WebGL context as soon as every style is drawn.
    void Promise.all(drawings).then(() => renderer.dispose());
    return () => {
      isCurrent = false;
      renderer.dispose();
    };
  }, [isRequested, styleUrlsKey, lng, lat, camera.zoom]);

  return (basemap: Basemap): Thumbnail => {
    switch (basemap.kind) {
      case BasemapKind.RASTER_TILES:
        return { status: ThumbnailStatus.READY, url: rasterThumbnailUrl(basemap, center) };
      case BasemapKind.NONE:
        return { status: ThumbnailStatus.EMPTY };
      case BasemapKind.STYLE: {
        const image: string | null | undefined = drawn.get(`${lng},${lat}\n${basemap.styleUrl}`);
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
