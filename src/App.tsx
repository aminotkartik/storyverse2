import { useEffect } from "react";
import NavChrome from "./components/NavChrome";
import IntroSequence from "./components/IntroSequence";
import Chapter01Crossing from "./components/chapters/Chapter01Crossing";
import Chapter02Pace from "./components/chapters/Chapter02Pace";
import Chapter03LookAgain from "./components/chapters/Chapter03LookAgain";
import Chapter04AverageHuman from "./components/chapters/Chapter04AverageHuman";
import Chapter05Mirror from "./components/chapters/Chapter05Mirror";
import Chapter06Notebook from "./components/chapters/Chapter06Notebook";
import Chapter07Poster from "./components/chapters/Chapter07Poster";
import Chapter08SecondPerson from "./components/chapters/Chapter08SecondPerson";
import Chapter09ThirtyFour from "./components/chapters/Chapter09ThirtyFour";
import Chapter10City from "./components/chapters/Chapter10City";
import Ending from "./components/Ending";
import FinalScreen from "./components/FinalScreen";
import { SoundProvider, useSound } from "./context/SoundContext";
import { useActiveSectionId } from "./hooks/useInView";
import { SECTIONS } from "./data/content";

const SECTION_IDS = SECTIONS.map((s) => s.id);
/** Sections whose ambient bed is allowed to run. Everywhere else it is stopped. */
const AMBIENT_SECTIONS = new Set(["opening", "chapter-01"]);

export default function App() {
  return (
    <SoundProvider>
      <StoryShell />
    </SoundProvider>
  );
}

/**
 * A single continuous document. Each story section is a tall scroll track with
 * a sticky stage, so the page scrolls natively: nothing intercepts the wheel or
 * touch, and no key or click is needed to move on.
 */
function StoryShell() {
  const sound = useSound();
  const activeId = useActiveSectionId(SECTION_IDS);

  useEffect(() => {
    if (activeId && !AMBIENT_SECTIONS.has(activeId)) sound.stopAmbient();
  }, [activeId]);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-sm bg-paper px-4 py-2 font-display text-sm text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to the story
      </a>
      <NavChrome activeId={activeId} />
      <main id="main" className="relative bg-ink text-paper">
        <IntroSequence />
        <Chapter01Crossing />
        <Chapter02Pace />
        <Chapter03LookAgain />
        <Chapter04AverageHuman />
        <Chapter05Mirror />
        <Chapter06Notebook />
        <Chapter07Poster />
        <Chapter08SecondPerson />
        <Chapter09ThirtyFour />
        <Chapter10City />
        <Ending />
        <FinalScreen />
      </main>
    </>
  );
}
