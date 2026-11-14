import { Map as MapLibreMap } from "maplibre-gl";

import { STYLE_THUMBNAIL_RENDER_SIZE } from "./thumbnailView.js";
import type { ThumbnailCamera } from "./thumbnailView.js";

/** Longest wait for a style and its tiles before drawing what has arrived. */
const RENDER_TIMEOUT_MILLISECONDS: number = 10_000;

/**
 * Draws style basemaps into images, one at a time, on a single hidden MapLibre map.
 *
 * Style basemaps are drawn from vector data, so unlike raster basemaps they have
 * no ready-made tile image to show. The hidden map is created on the first
 * request and reused, keeping to one extra WebGL context.
 */
export class StyleThumbnailRenderer {
  private container: HTMLDivElement | null = null;
  private map: MapLibreMap | null = null;
  private queue: Promise<unknown> = Promise.resolve();
  private isDisposed: boolean = false;

  /**
   * Draw a style once the styles requested before it are done.
   *
   * @param styleUrl - URL of the style document.
   * @param camera - Where to draw it.
   * @returns A PNG data URL, or null when the style could not be loaded, the hidden map could not be created, as
   *   when no WebGL context is left, or the renderer was disposed. It never rejects.
   */
  render(styleUrl: string, camera: ThumbnailCamera): Promise<string | null> {
    const drawing: Promise<string | null> = this.queue.then(() => this.draw(styleUrl, camera)).catch(() => null);
    this.queue = drawing;
    return drawing;
  }

  /** Remove the hidden map; pending and later requests resolve to null. */
  dispose(): void {
    this.isDisposed = true;
    this.map?.remove();
    this.container?.remove();
    this.map = null;
    this.container = null;
  }

  private async draw(styleUrl: string, camera: ThumbnailCamera): Promise<string | null> {
    if (this.isDisposed) {
      return null;
    }
    const map: MapLibreMap = this.showStyle(styleUrl, camera);
    const isIdle: boolean = await new Promise<boolean>((resolve: (isIdle: boolean) => void) => {
      const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
        map.off("idle", onIdle);
        resolve(false);
      }, RENDER_TIMEOUT_MILLISECONDS);
      const onIdle = (): void => {
        clearTimeout(timer);
        resolve(true);
      };
      map.once("idle", onIdle);
    });
    // dispose() clears the map while this waited.
    if (this.map !== map || (!isIdle && !map.isStyleLoaded())) {
      return null;
    }
    return map.getCanvas().toDataURL("image/png");
  }

  private showStyle(styleUrl: string, camera: ThumbnailCamera): MapLibreMap {
    const center: [number, number] = [camera.center.lng, camera.center.lat];
    if (this.map !== null) {
      this.map.jumpTo({ center, zoom: camera.zoom });
      this.map.setStyle(styleUrl, { diff: false });
      return this.map;
    }
    const container: HTMLDivElement = document.createElement("div");
    container.setAttribute("aria-hidden", "true");
    // Off screen rather than hidden, so the browser keeps drawing it.
    Object.assign(container.style, {
      position: "fixed",
      left: "-10000px",
      top: "0",
      width: `${STYLE_THUMBNAIL_RENDER_SIZE}px`,
      height: `${STYLE_THUMBNAIL_RENDER_SIZE}px`,
      pointerEvents: "none",
    });
    // MapLibre sizes its canvas from the container, so the container is in the page before the map is created.
    document.body.append(container);
    let map: MapLibreMap;
    try {
      map = new MapLibreMap({
        container,
        style: styleUrl,
        center,
        zoom: camera.zoom,
        interactive: false,
        attributionControl: false,
        fadeDuration: 0,
        // One device pixel per CSS pixel: the image is already four times the thumbnail's edge.
        pixelRatio: 1,
        canvasContextAttributes: { preserveDrawingBuffer: true },
      });
    } catch (error: unknown) {
      container.remove();
      throw error;
    }
    this.container = container;
    this.map = map;
    return map;
  }
}
