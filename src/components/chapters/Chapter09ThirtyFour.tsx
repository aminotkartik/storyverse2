import { motion, useTransform } from "framer-motion";
import { StorySection, type SceneContext } from "../story/StorySection";
import { Beat, RevealText } from "../story/Beat";
import { CrossingLane } from "../story/CrossingLane";
import { useChangeEffect, useDiscrete } from "../../hooks/useDiscrete";
import { useSound } from "../../context/SoundContext";
import { envelope, progressIn } from "../../utils/motion";
import { asset } from "../../utils/asset";

const TWO_PI = Math.PI * 2;
const elapsedAt = (v: number): number => Math.round(34 * progressIn(v, 0.1, 0.7));
const arrivedAt = (v: number): boolean => v >= 0.7;

export default function Chapter09ThirtyFour() {
  return (
    <StorySection id="chapter-09" number={9} title="34 Seconds" heightClass="h-[300vh]">
      {(scene) => <CalmScene {...scene} />}
    </StorySection>
  );
}

/**
 * The same crossing as Chapter 1, retold at an unhurried pace. Progress follows
 * the visitor's scrolling, so they can pause or reverse; there is no timer.
 */
function CalmScene({ progress, reduced }: SceneContext) {
  const sound = useSound();
  const elapsed = useDiscrete(progress, elapsedAt);
  const arrived = useDiscrete(progress, arrivedAt);

  useChangeEffect(arrived, (_prev, next) => {
    if (next) sound.chime();
  });

  const taraX = useTransform(progress, [0.1, 0.6], ["8%", "74%"]);
  const daduX = useTransform(progress, [0.1, 0.7], ["0%", "78%"]);
  const taraPhase = useTransform(progress, (v) => progressIn(v, 0.1, 0.6) * 0.66 * TWO_PI * 5);
  const daduPhase = useTransform(progress, (v) => progressIn(v, 0.1, 0.7) * 0.78 * TWO_PI * 5);
  const taraAmp = useTransform(progress, (v) => envelope(v, 0.09, 0.61));
  const daduAmp = useTransform(progress, (v) => envelope(v, 0.09, 0.71));

  // The framing opens up and the light settles as they cross.
  const camera = useTransform(progress, [0, 1], reduced ? [1, 1] : [1.12, 1.0]);
  const veil = useTransform(progress, [0, 0.6], [0.55, 0.22]);

  return (
    <div className="absolute inset-0 bg-ink">
      <motion.img
        src={asset("images/crossing-calm.jpg")}
        alt="Tara and Dadu walking together across a sunlit zebra crossing, with an accessibility ramp sign beside them."
        className="absolute inset-0 h-full w-full object-cover object-[center_70%]"
        style={{ scale: camera }}
      />
      <motion.div className="absolute inset-0 bg-ink" style={{ opacity: veil }} />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/85" />
      <div className="grain absolute inset-0" />

      <Beat progress={progress} from={0.02} to={0.2} className="absolute top-16 left-5 max-w-xs sm:left-10">
        <p className="font-serif text-lg leading-snug text-paper/90 italic sm:text-xl">
          The same crossing, another morning.
        </p>
      </Beat>

      <div className="absolute top-16 right-5 flex flex-col items-end sm:right-10" aria-hidden="true">
        <p className="font-display text-[11px] tracking-[0.3em] text-paper/60">TIME TAKEN</p>
        <span className="font-display text-5xl leading-none text-paper/90 sm:text-6xl">
          {String(elapsed).padStart(2, "0")}
          <span className="ml-1 text-2xl text-paper/50">s</span>
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-[38%]">
        <CrossingLane
          tara={{ x: taraX, phase: taraPhase, amp: taraAmp }}
          dadu={{ x: daduX, phase: daduPhase, amp: daduAmp }}
        />
      </div>

      <Beat progress={progress} from={0.66} to={0.8} className="absolute top-40 left-5 max-w-xs sm:left-10 sm:top-44">
        <p className="font-serif text-base leading-snug text-paper/85 italic sm:text-lg">
          Dadu reaches the other side. Tara looks back. Traffic has waited. Nobody complains.
        </p>
      </Beat>

      <div className="absolute inset-x-0 bottom-[8%] flex flex-col items-center gap-3 px-6 text-center">
        <Beat progress={progress} from={0.82} className="max-w-2xl">
          <p className="font-display text-xl leading-snug text-paper sm:text-3xl">
            “The city finally gave them more time.”
          </p>
        </Beat>
        <Beat progress={progress} from={0.87} className="max-w-2xl">
          <p className="font-display text-lg leading-snug text-paper/80 sm:text-2xl">
            “But that wasn't the real change.”
          </p>
        </Beat>
        <Beat progress={progress} from={0.92} className="max-w-2xl">
          <p className="font-display text-xl leading-snug text-amber sm:text-2xl">
            <RevealText
              text="“The real change was that people finally stopped stealing time from one another.”"
              progress={progress}
              from={0.92}
              to={0.99}
            />
          </p>
        </Beat>
      </div>
    </div>
  );
}
