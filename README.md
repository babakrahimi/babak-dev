# babak.dev

Personal site of Babak Rahimi — senior frontend engineer, Berlin.

Design direction: **Bench**. One dark ruled canvas, two typefaces, one amber
accent, three short sections, and a small machine on the bench that notices you.
Structure is carried by 1px hairlines and negative space rather than cards — no
containers, no cards, no shadows.

No framework, no runtime dependencies.

## Commands

| Command           | Action                                  |
| ----------------- | --------------------------------------- |
| `npm install`     | Install dependencies (Vite only)        |
| `npm run dev`     | Dev server on `localhost:5173`          |
| `npm run build`   | Production build to `dist/`             |
| `npm run preview` | Serve the production build locally      |

## Structure

```
index.html          Single page. Hero, status strip, 01 Approach / 02 Instruments / 03 Contact
src/tokens.css      Design tokens — colour, type, space, rules, motion
src/style.css       All styling, in token terms
src/machine.js      Fig. 01 — the pointer-tracking Macintosh
src/reveal.js       Scroll reveals and the section indicator
src/main.js         Entry
public/fonts/       Instrument Sans (variable) + IBM Plex Mono 400/500, latin subsets
public/og.png       Open Graph card, 1200×630
public/favicon.svg  The machine at 32px
```

## Design system

Full palette, type scale and rationale live in `src/tokens.css`. The short
version:

- **Ground** `#0a0c0f` — slightly cool. **Text** `#eeede9` — slightly warm.
  That temperature split is what keeps the greyscale from reading as a default.
- **Accent** `#edb24d` signal amber, 10.33:1 on the ground. Chroma capped at
  .135. Never body text, never a large fill, never a glowing border. At most six
  accent marks on screen at once.
- **Type** Instrument Sans for anything you'd say out loud; IBM Plex Mono for
  anything the page knows about itself. No heading is ever bold — hierarchy
  comes from size, colour and space. Tracking moves inversely to size, from
  `-0.03em` at display to `+0.09em` at 11px.
- **Rules** two grey weights plus the accent, no fourth. One radius, 2px. No
  shadows anywhere.
- **Cards** are not a layout tool — there are none. Approach, Instruments and
  Contact are all ruled ledgers on the same canvas, sharing an 11rem label
  column so their values align down the page.
- **Every token is used.** Nothing is declared "for later."

The status strip between the hero and `01 / Approach` is deliberately
subordinate: no heading, no section number, no nav entry, 11px labels over 13px
text, and roughly a fifth of a section's height. It is one self-contained `<dl>`
and deletes without touching the layout.

## Fig. 01

The Macintosh in the hero is drawn from primitives (no traced paths) in the same
1px stroke as the page's rules, with `vector-effect="non-scaling-stroke"` so the
line stays 1px at any size. It tracks the pointer with 5.5 user units of eased eye
travel, ≤1.5° of chassis parallax, and a screen glow that follows the pointer.
Blink is randomised 3–7s; click or tap winks.

It carries no explanatory callouts. Labelling the visual effects — "pointer
glow", "status LED" — would be annotating the design rather than reporting
anything, which is where this aesthetic turns artificial.

The telemetry beside `Fig. 01` reports the real normalised pointer vector and
the real state. **Rule: a readout reports something true or it does not ship.**
No invented build hashes, no fake uptime.

Behaviour by context:

- **Desktop** full annotation layer with two leaders; the rAF loop is cancelled
  by `IntersectionObserver` the moment the hero leaves the viewport.
- **Tablet** leaders are dropped rather than shrunk — they need horizontal run
  to read.
- **Mobile** the machine leaves the corner and joins the reading flow,
  right-aligned, never over content or a tap target.
- **Reduced motion** effects are gated on `prefers-reduced-motion: no-preference`,
  so the accessible path is the default branch. Eye tracking survives — it is
  directly user-driven with no autonomous animation — but every tween, the
  parallax, the glow and the blink do not.

## Budget

Measured on the production build:

| Asset | Raw     | Transferred |
| ----- | ------- | ----------- |
| HTML  | 14.7 kB | 3.6 kB      |
| CSS   | 18.7 kB | 4.7 kB      |
| JS    | 5.1 kB  | 2.0 kB      |
| Fonts | 48.8 kB | 48.8 kB     |

**59 kB** total on first load, zero raster images on the critical path, zero
runtime dependencies.

Verified contrast against the `#0a0c0f` ground: primary text 16.72:1, body
9.15:1, muted labels 4.64:1, accent 10.33:1. No horizontal overflow from 320 to
2560 px. Every interactive target is at least 44 px; every focusable element
carries a 1 px amber `:focus-visible` ring and scrolls into view on Tab.

## Voice

The copy is deliberately matter-of-fact. The visual system and the Macintosh
carry the personality, so the writing does not need to perform — no aphorisms
written to be quoted, no "crafted with care", no coffee. The colophon stays a
colophon: copyright, typefaces, stack, source. Nothing else earns a line.
