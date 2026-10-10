import type { PedestrianKind } from "../components/figures/Figures";

export const CHAPTERS = [
  { id: 1, title: "The Crossing" },
  { id: 2, title: "Fifteen Seconds" },
  { id: 3, title: "Look Again" },
  { id: 4, title: "The Average Human" },
  { id: 5, title: "The Mirror" },
  { id: 6, title: "The Numbers" },
  { id: 7, title: "Give Them 15 Seconds" },
  { id: 8, title: "The Second Person" },
  { id: 9, title: "34 Seconds" },
  { id: 10, title: "The City" },
] as const;

export interface StorySectionMeta {
  id: string;
  title: string;
  number?: number;
}

/** Every section of the document, in reading order. Drives the chapter index and menu. */
export const SECTIONS: readonly StorySectionMeta[] = [
  { id: "opening", title: "Opening" },
  ...CHAPTERS.map((c) => ({
    id: `chapter-${String(c.id).padStart(2, "0")}`,
    title: c.title,
    number: c.id,
  })),
  { id: "commitments", title: "What Will You Not Do Today?" },
  { id: "closing", title: "Closing" },
];

export interface Pedestrian {
  id: PedestrianKind;
  seconds: number;
  label: string;
  desc: string;
}

/** Illustrative crossing times from the project's story, not measurements. */
export const PEDESTRIANS: readonly Pedestrian[] = [
  { id: "student", seconds: 11, label: "Young Student", desc: "Backpack, headphones, already thinking about class." },
  { id: "groceries", seconds: 17, label: "Person Carrying Groceries", desc: "Two bags, one shifting grip, one eye on the signal." },
  { id: "parent", seconds: 24, label: "Parent & Child", desc: "A small hand held tightly. Small legs, small steps." },
  { id: "elderly", seconds: 27, label: "Elderly Pedestrian", desc: "Steady, unhurried, out of time before halfway." },
  { id: "mobility", seconds: 31, label: "Pedestrian with Mobility Difficulty", desc: "Every step costs more than the signal allows." },
];

export interface Hotspot {
  id: string;
  x: number; // percentage of image width
  y: number; // percentage of image height
  label: string;
  reveal: string;
}

export const HOTSPOTS: readonly Hotspot[] = [
  { id: "footpath", x: 20, y: 62, label: "Car on footpath", reveal: "Someone gained convenience.\nSomeone lost a path." },
  { id: "ramp", x: 72, y: 70, label: "Blocked ramp", reveal: "For one person, this is parking.\nFor another, this is a wall." },
  { id: "zebra", x: 48, y: 52, label: "Car on zebra crossing", reveal: "The crossing exists.\nThe priority doesn't." },
  { id: "garbage", x: 85, y: 40, label: "Garbage beside the bin", reveal: "Public space becomes\nnobody's space." },
  { id: "honk", x: 32, y: 28, label: "Honking driver", reveal: "Someone is trying\nto save seconds." },
];

export const AVERAGE_FRAGMENTS: readonly string[] = [
  "child",
  "elderly person",
  "parent",
  "wheelchair user",
  "injured person",
  "student",
  "worker",
  "tourist",
  "everyone",
];

export const NOTEBOOK_PAGES: readonly { seconds: number; label: string }[] = [
  { seconds: 11, label: "young student" },
  { seconds: 17, label: "groceries" },
  { seconds: 24, label: "parent + child" },
  { seconds: 27, label: "elderly pedestrian" },
  { seconds: 31, label: "mobility difficulty" },
];

/**
 * Tara's illustrative tally from the story. These are story data, not a survey,
 * and the interface labels them that way.
 */
export const CIVIC_STATS: readonly { label: string; value: number }[] = [
  { label: "FOOTPATH BLOCKED", value: 0.92 },
  { label: "CROSSING BLOCKED", value: 0.81 },
  { label: "RAMP BLOCKED", value: 0.88 },
  { label: "RED LIGHT IGNORED", value: 0.95 },
];

export const POSTER_REACTIONS = [
  { reaction: "laughs and keeps walking", mood: "ignore" },
  { reaction: "doesn't even look up", mood: "ignore" },
  { reaction: "tears a corner off, out of habit", mood: "tear" },
  { reaction: "glances, shrugs, moves on", mood: "ignore" },
] as const;

export interface ChainStep {
  prompt: string;
  careless: string;
  responsible: string;
  consequence: string;
}

export const CHAIN_STEPS: readonly ChainStep[] = [
  {
    prompt: "A motorcyclist wants to stop on the accessibility ramp, just for a minute.",
    careless: "Just for a minute.",
    responsible: "Find another place.",
    consequence: "The ramp stays clear. A woman with a stroller crosses without lifting it.",
  },
  {
    prompt: "A shopkeeper's delivery crate is spilling onto the footpath.",
    careless: "Leave it, someone will walk around.",
    responsible: "Move it against the wall.",
    consequence: "A visually impaired commuter's cane finds no obstacle today.",
  },
  {
    prompt: "A car is idling on the zebra crossing while the driver checks their phone.",
    careless: "It's only a few seconds.",
    responsible: "Pull back behind the line.",
    consequence: "An elderly man crosses in a straight, unbroken line for the first time all week.",
  },
];

export interface Commitment {
  id: string;
  text: string;
}

export const COMMITMENTS: readonly Commitment[] = [
  { id: "footpath", text: "I won't block a footpath." },
  { id: "ramp", text: "I won't park on an accessibility ramp." },
  { id: "zebra", text: "I won't stop on a zebra crossing." },
  { id: "honk", text: "I won't honk at someone who needs more time." },
  { id: "spaces", text: "I'll leave public spaces better than I found them." },
];
