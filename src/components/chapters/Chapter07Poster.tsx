import { motion, useTransform } from "framer-motion";
import { StorySection, type SceneContext } from "../story/StorySection";
import { Beat } from "../story/Beat";
import { useChangeEffect, useDiscrete } from "../../hooks/useDiscrete";
import { useSound } from "../../context/SoundContext";
import { useSlideshow } from "../../context/PresentationContext";
import { POSTER_REACTIONS } from "../../data/content";
import { asset } from "../../utils/asset";

const DROP_FROM = 0.04;
const DROP_TO = 0.16;
const REACT_START = 0.22;
const REACT_STEP = 0.1;
const TURN_START = 0.64;
const TURN_STEP = 0.08;
const DONE_AT = 0.88;
const TURNS = ["Then, one person stops.", "A second person notices.", "A third person follows."] as const;

const TEAR_INDEX = POSTER_REACTIONS.findIndex((r) => r.mood === "tear");

/** Index of the passerby reaction that has started by this point, or -1. */
function reactionAt(v: number): number {
  if (v < REACT_START) return -1;
  return Math.min(POSTER_REACTIONS.length - 1, Math.floor((v - REACT_START) / REACT_STEP));
}

export default function Chapter07Poster() {
  return (
    <StorySection id="chapter-07" number={7} title="Give Them 15 Seconds" heightClass="h-[320vh]">
      {(scene) => <PosterScene {...scene} />}
    </StorySection>
  );
}

function PosterScene({ progress }: SceneContext) {
  const sound = useSound();
  const slideshow = useSlideshow();
  const reaction = useDiscrete(progress, reactionAt);

  useChangeEffect(reaction, (_prev, next) => {
    if (next === TEAR_INDEX) sound.tear();
  });

  const drop = useTransform(progress, [DROP_FROM, DROP_TO], [340, 0]);
  const dropOpacity = useTransform(progress, [DROP_FROM, DROP_TO * 0.8], [0, 1]);
  const tearStart = REACT_START + TEAR_INDEX * REACT_STEP;
  const tear = useTransform(progress, [tearStart, tearStart + 0.02], [0, 1]);

  return (
    <div className="absolute inset-0 bg-ink">
      <img
        src={asset("images/poster-wall.jpg")}
        alt="A weathered street wall with old posters, where a single notice is pasted."
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/50" />
      <div className="grain absolute inset-0" />

      <Beat progress={progress} from={0} to={0.06} className="absolute inset-x-0 top-20 px-6 text-center">
        <p className="font-serif text-base tracking-widest text-paper/80 uppercase sm:text-lg">
          {slideshow.active ? "Use Next to put the notice up" : "Scroll to put the notice up"}
        </p>
      </Beat>

      {/* The notice itself: original artwork, pasted onto the wall as the scene opens. */}
      <motion.div
        style={{ y: drop, opacity: dropOpacity }}
        className="absolute top-[18%] left-1/2 w-40 -translate-x-1/2 sm:w-56"
      >
        <motion.span
          aria-hidden="true"
          style={{ opacity: tear }}
          className="absolute -top-px -right-px z-10 h-8 w-8 bg-charcoal"
        />
        <img
          src={asset("images/poster-notice.jpg")}
          alt="The hand-made campaign notice Tara pastes on the street wall, asking people to give pedestrians their fifteen seconds."
          width={768}
          height={1152}
          className="w-full rotate-[-1deg] border-2 border-ink shadow-[4px_4px_0_0_#0b0b0c]"
        />
      </motion.div>

      <div className="absolute inset-x-0 bottom-[12%] z-10 h-16 px-6 text-center">
        {POSTER_REACTIONS.map((r, i) => {
          const from = REACT_START + i * REACT_STEP;
          return (
            <Beat key={r.reaction} progress={progress} from={from} to={from + REACT_STEP * 0.9} className="absolute inset-x-0 bottom-0">
              <p className="font-serif text-lg text-paper/90 italic sm:text-2xl">A passerby {r.reaction}.</p>
            </Beat>
          );
        })}
        {TURNS.map((line, i) => {
          const from = TURN_START + i * TURN_STEP;
          return (
            <Beat key={line} progress={progress} from={from} to={from + TURN_STEP * 0.9} className="absolute inset-x-0 bottom-0">
              <p className="font-display text-2xl text-amber sm:text-4xl">{line}</p>
            </Beat>
          );
        })}
      </div>

      <Beat progress={progress} from={DONE_AT} className="absolute inset-x-0 bottom-[10%] z-10 px-6 text-center">
        <p className="mx-auto max-w-md font-serif text-lg text-paper/90 italic sm:text-xl">
          Nobody applauded. The street didn't change overnight.
          <br />
          But it noticed, for the first time, that it could.
        </p>
      </Beat>
    </div>
  );
}

