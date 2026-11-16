import type { StyleBasemap } from "./StyleBasemap.js";

/**
 * Fields of a {@link StyleBasemap} given to {@link defineStyleBasemap}.
 */
export type StyleBasemapSpecification = Omit<StyleBasemap, "kind"> & {
  /** Accept an `http` style URL; false when omitted. See {@link RasterTileBasemapSpecification.isHttpAllowed} for when to. */
  readonly isHttpAllowed?: boolean;
};
