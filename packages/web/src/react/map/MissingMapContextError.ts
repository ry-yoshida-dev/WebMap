/**
 * Raised when a hook or component needing the enclosing {@link WebMap} is rendered outside its children.
 */
export class MissingMapContextError extends Error {
  override readonly name: string = "MissingMapContextError";

  /**
   * @param caller - Name of the hook or component that needs the map.
   */
  constructor(caller: string) {
    super(`${caller} must be rendered inside the children of a WebMap`);
  }
}
