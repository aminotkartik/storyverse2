import { motion, useScroll } from "framer-motion";
import { Menu, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { CHAPTERS, SECTIONS } from "../data/content";
import { useSound } from "../context/SoundContext";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Minimal persistent chrome: a hairline scroll-progress bar, the current
 * chapter, a chapter menu of native anchor links, and the sound toggle.
 */
export default function NavChrome({ activeId }: { activeId: string | null }) {
  const sound = useSound();
  const { scrollYProgress } = useScroll();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const active = SECTIONS.find((s) => s.id === activeId) ?? null;
  const headline = active
    ? active.number
      ? `${pad(active.number)} / ${CHAPTERS.length} — ${active.title.toUpperCase()}`
      : active.title.toUpperCase()
    : "";

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
                  onClick={() => setOpen(false)}
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
