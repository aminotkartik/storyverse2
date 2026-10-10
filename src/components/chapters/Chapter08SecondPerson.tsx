import { motion } from "framer-motion";
import { StorySection, type SceneContext } from "../story/StorySection";
import { Beat } from "../story/Beat";
import { useDiscrete } from "../../hooks/useDiscrete";
import { setChainChoice, useChainChoices, type ChainChoice } from "../../state/chainChoices";
import { useSound } from "../../context/SoundContext";
import { CHAIN_STEPS } from "../../data/content";
import { cn } from "../../utils/cn";

type Choice = ChainChoice;

const FIRST_AT = 0.08;
const STEP_SPAN = 0.24;
const STEP_WINDOW = 0.21;
const FINAL_AT = 0.86;

const stepStart = (i: number): number => FIRST_AT + i * STEP_SPAN;

/** Index of the step currently in front of the reader, or -1. */
function activeStepAt(v: number): number {
  for (let i = CHAIN_STEPS.length - 1; i >= 0; i--) {
    if (v >= stepStart(i) && v < stepStart(i) + STEP_WINDOW) return i;
  }
  return -1;
}

export default function Chapter08SecondPerson() {
  return (
    <StorySection id="chapter-08" number={8} title="The Second Person" heightClass="h-[320vh]">
      {(scene) => <ChoiceScene {...scene} />}
    </StorySection>
  );
}

/**
 * Three small choices. Every choice is optional and nothing waits for one:
 * scrolling always moves the story on, and a choice can be changed at any time
 * while its step is in view.
 */
function ChoiceScene({ progress }: SceneContext) {
  const sound = useSound();
  const active = useDiscrete(progress, activeStepAt);
  // Choices live in a shared store so they persist across Prev/Next and mode switches.
  const choices = useChainChoices();

  const choose = (i: number, choice: Choice) => {
    setChainChoice(i, choice);
    if (choice === "responsible") sound.chime();
    else sound.honk(0.6);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-charcoal px-5">
      <div className="grain absolute inset-0" />

      {CHAIN_STEPS.map((step, i) => {
        const from = stepStart(i);
        const isActive = active === i;
        const choice = choices[i];
        return (
          <Beat key={step.prompt} progress={progress} from={from} to={from + STEP_WINDOW} className="absolute inset-x-5 mx-auto max-w-lg text-center">
            <div className="flex flex-col items-center gap-6">
              <p className="font-serif text-xs tracking-widest text-paper/50 uppercase">
                choice {i + 1} / {CHAIN_STEPS.length}
              </p>
              <p className="font-serif text-lg text-paper/90 sm:text-xl">{step.prompt}</p>

              <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  disabled={!isActive}
                  aria-pressed={choice === "careless"}
                  onClick={() => choose(i, "careless")}
                  className={cn(
                    "rounded-sm border px-5 py-3 font-display text-sm tracking-wide transition focus-visible:outline-2 focus-visible:outline-amber disabled:opacity-60",
                    choice === "careless"
                      ? "border-danger text-danger"
                      : "border-paper/40 text-paper/80 hover:border-danger hover:text-danger"
                  )}
                >
                  “{step.careless}”
                </button>
                <button
                  type="button"
                  disabled={!isActive}
                  aria-pressed={choice === "responsible"}
                  onClick={() => choose(i, "responsible")}
                  className={cn(
                    "rounded-sm border px-5 py-3 font-display text-sm tracking-wide transition focus-visible:outline-2 focus-visible:outline-amber disabled:opacity-60",
                    choice === "responsible"
                      ? "border-amber bg-amber/15 text-amber"
                      : "border-paper/40 text-paper/80 hover:border-amber hover:text-amber"
                  )}
                >
                  “{step.responsible}”
                </button>
              </div>

              <p className="min-h-[3.5rem] font-serif text-sm text-paper/70 italic" aria-live="polite">
                {choice === "responsible" && step.consequence}
                {choice === "careless" && "Nothing is punished here. Choose again, or keep scrolling."}
              </p>
            </div>
          </Beat>
        );
      })}

      <Beat progress={progress} from={FINAL_AT} className="absolute inset-x-0 bottom-[12%] px-6 text-center">
        <div className="flex flex-col items-center gap-5">
          <div className="flex gap-3" aria-label={`${choices.filter((c) => c === "responsible").length} of ${CHAIN_STEPS.length} responsible choices`}>
            {CHAIN_STEPS.map((_, i) => (
              <motion.span
                key={i}
                animate={{ scale: choices[i] === "responsible" ? 1.1 : 1 }}
                className={cn(
                  "h-8 w-8 rounded-full border-2 sm:h-10 sm:w-10",
                  choices[i] === "responsible" ? "border-amber bg-amber/30" : "border-paper/30"
                )}
              />
            ))}
          </div>
          <p className="font-display text-2xl leading-snug text-paper uppercase sm:text-4xl">One person can't change the city.</p>
          <p className="font-display text-2xl text-amber uppercase sm:text-4xl">The second can.</p>
        </div>
      </Beat>
    </div>
  );
}
