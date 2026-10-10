import { motion } from "framer-motion";

export default function FinalScreen() {
  return (
    <section
      id="closing"
      aria-labelledby="closing-heading"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#ede4d3] px-6 py-24 text-center text-ink"
    >
      <div className="halftone-light pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex max-w-xl flex-col items-center gap-10"
      >
        <p className="font-hand text-3xl leading-snug sm:text-4xl">
          “Someone may need the time
          <br />
          you are trying to save.”
        </p>

        <div className="space-y-1">
          <h2 id="closing-heading" className="font-display text-2xl tracking-[0.2em] sm:text-3xl">
            FIFTEEN SECONDS
          </h2>
          <p className="font-serif text-xs tracking-widest text-ink/60 uppercase">A StoryVerse project</p>
          <p className="font-serif text-xs tracking-widest text-ink/40 uppercase">
            SDG 11 · Sustainable Cities &amp; Communities
          </p>
        </div>

        <a
          href="#opening"
          className="rounded-sm border-2 border-ink px-7 py-3 font-display text-sm tracking-[0.2em] transition hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-amber"
        >
          BACK TO THE BEGINNING
        </a>
      </motion.div>
    </section>
  );
}
