import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChapterLabel, ContinueButton } from "../ui/Shared";
import { HOTSPOTS } from "../../data/content";
import type { SoundApi } from "../../hooks/useSound";

export default function Chapter03LookAgain({ onNext, sound }: { onNext: () => void; sound: SoundApi }) {
  const [active, setActive] = useState<string | null>(null);
  const [found, setFound] = useState<Set<string>>(new Set());

  const reveal = (id: string) => {
    setActive(id);
    sound.beep(1100);
    setFound((f) => new Set(f).add(id));
  };

  const allFound = found.size === HOTSPOTS.length;
  const activeSpot = HOTSPOTS.find((h) => h.id === active);

  return (
    <div className="manga-cursor relative h-full w-full overflow-hidden bg-ink">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/lookagain-street.jpg)", filter: "grayscale(0.15)" }}
      />
      <div className="absolute inset-0 bg-ink/35" />
      <div className="grain absolute inset-0" />

      <ChapterLabel index={3} title="Look Again" />

      <div className="pointer-events-none absolute top-20 left-1/2 z-10 -translate-x-1/2 text-center sm:top-24">
        <AnimatePresence>
          {!allFound && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-display text-3xl tracking-widest text-paper drop-shadow-lg sm:text-5xl"
            >
              LOOK AGAIN.
            </motion.h2>
          )}
        </AnimatePresence>
        {!allFound && (
          <p className="mt-2 font-serif text-xs text-paper/70 sm:text-sm">
            {found.size} / {HOTSPOTS.length} noticed — tap the glowing points
          </p>
        )}
      </div>

      {HOTSPOTS.map((h) => (
        <button
          key={h.id}
          onClick={() => reveal(h.id)}
          aria-label={h.label}
          className="absolute z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          style={{ left: `${h.x}%`, top: `${h.y}%` }}
        >
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${
              found.has(h.id) ? "bg-paper/10" : "bg-danger/50 animate-pulse-soft"
            }`}
          />
          <span
            className={`relative h-3 w-3 rounded-full border-2 ${
              found.has(h.id) ? "border-paper/50 bg-transparent" : "border-danger bg-danger"
            }`}
          />
        </button>
      ))}

      <AnimatePresence>
        {activeSpot && (
          <motion.div
            key={activeSpot.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-x-0 bottom-24 z-20 mx-auto w-[92%] max-w-md rounded-md border-2 border-ink bg-paper px-5 py-4 text-ink shadow-[5px_5px_0_0_#0b0b0c] sm:bottom-28"
          >
            <p className="font-display text-xs tracking-[0.2em] text-danger uppercase">
              {activeSpot.label}
            </p>
            <p className="mt-1 whitespace-pre-line font-hand text-xl leading-snug sm:text-2xl">
              {activeSpot.reveal}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {allFound && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-ink/85 px-6 text-center"
          >
            <p className="max-w-lg font-serif text-xl text-paper/90 italic sm:text-2xl">
              Nothing here was hidden.
              <br />
              We just stopped looking.
            </p>
            <ContinueButton onClick={onNext}>Ask why</ContinueButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
