import type { PresentationStop } from "./stops";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * Absolute document Y for a stop: the section's top plus `progress` of its
 * scrollable distance (track height minus one viewport). Computed live, never hardcoded.
 */
export function targetScrollY(stop: PresentationStop): number | null {
  const section = document.getElementById(stop.sectionId);
  if (!section) return null;
  const sectionTop = window.scrollY + section.getBoundingClientRect().top;
  const scrollable = Math.max(0, section.offsetHeight - window.innerHeight);
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return clamp(Math.round(sectionTop + clamp(stop.progress, 0, 1) * scrollable), 0, maxScroll);
}

export function scrollToStop(stop: PresentationStop, behavior: ScrollBehavior): void {
  const y = targetScrollY(stop);
  if (y === null) return;
  window.scrollTo({ top: y, behavior });
}

/** Index of the stop whose target Y is closest to the current scroll position. */
export function nearestStopIndex(stops: readonly PresentationStop[]): number {
  const current = window.scrollY;
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  stops.forEach((stop, i) => {
    const y = targetScrollY(stop);
    if (y === null) return;
    const distance = Math.abs(y - current);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i;
    }
  });
  return best;
}
