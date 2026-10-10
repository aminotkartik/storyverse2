import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ContinueButton } from "./ui/Shared";
import { ENDING_CHOICES, SEED_NOTES } from "../data/content";
import type { SoundApi } from "../hooks/useSound";

const STORAGE_KEY = "fifteen-seconds-notes";
const ROTATIONS = [-6, 4, -3, 7, -8, 2, 5, -4, 6, -2, 3, -5];

export default function Ending({ onNext, sound }: { onNext: () => void; sound: SoundApi }) {
  const [notes, setNotes] = useState<string[]>(SEED_NOTES);
  const [chosen, setChosen] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (Array.isArray(saved) && saved.length) setNotes([...SEED_NOTES, ...saved]);
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  const choose = (text: string) => {
    setChosen(text);
    sound.pageTurn();
    setNotes((n) => [...n, text]);
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...(Array.isArray(saved) ? saved : []), text]));
    } catch {
      /* storage unavailable, ignore */
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center overflow-y-auto bg-[#ded6c2] px-5 pt-20 pb-28 text-ink sm:px-10">
      <div className="halftone-light absolute inset-0 opacity-30" />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        <AnimatePresence mode="wait">
          {!chosen ? (
            <motion.div key="choices" exit={{ opacity: 0 }} className="flex w-full flex-col items-center gap-8">
              <h2 className="font-display text-3xl tracking-wide sm:text-5xl">WHAT WILL YOU NOT DO TODAY?</h2>
              <div className="flex w-full max-w-xl flex-col gap-3">
                {ENDING_CHOICES.map((c) => (
                  <button
                    key={c}
                    onClick={() => choose(c)}
                    className="rounded-sm border-2 border-ink/70 bg-paper px-5 py-3 text-left font-serif transition hover:-translate-y-0.5 hover:border-ink hover:shadow-[3px_3px_0_0_#0b0b0c]"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex w-full flex-col items-center gap-8"
            >
              <p className="font-hand text-3xl sm:text-4xl">“{chosen}”</p>
              <p className="font-display text-xl tracking-wide sm:text-2xl">
                MAYBE CIVIC SENSE
                <br />
                IS JUST EMPATHY
                <br />
                MADE VISIBLE.
              </p>
              <ContinueButton onClick={onNext} variant="light">
                Leave the city
              </ContinueButton>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-14 w-full">
          <p className="mb-4 font-serif text-xs tracking-widest text-ink/50 uppercase">
            notes left by others who passed through
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {notes.map((n, i) => (
              <motion.span
                key={`${n}-${i}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, rotate: ROTATIONS[i % ROTATIONS.length] }}
                className="rounded-sm border border-ink/30 bg-paper px-3 py-2 font-hand text-base text-ink/80 shadow-sm sm:text-lg"
              >
                {n}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
