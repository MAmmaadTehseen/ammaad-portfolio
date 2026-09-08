# DESIGN.md

## Theme

**Read-out** — a precision field instrument. Anodised olive housing, silkscreen
labels, one hot amber signal LED, a live trace behind the name.

Scene sentence: *a backend engineer reading a stack trace at 2am in Lahore, the
panel of a well-made instrument the only lit thing in the room.*

Reference lane: Nagra tape decks, Braun lab equipment, a surveyor's transit.
Explicitly **not** terminal-green, **not** editorial-serif, **not** SaaS-cream.

## Color

OKLCH throughout. Strategy: **committed** — the surface carries the brand.

The background is tinted (chroma 0.018) rather than neutral black. That is the
documented exception, and it earns it: the mood is environmental, the surface
*is* the anodised housing. Warmth is not smuggled into a near-white.

| Token | Value | Hex | Contrast vs bg |
| --- | --- | --- | --- |
| `--color-bg` | `oklch(0.17 0.018 122)` | `#0e1108` | — |
| `--color-surface` | `oklch(0.225 0.022 122)` | `#1a1d12` | 1.12 |
| `--color-surface-2` | `oklch(0.275 0.024 122)` | `#262a1c` | 1.29 |
| `--color-line` | `oklch(0.34 0.02 122)` | `#363a2e` | 1.63 |
| `--color-ink` | `oklch(0.96 0.008 110)` | `#f2f2ec` | **17.01** |
| `--color-muted` | `oklch(0.72 0.018 112)` | `#a4a699` | **7.72** |
| `--color-dim` | `oklch(0.625 0.018 112)` | — | **5.37** |
| `--color-primary` | `oklch(0.78 0.15 124)` | `#a4c752` | **9.87** |
| `--color-signal` | `oklch(0.76 0.165 62)` | `#fa9524` | **8.54** |

All ratios computed, not estimated. `--color-dim` was raised from L 0.56 (4.12:1,
failing) to L 0.625 during the build.

**Amber is a signal, never decoration.** It marks: availability, the active
channel, the active project, scroll position, and packets moving through a
diagram. If it is amber, it means something is live.

## Typography

Two families on a contrast axis — a wide grotesque against a boxy mono.

- **Archivo** (variable, `wdth` axis). Display runs at `font-stretch: 125%` for a
  signage feel. Also carries body copy at normal width.
- **Martian Mono** — instrument silkscreen. Labels, readouts, metadata, numbers.
  Mono is functional here, not costume.

Neither appears on the reflex-reject list.

- Display letter-spacing: `-0.03em` (floor is `-0.04em`; letters never touch).
- Hero: `clamp(2.75rem, 14vw, 11rem)` — ceiling under 6rem is waived for a
  single-word name, and 14vw guarantees it never breaks mid-word on mobile.
- Body prose capped at `68ch`, `text-wrap: pretty`. Headings `text-wrap: balance`.
- The engraved panel tag (`.u-engrave`) is the **one** deliberate label system,
  always paired with a rule or a value. It is not an eyebrow above every heading.

## Materials

- `.u-panel` — surface + hairline border. No border-plus-wide-shadow ghost cards.
- `.u-chamfer` — a 1px inner top highlight, the way milled aluminium catches light.
- `.u-grain` — 3.5% fractal noise overlay. Used on panels and the footer only.
- `.u-rule` — a hairline that fades out, like a measurement rule on a datasheet.
- `.u-led` — 6px amber dot with a double halo; `.u-led-live` pulses.
- Radii stay at 0. This is a machined panel; rounding it would soften the idea.

## Motion

Exponential ease-out only — `cubic-bezier(0.16, 1, 0.3, 1)`. No bounce, no elastic.

1. **Boot** — a 0→100 counter, a filling rule, then the panel lifts. Once per
   session, gated pre-paint by an inline script.
2. **Hero** — per-letter mask reveal, staggered 60ms, held until boot clears.
3. **Signal trace** — WebGL fBm field, seven stacked traces with an amber energy
   term. The traces are repelled by the pointer and run hot where they bend, so
   the hero is something you can push around rather than something you watch.
   Renders at 0.6x CSS pixels (every feature is a soft glow, so there is nothing
   for the resolution to resolve), three fBm octaves, and the loop stops
   entirely when the hero leaves the viewport or the tab is hidden.
4. **Cursor** — a crosshair reticle that rotates 45° and expands over targets, with
   a readout label from `data-cursor`.
5. **Scroll** — Lenis wheel smoothing; the nav hairline is a signal level.
6. **Channel switch** — a spring-driven indicator plus a scramble settle on the
   copy, like a readout landing on a value.
7. **Diagrams** — edges self-draw, then packets travel them. Paths carry
   `pathLength="1"` so one keyframe is correct for every edge length.

Reduced motion is a designed alternative everywhere: boot skipped, shader frozen
on one composed frame, reveals stripped of transforms, cursor reverted, packets
not rendered.

## Layout

- Asymmetric two-column work index: a list on the left, a sticky readout on the
  right. Below `lg` the readout collapses inline under its own row.
- Fluid `clamp()` spacing; generous section separation, tight groupings inside.
- Grid and flex children carry `min-w-0` so a wide diagram can never stretch the
  page — the diagram scrolls inside its own container instead.
- Semantic z-scale by name: `dropdown → sticky → nav → overlay → modal → cursor → boot`.

## Imagery

No stock photography and no sketchy SVG. The imagery is generated and structural:
the WebGL trace, and the animated architecture diagrams that stand in for
screenshots on closed work. On this brief that is the honest image — the systems
*are* the portfolio.
