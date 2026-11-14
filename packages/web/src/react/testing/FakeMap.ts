/**
 * Stand-in for a MapLibre map in tests: it keeps listeners by event type and calls them when an event is fired.
 */
export class FakeMap {
  private readonly listeners: Map<string, Set<(event: never) => void>> = new Map();

  /** Value `getZoom` returns. */
  zoom: number = 0;

  /**
   * @param type - Event type.
   * @param listener - Called with each event of the type.
   */
  on(type: string, listener: (event: never) => void): this {
    const listeners: Set<(event: never) => void> = this.listeners.get(type) ?? new Set();
    listeners.add(listener);
    this.listeners.set(type, listeners);
    return this;
  }

  /**
   * @param type - Event type.
   * @param listener - Listener given to {@link on}.
   */
  off(type: string, listener: (event: never) => void): this {
    this.listeners.get(type)?.delete(listener);
    return this;
  }

  /** @returns {@link zoom}. */
  getZoom(): number {
    return this.zoom;
  }

  /**
   * Call the listeners of an event type.
   *
   * @param type - Event type.
   * @param event - Event passed to each listener.
   */
  fire(type: string, event: object = {}): void {
    for (const listener of [...(this.listeners.get(type) ?? [])]) {
      Reflect.apply(listener, undefined, [event]);
    }
  }

  /**
   * @param type - Event type.
   * @returns How many listeners the type has.
   */
  listenerCount(type: string): number {
    return this.listeners.get(type)?.size ?? 0;
  }
}
