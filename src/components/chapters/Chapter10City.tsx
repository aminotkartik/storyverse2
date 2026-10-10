import { motion, useTransform } from "framer-motion";
import { StorySection, type SceneContext } from "../story/StorySection";
import { Beat } from "../story/Beat";
import { useDiscrete } from "../../hooks/useDiscrete";
import { asset } from "../../utils/asset";

const ZOOM_LABELS = ["a crossing", "a street", "a neighbourhood", "a city", "a sea of people"] as const;
const LABEL_FROM = 0.04;
const LABEL_STEP = 0.14;
const FINAL_AT = 0.86;

/** Which zoom level the reader has reached, from 0 (closest) to the last label. */
function labelAt(v: number): number {
  if (v < LABEL_FROM) return -1;
  return Math.min(ZOOM_LABELS.length - 1, Math.floor((v - LABEL_FROM) / LABEL_STEP));
}

export default function Chapter10City() {
  return (
    <StorySection id="chapter-10" number={10} title="The City" heightClass="h-[320vh]">
      {(scene) => <CityScene {...scene} />}
    </StorySection>
  );
}

function CityScene({ progress, reduced }: SceneContext) {
  const level = useDiscrete(progress, labelAt);
  // Start close on the street below the rooftop and pull back to the whole city.
  const scale = useTransform(progress, [0, 0.7], reduced ? [1, 1] : [2.6, 1]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      <motion.img
        src={asset("images/city-aerial.jpg")}
        alt="An aerial view at dusk over a dense city: rooftops, a temple tower, a market street full of rickshaws and people, and a wide river in the distance."
        className="absolute inset-0 h-full w-full object-cover"
        style={{ scale, transformOrigin: "62% 80%" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/50" />
      <div className="grain absolute inset-0" />

      <p className="absolute top-20 left-5 font-display text-[11px] tracking-[0.3em] text-paper/80 sm:left-10" aria-live="polite">
        {level >= 0 ? `VIEW: ${ZOOM_LABELS[level].toUpperCase()}` : "VIEW: A CROSSING"}
      </p>

      <div className="absolute inset-x-0 bottom-[12%] px-6 text-center">
        <Beat progress={progress} from={0.08} to={0.28} className="absolute inset-x-6 bottom-0">
          <p className="font-display text-2xl leading-snug text-paper sm:text-4xl">
            A CITY SHOULD NOT ASK PEOPLE TO BECOME FASTER.
          </p>
        </Beat>
        <Beat progress={progress} from={0.3} to={0.48} className="absolute inset-x-6 bottom-0">
          <p className="font-display text-2xl leading-snug text-amber sm:text-4xl">IT SHOULD LEARN TO BECOME FAIRER.</p>
        </Beat>
        <Beat progress={progress} from={0.5} to={0.64} className="absolute inset-x-6 bottom-0">
          <p className="font-serif text-lg text-paper/85 italic sm:text-xl">“A civil society doesn't begin with big laws.”</p>
        </Beat>
        <Beat progress={progress} from={0.66} to={0.8} className="absolute inset-x-6 bottom-0">
          <p className="font-serif text-lg text-paper/85 italic sm:text-xl">“It begins with small things we choose not to do.”</p>
        </Beat>
        <Beat progress={progress} from={FINAL_AT} className="absolute inset-x-6 bottom-0">
          <p className="font-display text-2xl leading-tight tracking-wide text-paper sm:text-5xl">
            DON'T DESIGN FOR THE AVERAGE HUMAN.
            <br />
            <span className="text-amber">BUILD FOR HUMANITY.</span>
          </p>
        </Beat>
      </div>

      <Beat progress={progress} from={0.92} className="absolute inset-x-0 bottom-5 z-10 flex justify-center">
        <a
          href="#commitments"
          className="font-display text-xs tracking-[0.25em] text-paper/80 underline decoration-amber decoration-2 underline-offset-8 transition hover:text-amber focus-visible:outline-2 focus-visible:outline-amber"
        >
          WHAT WILL YOU NOT DO TODAY? ↓
        </a>
      </Beat>
    </div>
  );
}
