import type { RequirementId } from "./requirements";

/**
 * One moment the slideshow can stop on. `progress` is 0–1 through the section's
 * own timeline. The scroll position is computed at runtime from the section's
 * real height, so nothing here is a pixel value.
 */
export interface PresentationStop {
  id: string;
  sectionId: string;
  progress: number;
  label: string;
  requires?: RequirementId;
}

const stop = (
  sectionId: string,
  progress: number,
  label: string,
  requires?: RequirementId
): PresentationStop => ({
  id: `${sectionId}:${progress}`,
  sectionId,
  progress,
  label,
  requires,
});

/*
 * Progress values are chosen to land on a settled moment in each section's
 * timeline (after a Beat has finished fading in, or at the end of a reveal).
 * They were checked against the timings in each chapter component.
 */
export const PRESENTATION_STOPS: readonly PresentationStop[] = [
  // Opening
  stop("opening", 0.03, "The signal in the dark"),
  stop("opening", 0.26, "The countdown begins"),
  stop("opening", 0.5, "Tension rises as the seconds fall"),
  stop("opening", 0.8, "The countdown runs out"),
  stop("opening", 0.84, "Title: Fifteen Seconds"),
  stop("opening", 0.99, "The opening thesis"),

  // Chapter 01 — The Crossing
  stop("chapter-01", 0.06, "Tara and Dadu reach the crossing"),
  stop("chapter-01", 0.2, "The countdown starts"),
  stop("chapter-01", 0.4, "Tara moves ahead of Dadu"),
  stop("chapter-01", 0.66, "Tension rises as time runs out"),
  stop("chapter-01", 0.82, "The signal turns red; Dadu is still on the road"),
  stop("chapter-01", 0.93, "Dadu's close-up: “Maine kya galat kiya?”"),

  // Chapter 02 — Pace
  stop("chapter-02", 0.04, "Fifteen seconds for everyone"),
  stop("chapter-02", 0.25, "Young Student: 11 seconds"),
  stop("chapter-02", 0.405, "Person Carrying Groceries: 17 seconds"),
  stop("chapter-02", 0.56, "Parent & Child: 24 seconds"),
  stop("chapter-02", 0.715, "Elderly Pedestrian: 27 seconds"),
  stop("chapter-02", 0.87, "Pedestrian with Mobility Difficulty: 31 seconds"),
  stop("chapter-02", 0.97, "Equal does not always mean fair"),

  // Chapter 03 — Look Again
  stop("chapter-03", 0.06, "Look Again"),
  stop("chapter-03", 0.17, "Hotspot: someone trying to save seconds"),
  stop("chapter-03", 0.31, "Hotspot: car on the footpath"),
  stop("chapter-03", 0.45, "Hotspot: car on the zebra crossing"),
  stop("chapter-03", 0.59, "Hotspot: blocked ramp"),
  stop("chapter-03", 0.73, "Hotspot: garbage beside the bin"),
  stop("chapter-03", 0.9, "Nothing here was hidden"),

  // Chapter 04 — The Average Human
  stop("chapter-04", 0.18, "Tara questions the average"),
  stop("chapter-04", 0.36, "Most pedestrians can cross in fifteen seconds"),
  stop("chapter-04", 0.54, "But who is the average pedestrian?"),
  stop("chapter-04", 0.8, "The people the average leaves out"),
  stop("chapter-04", 0.95, "There is no average person"),

  // Chapter 05 — The Mirror
  stop("chapter-05", 0.25, "Complaints about the system"),
  stop("chapter-05", 0.58, "The system becomes “us”"),
  stop("chapter-05", 0.84, "Visible civic behaviour"),
  stop("chapter-05", 0.95, "A system is made of people"),

  // Chapter 06 — The Notebook
  stop("chapter-06", 0.09, "Field note: young student"),
  stop("chapter-06", 0.21, "Field note: groceries"),
  stop("chapter-06", 0.33, "Field note: parent and child"),
  stop("chapter-06", 0.45, "Field note: elderly pedestrian"),
  stop("chapter-06", 0.57, "Field note: mobility difficulty"),
  stop("chapter-06", 0.74, "What the notebook adds up to"),
  stop("chapter-06", 0.95, "The timer was never the whole problem"),

  // Chapter 07 — The Poster
  stop("chapter-07", 0.17, "The notice goes up on the wall"),
  stop("chapter-07", 0.27, "A passerby laughs and keeps walking"),
  stop("chapter-07", 0.37, "A passerby does not look up"),
  stop("chapter-07", 0.47, "A passerby tears a corner off"),
  stop("chapter-07", 0.57, "A passerby glances, shrugs, moves on"),
  stop("chapter-07", 0.68, "Then, one person stops"),
  stop("chapter-07", 0.76, "A second person notices"),
  stop("chapter-07", 0.84, "A third person follows"),
  stop("chapter-07", 0.95, "Nobody applauded. Someone still stopped."),

  // Chapter 08 — Second Person (choices are required; see requirements.ts)
  stop("chapter-08", 0.18, "Scenario 1: the ramp. Choose a response.", "chain-choice-0"),
  stop("chapter-08", 0.26, "Scenario 1: what follows", "chain-choice-0"),
  stop("chapter-08", 0.42, "Scenario 2: the delivery crate. Choose a response.", "chain-choice-1"),
  stop("chapter-08", 0.5, "Scenario 2: what follows", "chain-choice-1"),
  stop("chapter-08", 0.66, "Scenario 3: the idling car. Choose a response.", "chain-choice-2"),
  stop("chapter-08", 0.74, "Scenario 3: what follows", "chain-choice-2"),
  stop("chapter-08", 0.95, "One person cannot change a city. A second person can."),

  // Chapter 09 — Thirty-Four Seconds
  stop("chapter-09", 0.05, "The same crossing, another morning"),
  stop("chapter-09", 0.35, "Tara and Dadu cross at an unhurried pace"),
  stop("chapter-09", 0.7, "Dadu reaches the other side"),
  stop("chapter-09", 0.9, "The city gave them more time, but that was not the real change"),
  stop("chapter-09", 0.99, "The real change: people stop taking time from one another"),

  // Chapter 10 — The City
  stop("chapter-10", 0.1, "View: a crossing"),
  stop("chapter-10", 0.25, "View: a street"),
  stop("chapter-10", 0.39, "View: a neighbourhood"),
  stop("chapter-10", 0.53, "View: a city"),
  stop("chapter-10", 0.72, "View: a sea of people"),
  stop("chapter-10", 0.92, "The closing message"),

  // Commitments and closing
  stop("commitments", 0, "What will you not do today?"),
  stop("closing", 0, "Closing"),
];
