import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChapterLabel, ContinueButton } from "../ui/Shared";
import { POSTER_REACTIONS } from "../../data/content";
import type { SoundApi } from "../../hooks/useSound";

type Stage = "drag" | "placed" | "reacting" | "turning" | "done";

export default function Chapter07Poster({ onNext, sound }: { onNext: () => void; sound: SoundApi }) {
  const [stage, setStage] = useState<Stage>("drag");
  const [reactionIdx, setReactionIdx] = useState(-1);
  const [turnIdx, setTurnIdx] = useState(-1);
  const targetRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);

  const checkDrop = () => {
    const target = targetRef.current?.getBoundingClientRect();
    const poster = posterRef.current?.getBoundingClientRect();
    if (!target || !poster) return false;
    const px = poster.left + poster.width / 2;
    const py = poster.top + poster.height / 2;
    return px > target.left && px < target.right && py > target.top && py < target.bottom;
  };

  useEffect(() => {
    if (stage !== "placed") return;
    sound.pageTurn();
    setStage("reacting");
  }, [stage, sound]);

  useEffect(() => {
    if (stage !== "reacting") return;
    if (reactionIdx < POSTER_REACTIONS.length - 1) {
      const t = window.setTimeout(() => {
        setReactionIdx((i) => i + 1);
        if (POSTER_REACTIONS[reactionIdx + 1]?.mood === "tear") sound.tear();
      }, 1100);
      return () => window.clearTimeout(t);
    } else {
      const t = window.setTimeout(() => setStage("turning"), 1300);
      return () => window.clearTimeout(t);
    }
  }, [stage, reactionIdx, sound]);

  useEffect(() => {
    if (stage !== "turning") return;
    if (turnIdx < 2) {
      const t = window.setTimeout(() => {
        setTurnIdx((i) => i + 1);
        sound.chime();
      }, 1300);
      return () => window.clearTimeout(t);
    } else {
      const t = window.setTimeout(() => setStage("done"), 1000);
      return () => window.clearTimeout(t);
    }
  }, [stage, turnIdx, sound]);

  useEffect(() => {
    if (stage === "reacting") setReactionIdx(0);
  }, [stage]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/poster-wall.jpg)" }}
      />
      <div className="absolute inset-0 bg-ink/45" />
      <div className="grain absolute inset-0" />

      <ChapterLabel index={7} title="Give Them 15 Seconds" />

      {/* drop target on the wall */}
      <div
        ref={targetRef}
        className={`absolute top-[22%] left-1/2 h-40 w-32 -translate-x-1/2 rounded-sm border-2 border-dashed transition sm:h-52 sm:w-40 ${
          stage === "drag" ? "border-paper/50" : "border-transparent"
        }`}
      />

      {stage === "drag" && (
        <>
          <motion.div
            ref={posterRef}
            drag
            dragSnapToOrigin
            dragElastic={0.2}
            onDragEnd={() => {
              if (checkDrop()) setStage("placed");
            }}
            whileDrag={{ scale: 1.06, zIndex: 50 }}
            className="absolute bottom-[22%] left-1/2 w-28 -translate-x-1/2 cursor-grab touch-none rounded-sm border-2 border-ink bg-paper p-3 text-center shadow-[4px_4px_0_0_#0b0b0c] active:cursor-grabbing sm:w-36 sm:p-4"
          >
            <p className="font-display text-[11px] leading-tight text-ink sm:text-sm">
              GIVE THEM 15 SECONDS.
            </p>
          </motion.div>
          <p className="absolute inset-x-0 bottom-[13%] text-center font-serif text-xs tracking-widest text-paper/60 uppercase">
            drag the poster onto the wall
          </p>
        </>
      )}

      {stage !== "drag" && (
        <div className="absolute top-[22%] left-1/2 w-32 -translate-x-1/2 rounded-sm border-2 border-ink bg-paper p-3 text-center shadow-[4px_4px_0_0_#0b0b0c] sm:w-40 sm:p-4">
          <p className="font-display text-[11px] leading-tight text-ink sm:text-sm">
            GIVE THEM 15 SECONDS.
          </p>
          <p className="mt-1 font-serif text-[9px] text-ink/60 sm:text-[10px]">
            Don't honk. Don't block the crossing.
            <br />
            Don't park on the ramp.
          </p>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-3 px-4 text-center sm:bottom-16">
        <AnimatePresence mode="wait">
          {stage === "reacting" && reactionIdx >= 0 && (
            <motion.p
              key={reactionIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="font-serif text-sm text-paper/80 italic"
            >
              A passerby {POSTER_REACTIONS[reactionIdx].reaction}.
            </motion.p>
          )}
          {stage === "turning" && (
            <motion.p
              key={`turn-${turnIdx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-xl text-amber sm:text-2xl"
            >
              {turnIdx === 0 && "Then, one person stops."}
              {turnIdx === 1 && "A second person notices."}
              {turnIdx === 2 && "A third person follows."}
            </motion.p>
          )}
          {stage === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-5"
            >
              <p className="max-w-sm font-serif text-paper/80 italic">
                Nobody applauded. The street didn't change overnight.
                <br />
                But it noticed, for the first time, that it could.
              </p>
              <ContinueButton onClick={onNext}>One choice at a time</ContinueButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
