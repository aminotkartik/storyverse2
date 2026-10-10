import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SoundApi } from "../hooks/useSound";
import { useReducedMotion } from "../hooks/useReducedMotion";

type Phase = "dark" | "signal" | "countdown" | "blackout" | "title";

export default function IntroSequence({
  onBegin,
  sound,
}: {
  onBegin: () => void;
  sound: SoundApi;
}) {
  const [phase, setPhase] = useState<Phase>("dark");
  const [count, setCount] = useState(15);
  const [titleStep, setTitleStep] = useState(0);
  const reduced = useReducedMotion();
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const t = (fn: () => void, ms: number) => {
      timers.current.push(window.setTimeout(fn, ms));
    };

    t(() => setPhase("signal"), 900);
    t(() => {
      setPhase("countdown");
      sound.startAmbient(0.08);
    }, 2200);

    // build the 15 -> 1 countdown timeline
    let cursor = 2200;
    for (let n = 15; n >= 1; n--) {
      const duration = n > 9 ? 480 : n > 4 ? 400 : 320;
      cursor += duration;
      t(() => {
        setCount(n);
        sound.heartbeat();
        if (n === 8 || n === 5) sound.honk(1);
        if (n <= 3) sound.honk(0.7 + Math.random() * 0.6);
        sound.setAmbientLevel(0.08 + (15 - n) * 0.045);
      }, cursor);
    }
    cursor += 500;
    t(() => {
      setPhase("blackout");
      sound.stopAmbient();
    }, cursor);
    cursor += 1100;
    t(() => setPhase("title"), cursor);
    cursor += 900;
    t(() => setTitleStep(1), cursor);
    cursor += 1600;
    t(() => setTitleStep(2), cursor);
    cursor += 1600;
    t(() => setTitleStep(3), cursor);

    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chaos = phase === "countdown" && count <= 3;
  const tense = phase === "countdown" && count <= 8;

  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-ink">
      <div className="grain absolute inset-0" />

      {/* Ambient sound hint */}
      {phase === "dark" && (
        <button
          onClick={sound.toggle}
          className="absolute top-5 right-5 z-10 rounded-full border border-paper/20 px-3 py-1.5 text-xs tracking-wide text-paper/50 uppercase transition hover:border-paper/50 hover:text-paper"
        >
          {sound.enabled ? "Sound on" : "Tap for sound"}
        </button>
      )}

      <AnimatePresence mode="wait">
        {(phase === "signal" || phase === "countdown") && (
          <motion.div
            key="signal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 flex flex-col items-center justify-center ${
              chaos && !reduced ? "animate-shake" : ""
            }`}
          >
            {chaos && !reduced && (
              <div className="speed-lines absolute inset-0 opacity-70" />
            )}
            <div className="relative flex h-40 w-40 items-center justify-center rounded-md border-2 border-paper/30 sm:h-52 sm:w-52">
              {phase === "signal" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="h-16 w-16 rounded-full bg-danger/80 sm:h-20 sm:w-20"
                />
              )}
              {phase === "countdown" && (
                <motion.span
                  key={count}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{
                    opacity: 1,
                    scale: 1 + (15 - count) * 0.045,
                  }}
                  transition={{ duration: 0.22 }}
                  className={`font-display select-none ${
                    tense ? "text-danger" : "text-paper"
                  }`}
                  style={{ fontSize: "clamp(4rem, 14vw, 9rem)" }}
                >
                  {count}
                </motion.span>
              )}
            </div>
            {tense && (
              <p className="mt-6 text-xs tracking-[0.4em] text-paper/40 uppercase">
                every second counts for someone
              </p>
            )}
          </motion.div>
        )}

        {phase === "blackout" && (
          <motion.div
            key="blackout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-ink"
          />
        )}

        {phase === "title" && (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="font-display text-5xl tracking-wide text-paper sm:text-7xl md:text-8xl"
            >
              FIFTEEN SECONDS
            </motion.h1>

            <div className="mt-8 min-h-[4.5rem] max-w-xl font-serif text-lg text-paper/80 italic sm:text-xl">
              <AnimatePresence mode="wait">
                {titleStep === 1 && (
                  <motion.p
                    key="l1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    “A city gave everyone the same amount of time.”
                  </motion.p>
                )}
                {titleStep >= 2 && (
                  <motion.p
                    key="l2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    “But it forgot that people move differently.”
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {titleStep >= 3 && (
                <motion.button
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  onClick={onBegin}
                  className="mt-12 rounded-sm border-2 border-paper px-10 py-3 font-display text-xl tracking-[0.2em] text-paper transition hover:bg-paper hover:text-ink"
                >
                  BEGIN
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
