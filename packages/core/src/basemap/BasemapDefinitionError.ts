/**
 * Raised when the definition of a basemap or terrain is malformed, such as a URL that is not `https`.
 */
export class BasemapDefinitionError extends Error {
  override readonly name: string = "BasemapDefinitionError";
}
