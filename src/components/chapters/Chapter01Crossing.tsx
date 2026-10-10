import { motion, useTransform } from "framer-motion";
import { StorySection, type SceneContext } from "../story/StorySection";
import { Beat } from "../story/Beat";
import { CrossingLane } from "../story/CrossingLane";
import { SpeechBubble } from "../ui/Primitives";
import { useChangeEffect, useDiscrete } from "../../hooks/useDiscrete";
import { useSound } from "../../context/SoundContext";
import { envelope, progressIn } from "../../utils/motion";
import { secondsLeft } from "../../utils/countdown";
import { asset } from "../../utils/asset";
import { cn } from "../../utils/cn";

const TWO_PI = Math.PI * 2;
const countdownAt = (v: number): number => secondsLeft(v, 0.2, 0.8);

export default function Chapter01Crossing() {
  return (
    <StorySection id="chapter-01" number={1} title="The Crossing" heightClass="h-[330vh]">
      {(scene) => <CrossingScene {...scene} />}
    </StorySection>
  );
}

function CrossingScene({ progress, reduced }: SceneContext) {
  const sound = useSound();
  const count = useDiscrete(progress, countdownAt);

  useChangeEffect(count, (prev, next) => {
    if (next >= prev) return;
    if (next === 14) {
      sound.beep(1200);
      sound.startAmbient(0.15);
    } else if (next === 8 || next === 5) {
      sound.honk(1);
    } else if (next <= 3 && next > 0) {
      sound.honk(0.6 + Math.random());
    }
    if (next === 0) sound.stopAmbient();
    else sound.setAmbientLevel(0.15 + (15 - next) * 0.03);
  });

  // Tara sets a brisk pace; Dadu is slower, and both stop when the signal runs out.
  const taraX = useTransform(progress, [0.2, 0.8], ["8%", "80%"]);
  const daduX = useTransform(progress, [0.2, 0.8], ["0%", "42%"]);
  const taraPhase = useTransform(progress, (v) => progressIn(v, 0.2, 0.8) * 0.72 * TWO_PI * 5);
  const daduPhase = useTransform(progress, (v) => progressIn(v, 0.2, 0.8) * 0.42 * TWO_PI * 5);
  const taraAmp = useTransform(progress, (v) => envelope(v, 0.19, 0.81));
  const daduAmp = useTransform(progress, (v) => envelope(v, 0.19, 0.8));

  const camera = useTransform(progress, [0, 0.85], reduced ? [1, 1] : [1.06, 1.16]);
  const tension = useTransform(progress, [0.45, 0.82], [0, 0.85]);
  const speed = useTransform(progress, [0.62, 0.8], [0, 0.45]);
  const redFlash = useTransform(progress, [0.78, 0.84], [0, 0.16]);
  const lanesFade = useTransform(progress, [0.84, 0.9], [1, 0.1]);
  const closeUp = useTransform(progress, [0.86, 0.93], [0, 1]);

  return (
    <div className="absolute inset-0 bg-ink">
      <motion.img
        src={asset("images/crossing-chaotic.jpg")}
        alt="Tara with her backpack and Dadu leaning on his cane at a crossing. The red pedestrian signal reads 17, and buses and motorbikes fill the road."
        className="absolute inset-0 h-full w-full object-cover object-[center_60%]"
        style={{ scale: camera, filter: "grayscale(0.1) brightness(0.62)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/10 to-ink/90" />
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: tension,
          background: "radial-gradient(ellipse at 50% 55%, transparent 38%, rgba(11,11,12,0.95) 100%)",
        }}
      />
      <motion.div className="speed-lines pointer-events-none absolute inset-0" style={{ opacity: speed }} />
      <motion.div className="pointer-events-none absolute inset-0 bg-danger" style={{ opacity: redFlash }} />
      <div className="grain absolute inset-0" />

      <Beat progress={progress} from={0.02} to={0.2} className="absolute top-16 left-5 max-w-xs sm:left-10">
        <p className="font-serif text-lg leading-snug text-paper/90 italic sm:text-xl">
          Tara is ready. Dadu is still finding his footing.
        </p>
      </Beat>

      <div className="absolute inset-x-0 top-[12%] flex flex-col items-center" aria-live="off">
        <p className="font-display text-[11px] tracking-[0.3em] text-paper/70">SIGNAL</p>
        <motion.span
          key={count}
          initial={{ opacity: 0.4, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "font-display leading-none select-none",
            count <= 5 ? "text-danger" : "text-paper"
          )}
          style={{ fontSize: "clamp(3.5rem, 12vw, 7rem)" }}
        >
          <span aria-label={`${count} seconds left`}>{String(count).padStart(2, "0")}</span>
        </motion.span>
        <Beat progress={progress} from={0.8} className="mt-2">
          <p className="font-serif text-sm tracking-widest text-danger uppercase">The signal turned red.</p>
        </Beat>
      </div>

      <motion.div className="absolute inset-x-0 bottom-[12%]" style={{ opacity: lanesFade }}>
        <CrossingLane
          tara={{ x: taraX, phase: taraPhase, amp: taraAmp }}
          dadu={{ x: daduX, phase: daduPhase, amp: daduAmp }}
        />
      </motion.div>

      <motion.div
        style={{ opacity: closeUp }}
        className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-ink/85 px-6 text-center"
        aria-hidden={false}
      >
        <img
          src={asset("images/dadu-portrait.webp")}
          alt="Close-up of Dadu, out of breath at the edge of the crossing"
          width={144}
          height={144}
          loading="lazy"
          className="h-28 w-28 rounded-full border-2 border-paper/40 object-cover object-top sm:h-36 sm:w-36"
        />
        <SpeechBubble>“Maine kya galat kiya?”</SpeechBubble>
        <p className="max-w-sm font-serif text-xs text-paper/60 italic">(“What did I do wrong?”)</p>
      </motion.div>
    </div>
  );
}
