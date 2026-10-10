import { useEffect, useState } from "react";

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [dash, setDash] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setDash(1));
    const t = window.setTimeout(onDone, 2600);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f3ede2] text-ink">
      <div className="relative h-28 w-28 sm:h-36 sm:w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full">
          <rect
            x="4"
            y="4"
            width="112"
            height="112"
            rx="10"
            fill="none"
            stroke="#0b0b0c"
            strokeWidth="3"
            strokeDasharray="440"
            strokeDashoffset={440 - dash * 440}
            style={{ transition: "stroke-dashoffset 1.8s ease" }}
          />
          {/* little pedestrian pictogram, hand-sketched */}
          <g
            style={{
              opacity: dash,
              transition: "opacity 1.2s ease 0.6s",
            }}
          >
            <circle cx="60" cy="38" r="9" fill="#0b0b0c" />
            <path
              d="M60 50 L60 78 M60 58 L44 70 M60 58 L76 70 M60 78 L48 100 M60 78 L72 100"
              stroke="#0b0b0c"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </svg>
      </div>
      <p className="mt-8 font-display text-5xl tracking-wide text-ink sm:text-6xl">15</p>
      <p className="mt-3 font-serif text-sm tracking-[0.3em] text-ink/60 uppercase">Loading the city…</p>
    </div>
  );
}
