import type { MotionValue } from "framer-motion";
import { motion } from "framer-motion";
import { DaduFigure, TaraFigure } from "../figures/Figures";

export interface WalkerState {
  /** Horizontal position as a percentage of the lane width. */
  x: MotionValue<string>;
  phase: MotionValue<number>;
  amp: MotionValue<number>;
}

const ZEBRA =
  "repeating-linear-gradient(90deg, rgba(243,237,226,0.85) 0 26px, transparent 26px 52px)";

/**
 * The shared crossing used by "The Crossing" and "34 Seconds". Tara walks the
 * upper lane and Dadu the lower one. Each figure sits in a full-width strip,
 * so a percentage translate moves it by a fraction of the lane width.
 */
export function CrossingLane({ tara, dadu }: { tara: WalkerState; dadu: WalkerState }) {
  return (
    <div className="relative mx-auto h-44 w-[92vw] max-w-3xl sm:h-52" aria-hidden="true">
      <div
        className="absolute inset-x-0 bottom-0 h-[40%] rounded-sm opacity-80"
        style={{ backgroundImage: ZEBRA }}
      />
      <div className="absolute inset-x-0 top-0 h-1/2 border-b border-dashed border-paper/25" />
      <motion.div className="absolute inset-x-0 top-0 h-1/2" style={{ x: tara.x }}>
        <div className="absolute bottom-[4%] left-[1%] flex flex-col items-center">
          <span className="mb-0.5 rounded bg-ink/70 px-1.5 font-display text-[9px] tracking-widest text-paper/90">
            TARA
          </span>
          <TaraFigure phase={tara.phase} amp={tara.amp} className="h-24 w-[5.5rem] sm:h-28 sm:w-24" />
        </div>
      </motion.div>
      <motion.div className="absolute inset-x-0 bottom-0 h-1/2" style={{ x: dadu.x }}>
        <div className="absolute bottom-[2%] left-[1%] flex flex-col items-center">
          <span className="mb-0.5 rounded bg-ink/70 px-1.5 font-display text-[9px] tracking-widest text-amber">
            DADU
          </span>
          <DaduFigure phase={dadu.phase} amp={dadu.amp} className="h-24 w-[5.5rem] sm:h-28 sm:w-24" />
        </div>
      </motion.div>
    </div>
  );
}
