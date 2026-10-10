import { useEffect, useRef, useState, type TouchEventHandler, type WheelEventHandler } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChapterLabel, ContinueButton, WalkingFigure } from "../ui/Shared";
import type { SoundApi } from "../../hooks/useSound";

type Phase = "ready" | "crossing" | "end";

export default function Chapter09ThirtyFour({ onNext, sound }: { onNext: () => void; sound: SoundApi }) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [progress, setProgress] = useState(0);
  const [narrationStep, setNarrationStep] = useState(0);
  const touchY = useRef<number | null>(null);

  const begin = () => {
    setPhase("crossing");
    sound.beep(900);
    sound.startAmbient(0.06);
  };

  const applyDelta = (dy: number) => {
    setProgress((p) => {
      const next = Math.max(0, Math.min(1, p + dy));
      if (next >= 1 && p < 1) {
        sound.stopAmbient();
        sound.chime();
        window.setTimeout(() => setPhase("end"), 600);
      }
      return next;
    });
  };

  const onWheel: WheelEventHandler = (e) => {
    if (phase !== "crossing") return;
    e.preventDefault();
    applyDelta(e.deltaY * 0.0009);
  };
  const onTouchStart: TouchEventHandler = (e) => {
    touchY.current = e.touches[0].clientY;
  };
  const onTouchMove: TouchEventHandler = (e) => {
    if (phase !== "crossing" || touchY.current === null) return;
    const dy = touchY.current - e.touches[0].clientY;
    applyDelta(dy * 0.003);
    touchY.current = e.touches[0].clientY;
  };

  useEffect(() => {
    if (phase !== "end") return;
    const t1 = window.setTimeout(() => setNarrationStep(1), 600);
    const t2 = window.setTimeout(() => setNarrationStep(2), 2600);
    const t3 = window.setTimeout(() => setNarrationStep(3), 5200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [phase]);

  const taraLeft = 16 + progress * 75;
  const daduLeft = 5 + progress * 75;
  const remaining = Math.max(0, 34 - Math.round(progress * 34));

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-ink"
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/crossing-calm.jpg)", filter: "brightness(0.75)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink/80" />
      <div className="grain absolute inset-0" />

      <ChapterLabel index={9} title="34 Seconds" />

      {phase === "crossing" && (
        <div className="absolute top-6 right-6 z-10 font-display text-3xl text-paper/80 sm:top-10 sm:right-12">
          {remaining}
        </div>
      )}

      <div className="relative z-10 flex h-full w-full flex-col">
        <div className="flex-1" />
        {phase !== "ready" && (
          <div className="relative mx-auto mb-[16%] w-[92%] max-w-3xl">
            <div
              className="h-20 w-full rounded-sm opacity-80 sm:h-24"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(243,237,226,0.9) 0 24px, transparent 24px 48px)",
              }}
            />
            <div
              className="absolute -top-16 z-10 -translate-x-1/2 transition-[left] duration-150 ease-out sm:-top-22"
              style={{ left: `${taraLeft}%` }}
            >
              <WalkingFigure
                character="tara"
                walking={phase === "crossing" && progress < 1}
                progress={progress}
              />
            </div>
            <div
              className="absolute -top-8 z-20 -translate-x-1/2 transition-[left] duration-150 ease-out sm:-top-12"
              style={{ left: `${daduLeft}%` }}
            >
              <WalkingFigure
                character="dadu"
                walking={phase === "crossing" && progress < 1}
                progress={progress}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-6 pb-12 text-center sm:pb-20">
          {phase === "ready" && (
            <motion.button
              onClick={begin}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-4"
            >
              <span className="font-display text-7xl text-paper sm:text-8xl">34</span>
              <span className="rounded-sm border border-paper/40 px-5 py-2 font-display text-xs tracking-[0.25em] text-paper/80">
                TAP TO CROSS, THEN SCROLL AT YOUR OWN PACE
              </span>
            </motion.button>
          )}

          {phase === "crossing" && progress < 1 && (
            <p className="font-serif text-xs tracking-widest text-paper/50 uppercase">
              scroll or swipe to walk with them
            </p>
          )}

          <AnimatePresence>
            {phase === "end" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex max-w-lg flex-col items-center gap-5 px-4"
              >
                <p className="font-serif text-paper/80 italic">
                  Dadu reaches the other side. Tara looks back. Traffic has waited. Nobody complains.
                </p>
                <div className="min-h-[5.5rem] space-y-3">
                  <AnimatePresence>
                    {narrationStep >= 1 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-display text-xl text-paper sm:text-2xl"
                      >
                        “The city finally gave them more time.”
                      </motion.p>
                    )}
                    {narrationStep >= 2 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-display text-xl text-paper/80 sm:text-2xl"
                      >
                        “But that wasn't the real change.”
                      </motion.p>
                    )}
                    {narrationStep >= 3 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-display text-xl text-amber sm:text-2xl"
                      >
                        “The real change was that people finally stopped stealing time from one another.”
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                {narrationStep >= 3 && <ContinueButton onClick={onNext}>Zoom out</ContinueButton>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
