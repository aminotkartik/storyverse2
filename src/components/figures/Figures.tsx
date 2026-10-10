import type { ReactNode } from "react";
import type { MotionValue } from "framer-motion";
import { cn } from "../../utils/cn";
import { Joint, mix, useCombined } from "./rig";

export type PedestrianKind = "student" | "groceries" | "parent" | "elderly" | "mobility";

interface Palette {
  cloth: string;
  legs: string;
  skin: string;
  hair: string;
  line: string;
  trim: string;
}

const CRIMSON = "#c73e2d";

const PALETTES = {
  tara: { cloth: "#f3ede2", legs: "#2a2826", skin: "#f3ede2", hair: "#0b0b0c", line: "#0b0b0c", trim: "#d99a4e" },
  dadu: { cloth: "#f3ede2", legs: "#d6cdbd", skin: "#d9c6a5", hair: "#bfb6a6", line: "#0b0b0c", trim: "#d99a4e" },
  student: { cloth: "#f3ede2", legs: "#2a2826", skin: "#f3ede2", hair: "#0b0b0c", line: "#0b0b0c", trim: "#8a847a" },
  groceries: { cloth: "#e5ddd0", legs: "#8a847a", skin: "#e8c9a0", hair: "#1c1b1a", line: "#0b0b0c", trim: "#d99a4e" },
  elderly: { cloth: "#d99a4e", legs: "#b87e38", skin: "#e8b878", hair: "#f3ede2", line: "#0b0b0c", trim: "#8a847a" },
  mobility: { cloth: "#e5ddd0", legs: "#b8afa0", skin: "#f3ede2", hair: "#1c1b1a", line: "#0b0b0c", trim: CRIMSON },
  child: { cloth: "#d99a4e", legs: "#b87e38", skin: "#f3ede2", hair: "#0b0b0c", line: "#0b0b0c", trim: "#8a847a" },
} satisfies Record<string, Palette>;

function tinted(p: Palette, stranded: boolean): Palette {
  return stranded ? { ...p, cloth: "#f5d0cb", legs: "#e07a6b", line: CRIMSON } : p;
}

interface HumanProps {
  phase: MotionValue<number>;
  amp: MotionValue<number>;
  palette: Palette;
  x?: number;
  scale?: number;
  hair?: "long" | "grey" | "short";
  backpack?: boolean;
  carry?: "none" | "bags" | "cane" | "crutch";
  stoop?: number;
  stride?: number;
  brace?: boolean;
}

/**
 * One articulated person in a 96-unit-tall local space (feet at y≈88, centre x=0).
 * All limbs share a walk phase and amplitude; `amp = 0` gives a standing pose.
 */
function Human({
  phase,
  amp,
  palette: p,
  x = 0,
  scale = 1,
  hair = "short",
  backpack = false,
  carry = "none",
  stoop = 0,
  stride = 1,
  brace = false,
}: HumanProps) {
  const legF = useCombined(phase, amp, (ph, a) => mix(-3, -Math.sin(ph) * 20 * stride, a));
  const legB = useCombined(phase, amp, (ph, a) => mix(5, Math.sin(ph) * 20 * stride, a));
  const kneeF = useCombined(phase, amp, (ph, a) => mix(3, Math.max(3, (Math.cos(ph) + 1) * 11), a));
  const kneeB = useCombined(phase, amp, (ph, a) => mix(7, Math.max(3, (1 - Math.cos(ph)) * 11), a));
  const armF = useCombined(phase, amp, (ph, a) => mix(6, Math.sin(ph) * 16 * stride, a));
  const armB = useCombined(phase, amp, (ph, a) => mix(-5, -Math.sin(ph) * 16 * stride, a));
  const bob = useCombined(phase, amp, (ph, a) => mix(0, -Math.abs(Math.sin(ph)) * 1.6, a));

  // Scale about the feet so a smaller figure stands on the same ground line.
  const ty = 88 * (1 - scale);

  return (
    <g transform={`translate(${x} ${ty.toFixed(2)}) scale(${scale})`}>
      <ellipse cx={0} cy={90} rx={13} ry={2.6} fill="rgba(0,0,0,0.55)" />
      <Joint dy={bob}>
        <Joint pivot={[-2, 57]} angle={legB}>
          <line x1={-2} y1={57} x2={-2} y2={73} stroke={p.legs} strokeWidth={5.4} strokeLinecap="round" />
          <Joint pivot={[-2, 73]} angle={kneeB}>
            <line x1={-2} y1={73} x2={-2} y2={88} stroke={p.legs} strokeWidth={4.6} strokeLinecap="round" />
            <path d="M-5 88 L5 89 L5 86.5 L-5 86.5 Z" fill={p.line} />
            {brace && <rect x={-5} y={75} width={6} height={5} rx={1} fill={CRIMSON} />}
          </Joint>
        </Joint>

        <Joint pivot={[0, 57]} angle={stoop}>
          {backpack && (
            <path
              d="M-7 33 C-14 33 -15 39 -15 46 C-15 53 -12 56 -7 56 L-6 56 L-6 33 Z"
              fill="#8a847a"
              stroke={p.line}
              strokeWidth={1.2}
            />
          )}
          <Joint pivot={[-6, 31]} angle={armB}>
            <line x1={-6} y1={31} x2={-7} y2={43} stroke={p.cloth} strokeWidth={4.2} strokeLinecap="round" />
            <line x1={-7} y1={43} x2={-6} y2={53} stroke={p.skin} strokeWidth={3.4} strokeLinecap="round" />
            {carry === "bags" && <rect x={-11} y={51} width={6} height={9} fill={p.trim} stroke={p.line} strokeWidth={1} />}
          </Joint>

          <path
            d="M-7 30 Q0 26.5 7 30 L8 57 L-8 57 Z"
            fill={p.cloth}
            stroke={p.line}
            strokeWidth={1.3}
            strokeLinejoin="round"
          />
          <line x1={1} y1={24} x2={1} y2={29} stroke={p.skin} strokeWidth={4.4} strokeLinecap="round" />
          <circle cx={2} cy={17} r={7} fill={p.skin} stroke={p.line} strokeWidth={1.3} />
          <path d="M4.6 15.5 L8 17.5 L4.6 18.6" fill={p.skin} stroke={p.line} strokeWidth={1} strokeLinejoin="round" />
          <Hair kind={hair} color={p.hair} />

          <Joint pivot={[6, 31]} angle={armF}>
            <line x1={6} y1={31} x2={7} y2={43} stroke={p.cloth} strokeWidth={4.2} strokeLinecap="round" />
            <line x1={7} y1={43} x2={8} y2={53} stroke={p.skin} strokeWidth={3.4} strokeLinecap="round" />
            {carry === "bags" && <rect x={6} y={51} width={7} height={9} fill={p.trim} stroke={p.line} strokeWidth={1} />}
            {carry === "cane" && (
              <>
                <line x1={8} y1={53} x2={10} y2={88} stroke={p.line} strokeWidth={1.8} strokeLinecap="round" />
                <circle cx={10} cy={88} r={2} fill={CRIMSON} />
              </>
            )}
          </Joint>
          {carry === "crutch" && (
            <>
              <line x1={-4} y1={38} x2={9} y2={88} stroke={p.line} strokeWidth={1.8} strokeLinecap="round" />
              <circle cx={9} cy={88} r={2} fill={CRIMSON} />
            </>
          )}
        </Joint>

        <Joint pivot={[2, 57]} angle={legF}>
          <line x1={2} y1={57} x2={2} y2={73} stroke={p.legs} strokeWidth={5.8} strokeLinecap="round" />
          <Joint pivot={[2, 73]} angle={kneeF}>
            <line x1={2} y1={73} x2={2} y2={88} stroke={p.legs} strokeWidth={4.8} strokeLinecap="round" />
            <path d="M-1 88 L8 89.5 L8 87 L-1 86.5 Z" fill={p.line} />
          </Joint>
        </Joint>
      </Joint>
    </g>
  );
}

function Hair({ kind, color }: { kind: "long" | "grey" | "short"; color: string }) {
  if (kind === "long") {
    return (
      <>
        <path d="M-5 14 C-6 9 0 5 6 8 C8 9 8 11 7 12 C3 10 -1 11 -5 16 Z" fill={color} />
        <path d="M-5 12 C-12 13 -13 21 -11 27 C-8 24 -6 20 -4 17 Z" fill={color} />
      </>
    );
  }
  if (kind === "grey") {
    return <path d="M-5 16 C-6 8 1 4.5 8 8.5 C6 10.5 3 10.5 -5 16 Z" fill={color} />;
  }
  return <path d="M-5 15 C-5 8.5 2 6 7.5 9 C5 10.5 2 10.5 -5 15 Z" fill={color} />;
}

interface FigureProps {
  phase: MotionValue<number>;
  amp: MotionValue<number>;
  stranded?: boolean;
  className?: string;
}

function FigureSvg({ viewBox, className, children }: { viewBox: string; className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      className={cn("overflow-visible drop-shadow-[0_3px_6px_rgba(0,0,0,0.75)]", className)}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function TaraFigure({ phase, amp, stranded = false, className }: FigureProps) {
  return (
    <FigureSvg viewBox="0 0 96 96" className={className}>
      <Human
        phase={phase}
        amp={amp}
        x={48}
        palette={tinted(PALETTES.tara, stranded)}
        hair="long"
        backpack
        stride={1.15}
      />
    </FigureSvg>
  );
}

export function DaduFigure({ phase, amp, stranded = false, className }: FigureProps) {
  return (
    <FigureSvg viewBox="0 0 96 96" className={className}>
      <Human
        phase={phase}
        amp={amp}
        x={48}
        palette={tinted(PALETTES.dadu, stranded)}
        hair="grey"
        stoop={9}
        carry="cane"
        stride={0.7}
      />
    </FigureSvg>
  );
}

export function PedestrianFigure({
  kind,
  phase,
  amp,
  stranded = false,
  className,
}: FigureProps & { kind: PedestrianKind }) {
  const tone = (key: keyof typeof PALETTES) => tinted(PALETTES[key], stranded);
  const body = (() => {
    switch (kind) {
      case "student":
        return <Human phase={phase} amp={amp} x={48} palette={tone("student")} backpack stride={1.1} />;
      case "groceries":
        return <Human phase={phase} amp={amp} x={48} palette={tone("groceries")} carry="bags" stride={0.9} />;
      case "elderly":
        return <Human phase={phase} amp={amp} x={48} palette={tone("elderly")} hair="grey" stoop={10} carry="cane" stride={0.7} />;
      case "mobility":
        return <Human phase={phase} amp={amp} x={48} palette={tone("mobility")} carry="crutch" brace stride={0.6} />;
      case "parent":
        return (
          <>
            <Human phase={phase} amp={amp} x={38} palette={tone("tara")} hair="long" stride={0.9} />
            <Human phase={phase} amp={amp} x={72} scale={0.6} palette={tone("child")} stride={1.2} />
          </>
        );
    }
  })();
  return (
    <FigureSvg viewBox="0 0 96 96" className={className}>
      {body}
    </FigureSvg>
  );
}
