import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChapterLabel,
  ContinueButton,
  FadeIn,
  PedestrianFigure,
  type PedestrianType,
} from "../ui/Shared";
import { PEDESTRIANS, type Pedestrian } from "../../data/content";
import type { SoundApi } from "../../hooks/useSound";

const SIGNAL_SECONDS = 15;
const SIM_MS = 3600;

export default function Chapter02Pace({ onNext, sound }: { onNext: () => void; sound: SoundApi }) {
  const [selected, setSelected] = useState<Pedestrian | null>(null);
  const [timer, setTimer] = useState(SIGNAL_SECONDS);
  const [progressPct, setProgressPct] = useState(0);
  const [result, setResult] = useState<"running" | "safe" | "stranded" | null>(null);
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  const rafRef = useRef<number | null>(null);

  const run = (p: Pedestrian) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setSelected(p);
    setResult("running");
    setTimer(SIGNAL_SECONDS);
    setProgressPct(0);
    sound.beep(900);

    const finishesInTime = p.seconds <= SIGNAL_SECONDS && p.outcome !== "stranded";
    const elapsedSeconds = finishesInTime ? p.seconds : SIGNAL_SECONDS;
    const target = finishesInTime ? 100 : Math.min(96, (SIGNAL_SECONDS / p.seconds) * 100);
    const start = performance.now();
    const duration = SIM_MS * (elapsedSeconds / SIGNAL_SECONDS);

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgressPct(t * target);
      setTimer(Math.max(0, Math.round(SIGNAL_SECONDS - t * elapsedSeconds)));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setResult(finishesInTime ? "safe" : "stranded");
        if (!finishesInTime) sound.honk(1);
        else sound.chime();
        setViewed((v) => new Set(v).add(p.id));
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col overflow-y-auto bg-charcoal px-5 pt-20 pb-28 sm:px-12">
      <ChapterLabel index={2} title="Fifteen Seconds" />
      <div className="grain absolute inset-0 pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <FadeIn>
          <p className="mb-8 text-center font-serif text-paper/70">
            The signal gives everyone exactly the same window. Choose a pedestrian and watch their crossing.
          </p>
        </FadeIn>

        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {PEDESTRIANS.map((p) => (
            <button
              key={p.id}
              onClick={() => run(p)}
              className={`rounded-md border px-2 py-3 text-center transition ${
                selected?.id === p.id
                  ? "border-amber bg-amber/10"
                  : "border-paper/20 hover:border-paper/50"
              }`}
            >
              <div className="font-display text-xl text-amber">{p.seconds}s</div>
              <div className="mt-1 font-serif text-[11px] leading-tight text-paper/70">{p.label}</div>
              {viewed.has(p.id) && <div className="mt-1 text-[10px] text-paper/40">✓ seen</div>}
            </button>
          ))}
        </div>

        {/* crossing visualization */}
        <div className="rounded-lg border border-paper/15 bg-ink/40 p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-serif text-sm text-paper/60">
              {selected ? selected.desc : "Select a pedestrian above to begin."}
            </span>
            <span
              className={`font-display text-3xl ${
                result === "stranded" || (selected && selected.seconds > SIGNAL_SECONDS && timer <= 5)
                  ? "text-danger"
                  : "text-paper"
              }`}
            >
              {String(timer).padStart(2, "0")}
            </span>
          </div>

          <div className="relative h-28 w-full overflow-hidden rounded-sm bg-ink/60 sm:h-32">
            {/* Zebra stripes along the road surface */}
            <div
              className="absolute inset-x-0 bottom-2 h-14 opacity-50 sm:h-16"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(243,237,226,0.8) 0 18px, transparent 18px 36px)",
              }}
            />
            {selected && (
              <div
                className="absolute bottom-3 -translate-x-1/2"
                style={{ left: `${6 + (progressPct / 100) * 86}%` }}
              >
                <PedestrianFigure
                  type={selected.id as PedestrianType}
                  walking={result === "running"}
                  progress={progressPct}
                  stranded={result === "stranded"}
                />
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {result === "safe" && selected && (
              <motion.p
                key="safe"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 font-serif text-sm text-paper/80"
              >
                {selected.id === "student"
                  ? "Made it with seconds to spare."
                  : "Made it — just barely, heart pounding."}
              </motion.p>
            )}
            {result === "stranded" && selected && (
              <motion.p
                key="stranded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 font-serif text-sm text-danger"
              >
                Still on the road when the signal turned red. The crossing needed {selected.seconds} seconds.
                The signal gave fifteen.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-14 flex flex-col items-center gap-6 text-center">
          <AnimatePresence>
            {viewed.size > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <p className="font-display text-5xl text-paper sm:text-6xl">15 SEC</p>
                <p className="font-serif text-lg text-paper/70 italic">
                  “Equal does not always mean fair.”
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {viewed.size > 0 && <ContinueButton onClick={onNext}>Look closer</ContinueButton>}
        </div>
      </div>
    </div>
  );
}
