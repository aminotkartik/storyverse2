import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingScreen from "./components/LoadingScreen";
import IntroSequence from "./components/IntroSequence";
import NavChrome from "./components/NavChrome";
import Ending from "./components/Ending";
import FinalScreen from "./components/FinalScreen";
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
import { useSound } from "./hooks/useSound";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { CHAPTERS } from "./data/content";

export type Stage = "loading" | "intro" | "chapter" | "ending" | "final";

export default function App() {
  const [stage, setStage] = useState<Stage>("loading");
  const [chapterIndex, setChapterIndex] = useState(1);
  const [presentationMode, setPresentationMode] = useState(false);
  const sound = useSound();
  const reduced = useReducedMotion();

  const goNext = useCallback(() => {
    setStage((s) => {
      if (s === "chapter") {
        if (chapterIndex < CHAPTERS.length) {
          setChapterIndex((i) => i + 1);
          return "chapter";
        }
        return "ending";
      }
      if (s === "ending") return "final";
      return s;
    });
  }, [chapterIndex]);

  const goPrev = useCallback(() => {
    setStage((s) => {
      if (s === "chapter") {
        if (chapterIndex > 1) {
          setChapterIndex((i) => i - 1);
          return "chapter";
        }
        return s;
      }
      if (s === "ending") {
        setChapterIndex(CHAPTERS.length);
        return "chapter";
      }
      return s;
    });
  }, [chapterIndex]);

  const jumpTo = useCallback((n: number) => {
    if (n <= CHAPTERS.length) {
      setChapterIndex(n);
      setStage("chapter");
    } else {
      setStage("ending");
    }
  }, []);

  // keyboard shortcuts: arrows for navigation, P for presentation mode, E to restart
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key.toLowerCase() === "p") {
        setPresentationMode((p) => {
          const turningOn = !p;
          if (turningOn) {
            setStage("chapter");
            setChapterIndex(1);
          }
          return !p;
        });
      } else if (e.key.toLowerCase() === "e") {
        setPresentationMode(false);
        setStage("loading");
        setChapterIndex(1);
      } else if (stage === "chapter") {
        if (e.key === "ArrowRight") goNext();
        if (e.key === "ArrowLeft") goPrev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [stage, goNext, goPrev]);

  const chapterTitle = useMemo(
    () => CHAPTERS.find((c) => c.id === chapterIndex)?.title ?? "",
    [chapterIndex]
  );

  const chapterNode = () => {
    const common = { onNext: goNext, sound };
    switch (chapterIndex) {
      case 1:
        return <Chapter01Crossing {...common} />;
      case 2:
        return <Chapter02Pace {...common} />;
      case 3:
        return <Chapter03LookAgain {...common} />;
      case 4:
        return <Chapter04AverageHuman {...common} />;
      case 5:
        return <Chapter05Mirror {...common} />;
      case 6:
        return <Chapter06Notebook {...common} />;
      case 7:
        return <Chapter07Poster {...common} />;
      case 8:
        return <Chapter08SecondPerson {...common} />;
      case 9:
        return <Chapter09ThirtyFour {...common} />;
      case 10:
        return <Chapter10City onNext={goNext} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen overflow-hidden bg-ink font-serif text-paper">
      <span className="sr-only" role="status" aria-live="polite">
        {stage === "chapter" ? `Chapter ${chapterIndex} of ${CHAPTERS.length}: ${chapterTitle}` : stage}
      </span>

      {stage === "loading" && <LoadingScreen onDone={() => setStage("intro")} />}

      {stage === "intro" && (
        <IntroSequence
          sound={sound}
          onBegin={() => {
            setStage("chapter");
            setChapterIndex(1);
          }}
        />
      )}

      {(stage === "chapter" || stage === "ending") && (
        <>
          <AnimatePresence mode="wait">
            {stage === "chapter" && (
              <motion.div
                key={chapterIndex}
                initial={{ opacity: 0, scale: reduced ? 1 : 1.015 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reduced ? 1 : 0.985 }}
                transition={{ duration: reduced ? 0.15 : 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                {chapterNode()}
              </motion.div>
            )}
            {stage === "ending" && (
              <motion.div
                key="ending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <Ending onNext={goNext} sound={sound} />
              </motion.div>
            )}
          </AnimatePresence>

          <NavChrome
            stage={stage}
            chapterIndex={chapterIndex}
            onPrev={goPrev}
            onNext={goNext}
            onJump={jumpTo}
            soundEnabled={sound.enabled}
            onToggleSound={sound.toggle}
            presentationMode={presentationMode}
          />

          {presentationMode && (
            <button
              onClick={() => setPresentationMode(false)}
              className="fixed top-4 left-4 z-40 rounded-full border border-paper/20 px-3 py-1 font-display text-[10px] tracking-widest text-paper/40 transition hover:text-paper/80"
            >
              EXIT PRESENTATION
            </button>
          )}
        </>
      )}

      {stage === "final" && (
        <FinalScreen
          onRestart={() => {
            setStage("chapter");
            setChapterIndex(1);
          }}
        />
      )}
    </div>
  );
}
