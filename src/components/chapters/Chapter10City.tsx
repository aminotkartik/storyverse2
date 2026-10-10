import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChapterLabel, ContinueButton } from "../ui/Shared";

const ZOOM_LABELS = ["a crossing", "a street", "a neighbourhood", "a city", "a sea of people"];

export default function Chapter10City({ onNext }: { onNext: () => void }) {
  const [started, setStarted] = useState(false);
  const [zoomStep, setZoomStep] = useState(0);
  const [messageStep, setMessageStep] = useState(0);

  useEffect(() => {
    if (!started) return;
    const timers: number[] = [];
    ZOOM_LABELS.forEach((_, i) => {
      timers.push(window.setTimeout(() => setZoomStep(i + 1), 1000 + i * 1300));
    });
    timers.push(
      window.setTimeout(() => setMessageStep(1), 1000 + ZOOM_LABELS.length * 1300 + 600)
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [started]);

  useEffect(() => {
    if (messageStep === 0) return;
    const delays = [0, 2200, 4200, 6200, 8200];
    const timers: number[] = [];
    for (let s = messageStep; s < 5; s++) {
      timers.push(window.setTimeout(() => setMessageStep(s + 1), delays[s] ?? 2000));
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageStep === 1]);

  const scale = 5 - Math.min(zoomStep, ZOOM_LABELS.length) * 0.8;

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/city-aerial.jpg)" }}
        animate={{ scale: started ? scale : 5 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-ink/55" />
      <div className="grain absolute inset-0" />

      <ChapterLabel index={10} title="The City" />

      {!started && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <button
            onClick={() => setStarted(true)}
            className="rounded-sm border border-paper/40 px-6 py-3 font-display text-sm tracking-[0.2em] text-paper transition hover:border-paper"
          >
            ZOOM OUT
          </button>
        </div>
      )}

      {started && messageStep === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={zoomStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-display text-2xl tracking-widest text-paper/80 sm:text-4xl"
            >
              {zoomStep === 0 ? "" : ZOOM_LABELS[Math.min(zoomStep - 1, ZOOM_LABELS.length - 1)]}
            </motion.p>
          </AnimatePresence>
        </div>
      )}

      {messageStep > 0 && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-ink/40 px-6 text-center">
          <AnimatePresence>
            {messageStep >= 1 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-2xl text-paper sm:text-4xl"
              >
                A CITY SHOULD NOT ASK PEOPLE
                <br />
                TO BECOME FASTER.
              </motion.p>
            )}
            {messageStep >= 2 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-2xl text-amber sm:text-4xl"
              >
                IT SHOULD LEARN
                <br />
                TO BECOME FAIRER.
              </motion.p>
            )}
            {messageStep >= 3 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-paper/80 italic"
              >
                “A civil society doesn't begin with big laws.”
              </motion.p>
            )}
            {messageStep >= 4 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-paper/80 italic"
              >
                “It begins with small things we choose not to do.”
              </motion.p>
            )}
            {messageStep >= 5 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-8">
                <p className="font-display text-xl text-paper sm:text-3xl">
                  DON'T DESIGN FOR THE AVERAGE HUMAN.
                  <br />
                  BUILD FOR HUMANITY.
                </p>
                <ContinueButton onClick={onNext}>What will you not do today?</ContinueButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
