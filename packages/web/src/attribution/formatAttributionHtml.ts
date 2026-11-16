import type { Attribution } from "@web-map/core";

const ESCAPES: Readonly<Record<string, string>> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (character: string) => ESCAPES[character] ?? character);
}

/**
 * Render attributions as the HTML MapLibre's attribution control shows, escaping every value.
 *
 * @param attributions - Credits, each linking to its source when it has one.
 * @returns Links, or escaped text for a credit without a link, separated by ` | `.
 */
export function formatAttributionHtml(attributions: readonly Attribution[]): string {
  return attributions
    .map(({ text, url }: Attribution) =>
      url === null ? escapeHtml(text) : `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`,
    )
    .join(" | ");
}
