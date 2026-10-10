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
 * Fades an element in across [from, to] and out again. Without `to` it fades in
 * and then stays on screen to the end of the section.
 *
 * Framer Motion turns a scroll-linked transform into a native (WAAPI) animation
 * and uses the input range as keyframe offsets. Browsers reject offsets outside
 * [0, 1], which throws during mount and leaves the page blank. So every input
 * point here is kept within [0, 1] and in ascending order.
 */
export function Beat({ progress, from, to, rise = 14, className, children }: BeatProps) {
  // An element that starts at the very top of the story is visible from the first frame,
  // so the opening never shows an empty black screen.
  const startsVisible = from <= 0;
  const fadeIn = to === undefined ? 0.035 : Math.min(0.035, (to - from) / 4);

  const opacityIn: number[] = [];
  const opacityOut: number[] = [];
  if (startsVisible) {
    opacityIn.push(0);
    opacityOut.push(1);
  } else {
    opacityIn.push(from, from + fadeIn);
    opacityOut.push(0, 1);
  }
  if (to !== undefined) {
    opacityIn.push(to - fadeIn, to);
    opacityOut.push(1, 0);
  } else if (opacityIn.length === 1) {
    opacityIn.push(1);
    opacityOut.push(1);
  }
  const opacity = useTransform(progress, opacityIn, opacityOut);

  const y = useTransform(progress, [from, Math.min(1, from + fadeIn)], [startsVisible ? 0 : rise, 0]);

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
