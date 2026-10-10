import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { cn } from "../../utils/cn";

interface BeatProps {
  progress: MotionValue<number>;
  /** Progress at which the element starts to appear. */
  from: number;
  /** Progress at which it leaves. Omit to keep it on screen until the end. */
  to?: number;
  /** Upward travel while entering, in px. */
  rise?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Fades an element in across [from, to] and out again. All motion is a
 * MotionValue transform, so scrolling never re-renders React.
 */
export function Beat({ progress, from, to, rise = 14, className, children }: BeatProps) {
  const end = to ?? 2;
  const fade = Math.min(0.035, (end - from) / 4);
  // An element that starts at the very top of the story is visible from the first frame,
  // so the opening never shows an empty black screen.
  const startsVisible = from <= 0;
  const opacity = useTransform(
    progress,
    startsVisible ? [0, end - fade, end] : [from, from + fade, end - fade, end],
    startsVisible ? [1, 1, 0] : [0, 1, 1, 0]
  );
  const y = useTransform(progress, startsVisible ? [0, 1] : [from, from + fade], startsVisible ? [0, 0] : [rise, 0]);
  return (
    <motion.div style={{ opacity, y }} className={cn(className)}>
      {children}
    </motion.div>
  );
}

interface RevealTextProps {
  text: string;
  progress: MotionValue<number>;
  from: number;
  to: number;
  className?: string;
}

/** Words light up one after another across [from, to], keeping the full sentence in the DOM. */
export function RevealText({ text, progress, from, to, className }: RevealTextProps) {
  const words = text.split(/\s+/);
  const span = to - from;
  return (
    <span className={className}>
      {words.map((word, i) => (
        <RevealWord
          key={`${i}-${word}`}
          word={word}
          progress={progress}
          start={from + (span * i) / words.length}
          end={from + (span * (i + 1)) / words.length}
          last={i === words.length - 1}
        />
      ))}
    </span>
  );
}

function RevealWord({
  word,
  progress,
  start,
  end,
  last,
}: {
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  last: boolean;
}) {
  const opacity = useTransform(progress, [start, Math.max(start + 0.001, end)], [0.14, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{word}</motion.span>
      {last ? null : " "}
    </>
  );
}
