"use client";

import { useState } from "react";
import type { ReactElement } from "react";

import type { BasemapOptionProps } from "./BasemapOptionProps.js";
import { describeRestriction } from "./describeRestriction.js";
import { Icon } from "../icons/Icon.js";
import { IconName } from "../icons/IconName.js";
import type { Thumbnail } from "../../thumbnail/Thumbnail.js";
import { ThumbnailStatus } from "../../thumbnail/ThumbnailStatus.js";

function ThumbnailImage({ thumbnail }: { readonly thumbnail: Thumbnail }): ReactElement {
  const [brokenUrl, setBrokenUrl] = useState<string | null>(null);
  switch (thumbnail.status) {
    case ThumbnailStatus.PENDING:
      return (
        <span className="wmap-thumbnail">
          <span className="wmap-spinner" />
        </span>
      );
    case ThumbnailStatus.READY:
      if (brokenUrl !== thumbnail.url) {
        return (
          <span className="wmap-thumbnail">
            <img src={thumbnail.url} alt="" draggable={false} onError={() => setBrokenUrl(thumbnail.url)} />
          </span>
        );
      }
      return (
        <span className="wmap-thumbnail">
          <Icon name={IconName.FOLDED_MAP} />
        </span>
      );
    case ThumbnailStatus.EMPTY:
      return <span className="wmap-thumbnail wmap-thumbnail-empty" />;
    case ThumbnailStatus.FAILED:
      return (
        <span className="wmap-thumbnail">
          <Icon name={IconName.FOLDED_MAP} />
        </span>
      );
    default: {
      const unreachable: never = thumbnail;
      throw new TypeError(`Unknown thumbnail ${String(unreachable)}`);
    }
  }
}

/**
 * Choice in the basemap menu: a thumbnail over the basemap's title, with its
 * attribution as the tooltip and restricted terms flagged.
 *
 * @param props - Basemap, its thumbnail, whether it is on screen and the choice handler.
 * @returns The option button.
 */
export function BasemapOption({ basemap, thumbnail, isSelected, onChoose, labels }: BasemapOptionProps): ReactElement {
  const restriction: string | null = describeRestriction(basemap.usage, labels);
  const credits: string = basemap.attributions.map((attribution) => `© ${attribution.text}`).join("\n");
  return (
    <button
      type="button"
      role="option"
      className="wmap-option"
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      autoFocus={isSelected}
      title={`${basemap.title}\n${credits}`}
      onClick={() => onChoose(basemap)}
    >
      <ThumbnailImage thumbnail={thumbnail} />
      <span className="wmap-option-title">{basemap.title}</span>
      {restriction === null ? null : <span className="wmap-option-restriction">{restriction}</span>}
    </button>
  );
}
