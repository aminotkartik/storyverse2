import { motion } from "framer-motion";

export default function FinalScreen({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#f3ede2] px-6 text-center text-ink">
      <div className="halftone-light absolute inset-0 opacity-20" />
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex max-w-xl flex-col items-center gap-10"
      >
        <p className="font-hand text-3xl leading-snug sm:text-4xl">
          “Someone may need the time
          <br />
          you are trying to save.”
        </p>

        <div className="space-y-1">
          <p className="font-display text-2xl tracking-[0.2em] sm:text-3xl">FIFTEEN SECONDS</p>
          <p className="font-serif text-xs tracking-widest text-ink/60 uppercase">A StoryVerse project</p>
          <p className="font-serif text-xs tracking-widest text-ink/40 uppercase">
            SDG 11 · Sustainable Cities &amp; Communities
          </p>
        </div>

        <button
          onClick={onRestart}
          className="rounded-sm border-2 border-ink px-7 py-3 font-display text-sm tracking-[0.2em] transition hover:bg-ink hover:text-paper"
        >
          ENTER THE CITY AGAIN
        </button>
      </motion.div>
    </div>
  );
}
