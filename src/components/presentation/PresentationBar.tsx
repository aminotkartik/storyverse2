import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSlideshow } from "../../context/PresentationContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../utils/cn";

const BLOCKED_ID = "slideshow-blocked-message";

/** Slideshow control bar. Rendered only while Slideshow Mode is active. */
export default function PresentationBar() {
  const s = useSlideshow();
  const reduced = useReducedMotion();
  const fraction = s.total > 1 ? s.index / (s.total - 1) : 1;
  const blocked = s.blockedMessage !== null;

  return (
    <AnimatePresence>
      {s.active && (
        <motion.section
          key="slideshow-bar"
          aria-label="Slideshow controls"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: reduced ? 0 : 0.3, ease: "easeOut" }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 sm:px-6 sm:pb-5"
        >
          <div className="pointer-events-auto w-full max-w-3xl overflow-hidden rounded-sm border border-paper/25 bg-ink/90 shadow-[4px_4px_0_0_#0b0b0c] backdrop-blur-sm">
            <div className="h-[2px] bg-paper/10" aria-hidden="true">
              <motion.div
                className="h-full w-full origin-left bg-amber"
                animate={{ scaleX: fraction }}
                transition={{ duration: reduced ? 0 : 0.35, ease: "easeOut" }}
              />
            </div>

            <div className="flex items-center gap-2 px-2 py-2 sm:gap-3 sm:px-3">
              <button
                type="button"
                onClick={s.previous}
                disabled={!s.canGoPrevious}
                aria-label="Previous slide"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-paper/30 text-paper transition hover:border-paper/70 focus-visible:outline-2 focus-visible:outline-amber disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-paper/30"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>

              <div className="min-w-0 flex-1 text-center">
                <p
                  aria-live="polite"
                  className="truncate font-display text-[11px] tracking-[0.16em] text-paper sm:text-xs"
                >
                  SLIDE {s.index + 1} / {s.total} — {s.chapterLabel}
                </p>
                <p className="hidden truncate font-serif text-xs text-paper/65 italic sm:block">{s.stop.label}</p>
              </div>

              {s.isLast ? (
                <button
                  type="button"
                  onClick={s.exit}
                  aria-label="Finish the slideshow and return to scrolling"
                  className="flex h-10 shrink-0 items-center rounded-sm bg-amber px-3 font-display text-[11px] tracking-[0.18em] text-ink transition hover:bg-paper focus-visible:outline-2 focus-visible:outline-paper"
                >
                  FINISH
                </button>
              ) : (
                <button
                  type="button"
                  onClick={s.next}
                  aria-disabled={blocked ? "true" : undefined}
                  aria-describedby={blocked ? BLOCKED_ID : undefined}
                  aria-label="Next slide"
                  className={cn(
                    "flex h-10 shrink-0 items-center gap-1 rounded-sm px-3 font-display text-[11px] tracking-[0.18em] transition focus-visible:outline-2 focus-visible:outline-amber",
                    blocked
                      ? "cursor-not-allowed border border-dashed border-amber/70 text-paper/60"
                      : "bg-amber text-ink hover:bg-paper"
                  )}
                >
                  NEXT
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              )}
            </div>

            <AnimatePresence initial={false}>
              {s.blockedMessage && (
                <motion.p
                  key="blocked"
                  id={BLOCKED_ID}
                  role="status"
                  // Opacity only. Animating height makes Framer measure layout and restore the
                  // previous scroll position, which cancels a navigation in progress.
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.2 }}
                  className="border-t border-amber/40 px-3 py-2 text-center font-serif text-sm text-amber"
                >
                  {s.blockedMessage}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
