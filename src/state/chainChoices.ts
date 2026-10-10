import { useSyncExternalStore } from "react";

/**
 * Chapter 08 choices live outside any one component so they survive scrolling
 * away, slideshow navigation, and mode switches. Each slot is one scenario.
 */
export type ChainChoice = "careless" | "responsible";
export type ChainChoices = readonly (ChainChoice | undefined)[];

let snapshot: ChainChoices = [];
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ChainChoices {
  return snapshot;
}

export function getChainChoices(): ChainChoices {
  return snapshot;
}

export function setChainChoice(index: number, choice: ChainChoice): void {
  if (snapshot[index] === choice) return;
  const next = [...snapshot];
  next[index] = choice;
  snapshot = next;
  listeners.forEach((listener) => listener());
}

export function useChainChoices(): ChainChoices {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
