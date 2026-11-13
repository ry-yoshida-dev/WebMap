import type { MapCamera } from "./MapCamera.js";

/**
 * Fields of a {@link MapCamera} given to {@link defineMapCamera}; bearing and pitch default to 0.
 */
export type MapCameraSpecification = Omit<MapCamera, "bearing" | "pitch"> & {
  readonly bearing?: number;
  readonly pitch?: number;
};
