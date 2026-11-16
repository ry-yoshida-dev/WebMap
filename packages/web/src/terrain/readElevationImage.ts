import { AJAXError } from "maplibre-gl";

/**
 * Fetch an elevation tile and read its pixels untouched: no color management and no premultiplied alpha, which would
 * change the values that encode heights.
 *
 * @param url - `https` URL of the tile image.
 * @param signal - Aborts the request.
 * @returns The RGBA pixels.
 * @throws AJAXError When the server answers with an error, as 404 for a tile outside a provider's coverage.
 * @throws DOMException When a 2D canvas is not available to read the pixels.
 */
export async function readElevationImage(url: string, signal?: AbortSignal): Promise<ImageData> {
  const response: Response = await fetch(url, signal === undefined ? {} : { signal });
  if (!response.ok) {
    throw new AJAXError(response.status, response.statusText, url, await response.blob());
  }
  const tile: ImageBitmap = await createImageBitmap(await response.blob(), { colorSpaceConversion: "none", premultiplyAlpha: "none" });
  const canvas: OffscreenCanvas = new OffscreenCanvas(tile.width, tile.height);
  const context: OffscreenCanvasRenderingContext2D | null = canvas.getContext("2d", { willReadFrequently: true });
  if (context === null) {
    tile.close();
    throw new DOMException("A 2D canvas is not available to decode elevation tiles", "NotSupportedError");
  }
  context.drawImage(tile, 0, 0);
  tile.close();
  return context.getImageData(0, 0, canvas.width, canvas.height);
}
