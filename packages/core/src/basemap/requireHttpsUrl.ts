import { BasemapDefinitionError } from "./BasemapDefinitionError.js";

/**
 * A host name of dot-separated labels with an optional port, then an optional path, query or fragment without
 * whitespace, after the scheme.
 */
const HOST_AND_PATH: string = String.raw`[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*(?::\d{1,5})?(?:[/?#]\S*)?$`;
const HTTPS_URL: RegExp = new RegExp(`^https://${HOST_AND_PATH}`, "i");
const HTTP_OR_HTTPS_URL: RegExp = new RegExp(`^https?://${HOST_AND_PATH}`, "i");

/**
 * Require an `https` URL with a host, or an `http` one when allowed; placeholders such as `{z}` are allowed in its
 * path and query, not in its host.
 *
 * @param url - URL to check.
 * @param subject - What the URL is for, used in the error message.
 * @param isHttpAllowed - Whether an `http` URL is accepted too; false when omitted.
 * @throws BasemapDefinitionError When the URL is not an `https` URL, or an `http` URL when allowed, with a host.
 */
export function requireHttpsUrl(url: string, subject: string, isHttpAllowed: boolean = false): void {
  if (!(isHttpAllowed ? HTTP_OR_HTTPS_URL : HTTPS_URL).test(url)) {
    throw new BasemapDefinitionError(
      `The URL of ${subject} must be an ${isHttpAllowed ? "http or https" : "https"} URL with a host: ${url}`,
    );
  }
}
