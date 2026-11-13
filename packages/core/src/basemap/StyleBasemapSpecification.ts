import type { StyleBasemap } from "./StyleBasemap.js";

/**
 * Fields of a {@link StyleBasemap} given to {@link defineStyleBasemap}.
 */
export type StyleBasemapSpecification = Omit<StyleBasemap, "kind">;
