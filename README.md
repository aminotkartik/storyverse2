# Fifteen Seconds

**A city should not ask people to become faster. It should learn to become fairer.**

An interactive manga narrative about Tara, her grandfather Dadu, and a pedestrian
signal that gives everyone — regardless of age, ability, or circumstance — exactly
fifteen seconds to cross the road. A StoryVerse continuation project about civic
responsibility, inaccessible infrastructure, and the small choices that build (or
erode) a civil society. Built for SDG 11 — Sustainable Cities & Communities.

It is a scroll-driven graphic novel. The page is one continuous document: you read
it by scrolling, and each chapter unfolds as you move through it.

## Running locally

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/ (single-file HTML, relative asset paths)
npm run preview  # preview the production build
```

The build is a static site (no backend, no database, no auth). Asset paths are
relative, so it works on GitHub Pages sub-paths as well as Vercel, Netlify, or any
static host.

## Controls

- **Scroll** — the only control. The page scrolls natively: there is no scroll
  hijacking, no wheel counting, and no key presses are needed. The timeline of each
  chapter is tied to how far you have scrolled through it, so you can pause, go back,
  or skip ahead.
- **Sound** — off by default. Use the speaker button (top right) to turn it on. When
  it is off, nothing plays, and turning it off stops the ambient bed at once.
- **Music** — the note button beside the speaker switches the looping background bed
  (`public/bgm.mp3`) on and off. It plays at about a fifth of full volume, under the
  narration and the effects, and is a separate control: turning the speaker off stops
  everything at once. Nothing plays until you opt in with either button, and if the
  browser blocks the start, the music begins on your next click or key press.
- **Chapter menu** — the menu button (top left) lists every chapter and the ending as
  anchor links. The current chapter is shown beside it as `NN / 10 — TITLE`. A thin
  bar at the top shows overall progress.
- **Optional choices** — "Look Again" hotspots and the "Second Person" choices are
  keyboard-accessible buttons. In Scroll Mode they are optional and never block scrolling.
  The only exception is Slideshow Mode, where one of the two responses in each "Second
  Person" scenario must be chosen before Next moves on. Either response is valid, and a
  choice can be changed later. Selections are kept while you move between slides.
- **Slideshow Mode** — the button at the top, labelled `SLIDESHOW MODE`, switches to a
  guided walk through the story. The control bar at the bottom has Previous, Next, and a
  progress bar. It shows `SLIDE n / N — CHAPTER NN: TITLE`. Keys: ←/→ or ↑/↓ move between
  slides, Home and End jump to the first and last slide, and Escape exits. Keys are ignored
  inside form fields. Choosing a chapter from the menu jumps to its first slide. Scroll Mode
  is the default, and it is the only mode that leaves native scrolling untouched. Slideshow
  Mode locks page scrolling while it is active. With reduced motion, slide changes are
  instant. The slides are stops on the same scenes, so there is no duplicate content.
- **Reduced motion** — when `prefers-reduced-motion` is set, camera moves, zooms, and
  pans are switched off. The story text and its timing are unchanged.

## Ending: "What will you not do today?"

Tick the commitments you mean. They are saved in **this browser only** (localStorage,
key `fifteen-seconds-commitments`). They are not sent anywhere and are not shared with
other visitors. Each commitment is stored once, so ticking and unticking never
duplicates entries. Use "Clear my choices" to remove them.

## Architecture

- **React 19 + TypeScript + Vite**, styled with **Tailwind CSS v4** (CSS-first theme
  in `src/index.css`).
- **framer-motion** drives the scroll timelines (`useScroll`, `useTransform`).
  Values that change with scroll are motion values, so scrolling does not re-render
  React on every frame; discrete values (the countdown digit, the active step) are
  read through `useDiscrete`, which updates state only when they change.
- **lucide-react** supplies the small interface icons.
- `src/components/story/StorySection.tsx` is the building block for every chapter: a
  tall track with a sticky stage. `Beat` fades text in and out across a range of
  progress. `CrossingLane` and the figure rig in `src/components/figures/` are shared
  by the crossing scenes.
- Sound is synthesized with the **Web Audio API** (`src/hooks/useSound.ts`): honks,
  heartbeat, signal beeps, page turns, tearing paper, and an ambient traffic bed are
  generated in code, so there are no audio files to host. Nothing autoplays; the
  visitor opts in with the toggle.
- Illustrations (`public/images/`) are original manga-style artwork created for this
  project. The portraits are also provided as WebP for faster loading.
- `src/data/content.ts` holds the narrative data (pedestrian crossing times, hotspot
  copy, notebook pages, poster reactions, chain-reaction choices, commitments) apart
  from presentation. The civic figures in the notebook chapter are labelled
  illustrative story values, not survey data.
- Accessibility: visible focus rings, semantic sections with headings, native
  checkboxes and buttons, a skip link to the story, a screen-reader live region for
  the current chapter, and no interaction that depends on audio or hover.

## Chapters

1. The Crossing · 2. Fifteen Seconds · 3. Look Again · 4. The Average Human ·
5. The Mirror · 6. The Numbers · 7. Give Them 15 Seconds · 8. The Second Person ·
9. 34 Seconds · 10. The City — followed by the ending ("What will you not do today?")
and a quiet final screen.

## Notes on tone

The story is intentionally not anti-government or anti-people. It argues that
poor infrastructure, weak enforcement, and normalised small selfishness feed each
other in a loop — and that the loop can be broken from either direction. The
closing idea is hopeful: civic sense is empathy made visible, and it starts with
things we choose not to do.
