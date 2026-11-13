import { BasemapDefinitionError } from "./BasemapDefinitionError.js";

/** `https`, a host, then an optional path, query or fragment without whitespace. */
const HTTPS_URL: RegExp = /^https:\/\/[^\s/?#@]+(?:[/?#]\S*)?$/;

/**
 * Require an `https` URL with a host; placeholders such as `{z}` are allowed.
 *
 * @param url - URL to check.
 * @param subject - What the URL is for, used in the error message.
 * @throws BasemapDefinitionError When the URL is not an `https` URL with a host.
 */
export function requireHttpsUrl(url: string, subject: string): void {
  if (!HTTPS_URL.test(url)) {
    throw new BasemapDefinitionError(`The URL of ${subject} must be an https URL: ${url}`);
  }
}
