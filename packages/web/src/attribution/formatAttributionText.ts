import type { Attribution } from "@web-map/core";

/**
 * Write attributions as plain text, for output that cannot carry links, such as a printed map.
 *
 * @param attributions - Credits.
 * @returns Their texts separated by ` | `, empty when there are none.
 */
export function formatAttributionText(attributions: readonly Attribution[]): string {
  return attributions.map(({ text }: Attribution) => text).join(" | ");
}
