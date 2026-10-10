/** Pure helpers for mapping scroll progress (0–1) onto story beats. */

export const clamp = (v: number, min = 0, max = 1): number => Math.min(max, Math.max(min, v));

/** Normalised position of `v` inside the range [a, b], clamped to 0–1. */
export const progressIn = (v: number, a: number, b: number): number => clamp((v - a) / (b - a));

/** 0 before `at`, rising linearly to 1 over `width`. */
export const ramp = (x: number, width = 0.02): number => clamp(x / width);

/** Smooth 0 → 1 → 0 window between a and b; used to switch walk cycles on and off. */
export const envelope = (v: number, a: number, b: number, edge = 0.02): number =>
  ramp(v - a, edge) * ramp(b - v, edge);
