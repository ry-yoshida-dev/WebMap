import { addProtocol } from "maplibre-gl";
import type { GetResourceResponse, RequestParameters } from "maplibre-gl";

import { GSI_ELEVATION_SCHEME } from "./gsiElevationScheme.js";
import { gsiToTerrarium } from "./gsiToTerrarium.js";
import { readElevationImage } from "./readElevationImage.js";

let isRegistered: boolean = false;

async function loadGsiElevationTile(
  request: RequestParameters,
  abortController: AbortController,
): Promise<GetResourceResponse<ImageBitmap>> {
  const image: ImageData = await readElevationImage(request.url.replace(`${GSI_ELEVATION_SCHEME}://`, "https://"), abortController.signal);
  gsiToTerrarium(image.data);
  return { data: await createImageBitmap(image, { colorSpaceConversion: "none", premultiplyAlpha: "none" }) };
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
