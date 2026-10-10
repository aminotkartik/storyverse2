# Fifteen Seconds

**A city should not ask people to become faster. It should learn to become fairer.**

An interactive manga narrative about Tara, her grandfather Dadu, and a pedestrian
signal that gives everyone — regardless of age, ability, or circumstance — exactly
fifteen seconds to cross the road. A StoryVerse continuation project about civic
responsibility, inaccessible infrastructure, and the small choices that build (or
erode) a civil society. Built for SDG 11 — Sustainable Cities & Communities.

This is not a static comic or a scrolling landing page. It is a short, guided,
interactive graphic novel: the visitor clicks the signal, drags a poster onto a
wall, scrolls through a mirror of their own city, and chooses what they will stop
doing.

## Running locally

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run preview  # preview the production build
```

The build is a static site (no backend, no database, no auth) and can be deployed
as-is to GitHub Pages, Vercel, Netlify, or any static host.

## Controls

- **Click / tap** — every interaction (the signal, hotspots, poster drag, choices)
  is click/tap driven. Nothing requires sound or hover to function.
- **Arrow Left / Right** — move between chapters once the story has begun.
- **Scroll / swipe** — inside "The Mirror" (05) and "34 Seconds" (09), scrolling or
  swiping drives the scene forward at the visitor's own pace.
- **P** — toggle Presentation Mode: hides secondary chrome and jumps to Chapter 01,
  for a clean 3-minute live demo.
- **E** — restart the entire experience from the opening countdown.
- The floating pill in the bottom-left opens a manga-style table of contents; the
  bottom-right holds the sound toggle and chapter prev/next controls.

## Architecture

- **React 19 + TypeScript + Vite**, styled entirely with **Tailwind CSS v4**
  (CSS-first theme in `src/index.css`).
- **framer-motion** drives every transition, drag interaction, and staged reveal.
- **lucide-react** supplies the small interface icons (menu, sound, chevrons).
- Sound is **synthesized procedurally with the Web Audio API** (`src/hooks/useSound.ts`)
  — honks, heartbeat, signal beeps, page turns, tearing paper and a soft ambient
  traffic bed are all generated oscillators/noise buffers, so there are no audio
  files to host or license, and nothing ever autoplays. The visitor must opt in
  via the sound toggle.
- Illustrations (`public/images/`) are original, AI-generated manga-style ink
  artwork created specifically for this project, art-directed to stay
  monochrome/halftone with a restrained red/amber accent, avoiding any existing
  franchise's style.
- `src/App.tsx` is a small state machine: `loading → intro → chapter(1..10) →
  ending → final`, with every chapter being an independently interactive React
  component under `src/components/chapters/`.
- `src/data/content.ts` holds every piece of narrative data (pedestrian pacing,
  hotspot copy, notebook stats, campaign reactions, chain-reaction choices, and
  ending prompts) separated from presentation.
- Accessibility: visible focus rings, `prefers-reduced-motion` support (global
  CSS kill-switch for animation durations), semantic buttons/labels throughout,
  a screen-reader live region announcing the current chapter, and no interaction
  that depends exclusively on audio or hover.

## Chapters

1. The Crossing · 2. Fifteen Seconds · 3. Look Again · 4. The Average Human ·
2. The Mirror · 6. The Numbers · 7. Give Them 15 Seconds · 8. The Second Person ·
3. 34 Seconds · 10. The City — followed by an interactive ending ("What will you
not do today?") and a quiet final screen.

## Notes on tone

The story is intentionally not anti-government or anti-people. It argues that
poor infrastructure, weak enforcement, and normalized small selfishness feed each
other in a loop — and that the loop can be broken from either direction. The
closing idea is hopeful: civic sense is empathy made visible, and it starts with
things we choose not to do.
