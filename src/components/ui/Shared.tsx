import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export function WalkingFigure({
  character,
  walking,
  urgent = false,
  showLabel = true,
}: {
  character: "tara" | "dadu";
  walking: boolean;
  progress?: number;
  urgent?: boolean;
  showLabel?: boolean;
}) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!walking || reduced) return;
    let raf = 0;
    let last = performance.now();
    const speed = character === "tara" ? (urgent ? 8.0 : 6.2) : urgent ? 4.8 : 3.8;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setPhase((p) => (p + dt * speed) % (Math.PI * 2));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [walking, character, urgent, reduced]);

  const active = walking && !reduced;
  const stride = active ? phase : 0;

  if (character === "tara") {
    // Negative angle = swing forward (+X, right); Positive angle = swing backward (-X, left)
    const s = Math.sin(stride);
    const c = Math.cos(stride);
    const hipFront = active ? -s * 22 : -5;
    const hipBack = active ? s * 22 : 6;
    // Knee only bends backward (+angle)
    const kneeFront = active ? Math.max(4, (c + 1) * 14) : 5;
    const kneeBack = active ? Math.max(4, (-c + 1) * 14) : 8;
    const armFront = active ? s * 18 : 5;
    const armBack = active ? -s * 18 : -5;
    const bob = active ? Math.abs(s) * -1.5 : 0;
    const hairSway = active ? Math.sin(stride) * 3 : 0;

    return (
      <div className="flex flex-col items-center select-none">
        <svg
          viewBox="0 0 64 96"
          className="h-16 w-11 overflow-visible drop-shadow-[0_3px_6px_rgba(0,0,0,0.75)] sm:h-22 sm:w-15"
          aria-hidden="true"
        >
          {/* Ground shadow */}
          <ellipse cx="32" cy="91" rx="14" ry="3" fill="rgba(0,0,0,0.55)" />

          <g transform={`translate(0, ${bob.toFixed(2)})`}>
            {/* Back Arm */}
            <g transform={`rotate(${armBack.toFixed(1)}, 31, 31)`}>
              <path
                d="M31 31 L30 44 L34 54"
                stroke="#bfb6a6"
                strokeWidth="4.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>

            {/* Back Leg */}
            <g transform={`rotate(${hipBack.toFixed(1)}, 31, 54)`}>
              <line
                x1="31"
                y1="54"
                x2="31"
                y2="71"
                stroke="#b8afa0"
                strokeWidth="5.5"
                strokeLinecap="round"
              />
              <g transform={`translate(31, 71) rotate(${kneeBack.toFixed(1)})`}>
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="16"
                  stroke="#b8afa0"
                  strokeWidth="4.6"
                  strokeLinecap="round"
                />
                <path d="M-2 16 L7 17.5 L7 15 L-1 13.5 Z" fill="#8a847a" />
              </g>
            </g>

            {/* Backpack */}
            <path
              d="M20 29 C15 29 14 35 14 43 C14 49 17 51 23 51 L26 51 L27 29 Z"
              fill="#8a847a"
              stroke="#0b0b0c"
              strokeWidth="1.4"
            />
            <rect x="16" y="37" width="5" height="9" rx="1.5" fill="#6e685f" />

            {/* Torso / Kurta */}
            <path
              d="M25 27 C25 25 36 25 37 28 L39 56 L22 57 Z"
              fill="#f3ede2"
              stroke="#0b0b0c"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Backpack strap on torso */}
            <path
              d="M27 27 Q33 36 30 47"
              stroke="#0b0b0c"
              strokeWidth="1.8"
              fill="none"
              opacity="0.65"
            />

            {/* Neck & Head */}
            <line x1="32" y1="22" x2="31" y2="27" stroke="#f3ede2" strokeWidth="4.5" strokeLinecap="round" />
            {/* Ponytail */}
            <g transform={`rotate(${hairSway.toFixed(1)}, 25, 16)`}>
              <path
                d="M25 15 C19 16 15 21 16 27 C19 25 22 21 25 18 Z"
                fill="#1c1b1a"
                stroke="#f3ede2"
                strokeWidth="0.9"
              />
            </g>
            {/* Head profile */}
            <circle cx="33" cy="15" r="7.5" fill="#f3ede2" stroke="#0b0b0c" strokeWidth="1.4" />
            {/* Nose/profile contour */}
            <path d="M39.5 13.5 L42 16 L39.5 17.2" fill="#f3ede2" stroke="#0b0b0c" strokeWidth="1.1" />
            {/* Hair cap */}
            <path
              d="M25.5 16 C25 10 30 6.5 36 7.5 C39.5 8 41 11 40 13 C36 11 31 12 27 16 Z"
              fill="#1c1b1a"
            />

            {/* Front Leg */}
            <g transform={`rotate(${hipFront.toFixed(1)}, 32, 54)`}>
              <line
                x1="32"
                y1="54"
                x2="32"
                y2="71"
                stroke="#e5ddd0"
                strokeWidth="5.8"
                strokeLinecap="round"
              />
              <g transform={`translate(32, 71) rotate(${kneeFront.toFixed(1)})`}>
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="16"
                  stroke="#e5ddd0"
                  strokeWidth="4.8"
                  strokeLinecap="round"
                />
                {/* Sneaker */}
                <path
                  d="M-2.5 16.5 L8 17.5 C8.5 15.5 6 14 2 14 L-2 14 Z"
                  fill="#f3ede2"
                  stroke="#0b0b0c"
                  strokeWidth="1.2"
                />
              </g>
            </g>

            {/* Front Arm */}
            <g transform={`rotate(${armFront.toFixed(1)}, 32, 31)`}>
              <path
                d="M32 31 L31 44 L36 53"
                stroke="#f3ede2"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
          </g>
        </svg>
        {showLabel && (
          <span className="-mt-1 rounded bg-ink/70 px-1.5 py-0.5 font-display text-[9px] tracking-widest text-paper/90">
            TARA
          </span>
        )}
      </div>
    );
  }

  // DADU: elderly man, slightly stooped forward, kurta + dhoti/trousers, walking with cane
  const s = Math.sin(stride);
  const c = Math.cos(stride);
  const hipFront = active ? -s * 12 : -3;
  const hipBack = active ? s * 12 : 4;
  const kneeFront = active ? Math.max(4, (c + 1) * 8) : 6;
  const kneeBack = active ? Math.max(4, (-c + 1) * 8) : 8;
  // Cane arm moves gently to support weight
  const caneSwing = active ? s * 7 : -2;
  const backArmSwing = active ? -s * 9 : 4;
  const bob = active ? Math.abs(s) * -0.9 : 0;

  return (
    <div className="flex flex-col items-center select-none">
      <svg
        viewBox="0 0 68 96"
        className="h-16 w-12 overflow-visible drop-shadow-[0_3px_6px_rgba(0,0,0,0.75)] sm:h-22 sm:w-16"
        aria-hidden="true"
      >
        {/* Ground shadow */}
        <ellipse cx="34" cy="91" rx="16" ry="3" fill="rgba(0,0,0,0.55)" />

        <g transform={`translate(0, ${bob.toFixed(2)})`}>
          {/* Back Arm */}
          <g transform={`rotate(${backArmSwing.toFixed(1)}, 29, 34)`}>
            <path
              d="M29 34 L27 47 L31 55"
              stroke="#b87e38"
              strokeWidth="4.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>

          {/* Back Leg */}
          <g transform={`rotate(${hipBack.toFixed(1)}, 28, 56)`}>
            <line
              x1="28"
              y1="56"
              x2="28"
              y2="72"
              stroke="#b87e38"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <g transform={`translate(28, 72) rotate(${kneeBack.toFixed(1)})`}>
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="15"
                stroke="#b87e38"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path d="M-2 15.5 L7 16.5 L7 14 L-2 13.5 Z" fill="#785021" />
            </g>
          </g>

          {/* Stooped Kurta Torso */}
          <path
            d="M23 30 C24 26 35 27 37 32 L38 61 L20 61 Z"
            fill="#d99a4e"
            stroke="#0b0b0c"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Kurta side slit & pocket detail */}
          <line x1="29" y1="53" x2="29" y2="61" stroke="#0b0b0c" strokeWidth="1.2" opacity="0.6" />

          {/* Neck & Head (leaning slightly forward) */}
          <line x1="34" y1="25" x2="31" y2="30" stroke="#e8b878" strokeWidth="4.8" strokeLinecap="round" />
          <circle cx="36.5" cy="18.5" r="7.5" fill="#e8b878" stroke="#0b0b0c" strokeWidth="1.4" />
          {/* Nose & moustache contour */}
          <path d="M43 17 L45.5 19.5 L43 20.5" fill="#e8b878" stroke="#0b0b0c" strokeWidth="1.1" />
          <path d="M40.5 22 Q43 21.5 44 23" stroke="#f3ede2" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* White hair */}
          <path
            d="M29 19 C28.5 12.5 33.5 9.5 39.5 11 C42 11.5 43 13.5 42 15 C38 13 33 14.5 30.5 19 Z"
            fill="#f3ede2"
          />
          {/* Glasses */}
          <circle cx="40.5" cy="18" r="2.1" fill="none" stroke="#0b0b0c" strokeWidth="1.1" />
          <line x1="35" y1="17.5" x2="38.4" y2="18" stroke="#0b0b0c" strokeWidth="1" />

          {/* Front Leg */}
          <g transform={`rotate(${hipFront.toFixed(1)}, 30, 56)`}>
            <line
              x1="30"
              y1="56"
              x2="30"
              y2="72"
              stroke="#e8b878"
              strokeWidth="6.4"
              strokeLinecap="round"
            />
            <g transform={`translate(30, 72) rotate(${kneeFront.toFixed(1)})`}>
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="15"
                stroke="#e8b878"
                strokeWidth="5.2"
                strokeLinecap="round"
              />
              {/* Sandal */}
              <path
                d="M-2.5 15.5 L8 16.5 C8 14.8 5.5 13.8 1.5 13.8 L-2 13.8 Z"
                fill="#d99a4e"
                stroke="#0b0b0c"
                strokeWidth="1.2"
              />
            </g>
          </g>

          {/* Front Arm + Walking Cane */}
          <g transform={`rotate(${caneSwing.toFixed(1)}, 33, 33)`}>
            <path
              d="M33 33 L37 44 L44 49"
              stroke="#e8b878"
              strokeWidth="4.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Curved wooden cane descending from hand (44, 49) to ground */}
            <path
              d="M41 49 C41 45.5 46.5 45.5 46.5 49 L48.5 89"
              stroke="#f3ede2"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="48.5" cy="89" r="1.8" fill="#c73e2d" />
          </g>
        </g>
      </svg>
      {showLabel && (
        <span className="-mt-1 rounded bg-ink/70 px-1.5 py-0.5 font-display text-[9px] tracking-widest text-amber">
          DADU
        </span>
      )}
    </div>
  );
}

export type PedestrianType = "student" | "groceries" | "parent" | "elderly" | "mobility";

export function PedestrianFigure({
  type,
  walking,
  stranded = false,
}: {
  type: PedestrianType;
  walking: boolean;
  progress?: number;
  stranded?: boolean;
}) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!walking || reduced) return;
    let raf = 0;
    let last = performance.now();
    const speedMap: Record<PedestrianType, number> = {
      student: 7.5,
      groceries: 5.8,
      parent: 5.0,
      elderly: 3.8,
      mobility: 3.2,
    };
    const speed = speedMap[type];

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setPhase((p) => (p + dt * speed) % (Math.PI * 2));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [walking, type, reduced]);

  const active = walking && !reduced;
  const stride = active ? phase : 0;
  const s = Math.sin(stride);
  const c = Math.cos(stride);
  const accentStroke = stranded ? "#c73e2d" : "#0b0b0c";
  const primaryFill = stranded ? "#f5d0cb" : "#f3ede2";
  const secondaryFill = stranded ? "#d99a92" : "#b8afa0";

  if (type === "elderly") {
    const hipFront = active ? -s * 12 : -3;
    const hipBack = active ? s * 12 : 4;
    const kneeFront = active ? Math.max(4, (c + 1) * 8) : 6;
    const kneeBack = active ? Math.max(4, (-c + 1) * 8) : 8;
    const caneSwing = active ? s * 7 : -2;
    const backArmSwing = active ? -s * 9 : 4;
    const bob = active ? Math.abs(s) * -0.9 : 0;
    const kurtaFill = stranded ? "#e07a6b" : "#d99a4e";
    const skinFill = stranded ? "#f5d0cb" : "#e8b878";

    return (
      <svg
        viewBox="0 0 68 96"
        className="h-16 w-12 overflow-visible drop-shadow-[0_3px_6px_rgba(0,0,0,0.75)] sm:h-20 sm:w-14"
        aria-hidden="true"
      >
        <ellipse cx="34" cy="91" rx="16" ry="3" fill="rgba(0,0,0,0.55)" />
        <g transform={`translate(0, ${bob.toFixed(2)})`}>
          {/* Back Arm */}
          <g transform={`rotate(${backArmSwing.toFixed(1)}, 29, 34)`}>
            <path
              d="M29 34 L27 47 L31 55"
              stroke="#b87e38"
              strokeWidth="4.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
          {/* Back Leg */}
          <g transform={`rotate(${hipBack.toFixed(1)}, 28, 56)`}>
            <line x1="28" y1="56" x2="28" y2="72" stroke="#b87e38" strokeWidth="6" strokeLinecap="round" />
            <g transform={`translate(28, 72) rotate(${kneeBack.toFixed(1)})`}>
              <line x1="0" y1="0" x2="0" y2="15" stroke="#b87e38" strokeWidth="5" strokeLinecap="round" />
              <path d="M-2 15.5 L7 16.5 L7 14 L-2 13.5 Z" fill="#785021" />
            </g>
          </g>
          {/* Stooped Kurta Torso */}
          <path
            d="M23 30 C24 26 35 27 37 32 L38 61 L20 61 Z"
            fill={kurtaFill}
            stroke={accentStroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <line x1="29" y1="53" x2="29" y2="61" stroke={accentStroke} strokeWidth="1.2" opacity="0.6" />
          {/* Neck & Head */}
          <line x1="34" y1="25" x2="31" y2="30" stroke={skinFill} strokeWidth="4.8" strokeLinecap="round" />
          <circle cx="36.5" cy="18.5" r="7.5" fill={skinFill} stroke={accentStroke} strokeWidth="1.4" />
          <path d="M43 17 L45.5 19.5 L43 20.5" fill={skinFill} stroke={accentStroke} strokeWidth="1.1" />
          <path d="M40.5 22 Q43 21.5 44 23" stroke="#f3ede2" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path
            d="M29 19 C28.5 12.5 33.5 9.5 39.5 11 C42 11.5 43 13.5 42 15 C38 13 33 14.5 30.5 19 Z"
            fill="#f3ede2"
          />
          <circle cx="40.5" cy="18" r="2.1" fill="none" stroke="#0b0b0c" strokeWidth="1.1" />
          <line x1="35" y1="17.5" x2="38.4" y2="18" stroke="#0b0b0c" strokeWidth="1" />
          {/* Front Leg */}
          <g transform={`rotate(${hipFront.toFixed(1)}, 30, 56)`}>
            <line x1="30" y1="56" x2="30" y2="72" stroke={skinFill} strokeWidth="6.4" strokeLinecap="round" />
            <g transform={`translate(30, 72) rotate(${kneeFront.toFixed(1)})`}>
              <line x1="0" y1="0" x2="0" y2="15" stroke={skinFill} strokeWidth="5.2" strokeLinecap="round" />
              <path
                d="M-2.5 15.5 L8 16.5 C8 14.8 5.5 13.8 1.5 13.8 L-2 13.8 Z"
                fill={kurtaFill}
                stroke={accentStroke}
                strokeWidth="1.2"
              />
            </g>
          </g>
          {/* Front Arm + Walking Cane */}
          <g transform={`rotate(${caneSwing.toFixed(1)}, 33, 33)`}>
            <path
              d="M33 33 L37 44 L44 49"
              stroke={skinFill}
              strokeWidth="4.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M41 49 C41 45.5 46.5 45.5 46.5 49 L48.5 89"
              stroke="#f3ede2"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="48.5" cy="89" r="1.8" fill="#c73e2d" />
          </g>
        </g>
      </svg>
    );
  }

  if (type === "student") {
    const hipFront = active ? -s * 28 : -8;
    const hipBack = active ? s * 28 : 8;
    const kneeFront = active ? Math.max(4, (c + 1) * 19) : 6;
    const kneeBack = active ? Math.max(4, (-c + 1) * 19) : 10;
    const armFront = active ? s * 24 : 6;
    const armBack = active ? -s * 24 : -6;
    const bob = active ? Math.abs(s) * -2.4 : 0;

    return (
      <svg
        viewBox="0 0 64 96"
        className="h-16 w-11 overflow-visible drop-shadow-[0_3px_6px_rgba(0,0,0,0.75)] sm:h-20 sm:w-14"
        aria-hidden="true"
      >
        <ellipse cx="32" cy="91" rx="14" ry="3" fill="rgba(0,0,0,0.55)" />
        <g transform={`translate(0, ${bob.toFixed(2)})`}>
          {/* Back Arm */}
          <g transform={`rotate(${armBack.toFixed(1)}, 31, 31)`}>
            <path d="M31 31 L30 44 L35 53" stroke={secondaryFill} strokeWidth="4.2" strokeLinecap="round" fill="none" />
          </g>
          {/* Back Leg */}
          <g transform={`rotate(${hipBack.toFixed(1)}, 31, 54)`}>
            <line x1="31" y1="54" x2="31" y2="71" stroke={secondaryFill} strokeWidth="5.4" strokeLinecap="round" />
            <g transform={`translate(31, 71) rotate(${kneeBack.toFixed(1)})`}>
              <line x1="0" y1="0" x2="0" y2="16" stroke={secondaryFill} strokeWidth="4.6" strokeLinecap="round" />
              <path d="M-2 16 L7 17.5 L7 15 L-1 13.5 Z" fill="#8a847a" />
            </g>
          </g>
          {/* Backpack */}
          <path d="M19 28 C14 28 13 35 13 44 C13 50 16 52 23 52 L26 52 L27 28 Z" fill="#d99a4e" stroke={accentStroke} strokeWidth="1.4" />
          {/* Hoodie/Torso */}
          <path d="M25 27 C25 24 36 24 38 28 L39 55 L23 56 Z" fill={primaryFill} stroke={accentStroke} strokeWidth="1.5" />
          {/* Head + Headphones */}
          <line x1="33" y1="22" x2="32" y2="27" stroke={primaryFill} strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="34" cy="15" r="7.2" fill={primaryFill} stroke={accentStroke} strokeWidth="1.4" />
          <path d="M28 15 A6.5 6.5 0 0 1 39 11" stroke="#d99a4e" strokeWidth="2.2" fill="none" />
          <rect x="31.5" y="13" width="3.5" height="5" rx="1.5" fill="#d99a4e" stroke="#0b0b0c" strokeWidth="0.8" />
          {/* Front Leg */}
          <g transform={`rotate(${hipFront.toFixed(1)}, 32, 54)`}>
            <line x1="32" y1="54" x2="32" y2="71" stroke={primaryFill} strokeWidth="5.8" strokeLinecap="round" />
            <g transform={`translate(32, 71) rotate(${kneeFront.toFixed(1)})`}>
              <line x1="0" y1="0" x2="0" y2="16" stroke={primaryFill} strokeWidth="4.8" strokeLinecap="round" />
              <path d="M-2.5 16.5 L8 17.5 C8.5 15.5 6 14 2 14 L-2 14 Z" fill="#d99a4e" stroke={accentStroke} strokeWidth="1.1" />
            </g>
          </g>
          {/* Front Arm */}
          <g transform={`rotate(${armFront.toFixed(1)}, 33, 31)`}>
            <path d="M33 31 L32 44 L38 52" stroke={primaryFill} strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </g>
        </g>
      </svg>
    );
  }

  if (type === "groceries") {
    const hipFront = active ? -s * 20 : -5;
    const hipBack = active ? s * 20 : 6;
    const kneeFront = active ? Math.max(5, (c + 1) * 14) : 7;
    const kneeBack = active ? Math.max(5, (-c + 1) * 14) : 9;
    const armFront = active ? s * 10 : 3;
    const armBack = active ? -s * 10 : -3;
    const bob = active ? Math.abs(s) * -1.8 : 0;

    return (
      <svg
        viewBox="0 0 68 96"
        className="h-16 w-12 overflow-visible drop-shadow-[0_3px_6px_rgba(0,0,0,0.75)] sm:h-20 sm:w-14"
        aria-hidden="true"
      >
        <ellipse cx="34" cy="91" rx="16" ry="3" fill="rgba(0,0,0,0.55)" />
        <g transform={`translate(0, ${bob.toFixed(2)})`}>
          {/* Back Arm + Back Grocery Bag */}
          <g transform={`rotate(${armBack.toFixed(1)}, 29, 32)`}>
            <path d="M29 32 L25 45 L24 53" stroke={secondaryFill} strokeWidth="4.4" strokeLinecap="round" fill="none" />
            {/* Bag 1 */}
            <path d="M21 52 L27 52 L29 69 L19 69 Z" fill="#b8afa0" stroke={accentStroke} strokeWidth="1.3" />
            <path d="M22 52 Q24 47 26 52" stroke={accentStroke} strokeWidth="1.3" fill="none" />
          </g>
          {/* Back Leg */}
          <g transform={`rotate(${hipBack.toFixed(1)}, 30, 55)`}>
            <line x1="30" y1="55" x2="30" y2="71" stroke={secondaryFill} strokeWidth="5.6" strokeLinecap="round" />
            <g transform={`translate(30, 71) rotate(${kneeBack.toFixed(1)})`}>
              <line x1="0" y1="0" x2="0" y2="16" stroke={secondaryFill} strokeWidth="4.8" strokeLinecap="round" />
              <path d="M-2 16 L7 17 L7 14.5 L-2 14 Z" fill="#8a847a" />
            </g>
          </g>
          {/* Torso */}
          <path d="M24 28 C25 25 36 25 38 29 L39 56 L22 56 Z" fill={primaryFill} stroke={accentStroke} strokeWidth="1.5" />
          {/* Head */}
          <line x1="32" y1="22" x2="31" y2="28" stroke={primaryFill} strokeWidth="4.6" strokeLinecap="round" />
          <circle cx="33.5" cy="15.5" r="7.2" fill={primaryFill} stroke={accentStroke} strokeWidth="1.4" />
          <path d="M26.5 15 C26.5 9.5 32 7.5 37.5 9 C40 10 40.5 12 39.5 13.5 C36 11.5 30 12 28 16 Z" fill="#1c1b1a" />
          {/* Front Leg */}
          <g transform={`rotate(${hipFront.toFixed(1)}, 32, 55)`}>
            <line x1="32" y1="55" x2="32" y2="71" stroke={primaryFill} strokeWidth="6" strokeLinecap="round" />
            <g transform={`translate(32, 71) rotate(${kneeFront.toFixed(1)})`}>
              <line x1="0" y1="0" x2="0" y2="16" stroke={primaryFill} strokeWidth="5" strokeLinecap="round" />
              <path d="M-2.5 16.5 L8 17.5 C8 15.2 5.5 14 1.5 14 L-2 14 Z" fill={primaryFill} stroke={accentStroke} strokeWidth="1.2" />
            </g>
          </g>
          {/* Front Arm + Front Heavy Grocery Bag */}
          <g transform={`rotate(${armFront.toFixed(1)}, 34, 32)`}>
            <path d="M34 32 L38 45 L41 53" stroke={primaryFill} strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Bag 2 with groceries peeking out */}
            <circle cx="40" cy="54" r="2.5" fill="#c73e2d" />
            <path d="M42 51 L45 55 L40 55 Z" fill="#d99a4e" />
            <path d="M36 55 L46 55 L48 73 L34 73 Z" fill="#d99a4e" stroke={accentStroke} strokeWidth="1.4" />
            <path d="M38 55 Q41 49 44 55" stroke={primaryFill} strokeWidth="1.5" fill="none" />
          </g>
        </g>
      </svg>
    );
  }

  if (type === "parent") {
    const hipFront = active ? -s * 18 : -5;
    const hipBack = active ? s * 18 : 6;
    const childHipF = active ? s * 25 : -6;
    const childHipB = active ? -s * 25 : 6;
    const bob = active ? Math.abs(s) * -1.6 : 0;
    const childBob = active ? Math.abs(c) * -2 : 0;

    return (
      <svg
        viewBox="0 0 88 96"
        className="h-16 w-15 overflow-visible drop-shadow-[0_3px_6px_rgba(0,0,0,0.75)] sm:h-20 sm:w-18"
        aria-hidden="true"
      >
        <ellipse cx="44" cy="91" rx="26" ry="3.2" fill="rgba(0,0,0,0.55)" />
        {/* Parent on left */}
        <g transform={`translate(0, ${bob.toFixed(2)})`}>
          {/* Parent Back Leg */}
          <g transform={`rotate(${hipBack.toFixed(1)}, 24, 54)`}>
            <line x1="24" y1="54" x2="23" y2="86" stroke={secondaryFill} strokeWidth="5.4" strokeLinecap="round" />
          </g>
          {/* Parent Torso */}
          <path d="M18 27 C19 24 30 24 31 28 L33 56 L16 56 Z" fill={primaryFill} stroke={accentStroke} strokeWidth="1.5" />
          {/* Parent Head */}
          <circle cx="25.5" cy="15.5" r="7" fill={primaryFill} stroke={accentStroke} strokeWidth="1.4" />
          <path d="M18.5 16 C18 10 23 7.5 29 8.5 C31.5 9 32.5 11.5 31.5 13 C28 11 22 12 20 16 Z" fill="#1c1b1a" />
          {/* Parent Front Leg */}
          <g transform={`rotate(${hipFront.toFixed(1)}, 26, 54)`}>
            <line x1="26" y1="54" x2="26" y2="86" stroke={primaryFill} strokeWidth="5.8" strokeLinecap="round" />
            <path d="M23.5 86.5 L33 87.5 L33 85 L23.5 84.5 Z" fill={primaryFill} stroke={accentStroke} strokeWidth="1.1" />
          </g>
          {/* Parent Arm reaching down to hold child's hand */}
          <path d="M29 32 L38 46 L47 54" stroke={primaryFill} strokeWidth="4.2" strokeLinecap="round" fill="none" />
        </g>

        {/* Child on right, holding parent's hand */}
        <g transform={`translate(0, ${childBob.toFixed(2)})`}>
          {/* Child Back Arm raised to parent's hand */}
          <path d="M58 56 L52 55 L47 54" stroke="#d99a4e" strokeWidth="3.6" strokeLinecap="round" fill="none" />
          {/* Clasped hands */}
          <circle cx="47" cy="54" r="2.6" fill="#d99a4e" stroke={accentStroke} strokeWidth="1" />
          {/* Child Back Leg */}
          <g transform={`rotate(${childHipB.toFixed(1)}, 60, 68)`}>
            <line x1="60" y1="68" x2="60" y2="87" stroke="#b87e38" strokeWidth="4.2" strokeLinecap="round" />
          </g>
          {/* Child Torso */}
          <path d="M55 50 C56 48 64 48 65 50 L66 69 L54 69 Z" fill="#d99a4e" stroke={accentStroke} strokeWidth="1.4" />
          {/* Child Head */}
          <circle cx="60.5" cy="41" r="5.6" fill={primaryFill} stroke={accentStroke} strokeWidth="1.3" />
          <path d="M55 41 C55 36.5 59 35 63.5 36 C65 36.5 66 38 65 39.5 C62 38 58 38.5 56 41 Z" fill="#1c1b1a" />
          {/* Child Front Leg */}
          <g transform={`rotate(${childHipF.toFixed(1)}, 61, 68)`}>
            <line x1="61" y1="68" x2="61" y2="87" stroke={primaryFill} strokeWidth="4.5" strokeLinecap="round" />
            <path d="M59 87 L66 88 L66 85.5 L59 85.5 Z" fill="#d99a4e" stroke={accentStroke} strokeWidth="1" />
          </g>
        </g>
      </svg>
    );
  }

  // mobility: Pedestrian with forearm crutch, taking careful steps
  const hipFront = active ? -s * 13 : -4;
  const hipBack = active ? s * 13 : 5;
  const kneeFront = active ? Math.max(6, (c + 1) * 10) : 8;
  const crutchSwing = active ? s * 11 : -3;
  const bob = active ? Math.abs(s) * -1.3 : 0;

  return (
    <svg
      viewBox="0 0 68 96"
      className="h-16 w-12 overflow-visible drop-shadow-[0_3px_6px_rgba(0,0,0,0.75)] sm:h-20 sm:w-14"
      aria-hidden="true"
    >
      <ellipse cx="34" cy="91" rx="16" ry="3" fill="rgba(0,0,0,0.55)" />
      <g transform={`translate(0, ${bob.toFixed(2)})`}>
        {/* Back Leg (injured/braced leg) */}
        <g transform={`rotate(${hipBack.toFixed(1)}, 27, 55)`}>
          <line x1="27" y1="55" x2="27" y2="86" stroke={secondaryFill} strokeWidth="5.6" strokeLinecap="round" />
          {/* Knee brace detail */}
          <rect x="24" y="68" width="6" height="6" rx="1" fill="#c73e2d" />
          <path d="M25 86 L34 87 L34 84.5 L25 84.5 Z" fill="#8a847a" />
        </g>
        {/* Torso (leaning slightly onto crutch) */}
        <path d="M22 29 C23 26 34 26 36 30 L37 56 L20 56 Z" fill={primaryFill} stroke={accentStroke} strokeWidth="1.5" />
        {/* Head */}
        <line x1="32" y1="23" x2="30" y2="29" stroke={primaryFill} strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="34" cy="17" r="7" fill={primaryFill} stroke={accentStroke} strokeWidth="1.4" />
        <path d="M27 17 C27 11.5 32 9.5 37.5 11 C40 11.5 40.5 13.5 39.5 15 C36 13 31 14 28.5 17 Z" fill="#1c1b1a" />
        {/* Front Leg */}
        <g transform={`rotate(${hipFront.toFixed(1)}, 29, 55)`}>
          <line x1="29" y1="55" x2="29" y2="71" stroke={primaryFill} strokeWidth="6" strokeLinecap="round" />
          <g transform={`translate(29, 71) rotate(${kneeFront.toFixed(1)})`}>
            <line x1="0" y1="0" x2="0" y2="15" stroke={primaryFill} strokeWidth="5" strokeLinecap="round" />
            <path d="M-2.5 15.5 L8 16.5 C8 14.5 5.5 13.5 1.5 13.5 L-2 13.5 Z" fill={primaryFill} stroke={accentStroke} strokeWidth="1.2" />
          </g>
        </g>
        {/* Front Arm + Forearm Crutch */}
        <g transform={`rotate(${crutchSwing.toFixed(1)}, 32, 32)`}>
          {/* Forearm cuff & crutch shaft */}
          <path d="M36 38 L43 48 L48 89" stroke="#d99a4e" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <path d="M34 40 C36 37 40 37 40 41" stroke="#d99a4e" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          {/* Hand grip */}
          <line x1="39" y1="48" x2="45" y2="48" stroke="#0b0b0c" strokeWidth="2.5" strokeLinecap="round" />
          {/* Arm */}
          <path d="M32 32 L36 42 L42 48" stroke={primaryFill} strokeWidth="4.4" strokeLinecap="round" fill="none" />
          {/* Crutch rubber tip */}
          <circle cx="48" cy="89" r="2.2" fill="#c73e2d" />
        </g>
      </g>
    </svg>
  );
}

export function ChapterLabel({ index, title }: { index: number; title: string }) {
  return (
    <div className="pointer-events-none absolute top-5 left-5 z-20 sm:top-8 sm:left-8">
      <p className="font-display text-xs tracking-[0.3em] text-paper/50">
        CHAPTER {String(index).padStart(2, "0")}
      </p>
      <h2 className="font-display text-xl tracking-wide text-paper sm:text-2xl">{title}</h2>
    </div>
  );
}

export function ContinueButton({
  onClick,
  children = "Continue",
  variant = "dark",
}: {
  onClick: () => void;
  children?: ReactNode;
  variant?: "dark" | "light";
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className={
        variant === "dark"
          ? "group inline-flex items-center gap-2 rounded-sm border border-paper/70 px-6 py-2.5 font-display text-sm tracking-[0.2em] text-paper transition hover:bg-paper hover:text-ink"
          : "group inline-flex items-center gap-2 rounded-sm border border-ink/70 px-6 py-2.5 font-display text-sm tracking-[0.2em] text-ink transition hover:bg-ink hover:text-paper"
      }
    >
      {children}
      <span className="transition-transform group-hover:translate-x-1">→</span>
    </motion.button>
  );
}

export function SpeechBubble({
  children,
  from = "left",
  className = "",
}: {
  children: ReactNode;
  from?: "left" | "right";
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`relative rounded-2xl border-2 border-ink bg-paper px-5 py-3 font-hand text-xl text-ink shadow-[4px_4px_0_0_#0b0b0c] sm:text-2xl ${className}`}
    >
      {children}
      <span
        className={`absolute -bottom-2.5 h-4 w-4 rotate-45 border-r-2 border-b-2 border-ink bg-paper ${
          from === "left" ? "left-8" : "right-8"
        }`}
      />
    </motion.div>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PanelFrame({
  children,
  className = "",
  image,
}: {
  children: ReactNode;
  className?: string;
  image?: string;
}) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-ink ${className}`}>
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink/80" />
      <div className="grain absolute inset-0" />
      <div className="relative z-10 flex h-full w-full flex-col">{children}</div>
    </div>
  );
}
