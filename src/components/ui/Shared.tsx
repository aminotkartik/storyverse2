import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function ChapterLabel({ index, title }: { index: number; title: string }) {
  return (
    <div className="pointer-events-none absolute top-5 left-5 z-20 sm:top-8 sm:left-8">
      <p className="font-display text-xs tracking-[0.3em] text-paper/50">
        CHAPTER {String(index).padStart(2, "0")}
      </p>
      <h2 className="font-display text-xl tracking-wide text-paper sm:text-2xl">{title}</h2>
    </div>
  );
}

export function ContinueButton({
  onClick,
  children = "Continue",
  variant = "dark",
}: {
  onClick: () => void;
  children?: ReactNode;
  variant?: "dark" | "light";
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className={
        variant === "dark"
          ? "group inline-flex items-center gap-2 rounded-sm border border-paper/70 px-6 py-2.5 font-display text-sm tracking-[0.2em] text-paper transition hover:bg-paper hover:text-ink"
          : "group inline-flex items-center gap-2 rounded-sm border border-ink/70 px-6 py-2.5 font-display text-sm tracking-[0.2em] text-ink transition hover:bg-ink hover:text-paper"
      }
    >
      {children}
      <span className="transition-transform group-hover:translate-x-1">→</span>
    </motion.button>
  );
}

export function SpeechBubble({
  children,
  from = "left",
  className = "",
}: {
  children: ReactNode;
  from?: "left" | "right";
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`relative rounded-2xl border-2 border-ink bg-paper px-5 py-3 font-hand text-xl text-ink shadow-[4px_4px_0_0_#0b0b0c] sm:text-2xl ${className}`}
    >
      {children}
      <span
        className={`absolute -bottom-2.5 h-4 w-4 rotate-45 border-r-2 border-b-2 border-ink bg-paper ${
          from === "left" ? "left-8" : "right-8"
        }`}
      />
    </motion.div>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PanelFrame({
  children,
  className = "",
  image,
}: {
  children: ReactNode;
  className?: string;
  image?: string;
}) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-ink ${className}`}>
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink/80" />
      <div className="grain absolute inset-0" />
      <div className="relative z-10 flex h-full w-full flex-col">{children}</div>
    </div>
  );
}
