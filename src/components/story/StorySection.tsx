import { useRef, type ReactNode } from "react";
import { useScroll, type MotionValue } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../utils/cn";

/** What a scene receives: its own scroll progress (0 → 1) and the motion preference. */
export interface SceneContext {
  progress: MotionValue<number>;
  reduced: boolean;
}

interface StorySectionProps {
  id: string;
  /** Chapter number, shown in the screen-reader heading. */
  number?: number;
  title: string;
  /** Tailwind height class for the scroll distance, e.g. "h-[320vh]". */
  heightClass: string;
  className?: string;
  children: (scene: SceneContext) => ReactNode;
}

/**
 * A tall section whose inner stage sticks to the viewport while the visitor
 * scrolls through it. Progress is the section's own scroll fraction, so each
 * chapter owns a complete, reversible timeline. The page itself is never
 * hijacked: the wheel and touch keep their native behaviour. Under reduced
 * motion the timeline is unchanged, so no text is lost, but scenes skip their
 * camera moves (see `SceneContext.reduced`).
 */
export function StorySection({ id, number, title, heightClass, className, children }: StorySectionProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = scrollYProgress;
  const headingId = `${id}-heading`;
  const heading = number ? `Chapter ${String(number).padStart(2, "0")}: ${title}` : title;

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={headingId}
      className={cn(heightClass, "scroll-mt-0", className)}
    >
      <h2 id={headingId} className="sr-only">
        {heading}
      </h2>
      <div
        className="sticky top-0 h-svh min-h-[460px] overflow-hidden"
      >
        {children({ progress, reduced })}
      </div>
    </section>
  );
}
