import type { ThumbnailStatus } from "./ThumbnailStatus.js";

/**
 * Small preview of a basemap, discriminated by {@link ThumbnailStatus}.
 */
export type Thumbnail =
  | { readonly status: ThumbnailStatus.PENDING }
  | { readonly status: ThumbnailStatus.READY; readonly url: string }
  | { readonly status: ThumbnailStatus.FAILED };
