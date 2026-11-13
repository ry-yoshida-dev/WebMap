import { addProtocol, AJAXError } from "maplibre-gl";
import type { GetResourceResponse, RequestParameters } from "maplibre-gl";

import { GSI_ELEVATION_SCHEME } from "./gsiElevationScheme.js";
import { gsiToTerrarium } from "./gsiToTerrarium.js";

let isRegistered: boolean = false;

async function loadGsiElevationTile(
  request: RequestParameters,
  abortController: AbortController,
): Promise<GetResourceResponse<ImageBitmap>> {
  const url: string = request.url.replace(`${GSI_ELEVATION_SCHEME}://`, "https://");
  const response: Response = await fetch(url, { signal: abortController.signal });
  if (!response.ok) {
    // An AJAXError keeps 404s outside Japan reported as missing coverage, not failures.
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
  const image: ImageData = context.getImageData(0, 0, canvas.width, canvas.height);
  gsiToTerrarium(image.data);
  context.putImageData(image, 0, 0);
  return { data: await createImageBitmap(canvas, { premultiplyAlpha: "none" }) };
}

/**
 * Let MapLibre load GSI elevation tiles through {@link GSI_ELEVATION_SCHEME} URLs, re-encoding them as Terrarium.
 * Registering is global to MapLibre and done once, however often this is called.
 */
export function registerGsiElevationProtocol(): void {
  if (isRegistered) {
    return;
  }
  addProtocol(GSI_ELEVATION_SCHEME, loadGsiElevationTile);
  isRegistered = true;
}
