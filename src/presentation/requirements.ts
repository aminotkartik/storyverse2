import type { ChainChoices } from "../state/chainChoices";

/**
 * Inputs that must be completed before the slideshow may move past a stop.
 * Only the three Chapter 08 choices are required. Commitments and hotspots are optional.
 */
export type RequirementId = "chain-choice-0" | "chain-choice-1" | "chain-choice-2";

const CHAIN_SLOT: Record<RequirementId, number> = {
  "chain-choice-0": 0,
  "chain-choice-1": 1,
  "chain-choice-2": 2,
};

export const REQUIREMENT_MESSAGE =
  "Choose one of the two responses to continue. Either choice is valid, and you can change it later.";

export function isRequirementMet(id: RequirementId, choices: ChainChoices): boolean {
  return choices[CHAIN_SLOT[id]] !== undefined;
}
