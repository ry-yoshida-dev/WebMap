import type { ReactElement } from "react";

import { describeRestriction } from "./describeRestriction.js";
import type { UsageNoticeProps } from "./UsageNoticeProps.js";

/**
 * Badge linking to the terms of a basemap whose commercial use is restricted or unknown, as plain text when there is
 * no page to link; empty otherwise.
 *
 * @param props - Terms of the basemap on screen and the labels.
 * @returns The badge, or an empty placeholder keeping the layout stable.
 */
export function UsageNotice({ usage, labels }: UsageNoticeProps): ReactElement {
  const restriction: string | null = describeRestriction(usage, labels);
  if (restriction === null) {
    return <span className="wmap-usage" />;
  }
  const details: string = [usage.license, usage.conditions].filter((part: string | null) => part !== null).join("\n");
  if (usage.termsUrl === null) {
    return (
      <span className="wmap-usage" data-restricted="true" title={details}>
        {restriction}
      </span>
    );
  }
  return (
    <a className="wmap-usage" data-restricted="true" href={usage.termsUrl} target="_blank" rel="noopener noreferrer" title={details}>
      {restriction}
    </a>
  );
}
