import { motion, useTransform, type MotionValue } from "framer-motion";
import { StorySection, type SceneContext } from "../story/StorySection";
import { Beat } from "../story/Beat";
import { AVERAGE_FRAGMENTS } from "../../data/content";
import { asset } from "../../utils/asset";
import { SpeechBubble } from "../ui/Primitives";

const FRAGMENT_START = 0.6;
const FRAGMENT_STEP = 0.022;
const FINAL_AT = 0.84;

export default function Chapter04AverageHuman() {
  return (
    <StorySection id="chapter-04" number={4} title="The Average Human" heightClass="h-[300vh]">
      {(scene) => <ControlRoomScene {...scene} />}
    </StorySection>
  );
}

function ControlRoomScene({ progress, reduced }: SceneContext) {
  const zoom = useTransform(progress, [0, 1], reduced ? [1, 1] : [1.04, 1.14]);

  return (
    <div className="absolute inset-0 bg-ink">
      <motion.img
        src={asset("images/control-room.jpg")}
        alt="A dim control room with a wall of monitors showing city data."
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        style={{ scale: zoom }}
      />
      <div className="absolute inset-0 bg-ink/55" />
      <div className="grain absolute inset-0" />

      <div className="absolute top-16 left-1/2 w-[min(90%,22rem)] -translate-x-1/2 rounded-sm border border-paper/30 bg-ink/75 px-5 py-3 text-center font-display tracking-widest text-paper sm:top-20">
        <p className="text-[11px] text-paper/50">MONITOR 04</p>
        <p className="text-xl text-amber sm:text-2xl">AVERAGE PEDESTRIAN</p>
        <p className="text-3xl sm:text-4xl">15 SEC</p>
      </div>

      <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center px-6">
        <Beat progress={progress} from={0.1} to={0.24} className="absolute inset-x-6 flex justify-center">
          <div className="flex flex-col items-center gap-3">
            <img
              src={asset("images/tara-portrait.webp")}
              alt="Tara, looking at the monitor"
              className="h-20 w-20 rounded-full border-2 border-paper/40 object-cover"
            />
            <SpeechBubble>“Average?”</SpeechBubble>
          </div>
        </Beat>
        <Beat progress={progress} from={0.28} to={0.44} className="absolute inset-x-6 flex justify-center">
          <SpeechBubble tail="right">“Most pedestrians can cross within fifteen seconds.”</SpeechBubble>
        </Beat>
        <Beat progress={progress} from={0.48} to={0.6} className="absolute inset-x-6 flex justify-center">
          <div className="flex flex-col items-center gap-3">
            <img
              src={asset("images/tara-portrait.webp")}
              alt="Tara, asking the question"
              className="h-20 w-20 rounded-full border-2 border-paper/40 object-cover"
            />
            <SpeechBubble>“But who is the average pedestrian?”</SpeechBubble>
          </div>
        </Beat>
      </div>

      <div className="absolute inset-x-0 top-[58%] flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-6 text-center">
        {AVERAGE_FRAGMENTS.map((f, i) => (
          <Fragment key={f} label={f} start={FRAGMENT_START + i * FRAGMENT_STEP} progress={progress} />
        ))}
      </div>

      <Beat progress={progress} from={FINAL_AT} className="absolute inset-x-0 bottom-[12%] px-6 text-center">
        <p className="font-display text-3xl leading-tight tracking-wide text-paper drop-shadow-lg sm:text-6xl">
          THERE IS NO AVERAGE PERSON.
        </p>
      </Beat>
    </div>
  );
}

function Fragment({ label, start, progress }: { label: string; start: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [start, start + 0.02], [0, 1]);
  return (
    <motion.span style={{ opacity }} className="font-serif text-lg text-paper/85 italic drop-shadow sm:text-xl">
      {label}
    </motion.span>
  );
}
