import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChapterLabel, ContinueButton } from "../ui/Shared";
import { NOTEBOOK_PAGES, CIVIC_STATS } from "../../data/content";
import type { SoundApi } from "../../hooks/useSound";

const TOTAL_PAGES = NOTEBOOK_PAGES.length + 2; // + stats page + final page

export default function Chapter06Notebook({ onNext, sound }: { onNext: () => void; sound: SoundApi }) {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);

  const turn = (d: 1 | -1) => {
    const next = page + d;
    if (next < 0 || next >= TOTAL_PAGES) return;
    sound.pageTurn();
    setDir(d);
    setPage(next);
  };

  const isNotebook = page < NOTEBOOK_PAGES.length;
  const isStats = page === NOTEBOOK_PAGES.length;
  const isFinal = page === NOTEBOOK_PAGES.length + 1;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-[#ded6c2] px-5 py-20 text-ink">
      <div className="halftone-light absolute inset-0 opacity-30" />
      <ChapterLabel index={6} title="The Numbers" />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <div className="relative h-[20rem] w-full overflow-hidden rounded-sm border-2 border-ink bg-[#f3ede2] shadow-[6px_6px_0_0_#0b0b0c] sm:h-[22rem]">
          <AnimatePresence mode="wait" custom={dir}>
            {isNotebook && (
              <motion.div
                key={`n-${page}`}
                custom={dir}
                initial={{ x: dir > 0 ? 80 : -80, opacity: 0, rotate: dir > 0 ? 4 : -4 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                exit={{ x: dir > 0 ? -80 : 80, opacity: 0, rotate: dir > 0 ? -4 : 4 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"
              >
                <p className="font-serif text-xs tracking-widest text-ink/50 uppercase">
                  Field note {page + 1} / {NOTEBOOK_PAGES.length}
                </p>
                <p className="font-display text-6xl text-danger sm:text-7xl">{NOTEBOOK_PAGES[page].seconds}</p>
                <p className="font-hand text-2xl text-ink sm:text-3xl">{NOTEBOOK_PAGES[page].label}</p>
                <p className="font-serif text-xs text-ink/50 italic">seconds needed to cross, safely</p>
              </motion.div>
            )}

            {isStats && (
              <motion.div
                key="stats"
                custom={dir}
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -80, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex flex-col justify-center gap-4 p-6 sm:p-10"
              >
                <p className="mb-2 text-center font-serif text-xs tracking-widest text-ink/50 uppercase">
                  What Tara counted in one week
                </p>
                {CIVIC_STATS.map((s, i) => (
                  <div key={s.label}>
                    <div className="mb-1 flex justify-between font-serif text-[11px] tracking-wide text-ink/70">
                      <span>{s.label}</span>
                      <span>{Math.round(s.value * 100)}%</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-ink/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.value * 100}%` }}
                        transition={{ duration: 1, delay: i * 0.15 }}
                        className="h-3 rounded-full bg-danger"
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {isFinal && (
              <motion.div
                key="final"
                custom={dir}
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -80, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center"
              >
                <p className="font-hand text-3xl leading-snug text-ink sm:text-4xl">
                  “The timer wasn't the problem.
                  <br />
                  The assumption was.”
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center gap-6">
          <button
            onClick={() => turn(-1)}
            disabled={page === 0}
            className="rounded-full border border-ink/30 px-4 py-2 font-display text-xs tracking-widest text-ink/70 transition hover:border-ink disabled:opacity-20"
          >
            ← PREV
          </button>
          <span className="font-serif text-xs text-ink/50">
            {page + 1} / {TOTAL_PAGES}
          </span>
          <button
            onClick={() => turn(1)}
            disabled={page === TOTAL_PAGES - 1}
            className="rounded-full border border-ink/30 px-4 py-2 font-display text-xs tracking-widest text-ink/70 transition hover:border-ink disabled:opacity-20"
          >
            NEXT →
          </button>
        </div>

        {isFinal && (
          <div className="mt-8">
            <ContinueButton onClick={onNext} variant="light">
              Start the campaign
            </ContinueButton>
          </div>
        )}
      </div>
    </div>
  );
}
