import { motion, useTransform, type MotionValue } from "framer-motion";
import { StorySection, type SceneContext } from "../story/StorySection";
import { Beat } from "../story/Beat";
import { PedestrianFigure } from "../figures/Figures";
import { useDiscrete } from "../../hooks/useDiscrete";
import { PEDESTRIANS } from "../../data/content";
import { envelope, progressIn } from "../../utils/motion";
import { SIGNAL_SECONDS } from "../../utils/countdown";

const TWO_PI = Math.PI * 2;
const LONGEST = PEDESTRIANS[PEDESTRIANS.length - 1].seconds;

/** Each profile gets its own window of scroll; windows never overlap. */
const ROWS = PEDESTRIANS.map((p, i) => {
  const start = 0.12 + i * 0.155;
  return { ...p, start, end: start + 0.13 };
});
type Row = (typeof ROWS)[number];

/** Seconds of the signal that have passed for this row. */
const elapsedFor = (v: number, row: Row): number => SIGNAL_SECONDS * progressIn(v, row.start, row.end);
/** Share of the crossing completed within the signal window (capped at 1). */
const positionFor = (v: number, row: Row): number => Math.min(1, elapsedFor(v, row) / row.seconds);

/** The countdown shown in the header: 15 → 0 inside each profile's window. */
function headerSecondsAt(v: number): number {
  let current = SIGNAL_SECONDS;
  for (const row of ROWS) {
    if (v >= row.start) current = Math.max(0, SIGNAL_SECONDS - Math.floor(elapsedFor(v, row)));
  }
  return current;
}

export default function Chapter02Pace() {
  return (
    <StorySection id="chapter-02" number={2} title="Fifteen Seconds" heightClass="h-[420vh]">
      {(scene) => <ComparisonScene {...scene} />}
    </StorySection>
  );
}

function ComparisonScene({ progress }: SceneContext) {
  const seconds = useDiscrete(progress, headerSecondsAt);
  const finalFade = useTransform(progress, [0.9, 0.95], [0, 0.85]);

  return (
    <div className="absolute inset-0 flex flex-col bg-charcoal">
      <div className="grain absolute inset-0" />

      <div className="relative z-10 flex items-start justify-between gap-6 px-5 pt-16 sm:px-14">
        <Beat progress={progress} from={0} to={0.1} className="max-w-md">
          <p className="font-serif text-base leading-snug text-paper/85 sm:text-lg">
            The signal gives everyone exactly the same window. Five crossings, one after another.
          </p>
        </Beat>
        <div className="shrink-0 text-right">
          <p className="font-display text-[11px] tracking-[0.3em] text-paper/60">SIGNAL</p>
          <p
            className={`font-display text-5xl leading-none sm:text-6xl ${seconds <= 5 ? "text-danger" : "text-paper"}`}
            aria-label={`${seconds} seconds on the signal`}
          >
            {String(seconds).padStart(2, "0")}
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-5 py-6 sm:px-10">
        {ROWS.map((row) => (
          <CrossingRow key={row.id} row={row} progress={progress} />
        ))}
      </div>

      <p className="relative z-10 px-5 pb-5 text-center font-serif text-[11px] tracking-wide text-paper/45 sm:pb-8">
        Crossing times are illustrative story values, not measurements.
      </p>

      <motion.div
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-ink px-6 text-center"
        style={{ opacity: finalFade }}
      >
        <Beat progress={progress} from={0.9}>
          <p className="font-display text-4xl leading-tight tracking-wide text-paper uppercase sm:text-7xl">
            Equal does not always mean fair.
          </p>
        </Beat>
      </motion.div>
    </div>
  );
}

function CrossingRow({ row, progress }: { row: Row; progress: MotionValue<number> }) {
  const x = useTransform(progress, (v) => `${positionFor(v, row) * 86}%`);
  const phase = useTransform(progress, (v) => elapsedFor(v, row) * TWO_PI * 0.9);
  const amp = useTransform(progress, (v) => envelope(v, row.start, row.end, 0.01) * (positionFor(v, row) < 1 ? 1 : 0));
  const reveal = useTransform(progress, [row.start - 0.02, row.start + 0.01], [0, 1]);
  const bar = useTransform(progress, [row.start, row.end], [0, row.seconds / LONGEST]);
  const stranded = row.seconds > SIGNAL_SECONDS;

  return (
    <motion.div style={{ opacity: reveal }} className="w-full">
      <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3">
        <p className="font-serif text-sm text-paper sm:text-base">
          <span className="mr-2 font-display text-2xl text-amber sm:text-3xl">{row.seconds}s</span>
          {row.label}
        </p>
        <p className="font-serif text-xs text-paper/60 italic">{row.desc}</p>
      </div>

      <div className="relative h-14 overflow-hidden rounded-sm border border-paper/20 bg-ink/60">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, rgba(243,237,226,0.9) 0 18px, transparent 18px 36px)",
          }}
        />
        <div className="absolute inset-y-0 right-0 w-px bg-paper/60" aria-hidden="true" />
        <motion.div className="absolute inset-y-0 left-0 w-full" style={{ x }}>
          <div className="absolute bottom-0 left-2">
            <PedestrianFigure kind={row.id} phase={phase} amp={amp} stranded={stranded} className="h-12 w-12" />
          </div>
        </motion.div>
      </div>

      <div className="relative mt-1.5 h-1.5 rounded-full bg-paper/10" aria-hidden="true">
        <motion.div className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-amber" style={{ scaleX: bar }} />
        <div
          className="absolute -top-[3px] -bottom-[3px] w-px bg-danger"
          style={{ left: `${(SIGNAL_SECONDS / LONGEST) * 100}%` }}
        />
      </div>

      {stranded && (
        <Beat progress={progress} from={row.end - 0.005} className="mt-1">
          <p className="font-serif text-xs text-danger">
            The signal turned red at {SIGNAL_SECONDS}s. This crossing needed {row.seconds}.
          </p>
        </Beat>
      )}
    </motion.div>
  );
}


