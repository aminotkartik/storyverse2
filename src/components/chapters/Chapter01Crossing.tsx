import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChapterLabel, ContinueButton, SpeechBubble, WalkingFigure } from "../ui/Shared";
import type { SoundApi } from "../../hooks/useSound";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type Phase = "waiting" | "counting" | "end";

export default function Chapter01Crossing({
  onNext,
  sound,
}: {
  onNext: () => void;
  sound: SoundApi;
}) {
  const [phase, setPhase] = useState<Phase>("waiting");
  const [count, setCount] = useState(15);
  const reduced = useReducedMotion();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "counting") return;
    intervalRef.current = window.setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          window.clearInterval(intervalRef.current!);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "counting") return;
    sound.setAmbientLevel(0.15 + (15 - count) * 0.035);
    if (count === 14) sound.beep(1200);
    if (count === 8 || count === 5) sound.honk(1);
    if (count <= 3 && count > 0) sound.honk(0.6 + Math.random());
    if (count === 0) {
      sound.stopAmbient();
      window.setTimeout(() => setPhase("end"), 900);
    }
  }, [count, phase, sound]);

  const startSignal = () => {
    if (phase !== "waiting") return;
    setPhase("counting");
    setCount(15);
    sound.beep(900);
    sound.startAmbient(0.15);
  };

  const progress = (15 - count) / 15; // 0 -> 1
  const taraLeft = 16 + progress * 74; // starts ahead on the upper track, reaches 90%
  const daduLeft = 5 + progress * 46; // starts behind on the lower track, stranded near middle (51%)
  const closeUp = phase === "counting" && count <= 5;
  const chaos = phase === "counting" && count <= 3 && count > 0;
  const borderInset = phase === "counting" ? Math.min(28, (15 - count) * 2) : 0;

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      <div
        className="absolute inset-0 bg-cover bg-center transition-[filter] duration-700"
        style={{
          backgroundImage: "url(/images/crossing-chaotic.jpg)",
          filter: phase === "waiting" ? "grayscale(0.2) brightness(0.55)" : "grayscale(0.1) brightness(0.5)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink/90" />
      <div className="grain absolute inset-0" />

      {chaos && !reduced && <div className="speed-lines pointer-events-none absolute inset-0 opacity-60" />}

      {/* tightening panel border as time runs out */}
      <div
        className="pointer-events-none absolute border-danger/70 transition-all duration-500"
        style={{
          inset: borderInset,
          borderWidth: phase === "counting" && count <= 8 ? 3 : 0,
        }}
      />

      <ChapterLabel index={1} title="The Crossing" />

      <div className={`relative z-10 flex h-full w-full flex-col ${chaos && !reduced ? "animate-shake" : ""}`}>
        <div className="flex-1" />

        {/* crossing lane */}
        <div className="relative mx-auto mb-[16%] w-[92%] max-w-3xl">
          <div
            className="h-20 w-full rounded-sm opacity-80 sm:h-24"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(243,237,226,0.9) 0 24px, transparent 24px 48px)",
            }}
          />
          {/* Tara (upper lane, slightly ahead) */}
          <div
            className="
              absolute -top-16 z-10 -translate-x-1/2 transition-all duration-700 ease-linear
              sm:-top-22
            "
            style={{ left: `${taraLeft}%` }}
          >
            <WalkingFigure
              character="tara"
              walking={phase === "counting" && count > 0}
              progress={progress}
              urgent={closeUp}
            />
          </div>
          {/* Dadu (lower lane, slightly behind so they never superimpose) */}
          <div
            className="
              absolute -top-8 z-20 -translate-x-1/2 transition-all duration-700 ease-linear
              sm:-top-12
            "
            style={{ left: `${daduLeft}%` }}
          >
            <WalkingFigure
              character="dadu"
              walking={phase === "counting" && count > 0}
              progress={progress}
              urgent={closeUp}
            />
          </div>
        </div>

        <div className="flex flex-col items-center pb-10 text-center sm:pb-16">
          {phase === "waiting" && (
            <motion.button
              onClick={startSignal}
              whileTap={{ scale: 0.92 }}
              aria-label="Activate the pedestrian signal"
              className="flex flex-col items-center gap-3 rounded-lg border border-paper/30 bg-ink/50 px-8 py-5 backdrop-blur-sm transition hover:border-paper/70"
            >
              <span className="h-8 w-8 animate-pulse-soft rounded-full bg-danger" />
              <span className="font-display text-sm tracking-[0.25em] text-paper">
                TAP THE SIGNAL TO CROSS
              </span>
            </motion.button>
          )}

          {phase === "counting" && (
            <motion.div
              key={count}
              initial={{ scale: 0.85, opacity: 0.6 }}
              animate={{ scale: closeUp ? 1.3 : 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`font-display select-none ${count <= 5 ? "text-danger" : "text-paper"}`}
              style={{ fontSize: "clamp(3.5rem, 12vw, 7rem)" }}
            >
              {String(count).padStart(2, "0")}
            </motion.div>
          )}

          <AnimatePresence>
            {phase === "end" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-6 px-4"
              >
                <img
                  src="/images/dadu-portrait.png"
                  alt="Close-up of Dadu, out of breath at the edge of the crossing"
                  className="h-28 w-28 rounded-full border-2 border-paper/40 object-cover sm:h-36 sm:w-36"
                />
                <SpeechBubble>“Maine kya galat kiya?”</SpeechBubble>
                <p className="max-w-sm font-serif text-xs text-paper/50 italic">
                  (“What did I do wrong?”)
                </p>
                <ContinueButton onClick={onNext}>Keep walking with her</ContinueButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
