import { useState } from "react";
import { motion } from "framer-motion";
import { COMMITMENTS } from "../data/content";
import { useSound } from "../context/SoundContext";
import { readCommitments, writeCommitments } from "../utils/commitments";

export default function Ending() {
  const sound = useSound();
  const [selected, setSelected] = useState<string[]>(() => readCommitments());

  const toggle = (id: string) => {
    const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
    setSelected(next);
    writeCommitments(next);
    sound.pageTurn();
  };

  const clear = () => {
    setSelected([]);
    writeCommitments([]);
  };

  return (
    <section
      id="commitments"
      aria-labelledby="commitments-heading"
      className="relative flex min-h-svh items-center justify-center bg-paper px-5 py-24 text-ink sm:px-10"
    >
      <div className="halftone-light pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-xl"
      >
        <h2 id="commitments-heading" className="font-display text-4xl leading-none tracking-wide sm:text-6xl">
          WHAT WILL YOU NOT DO TODAY?
        </h2>
        <p className="mt-4 font-serif text-base text-ink/75">
          Tick the ones you mean. Nothing is required, and nothing is submitted anywhere.
        </p>

        <fieldset className="mt-8">
          <legend className="sr-only">Commitments</legend>
          <ul className="flex flex-col gap-3">
            {COMMITMENTS.map((c) => {
              const checked = selected.includes(c.id);
              return (
                <li key={c.id}>
                  <label
                    className={`flex cursor-pointer items-start gap-4 rounded-sm border-2 px-4 py-3 font-serif text-base transition ${
                      checked ? "border-ink bg-ink text-paper" : "border-ink/25 hover:border-ink"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(c.id)}
                      className="mt-1 h-4 w-4 shrink-0 accent-amber focus-visible:outline-2 focus-visible:outline-amber"
                    />
                    <span>{c.text}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="font-serif text-xs text-ink/65" aria-live="polite">
            {selected.length} of {COMMITMENTS.length} kept. Saved only in this browser, on this device. It is not
            shared with other visitors.
          </p>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="font-display text-xs tracking-[0.2em] text-ink/70 underline underline-offset-4 hover:text-danger focus-visible:outline-2 focus-visible:outline-amber"
            >
              CLEAR MY CHOICES
            </button>
          )}
        </div>
      </motion.div>
    </section>
  );
}
