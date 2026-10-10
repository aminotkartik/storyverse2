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

export interface Pedestrian {
  id: string;
  seconds: number;
  label: string;
  desc: string;
  speed: number; // relative crossing speed, 1 = fastest
  outcome: "safe" | "rushed" | "stranded";
}

export const PEDESTRIANS: Pedestrian[] = [
  {
    id: "student",
    seconds: 11,
    label: "Young Student",
    desc: "Backpack, headphones, already thinking about class.",
    speed: 1,
    outcome: "safe",
  },
  {
    id: "groceries",
    seconds: 17,
    label: "Person Carrying Groceries",
    desc: "Two bags, one shifting grip, one eye on the signal.",
    speed: 0.72,
    outcome: "stranded",
  },
  {
    id: "parent",
    seconds: 24,
    label: "Parent & Child",
    desc: "A small hand held tightly. Small legs, small steps.",
    speed: 0.5,
    outcome: "stranded",
  },
  {
    id: "elderly",
    seconds: 27,
    label: "Elderly Pedestrian",
    desc: "Steady, unhurried, out of time before halfway.",
    speed: 0.42,
    outcome: "stranded",
  },
  {
    id: "mobility",
    seconds: 31,
    label: "Pedestrian with Mobility Difficulty",
    desc: "Every step costs more than the signal allows.",
    speed: 0.36,
    outcome: "stranded",
  },
];

export interface Hotspot {
  id: string;
  x: number; // percentage
  y: number;
  label: string;
  reveal: string;
}

export const HOTSPOTS: Hotspot[] = [
  {
    id: "footpath",
    x: 20,
    y: 62,
    label: "Car on footpath",
    reveal: "Someone gained convenience.\nSomeone lost a path.",
  },
  {
    id: "ramp",
    x: 72,
    y: 70,
    label: "Blocked ramp",
    reveal: "For one person, this is parking.\nFor another, this is a wall.",
  },
  {
    id: "zebra",
    x: 48,
    y: 52,
    label: "Car on zebra crossing",
    reveal: "The crossing exists.\nThe priority doesn't.",
  },
  {
    id: "garbage",
    x: 85,
    y: 40,
    label: "Garbage beside the bin",
    reveal: "Public space becomes\nnobody's space.",
  },
  {
    id: "honk",
    x: 32,
    y: 28,
    label: "Honking driver",
    reveal: "Someone is trying\nto save seconds.",
  },
];

export const AVERAGE_FRAGMENTS = [
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

export interface NotebookPage {
  seconds: number;
  label: string;
}

export const NOTEBOOK_PAGES: NotebookPage[] = [
  { seconds: 11, label: "young student" },
  { seconds: 17, label: "groceries" },
  { seconds: 24, label: "parent + child" },
  { seconds: 27, label: "elderly pedestrian" },
  { seconds: 31, label: "mobility difficulty" },
];

export const CIVIC_STATS = [
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

export const CHAIN_STEPS: ChainStep[] = [
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

export const ENDING_CHOICES = [
  "I won't block a footpath.",
  "I won't park on an accessibility ramp.",
  "I won't stop on a zebra crossing.",
  "I won't honk at someone who needs more time.",
  "I'll leave public spaces better than I found them.",
];

export const SEED_NOTES = [
  "I won't block a footpath.",
  "I'll leave public spaces better than I found them.",
  "I won't honk at someone who needs more time.",
  "I won't park on an accessibility ramp.",
  "I won't stop on a zebra crossing.",
  "I'll wait the extra five seconds.",
  "I won't block a footpath.",
  "I won't honk at someone who needs more time.",
];
