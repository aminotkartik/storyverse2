import { useEffect, useRef, type ReactNode } from "react";
import { useTransform, type MotionValue } from "framer-motion";

export type Angle = MotionValue<number> | number;

interface JointProps {
  /** Rotation pivot in the figure's local coordinate space. */
  pivot?: readonly [number, number];
  angle?: Angle;
  dy?: Angle;
  children: ReactNode;
}

/**
 * A rotating/translating SVG group. Angles arrive as MotionValues and are
 * written straight to the `transform` attribute, so an animated figure never
 * triggers a React render while the visitor scrolls.
 */
export function Joint({ pivot = [0, 0], angle = 0, dy = 0, children }: JointProps) {
  const ref = useRef<SVGGElement>(null);
  const [px, py] = pivot;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const write = () => {
      const a = typeof angle === "number" ? angle : angle.get();
      const y = typeof dy === "number" ? dy : dy.get();
      el.setAttribute("transform", `translate(0 ${y.toFixed(2)}) rotate(${a.toFixed(2)} ${px} ${py})`);
    };
    write();
    const unsubscribers: Array<() => void> = [];
    if (typeof angle !== "number") unsubscribers.push(angle.on("change", write));
    if (typeof dy !== "number") unsubscribers.push(dy.on("change", write));
    return () => unsubscribers.forEach((off) => off());
  }, [angle, dy, px, py]);

  return <g ref={ref}>{children}</g>;
}

/** Derives one motion value from two others (e.g. walk phase and walk amplitude). */
export function useCombined(
  a: MotionValue<number>,
  b: MotionValue<number>,
  fn: (x: number, y: number) => number
): MotionValue<number> {
  return useTransform([a, b], (values: number[]) => fn(values[0], values[1]));
}

/** Blends a standing pose into a walking pose: amp 0 = rest, amp 1 = full stride. */
export const mix = (rest: number, walk: number, amp: number): number => rest + (walk - rest) * amp;
