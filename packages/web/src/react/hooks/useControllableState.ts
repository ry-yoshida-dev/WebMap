"use client";

import { useCallback, useState } from "react";

/**
 * A value an application either keeps in its own state and passes in, or leaves to the component.
 *
 * While `controlled` is defined it is the value, and changes only reach the application's callback; otherwise the
 * component keeps the value, starting from `initial`.
 *
 * @param controlled - Value the application keeps, or undefined to leave it to the component.
 * @param initial - Value the component starts from, read once.
 * @returns The current value and a function recording a change while the component keeps the value.
 */
export function useControllableState<TValue>(
  controlled: TValue | undefined,
  initial: () => TValue,
): readonly [TValue, (next: TValue) => void] {
  const [kept, setKept] = useState<TValue>(initial);
  const isControlled: boolean = controlled !== undefined;
  const change = useCallback(
    (next: TValue): void => {
      if (!isControlled) {
        setKept(() => next);
      }
    },
    [isControlled],
  );
  return [controlled ?? kept, change];
}
