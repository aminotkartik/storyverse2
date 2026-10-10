import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChapterLabel, ContinueButton, SpeechBubble } from "../ui/Shared";
import { AVERAGE_FRAGMENTS } from "../../data/content";
import type { SoundApi } from "../../hooks/useSound";

export default function Chapter04AverageHuman({ onNext, sound }: { onNext: () => void; sound: SoundApi }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step === 3) {
      const t = window.setTimeout(() => setStep(4), AVERAGE_FRAGMENTS.length * 180 + 900);
      return () => window.clearTimeout(t);
    }
  }, [step]);

  const advance = () => {
    if (step >= 3) return;
    sound.pageTurn();
    setStep((s) => s + 1);
  };

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-ink px-5 py-20 text-center"
      onClick={step < 3 ? advance : undefined}
      role={step < 3 ? "button" : undefined}
      tabIndex={step < 3 ? 0 : undefined}
      onKeyDown={(e) => {
        if (step < 3 && (e.key === "Enter" || e.key === " ")) advance();
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: "url(/images/control-room.jpg)" }}
      />
      <div className="absolute inset-0 bg-ink/50" />
      <div className="grain absolute inset-0" />

      <ChapterLabel index={4} title="The Average Human" />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-5">
        <div className="mb-2 rounded-sm border border-paper/30 bg-ink/70 px-6 py-4 font-display tracking-widest text-paper">
          <p className="text-xs text-paper/50">MONITOR 04</p>
          <p className="text-2xl text-amber sm:text-3xl">AVERAGE PEDESTRIAN</p>
          <p className="text-4xl sm:text-5xl">15 SEC</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <img
                src="/images/tara-portrait.png"
                alt="Tara, examining the monitor"
                className="h-16 w-16 rounded-full border-2 border-paper/40 object-cover"
              />
              <SpeechBubble>“Average?”</SpeechBubble>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SpeechBubble from="right">
                “Most pedestrians can cross within fifteen seconds.”
              </SpeechBubble>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <img
                src="/images/tara-portrait.png"
                alt="Tara, pressing the question"
                className="h-16 w-16 rounded-full border-2 border-paper/40 object-cover"
              />
              <SpeechBubble>“But who is the average pedestrian?”</SpeechBubble>
            </motion.div>
          )}
        </AnimatePresence>

        {step < 3 && (
          <p className="mt-6 animate-blink font-serif text-xs tracking-widest text-paper/40 uppercase">
            tap to continue
          </p>
        )}

        {step === 3 && (
          <div className="relative flex h-40 w-full flex-wrap items-center justify-center gap-3">
            {AVERAGE_FRAGMENTS.map((f, i) => (
              <motion.span
                key={f}
                initial={{ opacity: 0, y: 0, scale: 1.1 }}
                animate={{ opacity: [0, 1, 1, 0], y: -20 }}
                transition={{ duration: 1.6, delay: i * 0.18 }}
                className="font-serif text-lg text-paper/80 italic sm:text-xl"
              >
                {f}
              </motion.span>
            ))}
          </div>
        )}

        <AnimatePresence>
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-8"
            >
              <p className="font-display text-3xl tracking-wide text-paper sm:text-5xl">
                THERE IS NO AVERAGE PERSON.
              </p>
              <ContinueButton onClick={onNext}>See the pattern</ContinueButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
