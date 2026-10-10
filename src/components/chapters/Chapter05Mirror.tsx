import { useRef, useState, type TouchEventHandler, type WheelEventHandler } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChapterLabel, ContinueButton } from "../ui/Shared";
import type { SoundApi } from "../../hooks/useSound";

const COMPLAINTS = ["“Roads are horrible.”", "“Government does nothing.”", "“This city has no discipline.”"];

const CALLOUTS = [
  { x: 14, y: 70, text: "blocking the footpath" },
  { x: 40, y: 35, text: "jumping the signal" },
  { x: 62, y: 60, text: "littering beside the bin" },
  { x: 80, y: 42, text: "parked across the ramp" },
  { x: 28, y: 50, text: "honking without reason" },
];

const MAX_STEP = 4;

export default function Chapter05Mirror({ onNext, sound }: { onNext: () => void; sound: SoundApi }) {
  const [step, setStep] = useState(0);
  const cooldown = useRef(false);
  const touchY = useRef<number | null>(null);

  const bump = (dir: 1 | -1) => {
    if (cooldown.current) return;
    cooldown.current = true;
    window.setTimeout(() => (cooldown.current = false), 550);
    setStep((s) => Math.max(0, Math.min(MAX_STEP, s + dir)));
    sound.pageTurn();
  };

  const onWheel: WheelEventHandler = (e) => {
    e.preventDefault();
    bump(e.deltaY > 0 ? 1 : -1);
  };
  const onTouchStart: TouchEventHandler = (e) => {
    touchY.current = e.touches[0].clientY;
  };
  const onTouchMove: TouchEventHandler = (e) => {
    if (touchY.current === null) return;
    const dy = touchY.current - e.touches[0].clientY;
    if (Math.abs(dy) > 30) {
      bump(dy > 0 ? 1 : -1);
      touchY.current = e.touches[0].clientY;
    }
  };

  const visibleCallouts = CALLOUTS.slice(0, Math.max(0, step));

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-ink outline-none"
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      tabIndex={0}
      aria-label="Scroll or swipe to reveal the mirror"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: "url(/images/mirror-crowd.jpg)",
          filter: step < 1 ? "grayscale(0.3) brightness(0.5)" : "grayscale(0) brightness(0.65)",
        }}
      />
      <div className="absolute inset-0 bg-ink/40" />
      <div className="grain absolute inset-0" />

      <ChapterLabel index={5} title="The Mirror" />

      <div className="pointer-events-none absolute top-20 left-1/2 z-10 -translate-x-1/2 text-center sm:top-24">
        <motion.h2
          key={step < 2 ? "system" : "us"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-display text-3xl tracking-[0.2em] text-paper drop-shadow-lg sm:text-5xl"
        >
          {step < 2 ? "THE SYSTEM" : "US"}
        </motion.h2>
      </div>

      {step < 2 && (
        <div className="absolute top-1/2 left-1/2 z-10 flex w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-3">
          {COMPLAINTS.map((c, i) => (
            <motion.p
              key={c}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.25 }}
              className="rounded-md border border-paper/20 bg-ink/60 px-4 py-2 text-center font-hand text-xl text-paper sm:text-2xl"
            >
              {c}
            </motion.p>
          ))}
        </div>
      )}

      <AnimatePresence>
        {visibleCallouts.map((c) => (
          <motion.div
            key={c.text}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-danger bg-ink/70 px-3 py-1 font-serif text-[11px] text-paper shadow-lg sm:text-xs"
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
          >
            {c.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {step >= MAX_STEP && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-ink/85 px-6 text-center"
        >
          <p className="max-w-lg font-serif text-xl text-paper/90 italic sm:text-2xl">
            “We blamed the system so often
            <br /> that we forgot —<br />a system is made of people.”
          </p>
          <p className="font-serif text-base text-paper/70 italic">“And sometimes, we are the system.”</p>
          <ContinueButton onClick={onNext}>Count the small things</ContinueButton>
        </motion.div>
      )}

      {step < MAX_STEP && (
        <div className="absolute inset-x-0 bottom-20 z-10 flex flex-col items-center gap-2 sm:bottom-24">
          <p className="font-serif text-[11px] tracking-widest text-paper/50 uppercase">
            scroll, swipe, or tap to look closer
          </p>
          <button
            onClick={() => bump(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/30 text-paper/80 transition hover:border-paper/70"
            aria-label="Reveal next detail"
          >
            ↓
          </button>
        </div>
      )}
    </div>
  );
}
