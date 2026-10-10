import { motion, useTransform } from "framer-motion";
import { StorySection, type SceneContext } from "./story/StorySection";
import { Beat, RevealText } from "./story/Beat";
import { useChangeEffect, useDiscrete } from "../hooks/useDiscrete";
import { useSound } from "../context/SoundContext";
import { useSlideshow } from "../context/PresentationContext";
import { secondsLeft } from "../utils/countdown";
import { asset } from "../utils/asset";
import { cn } from "../utils/cn";

/** -1 while the signal is still dark, then the countdown digit, then 0 once it has run out. */
const introAt = (v: number): number => (v < 0.2 ? -1 : secondsLeft(v, 0.2, 0.8));

export default function IntroSequence() {
  return (
    <StorySection id="opening" title="Fifteen Seconds" heightClass="h-[300vh]">
      {(scene) => <IntroScene {...scene} />}
    </StorySection>
  );
}

function IntroScene({ progress, reduced }: SceneContext) {
  const sound = useSound();
  const count = useDiscrete(progress, introAt);
  const slideshow = useSlideshow();

  useChangeEffect(count, (prev, next) => {
    if (prev === -1 && next > 0) sound.startAmbient(0.1);
    if (next === 0 && prev > 0) {
      sound.stopAmbient();
      sound.heartbeat();
      return;
    }
    if (next < prev && next > 0) {
      if (next === 8 || next === 5) sound.honk(1);
      else if (next <= 3) sound.honk(0.7 + Math.random() * 0.6);
      else sound.heartbeat();
      sound.setAmbientLevel(0.1 + (15 - next) * 0.04);
    }
  });

  const photo = useTransform(progress, [0, 0.12, 0.5], [0.16, 0.2, 0.42]);
  const photoScale = useTransform(progress, [0, 0.8], reduced ? [1, 1] : [1.14, 1.04]);
  const dark = useTransform(progress, [0, 0.2], [0.9, 0.78]);
  const tension = useTransform(progress, [0.45, 0.85], [0, 0.9]);
  const signal = useTransform(progress, [0, 0.1, 0.2], [0.45, 0.7, 1]);
  const redGlow = useTransform(progress, [0.6, 0.8], [0, 0.25]);

  return (
    <div className="absolute inset-0 bg-ink">
      <motion.img
        src={asset("images/crossing-chaotic.jpg")}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover grayscale"
        style={{ opacity: photo, scale: photoScale }}
      />
      <motion.div className="absolute inset-0 bg-ink" style={{ opacity: dark }} />
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: tension,
          background: "radial-gradient(ellipse at 50% 45%, transparent 30%, rgba(11,11,12,0.96) 100%)",
        }}
      />
      <motion.div className="pointer-events-none absolute inset-0 bg-danger" style={{ opacity: redGlow }} />
      <div className="grain absolute inset-0" />

      <motion.div
        style={{ opacity: signal }}
        className="absolute top-[16%] left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-md border-2 border-paper/30 sm:h-20 sm:w-20">
          <span className="h-6 w-6 rounded-full bg-danger shadow-[0_0_28px_rgba(199,62,45,0.85)] sm:h-8 sm:w-8" />
        </div>
      </motion.div>

      <div className="absolute inset-x-0 top-[30%] flex flex-col items-center" aria-hidden="true">
        {count > 0 && (
          <>
            <motion.span
              key={count}
              initial={{ opacity: 0.35, scale: 1.14 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "font-display leading-none select-none",
                count <= 5 ? "text-danger" : "text-paper"
              )}
              style={{ fontSize: "clamp(6rem, 24vw, 15rem)" }}
            >
              {count}
            </motion.span>
            {count <= 8 && (
              <p className="mt-4 font-serif text-xs tracking-[0.4em] text-paper/50 uppercase">
                every second counts for someone
              </p>
            )}
          </>
        )}
      </div>

      <Beat progress={progress} from={0} to={0.07} className="absolute inset-x-0 bottom-[16%] text-center">
        <p className="font-serif text-xs tracking-[0.35em] text-paper/60 uppercase">
          {slideshow.active ? "Use Next to begin the crossing" : "Scroll to begin the crossing"}
        </p>
      </Beat>

      <Beat
        progress={progress}
        from={0.8}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      >
        <h1 className="font-display text-5xl tracking-wide text-paper sm:text-7xl md:text-8xl">FIFTEEN SECONDS</h1>
        <p className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-paper/85 italic sm:text-2xl">
          <RevealText
            text="A city gave everyone the same amount of time. But it forgot that people move differently."
            progress={progress}
            from={0.86}
            to={0.99}
          />
        </p>
      </Beat>
    </div>
  );
}
