import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface SceneTransitionOverlayProps {
  /** Increment this key to trigger a transition. Direction determines the sweep direction. */
  transitionKey: number;
  direction: "next" | "previous";
}

/**
 * Cinematic clip-path + motion-blur overlay for Slideshow Mode.
 * Triggers when transitionKey changes. Fast (280ms), direction-aware.
 */
export default function SceneTransitionOverlay({
  transitionKey,
  direction,
}: SceneTransitionOverlayProps) {
  const reduced = useReducedMotion();

  if (reduced || transitionKey === 0) return null;

  const isNext = direction === "next";

  return (
    <AnimatePresence>
      <motion.div
        key={transitionKey}
        initial={{
          clipPath: isNext
            ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
            : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        }}
        animate={{
          clipPath: isNext
            ? "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)"
            : "polygon(0 0, 0 0, 0 100%, 0 100%)",
        }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="pointer-events-none fixed inset-0 z-[100]"
        style={{
          background: "linear-gradient(90deg, #0b0b0c 0%, #1c1b1a 50%, #0b0b0c 100%)",
        }}
      >
        {/* Directional speed lines */}
        <motion.div
          initial={{ x: isNext ? "-100%" : "100%", opacity: 0 }}
          animate={{ x: 0, opacity: [0, 1, 0] }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="h-px w-[150%] bg-gradient-to-r from-transparent via-danger to-transparent"
            style={{ transform: `rotate(${isNext ? -2 : 2}deg)` }}
          />
        </motion.div>

        {/* Secondary amber accent streak */}
        <motion.div
          initial={{ x: isNext ? "-150%" : "150%", opacity: 0 }}
          animate={{ x: 0, opacity: [0, 0.7, 0] }}
          transition={{ duration: 0.28, delay: 0.04, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="h-0.5 w-[160%] bg-gradient-to-r from-transparent via-amber to-transparent"
            style={{ transform: `rotate(${isNext ? -3 : 3}deg)` }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
