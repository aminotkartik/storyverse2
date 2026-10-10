import { useState } from "react";
import { AnimatePresence, motion, useTransform, type MotionValue } from "framer-motion";
import { StorySection, type SceneContext } from "../story/StorySection";
import { Beat } from "../story/Beat";
import { useChangeEffect, useDiscrete } from "../../hooks/useDiscrete";
import { useSound } from "../../context/SoundContext";
import { HOTSPOTS } from "../../data/content";
import { asset } from "../../utils/asset";

const FIRST_REVEAL = 0.14;
const REVEAL_STEP = 0.14;

/** Index of the most recently revealed hotspot, or -1 before the first one. */
function latestAt(v: number): number {
  if (v < FIRST_REVEAL) return -1;
  return Math.min(HOTSPOTS.length - 1, Math.floor((v - FIRST_REVEAL) / REVEAL_STEP));
}

export default function Chapter03LookAgain() {
  return (
    <StorySection id="chapter-03" number={3} title="Look Again" heightClass="h-[300vh]">
      {(scene) => <StreetScene {...scene} />}
    </StorySection>
  );
}

function StreetScene({ progress, reduced }: SceneContext) {
  const sound = useSound();
  const latest = useDiscrete(progress, latestAt);
  // A manual pick only applies to the hotspot set it was made in; scrolling on
  // to a new hotspot hands control back to the scroll position.
  const [picked, setPicked] = useState<{ at: number; index: number } | null>(null);

  useChangeEffect(latest, (prev, next) => {
    if (next > prev) sound.beep(1100);
  });

  const shown = picked && picked.at === latest ? picked.index : latest;
  const spot = shown >= 0 ? HOTSPOTS[shown] : null;

  const pan = useTransform(progress, [0, 1], reduced ? ["0%", "0%"] : ["1.5%", "-1.5%"]);
  const zoom = useTransform(progress, [0, 0.9], reduced ? [1, 1] : [1.08, 1.02]);

  return (
    <div className="absolute inset-0 bg-ink">
      <motion.img
        src={asset("images/lookagain-street.jpg")}
        alt="A busy street: a car parked on the footpath, a garbage heap by the bin, a car on the zebra crossing, a motorbike, a blocked accessibility ramp, and a honking driver."
        className="absolute inset-0 h-full w-full object-cover"
        style={{ x: pan, scale: zoom, filter: "grayscale(0.15) brightness(0.8)" }}
      />
      <div className="absolute inset-0 bg-ink/30" />
      <div className="grain absolute inset-0" />

      <Beat progress={progress} from={0} to={0.13} className="absolute inset-x-0 top-20 text-center">
        <h3 className="font-display text-4xl tracking-widest text-paper drop-shadow-lg sm:text-6xl">LOOK AGAIN.</h3>
      </Beat>

      <p className="absolute bottom-[calc(38%+1rem)] left-5 font-display text-[11px] tracking-[0.25em] text-paper/80 sm:left-10 sm:bottom-auto sm:top-44">
        {String(Math.max(0, latest + 1)).padStart(2, "0")} / {String(HOTSPOTS.length).padStart(2, "0")} NOTICED
      </p>

      {HOTSPOTS.map((spotData, i) => (
        <Marker
          key={spotData.id}
          index={i}
          label={spotData.label}
          x={spotData.x}
          y={spotData.y}
          progress={progress}
          selected={shown === i}
          revealed={i <= latest}
          onSelect={() => setPicked({ at: latest, index: i })}
        />
      ))}

      <div className="absolute inset-x-0 bottom-6 flex justify-center px-4 sm:bottom-10">
        <AnimatePresence mode="wait">
          {spot && (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md rounded-sm border-2 border-ink bg-paper px-5 py-4 text-ink shadow-[5px_5px_0_0_#0b0b0c]"
              role="status"
            >
              <p className="font-display text-xs tracking-[0.2em] text-danger uppercase">{spot.label}</p>
              <p className="mt-1 font-hand text-xl leading-snug whitespace-pre-line sm:text-2xl">{spot.reveal}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Beat progress={progress} from={0.86} className="absolute inset-x-0 top-20 px-6 text-center">
        <p className="mx-auto max-w-lg font-serif text-xl leading-snug text-paper italic drop-shadow-lg sm:text-3xl">
          Nothing here was hidden.
          <br />
          We just stopped looking.
        </p>
      </Beat>
    </div>
  );
}

function Marker({
  index,
  label,
  x,
  y,
  progress,
  selected,
  revealed,
  onSelect,
}: {
  index: number;
  label: string;
  x: number;
  y: number;
  progress: MotionValue<number>;
  selected: boolean;
  revealed: boolean;
  onSelect: () => void;
}) {
  const start = FIRST_REVEAL + index * REVEAL_STEP;
  const opacity = useTransform(progress, [start - 0.01, start + 0.02], [0, 1]);
  const ring = useTransform(progress, [start, start + 0.07], [0, 1]);

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={!revealed}
      style={{ left: `${x}%`, top: `${y}%`, opacity }}
      aria-label={`${label}: show what it shows`}
      aria-pressed={selected}
      className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full disabled:pointer-events-none"
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <motion.circle
          cx={24}
          cy={24}
          r={20}
          fill="none"
          stroke="#c73e2d"
          strokeWidth={1.8}
          style={{ pathLength: ring }}
          transform="rotate(-90 24 24)"
        />
      </svg>
      <span
        className={`h-3 w-3 rounded-full border-2 ${
          selected ? "border-paper bg-paper" : "border-danger bg-danger animate-pulse-soft"
        }`}
      />
    </motion.button>
  );
}
