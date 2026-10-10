import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Menu, Volume2, VolumeX, X } from "lucide-react";
import { useState } from "react";
import { CHAPTERS } from "../data/content";
import type { Stage } from "../App";

export default function NavChrome({
  stage,
  chapterIndex,
  onPrev,
  onNext,
  onJump,
  soundEnabled,
  onToggleSound,
  presentationMode,
}: {
  stage: Stage;
  chapterIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onJump: (i: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  presentationMode: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const inChapter = stage === "chapter";

  return (
    <>
      {/* persistent watermark countdown motif */}
      {!presentationMode && (
        <div
          aria-hidden
          className="pointer-events-none fixed top-2 right-3 z-10 font-display text-[11px] tracking-[0.3em] text-paper/25 select-none sm:top-4 sm:right-6"
        >
          {stage === "chapter" ? `CH.${String(chapterIndex).padStart(2, "0")}` : "FIFTEEN SECONDS"}
        </div>
      )}

      {/* bottom control bar */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex items-end justify-between gap-3 p-3 sm:p-5">
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open table of contents"
            className="flex items-center gap-2 rounded-full border border-paper/25 bg-ink/60 px-3 py-2 text-paper backdrop-blur-sm transition hover:border-paper/60"
          >
            <Menu size={16} />
            {!presentationMode && (
              <span className="hidden font-display text-[11px] tracking-[0.2em] sm:inline">
                FIFTEEN SECONDS
              </span>
            )}
          </button>
          {inChapter && !presentationMode && (
            <span className="rounded-full border border-paper/20 bg-ink/60 px-3 py-2 font-display text-xs tracking-[0.2em] text-paper/80 backdrop-blur-sm">
              {String(chapterIndex).padStart(2, "0")} / {CHAPTERS.length}
            </span>
          )}
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? "Mute ambient sound" : "Enable ambient sound"}
            aria-pressed={soundEnabled}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/25 bg-ink/60 text-paper backdrop-blur-sm transition hover:border-paper/60"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          {inChapter && (
            <>
              <button
                onClick={onPrev}
                disabled={chapterIndex <= 1}
                aria-label="Previous chapter"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/25 bg-ink/60 text-paper backdrop-blur-sm transition hover:border-paper/60 disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={onNext}
                aria-label="Next chapter"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/25 bg-ink/60 text-paper backdrop-blur-sm transition hover:border-paper/60"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Table of contents"
          >
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="absolute top-6 right-6 text-paper/70 transition hover:text-paper"
            >
              <X size={28} />
            </button>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-2xl"
            >
              <p className="mb-6 text-center font-display text-sm tracking-[0.35em] text-paper/50">
                TABLE OF CONTENTS
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {CHAPTERS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onJump(c.id);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-4 rounded-md border border-paper/15 px-4 py-3 text-left transition hover:border-amber/60 hover:bg-paper/5"
                  >
                    <span className="font-display text-lg text-amber">{String(c.id).padStart(2, "0")}</span>
                    <span className="font-serif text-paper/90">{c.title}</span>
                  </button>
                ))}
                <button
                  onClick={() => {
                    onJump(11);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-4 rounded-md border border-paper/15 px-4 py-3 text-left transition hover:border-amber/60 hover:bg-paper/5 sm:col-span-2"
                >
                  <span className="font-display text-lg text-amber">✕</span>
                  <span className="font-serif text-paper/90">What Will You Not Do Today?</span>
                </button>
              </div>
              <p className="mt-8 text-center font-serif text-xs text-paper/40">
                Press <kbd className="rounded border border-paper/30 px-1">P</kbd> for presentation mode ·{" "}
                <kbd className="rounded border border-paper/30 px-1">E</kbd> to restart the experience
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
