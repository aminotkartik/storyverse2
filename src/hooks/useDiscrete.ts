import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";

/**
 * Maps scroll progress to a discrete value (a countdown digit, the active
 * step, a page index). React state changes only when the selected value
 * changes, so scrolling never re-renders on every frame. `select` must be a
 * stable (module-level) function.
 */
export function useDiscrete<T>(progress: MotionValue<number>, select: (v: number) => T): T {
  const [value, setValue] = useState<T>(() => select(progress.get()));

  useEffect(() => {
    const update = (v: number) => setValue(select(v));
    update(progress.get());
    return progress.on("change", update);
  }, [progress, select]);

  return value;
}

/** Runs `onChange(prev, next)` whenever `value` changes after mount. */
export function useChangeEffect<T>(value: T, onChange: (prev: T, next: T) => void): void {
  const previous = useRef(value);
  const callback = useRef(onChange);

  useEffect(() => {
    callback.current = onChange;
  });

  useEffect(() => {
    if (Object.is(previous.current, value)) return;
    const before = previous.current;
    previous.current = value;
    callback.current(before, value);
  }, [value]);
}
