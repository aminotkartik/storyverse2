import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export function SpeechBubble({
  children,
  tail = "left",
  className,
}: {
  children: ReactNode;
  tail?: "left" | "right";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border-2 border-ink bg-paper px-5 py-3 font-hand text-xl leading-snug text-ink shadow-[4px_4px_0_0_#0b0b0c] sm:text-2xl",
        className
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-2.5 h-4 w-4 rotate-45 border-r-2 border-b-2 border-ink bg-paper",
          tail === "left" ? "left-8" : "right-8"
        )}
      />
    </div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-display text-[11px] tracking-[0.3em] text-paper/70 uppercase sm:text-xs", className)}>
      {children}
    </p>
  );
}
