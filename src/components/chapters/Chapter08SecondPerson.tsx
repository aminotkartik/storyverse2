import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChapterLabel, ContinueButton } from "../ui/Shared";
import { CHAIN_STEPS } from "../../data/content";
import type { SoundApi } from "../../hooks/useSound";

export default function Chapter08SecondPerson({ onNext, sound }: { onNext: () => void; sound: SoundApi }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [resolved, setResolved] = useState(false);
  const [careless, setCareless] = useState(false);
  const [finalStep, setFinalStep] = useState(0); // 0 none, 1 "one person", 2 "second can"

  const step = CHAIN_STEPS[stepIdx];
  const isFinished = stepIdx >= CHAIN_STEPS.length;

  const choose = (good: boolean) => {
    if (good) {
      setResolved(true);
      setCareless(false);
      sound.chime();
    } else {
      setCareless(true);
      sound.honk(0.6);
    }
  };

  const next = () => {
    if (stepIdx + 1 >= CHAIN_STEPS.length) {
      setStepIdx(stepIdx + 1);
      window.setTimeout(() => setFinalStep(1), 300);
      window.setTimeout(() => setFinalStep(2), 2000);
    } else {
      setStepIdx((s) => s + 1);
      setResolved(false);
      setCareless(false);
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-charcoal px-5 py-20 text-center">
      <div className="grain absolute inset-0" />
      <ChapterLabel index={8} title="The Second Person" />

      {!isFinished && (
        <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-6">
          <p className="font-serif text-xs tracking-widest text-paper/40 uppercase">
            choice {stepIdx + 1} / {CHAIN_STEPS.length}
          </p>
          <p className="font-serif text-lg text-paper/90 sm:text-xl">{step.prompt}</p>

          {!resolved ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => choose(false)}
                className="rounded-sm border border-paper/40 px-6 py-3 font-display text-sm tracking-wide text-paper/80 transition hover:border-danger hover:text-danger"
              >
                “{step.careless}”
              </button>
              <button
                onClick={() => choose(true)}
                className="rounded-sm border border-amber px-6 py-3 font-display text-sm tracking-wide text-amber transition hover:bg-amber hover:text-ink"
              >
                “{step.responsible}”
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key="resolved"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-5"
              >
                <p className="max-w-md font-serif text-paper/80 italic">{step.consequence}</p>
                <ContinueButton onClick={next}>
                  {stepIdx + 1 >= CHAIN_STEPS.length ? "See what happens" : "Next choice"}
                </ContinueButton>
              </motion.div>
            </AnimatePresence>
          )}

          <AnimatePresence>
            {careless && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-serif text-sm text-paper/50 italic"
              >
                Nothing changes. The street stays the same. Try again.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}

      {isFinished && (
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0.15, scale: 0.8 }}
                animate={{
                  opacity: finalStep >= 1 ? 1 : 0.15,
                  scale: finalStep >= 2 && i > 0 ? 1.1 : 1,
                }}
                transition={{ delay: i * 0.2 }}
                className="h-8 w-8 rounded-full border-2 border-amber bg-amber/20 sm:h-10 sm:w-10"
              />
            ))}
          </div>
          <AnimatePresence mode="wait">
            {finalStep === 1 && (
              <motion.p
                key="f1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-display text-2xl text-paper sm:text-4xl"
              >
                ONE PERSON CAN'T CHANGE THE CITY.
              </motion.p>
            )}
            {finalStep >= 2 && (
              <motion.div key="f2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <p className="font-display text-2xl text-amber sm:text-4xl">THE SECOND CAN.</p>
                <ContinueButton onClick={onNext}>Return to the crossing</ContinueButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
