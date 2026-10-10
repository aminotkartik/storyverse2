import { motion, useTransform, type MotionValue } from "framer-motion";
import { StorySection, type SceneContext } from "../story/StorySection";
import { Beat } from "../story/Beat";
import { useDiscrete } from "../../hooks/useDiscrete";
import { CIVIC_STATS, NOTEBOOK_PAGES } from "../../data/content";
import { asset } from "../../utils/asset";
import { progressIn } from "../../utils/motion";

const PAGE_START = 0.04;
const PAGE_STEP = 0.12;
const STATS_FROM = 0.66;
const STATS_TO = 0.8;
const FINAL_AT = 0.86;

/** Which field-note page is in front, or -1 before the first page. */
function pageAt(v: number): number {
  if (v < PAGE_START) return -1;
  return Math.min(NOTEBOOK_PAGES.length - 1, Math.floor((v - PAGE_START) / PAGE_STEP));
}

export default function Chapter06Notebook() {
  return (
    <StorySection id="chapter-06" number={6} title="The Numbers" heightClass="h-[340vh]">
      {(scene) => <NotebookScene {...scene} />}
    </StorySection>
  );
}

function NotebookScene({ progress, reduced }: SceneContext) {
  const page = useDiscrete(progress, pageAt);
  // The desk Tara wrote her notes on, held behind the pages so the paper stays readable.
  const zoom = useTransform(progress, [0, 1], reduced ? [1, 1] : [1.08, 1]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-charcoal">
      <motion.img
        src={asset("images/numbers-notebook.jpg")}
        alt="Tara's desk while she writes up her field notes: the crossing times she recorded by hand."
        className="absolute inset-0 h-full w-full object-cover"
        style={{ scale: zoom, filter: "grayscale(0.4) brightness(0.5) contrast(1.05)" }}
      />
      {/* A heavy veil, so the notebook pages and the tally keep their contrast on any screen. */}
      <div className="absolute inset-0 bg-charcoal/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-transparent to-charcoal/85" />
      <div className="grain absolute inset-0" />

      <div className="absolute top-16 left-5 font-display text-[11px] tracking-[0.3em] text-paper/60 sm:left-10">
        FIELD NOTES {String(Math.max(0, page + 1)).padStart(2, "0")} / {String(NOTEBOOK_PAGES.length).padStart(2, "0")}
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-5">
        {NOTEBOOK_PAGES.map((p, i) => {
          const from = PAGE_START + i * PAGE_STEP;
          return (
            <Beat
              key={p.label}
              progress={progress}
              from={from}
              to={from + PAGE_STEP * 0.9}
              rise={24}
              className="absolute w-full max-w-sm"
            >
              <article className="relative rotate-[-1.5deg] border-2 border-ink bg-paper px-7 py-8 text-ink shadow-[6px_6px_0_0_#0b0b0c]">
                <p className="font-serif text-[11px] tracking-widest text-ink/60 uppercase">
                  Field note {i + 1} / {NOTEBOOK_PAGES.length}
                </p>
                <p className="mt-3 font-display text-7xl leading-none text-danger sm:text-8xl">{p.seconds}</p>
                <p className="mt-2 font-display text-sm tracking-widest text-ink/70">SECONDS NEEDED</p>
                <p className="mt-4 font-hand text-2xl text-ink sm:text-3xl">{p.label}</p>
                <div className="mt-6 h-px w-full bg-ink/20" />
                <p className="mt-3 font-serif text-xs text-ink/60 italic">
                  Written by hand, from observation. Crossing times are story values.
                </p>
              </article>
            </Beat>
          );
        })}
      </div>

      <Beat progress={progress} from={STATS_FROM} to={STATS_TO} className="absolute inset-x-5 top-1/2 mx-auto max-w-md -translate-y-1/2 sm:inset-x-0">
        <div className="rounded-sm border-2 border-ink bg-paper px-6 py-6 text-ink shadow-[6px_6px_0_0_#0b0b0c]">
          <p className="font-display text-xl tracking-wide">WHAT THE CITY TALLIED</p>
          <p className="mt-1 font-serif text-xs text-ink/65 italic">
            Illustrative values from the story, not survey data.
          </p>
          <div className="mt-5 flex flex-col gap-4">
            {CIVIC_STATS.map((s, i) => (
              <StatBar key={s.label} label={s.label} value={s.value} start={STATS_FROM + 0.01 + i * 0.02} progress={progress} />
            ))}
          </div>
        </div>
      </Beat>

      <Beat progress={progress} from={FINAL_AT} className="absolute inset-x-0 bottom-[14%] px-6 text-center">
        <p className="mx-auto max-w-2xl font-display text-2xl leading-snug tracking-wide text-paper uppercase sm:text-5xl">
          The timer wasn't the problem.
          <br />
          <span className="text-amber">The assumption was.</span>
        </p>
      </Beat>
    </div>
  );
}

function StatBar({ label, value, start, progress }: { label: string; value: number; start: number; progress: MotionValue<number> }) {
  const width = useTransform(progress, (v) => `${Math.round(progressIn(v, start, start + 0.08) * value * 100)}%`);
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between font-display text-xs tracking-widest">
        <span>{label}</span>
        <span className="text-danger">{Math.round(value * 100)}%</span>
      </div>
      <div className="h-3 w-full bg-ink/10">
        <motion.div className="h-full bg-danger" style={{ width }} />
      </div>
    </div>
  );
}
