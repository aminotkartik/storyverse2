import { motion, useScroll } from "framer-motion";
import { Menu, Music, Presentation, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { CHAPTERS, SECTIONS } from "../data/content";
import { useSound } from "../context/SoundContext";
import { useSlideshow } from "../context/PresentationContext";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Minimal persistent chrome: a hairline scroll-progress bar, the current
 * chapter, a mode switch (Scroll / Slideshow), a chapter menu, and the sound toggle.
 */
export default function NavChrome({ activeId }: { activeId: string | null }) {
  const sound = useSound();
  const slideshow = useSlideshow();
  const { scrollYProgress } = useScroll();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const active = SECTIONS.find((s) => s.id === activeId) ?? null;
  const headline = active
    ? active.number
      ? `${pad(active.number)} / ${CHAPTERS.length} — ${active.title.toUpperCase()}`
      : active.title.toUpperCase()
    : "";
  const modeLabel = slideshow.active ? "EXIT SLIDESHOW" : "SLIDESHOW MODE";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-amber"
        style={{ scaleX: scrollYProgress }}
      />

      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between gap-3 p-3 sm:p-5">
        <p className="pointer-events-auto min-w-0 truncate rounded-sm bg-ink/75 px-2.5 py-1.5 font-display text-[11px] tracking-[0.2em] text-paper/90 sm:text-xs">
          {headline}
        </p>

        <div className="pointer-events-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={slideshow.toggle}
            aria-label={modeLabel}
            aria-keyshortcuts={slideshow.active ? "Escape" : undefined}
            className="flex h-10 items-center gap-2 rounded-full border border-paper/30 bg-ink/75 px-3 text-paper transition hover:border-paper/70"
          >
            <Presentation size={16} aria-hidden="true" />
            <span className="hidden font-display text-[11px] tracking-[0.2em] sm:inline">{modeLabel}</span>
          </button>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 items-center gap-2 rounded-full border border-paper/30 bg-ink/75 px-3 text-paper transition hover:border-paper/70"
          >
            {open ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
            <span className="font-display text-[11px] tracking-[0.2em]">CHAPTERS</span>
          </button>
          <button
            type="button"
            onClick={sound.toggleMusic}
            aria-pressed={sound.musicEnabled}
            aria-label={
              sound.musicEnabled ? "Music is on. Turn the music off" : "Music is off. Turn the music on"
            }
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 bg-ink/75 transition hover:border-paper/70 ${
              sound.musicEnabled ? "text-amber" : "text-paper/60"
            }`}
          >
            <span className="relative inline-flex">
              <Music size={16} aria-hidden="true" />
              {!sound.musicEnabled && (
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 h-[1.5px] w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current"
                />
              )}
            </span>
          </button>
          <button
            type="button"
            aria-pressed={sound.enabled}
            aria-label={sound.enabled ? "Sound is on. Turn sound off" : "Sound is off. Turn sound on"}
            onClick={sound.toggle}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 bg-ink/75 text-paper transition hover:border-paper/70"
          >
            {sound.enabled ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
          </button>
        </div>
      </header>

      {open && (
        <nav
          id={menuId}
          aria-label="Chapters"
          className="fixed top-16 right-3 z-50 max-h-[78svh] w-[min(92vw,22rem)] overflow-y-auto rounded-sm border border-paper/25 bg-ink p-3 shadow-[6px_6px_0_0_#0b0b0c] sm:right-5"
        >
          <ol className="flex flex-col gap-0.5">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    setOpen(false);
                    // In Slideshow Mode a chapter jumps to its first slide instead of anchoring.
                    if (slideshow.active) {
                      e.preventDefault();
                      slideshow.goToSection(s.id);
                    }
                  }}
                  aria-current={s.id === activeId ? "location" : undefined}
                  className="flex items-baseline gap-3 rounded-sm px-3 py-2 font-serif text-paper/90 transition hover:bg-paper/5 aria-[current=location]:text-amber"
                >
                  {s.number !== undefined && (
                    <span className="font-display text-sm text-amber">{pad(s.number)}</span>
                  )}
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <p className="sr-only" aria-live="polite">
        {active ? `Now reading: ${active.title}` : ""}
      </p>
    </>
  );
}
