import { motion, useTransform, type MotionValue } from "framer-motion";
import { StorySection, type SceneContext } from "../story/StorySection";
import { Beat } from "../story/Beat";
import { asset } from "../../utils/asset";

const COMPLAINTS = ["“Roads are horrible.”", "“Government does nothing.”", "“This city has no discipline.”"];

const CALLOUTS = [
  { x: 14, y: 70, text: "blocking the footpath" },
  { x: 40, y: 35, text: "jumping the signal" },
  { x: 62, y: 60, text: "littering beside the bin" },
  { x: 80, y: 42, text: "parked across the ramp" },
  { x: 28, y: 50, text: "honking without reason" },
];

const SHIFT_AT = 0.5;
const CALLOUT_START = 0.56;
const CALLOUT_STEP = 0.06;
const FINAL_AT = 0.88;

export default function Chapter05Mirror() {
  return (
    <StorySection id="chapter-05" number={5} title="The Mirror" heightClass="h-[320vh]">
      {(scene) => <MirrorScene {...scene} />}
    </StorySection>
  );
}

function MirrorScene({ progress }: SceneContext) {
  const grey = useTransform(progress, [SHIFT_AT - 0.04, SHIFT_AT + 0.06], [0.35, 0]);
  const bright = useTransform(progress, [SHIFT_AT - 0.04, SHIFT_AT + 0.06], [0.5, 0.65]);
  const filter = useTransform(
    [grey, bright] as MotionValue<number>[],
    ([g, b]: number[]) => `grayscale(${g}) brightness(${b})`
  );

  return (
    <div className="absolute inset-0 bg-ink">
      <motion.img
        src={asset("images/mirror-crowd.jpg")}
        alt="A crowd on a city street, with a honking driver, a car on the footpath, litter and a stray dog."
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter }}
      />
      <div className="absolute inset-0 bg-ink/40" />
      <div className="grain absolute inset-0" />

      <Beat progress={progress} from={0} to={SHIFT_AT} className="absolute inset-x-0 top-20 text-center">
        <h3 className="font-display text-3xl tracking-[0.2em] text-paper drop-shadow-lg sm:text-5xl">THE SYSTEM</h3>
      </Beat>
      <Beat progress={progress} from={SHIFT_AT} className="absolute inset-x-0 top-20 text-center">
        <h3 className="font-display text-3xl tracking-[0.2em] text-paper drop-shadow-lg sm:text-5xl">US</h3>
      </Beat>

      <div className="absolute top-1/2 left-1/2 flex w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-3">
        {COMPLAINTS.map((c, i) => (
          <Beat key={c} progress={progress} from={0.04 + i * 0.07} to={SHIFT_AT} className="w-full">
            <p className="rounded-md border border-paper/20 bg-ink/60 px-4 py-2 text-center font-hand text-xl text-paper sm:text-2xl">
              {c}
            </p>
          </Beat>
        ))}
      </div>

      {CALLOUTS.map((c, i) => (
        <Callout key={c.text} {...c} start={CALLOUT_START + i * CALLOUT_STEP} progress={progress} />
      ))}

      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <Beat progress={progress} from={FINAL_AT} className="flex flex-col items-center gap-6 bg-ink/85 px-6 py-10 text-center">
          <p className="max-w-lg font-serif text-xl text-paper/90 italic sm:text-2xl">
            “We blamed the system so often
            <br /> that we forgot —<br />a system is made of people.”
          </p>
          <p className="font-serif text-base text-paper/70 italic">“And sometimes, we are the system.”</p>
        </Beat>
      </div>
    </div>
  );
}

function Callout({ x, y, text, start, progress }: { x: number; y: number; text: string; start: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [start, start + 0.03], [0, 1]);
  const scale = useTransform(progress, [start, start + 0.03], [0.6, 1]);
  return (
    <motion.div
      style={{ left: `${x}%`, top: `${y}%`, opacity, scale }}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-danger bg-ink/70 px-3 py-1 font-serif text-[11px] whitespace-nowrap text-paper shadow-lg sm:text-xs"
    >
      {text}
    </motion.div>
  );
}
