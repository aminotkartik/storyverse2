export const SIGNAL_SECONDS = 15;

/**
 * Seconds shown on the pedestrian signal while progress moves from `start` to
 * `end`. Before `start` the full window is shown; at or after `end` it reads 0.
 * Driven by scroll position, never by a timer.
 */
export function secondsLeft(v: number, start = 0.2, end = 0.8): number {
  if (v <= start) return SIGNAL_SECONDS;
  if (v >= end) return 0;
  const t = (v - start) / (end - start);
  return SIGNAL_SECONDS - Math.floor(t * SIGNAL_SECONDS);
}
