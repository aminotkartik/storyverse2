import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SECTIONS } from "../data/content";
import { PRESENTATION_STOPS, type PresentationStop } from "../presentation/stops";
import { REQUIREMENT_MESSAGE, isRequirementMet } from "../presentation/requirements";
import { nearestStopIndex, scrollToStop } from "../presentation/navigation";
import { getChainChoices, useChainChoices } from "../state/chainChoices";
import { useReducedMotion } from "../hooks/useReducedMotion";

const STOPS = PRESENTATION_STOPS;
const LAST = STOPS.length - 1;
const clampIndex = (i: number) => Math.min(LAST, Math.max(0, i));

export interface PresentationApi {
  active: boolean;
  index: number;
  total: number;
  stop: PresentationStop;
  sectionId: string;
  chapterLabel: string;
  /** Explanation shown while Next is blocked by a required input, otherwise null. */
  blockedMessage: string | null;
  canGoPrevious: boolean;
  isLast: boolean;
  enter: () => void;
  exit: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  goToIndex: (index: number) => void;
  goToSection: (sectionId: string) => void;
}

const PresentationContext = createContext<PresentationApi | null>(null);

function chapterLabelFor(sectionId: string): string {
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) return "";
  if (section.number !== undefined) {
    return `CHAPTER ${String(section.number).padStart(2, "0")}: ${section.title.toUpperCase()}`;
  }
  return section.title.toUpperCase();
}

/**
 * Owns Slideshow Mode. Scroll Mode is the default and is untouched: the page
 * scrolls natively. Slideshow mode only moves between stops, and locks scrolling
 * through the `presenting` class on <html> while it is active.
 */
export function PresentationProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const choices = useChainChoices();

  const moveTo = useCallback(
    (target: number) => {
      const i = clampIndex(target);
      const from = STOPS[indexRef.current];
      const to = STOPS[i];
      // Same-section moves glide. Cross-section jumps and reduced motion are instant.
      const instant = reduced || from.sectionId !== to.sectionId;
      scrollToStop(to, instant ? "auto" : "smooth");
      indexRef.current = i;
      setIndex(i);
    },
    [reduced]
  );

  const enter = useCallback(() => {
    const i = nearestStopIndex(STOPS);
    scrollToStop(STOPS[i], "auto");
    indexRef.current = i;
    setIndex(i);
    setActive(true);
  }, []);

  const exit = useCallback(() => setActive(false), []);

  const next = useCallback(() => {
    const current = STOPS[indexRef.current];
    // Checked against the live store so the gate never uses a stale render.
    if (current.requires && !isRequirementMet(current.requires, getChainChoices())) return;
    moveTo(indexRef.current + 1);
  }, [moveTo]);

  const previous = useCallback(() => moveTo(indexRef.current - 1), [moveTo]);

  const goToIndex = useCallback((i: number) => moveTo(i), [moveTo]);

  const goToSection = useCallback(
    (sectionId: string) => {
      const i = STOPS.findIndex((s) => s.sectionId === sectionId);
      if (i >= 0) moveTo(i);
    },
    [moveTo]
  );

  const toggle = useCallback(() => {
    if (active) exit();
    else enter();
  }, [active, enter, exit]);

  // Scroll lock applies only while the slideshow is active.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("presenting", active);
    return () => root.classList.remove("presenting");
  }, [active]);

  // Keep the current stop pinned when the viewport changes size.
  useEffect(() => {
    if (!active) return;
    const onResize = () => scrollToStop(STOPS[indexRef.current], "auto");
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active]);

  // Keyboard navigation applies only in Slideshow Mode and never inside form fields.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) {
        return;
      }
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          previous();
          break;
        case "Home":
          e.preventDefault();
          moveTo(0);
          break;
        case "End":
          e.preventDefault();
          moveTo(LAST);
          break;
        case "Escape":
          // While the chapter menu is open, Escape closes the menu instead.
          if (document.querySelector('nav[aria-label="Chapters"]')) return;
          e.preventDefault();
          exit();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, next, previous, moveTo, exit]);

  const value = useMemo<PresentationApi>(() => {
    const stop = STOPS[index];
    const blocked = stop.requires && !isRequirementMet(stop.requires, choices);
    return {
      active,
      index,
      total: STOPS.length,
      stop,
      sectionId: stop.sectionId,
      chapterLabel: chapterLabelFor(stop.sectionId),
      blockedMessage: blocked ? REQUIREMENT_MESSAGE : null,
      canGoPrevious: index > 0,
      isLast: index === LAST,
      enter,
      exit,
      toggle,
      next,
      previous,
      goToIndex,
      goToSection,
    };
  }, [active, index, choices, enter, exit, toggle, next, previous, goToIndex, goToSection]);

  return <PresentationContext.Provider value={value}>{children}</PresentationContext.Provider>;
}

export function useSlideshow(): PresentationApi {
  const ctx = useContext(PresentationContext);
  if (!ctx) throw new Error("useSlideshow must be used inside PresentationProvider");
  return ctx;
}
