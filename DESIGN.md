# DESIGN.md: Afterglow

## 1. Theme and scene

**Scene.** A founder or operations lead in London, Zurich or Dubai opens the link at the end of the working day. They are at a kitchen table under one warm pendant lamp, with the room half dark and this week's broken app still on their mind. They give a stranger in Lahore two unhurried minutes to earn a 30-minute call. The room is dim and the reader is tired and wary, so the page is dark, low-glare and warm-toned, and it never rushes them.

**Theme.** The site is lit by the sunset in Ammaad's own photograph. It opens as a dark, quiet room with one window of light, the rooftop portrait. The sky from that photo spills onto the page the way a TV in "ambient mode" colours the wall behind it. The offer sentence switches on word by word, from dim to lit. As you scroll, the light sinks (the "sundown"). The architecture diagrams switch on node by node, like windows across a city at dusk. Every page ends under a warm lamp that follows your hand.

**Why it reads as soft rather than gamified:**
- Things come into focus or brighten. They do not travel.
- One choreographed moment plays once per session.
- Every other motion answers the reader's scroll or pointer, with long decelerating tails.
- Only two things loop: the availability dot and a 90-second capability band, and both pause when off-screen.
- There is no loader, custom cursor, WebGL, scramble text, HUD or counter.

**Colour strategy.** Restrained. Neutrals are tinted towards the photo (hue 32, chroma 0.016 or less). A single apricot accent covers under 5% of the pixels in any view. Drama comes from light (the photo, its spill and the lamp), never from painted surfaces.

**Anti-references.** Instrument or HUD, terminal green, editorial serif italic with mono kickers, SaaS cream, synthwave sunset gradients, decorative glow blobs, lime-on-black v0 templates, navy-and-mint clones.

## 2. Colour tokens

All tokens are defined in `globals.css` under `@theme` as OKLCH. The hex values are the sRGB conversions. Contrast is WCAG 2.x, computed during the design pass with a small OKLCH-to-sRGB script.

| Token | OKLCH | Hex | Role |
|---|---|---|---|
| `--bg` | 0.165 0.009 32 | #120d0c | Page ground, from the black tee darkened. Also `themeColor`; `colorScheme: dark`. |
| `--bg-deep` | 0.135 0.008 32 | #0b0706 | Closing-room floor, featured-stage screen, case poster layer. |
| `--surface` | 0.205 0.011 32 | #1c1514 | Short-version card, case sheet, compact nav pill (94%, solid, no blur), mobile menu. |
| `--surface-2` | 0.245 0.013 32 | #261e1d | Diagram nodes at rest, hovered rows. |
| `--line` | 0.33 0.014 32 | #3c3331 | Decorative hairlines only. |
| `--line-strong` | 0.52 0.016 40 | #726662 | Diagram edges, ghost-pill borders, input borders, inactive ticks. Non-text. |
| `--ink` | 0.955 0.011 80 | #f4efe8 | Headings, lit words, node labels, active items. Warm white, never #fff. |
| `--ink-2` | 0.87 0.012 70 | #d9d3cc | Body copy, default links. |
| `--muted` | 0.735 0.02 50 | #b4a69e | Meta, captions, legends, sub and edge labels, torch-card base text. |
| `--dim` | 0.66 0.02 45 | #9d8f88 | The dimmed state for focus-dimming siblings and inactive tabs and radios. |
| `--faint` | 0.56 0.018 40 | #7e716d | Transitional start colour for light-ups on display text only. Never a resting colour. |
| `--glow` | 0.855 0.115 76 | #fbc576 | Apricot from the photo's near-sun sky. Primary CTA fill, availability dot, active hairlines and ticks, packets, focus ring, selection background, the lit key phrase. |
| `--glow-hover` | 0.90 0.10 78 | #ffd691 | Primary CTA hover fill. |
| `--on-glow` | = `--bg` | #120d0c | Text on apricot. |
| `--lit` | color-mix(in oklch, var(--glow) 8%, var(--surface-2)) | ≈#362925 | Resting fill of a node once it has switched on. |
| `--flare` | color-mix(in oklch, var(--glow) 14%, var(--surface-2)) | n/a | Node fill at the peak of assembly (under 0.5s). |
| `--ember` | 0.70 0.13 50 | #de844f | Gradients only, 16% alpha or less (horizon, spill core). Never text. |
| `--haze` | 0.62 0.05 30 | #a27b74 | Gradients only (rose city haze in the spill and horizon). Never text. |

### Computed contrast

| Foreground | bg | bg-deep | surface | surface-2 | lit | flare 14% | 20% glow wash | lamp 11% | nav 94% |
|---|---|---|---|---|---|---|---|---|---|
| ink | 16.92 | 17.56 | 15.75 | 14.28 | 11.93 | 10.24 | 10.86 | 13.76 | 15.82 |
| ink-2 | 13.00 | 13.50 | 12.10 | 10.98 | 9.17 | 7.87 | 8.35 | 10.58 | 12.16 |
| muted | 8.17 | 8.48 | 7.60 | 6.90 | 5.76 | 4.94 | 5.24 | 6.65 | 7.64 |
| dim | 6.16 | 6.40 | 5.73 | 5.20 | 4.34 (not used) | n/a | 3.95 (not used) | 5.01 | 5.76 |
| faint (transient, display ≥ 2rem only) | 4.12 | 4.28 | 3.83 | 3.48 | n/a | n/a | n/a | 3.35 | 3.85 |
| line-strong (non-text) | 3.48 | 3.61 | 3.24 | 2.94 (never used there) | n/a | n/a | n/a | n/a | 3.26 |
| glow | 12.25 | 12.72 | 11.40 | 10.34 | 8.64 | n/a | 7.86 | 9.97 | 11.46 |

Other pairs:
- `--on-glow` on `--glow` (CTA label): 12.25. On `--glow-hover`: 14.07.
- Focus ring (2px glow, 3px offset) on bg: 12.25.

**Contrast rules**
- Body text is ink-2 or ink on every surface (10.98:1 or better).
- Meta is muted: 4.94:1 at worst, during the flare only.
- Dimmed siblings use `--dim`, never opacity: 5.20:1 or better on every surface where a dimmed item sits.
- `--dim` never sits on `--lit` or on a glow wash.
- `--faint` is only a transient start state on text of 2rem or larger, and it is still 3.35:1 or better.
- Any glow that can sit under text is capped at a 20% composite, where muted stays at 5.24:1.
- Light-ups are on display text only.
- Every glow uses `closest-side` radial gradients or a feathered mask, so no box edge ever shows.

**Removed:** anodised olive (#0e1108), olive-green primary, amber signal, LED green, amber selection, custom scrollbar.

## 3. Typography

**Families.** Both are self-hosted via `next/font/google`, `display: 'swap'`, with CSS variables on `<html>`.
- **Ysabeau Office** (OFL, Christian Thalmann). Variable wght 1–1000, roman only. Latin woff2 is 38.6 KB. Used for display and voice. It has lining, tabular figures by default.
  `Ysabeau_Office({ subsets:['latin'], variable:'--font-display', display:'swap' })`
- **Afacad Flux** (OFL, Dicotype). Variable wght 100–1000; the slnt axis is not loaded. Latin woff2 is 40.2 KB. Used for body, UI and diagram labels, with `font-variant-numeric: tabular-nums` on times, years and counts.
  `Afacad_Flux({ subsets:['latin'], variable:'--font-text', display:'swap' })`
- Total fonts: 78.8 KB, down from 113.6 KB (Archivo wdth + Martian Mono are removed). **No monospace anywhere.**
- `lib/og.ts` fetches static TTFs (Ysabeau Office 300, Afacad Flux 400 and 500) and keeps its fall-back-to-built-ins behaviour.

**Why these.** The voice words are *lamplit, unhurried, exact*.
- Ysabeau Office is a humanist sans on Garamond proportions: warm at light weights and classical underneath. It sits outside the editorial-serif lane (no italics, no mono kickers, no ruled columns, full imagery).
- Afacad Flux is a calm geometric sans, which contrasts with it on the geometric-versus-humanist axis.
- The two carry Jingjing's temperament (huge sizes at light weights; emphasis comes from brightness, never bold display) without copying her fonts.

**Rules**
- Ysabeau Office 300 is never set below 1.5rem; use 350–400 below that.
- The smallest text anywhere is 0.8125rem (13px). SVG labels never render below 12px.
- No tracked uppercase labels. Sentence case everywhere.
- Headings use `text-wrap: balance`, prose uses `text-wrap: pretty`, and body is capped at 64ch.
- Display tracking is never tighter than -0.025em.

### Scale

| Role | Family / weight | Size | Tracking / leading |
|---|---|---|---|
| Hero offer (h1 line 2) | Ysabeau Office 300 | clamp(2.75rem, 1.1rem + 4.3vw, 5.25rem) | -0.022em / 1.02 |
| Hero who-line (h1 line 1) | Afacad 500 ink, then 400 muted | 1.0625rem | 0 / 1.4 |
| Page h1 (Work, About, Contact, case names of 18 characters or fewer) | Ysabeau Office 300 | clamp(3rem, 1.4rem + 4.6vw, 5.75rem) | -0.024em / 1.0 |
| Case h1 over 18 characters | Ysabeau Office 300 | clamp(2.5rem, 1.2rem + 3.4vw, 4.25rem) | -0.02em / 1.02 |
| Closing "Let's build / something that lasts." | Ysabeau Office 300 | clamp(3rem, 1.4rem + 5vw, 6rem) | -0.025em / 1.0 |
| h2 | Ysabeau Office 300 | clamp(2.25rem, 1.2rem + 3vw, 4rem) | -0.02em / 1.02 |
| h3, service titles, index names | Ysabeau Office 300 (350 for list rows) | clamp(1.625rem, 1.2rem + 1.5vw, 2.75rem) | -0.015em / 1.08 |
| Voice (bio ledes, standfirst, big email, channel labels) | Ysabeau Office 350 | clamp(1.375rem, 1.05rem + 1.1vw, 2.125rem) | -0.008em / 1.22 |
| Lead | Afacad 400 ink-2 | clamp(1.125rem, 1rem + 0.35vw, 1.3125rem) | 0 / 1.55, max 46ch |
| Body | Afacad 400 ink-2 | 1.0625rem (case body 1.125rem) | +0.004em / 1.68, max 64ch |
| UI, nav, buttons | Afacad 400 / 500 (buttons 600) | 0.9375–1.0625rem | 0 / 1.35 |
| Meta, captions | Afacad 400 muted | 0.875–0.9375rem | 0 / 1.45, tabular-nums |
| Legend (floor) | Afacad 400 muted | 0.8125rem | 0 / 1.45 |
| Horizon band | Ysabeau Office 300 muted | clamp(1.25rem, 1rem + 0.7vw, 1.625rem) | 0 / 1.3 |
| Diagram SVG | Afacad | node label 17u / 500 ink, sub 13.5u muted, edge chip 13u muted | Rendered floor 12px (see §8) |

## 4. Materials

- **Radii.** Portrait and cards 14px. Case sheet top 20px. Pills 999px. Diagram nodes 10u. No chamfers. No zero-radius rule.
- **Borders.** 1px `--line` on cards and the stage. Ghost pills use `--line-strong`. The base border colour is set in `@layer base`. There are no side-stripe borders anywhere.
- **Shadows.** None, except the case sheet: `0 -24px 48px oklch(.1 .01 32 / .5)`.
- **Glass and blur.** None. There is no `backdrop-filter` anywhere. The compact nav is solid `--surface` at 94%.
- **Light.** Light is the only decorative material:
  - the portrait spill (two `closest-side` radials in sampled sun #fecf76 at 26% and ember at 16%)
  - the hero horizon (a feathered ember and haze ellipse at 16% or less)
  - apricot dots in the horizon band
  - the closing-room lamp (a `closest-side` radial at 11%)
  Glow never appears behind other sections.
- **Selection** is `--glow` on `--bg`.
- **Focus** is `outline: 2px solid var(--glow); outline-offset: 3px` everywhere. The focus ring is never removed.
- **Removed:** u-engrave, u-panel, u-chamfer, u-grain (feTurbulence), u-rule, u-led plus its pulse, cursor:none rules, the boot rules, `text-rendering: optimizeLegibility`, and the custom scrollbar.
- **Z-scale**, defined once in `:root`: base 0, poster 0, sheet 10, header 50, menu 80, skip 100.

## 5. Layout

**Frame**
- Container max 1274px.
- Gutters: 16px below 768px, clamp(16px, 4vw, 40px) above.
- 12-column grid.
- Section rhythm: clamp(96px, 14vh, 160px).
- `min-width: 0` on every grid and flex child.
- `overflow-x: clip` on `body`, the hero and the closing room, because glows extend past their boxes.
- `scroll-margin-top: 104px` on anchor targets.

### Home, in order

1. **Hero** (min-height 100svh, content bottom-aligned, grid 7/5, gap clamp(32px, 5vw, 88px)).
   - Left column:
     - `<h1>`, in two visible parts:
       1. Who-line: `profile.name` (ink 500), then ", full-stack & AI engineer in Lahore, Pakistan" (muted), built from profile.role and profile.location.
       2. Display offer: `bio.client.lede` as LightUp words, with the last three words ("actually runs on.") in `--glow`.
     - A static sentence carrying the four services: "I take on SaaS & web apps, AI features & agents, automation & integrations, and rescue & maintenance." Built from `services[].title`, lower-cased after the first item.
     - Lead: the first sentence of `bio.client.body`.
     - CTA row: filled apricot `BookCallLink` "Book a 30-minute call →", then `WhatsAppLink` as a ghost pill, then an "Email" ghost pill (mailto).
     - Availability line: breathing dot, `profile.availableNote`, and the LocalTime sentence "18:42 in Lahore, 14:42 where you are". The second clause appears only when offsets differ. SSR prints "Lahore (UTC+5)".
     - Proof line: "Recently shipped:" followed by the brand names (the part before " — ") of the first four `featured` projects with tier `live` that have a Live link. Each links to `/work/[id]`. Derived from data, never hard-coded.
   - Right column: the portrait figure (4:5, max 420px, 14px radius), figcaption `profile.discipline` · "Lahore, UTC+5", and the spill behind it.
   - Bottom edge: the horizon glow.
   - Mobile order: who-line, offer, services sentence, full-width 52px primary CTA, WhatsApp and Email on one row, availability, proof line, then the portrait (up to 360px, object-position 50% 22%). At 390px the offer and primary CTA sit above the fold.
2. **Horizon band.** The 12 `capabilities` as a real `<ul aria-label="What I work on">` with an `aria-hidden` duplicate, full bleed between hairlines.
3. **What I can build for you.**
   - h2 and the lead "Each one points at the work that proves it."
   - Four full-width rows split 5/7, separated by hairlines. Left: the title as h3. Right: body, then "Proof:" and three `<Link>`s to `/work/[id]` using brand names.
   - After the list: "Not sure which of these it is?" followed by Book a call, WhatsApp, and "Or write it down →" (`/contact`).
   - Server component. No cards, icons or numbers.
4. **Selected work.**
   - h2 and lead: "Most of this is client software with private code, so it is drawn rather than screenshotted: how a request actually moves through it."
   - Link: "All {projects.length} projects →".
   - At 1024px and up, a 4/8 grid:
     - Left: a vertical tablist of the 8 `featured`, in site.ts order. Each tab shows the brand (Ysabeau 350, 1.625rem), the descriptor (or the tier label) in muted, and the year. Active: ink with a 32px apricot hairline. Inactive: `--dim` with a 16px hairline.
     - Right: a sticky (top 96px) `--bg-deep` stage. All 8 panels sit stacked in one grid cell. Each panel has: a meta row (tier label · year · role), h3 "Brand — descriptor" with the descriptor in muted, `lede.client`, the full diagram in a frame of clamp(260px, 26vw, 360px), the legend, "Read the case study →", and "Visit live ↗" when a Live link exists.
     - No slide counter.
   - Below 1024px: an `<ol>` of 8 rows. Each row has a 64px silhouette glyph, brand, descriptor, tier · year, `lede.client` and "Read the case study →". Plain rows with hairlines, not cards.
5. **The short version.**
   - 4/8 grid. The left rail has the h2 and a `<fieldset><legend>Read this as a</legend>` of three native radios from CHANNELS, each with its hint as a second line. Client is checked by default.
   - The right is a `--surface` card (14px radius, 1px line) holding all three bios in one grid cell.
     - Client shows `about.lede` as the voice line, so the hero sentence is not repeated. Recruiter and Engineer show `bio[channel].lede`.
     - Then `bio[channel].body`, the torch effect, and "Currently {experience[0].role} at {experience[0].org}" in muted.
     - Then "More about how I work →" (`/about`).
6. **Closing room**, shared (see §6 Nav and footer).

The ProfilePage JSON-LD stays on home only. StackPanel is removed from home.

### /work

- h1 "Work".
- Lead derived from data: "{projects.length} builds. The {showcase.length} below get the full treatment; smaller ones follow. What you can see of each depends on whether the source is mine to show."
- Tier filter, zero JS: native radios reading "All {n} · Live {n} · Private source {n} · Open source {n}", with counts from `showcase` by tier. "Private source" is the first clause of `TIERS.closed.note`.
- Showcase index: `<ol>` of `<Link>` rows. Each row has the brand (Ysabeau 350, clamp(1.75rem, 1.2rem + 1.5vw, 2.75rem)), the descriptor in muted, `lede.client` clamped to two lines, tier label and year (tabular) on the right, and an arrow.
  - Fine pointers get a lagging preview card.
  - Touch devices get a silhouette glyph and three-line ledes.
- Smaller builds (h2, note "Personal tools and shorter engagements"): `shortEntries` as rows (name, `lede.client`, tier · year, link). There is no pinned strip.
- Also built (h2): `alsoBuilt` as one-line rows of name and note. No links.
- Closing note (existing copy) linking to `/contact`, then the closing room.

### /work/[slug]

- Fixed poster layer: the project's silhouette, right-aligned, `mask-image: linear-gradient(to left, #000 55%, transparent)` so it never sits behind the h1. Projects without a flow get the horizon glow only.
- Header (min-height 88svh, content bottom-left):
  - `<nav aria-label="Breadcrumb">` Home / Work / {brand}
  - h1 = brand (sized by length)
  - descriptor in voice (muted)
  - standfirst `lede.client`
  - action row: link labels from site.ts, and "Book a call about something similar →" (`profile.booking`)
- Sheet (`--surface`, 20px top radius, margin-top -12svh so its edge peeks into the first view). First comes a facts `<dl>` in a row: Role · Year · Status (tier label + `TIERS[tier].note`) · Links · "About N min read" (build-time word count of ledes, outcomes and internals at 200 wpm).
- Then two columns at 1024px and up: a sticky 240px rail (h2 plus a one-line summary), and content at 64ch. A section renders only if its data exists:
  - "What it does for the business": outcomes, with 12px apricot dash markers between hairlines.
  - "My part": role and year, `lede.recruiter`, then "Stack and integrations" as a middot-separated wrapped line (never called frameworks).
  - "How it fits together": a `--bg-deep` plate with the full diagram (scroll-assembled), the legend, and `<details><summary>Read it as text</summary>` listing every connection.
  - "Under the hood": `lede.engineer` in voice, then internals if present.
  - "See it": link buttons ("Live ↗", "Source ↗"), labels only, never a hostname. For private source: "The source is private — happy to walk you through it." with BookCallLink and the email.
- Prev/next: two large links, each with a silhouette glyph, brand and descriptor, then "All work", then the closing room.
- At 1360px and up, a tick scroll-spy sits in its own left gutter.

### /about

- Grid 7/5.
  - Left: h1 `about.lede` (page-title size, LightUp), then `about.body` as two paragraphs.
  - Right: the portrait (priority, static spill, no entrance), with `profile.location` and LocalTime under it.
- "How I work": `about.approach` as three hairline rows (h3 on the left, body on the right) with focus-dimming.
- "Experience": rows of period (tabular, muted) | role · org · location | points.
- "Education": one row.
- "What I am doing now": `about.now` as a plain list.
- "Tools": `stackGroups` in three columns (h3, note in muted, items as wrapped text). This is the only place the stack appears. Capabilities follow as one middot-separated paragraph.
- Links to Work and Contact, then the closing room.

### /contact

- h1 `contact.lede` (LightUp) and `contact.body` in voice.
- Beside the h1: a 72px round portrait crop, the breathing dot with `availableNote`, and "It's 18:42 in Lahore (UTC+5), 14:42 where you are".
- Three channel rows, ranked, full width with hairlines, no cards:
  1. "Book a 30-minute call" (glint CTA, new tab, sr-only "(opens in a new tab)").
  2. WhatsApp, `profile.whatsapp.display`, with the existing prefilled opener.
  3. Email at voice size, `overflow-wrap: anywhere`, plus a Copy button with an aria-live "Copied".
- "What helps me answer well" (`contact.helpful`) and "Straight answers" (`contact.honest`) as two plain lists.
- "Elsewhere": socials with handles, `rel="me noopener noreferrer"`, `target="_blank"`.
- A small `<dl>`: Based in / Open to / Read first → `/work`.
- No closing room on this page. The footer shows only its bottom row.

### Nav and footer

**Skip link.** First focusable element on every page. "Skip to content" → `<main id="main" tabIndex={-1}>`.

**Header** (fixed, 16px from the top, all pages, visible at the top of home)
- A 32px round avatar (object-position 50% 16%, alt="") with a static apricot dot when `profile.available`.
- "Ammaad Tehseen", linking home.
- Work / About / Contact with `aria-current`. The active link is ink with its underline shown.
- LocalTime "18:42 in Lahore", 1280px and up only, width reserved in `ch`.
- A filled apricot "Book a call" pill at every width.
- States:
  - At the top: a transparent, full-width row.
  - Past 80px: a solid `--surface` 94% pill, max-width 760px, with a hairline border. The clock is dropped.
  - Past 480px: hides while scrolling down; returns on any upward scroll.
  - `:focus-within` always reveals it.
- A 1px apricot progress line along the pill's bottom edge, on case pages only.
- Below 768px: avatar, "Ammaad", "Book a call" and a "Menu" button. The button opens a native `<dialog>` sheet (`--surface`) with the links in Ysabeau at 2rem, the three channels and LocalTime.

**Closing room** (every page except /contact)
- min-height 92svh, `--bg` → `--bg-deep`.
- h2 "Let's build" / "something that lasts." as real text, with `contact.honest[0]` beneath it as a reassurance line.
- A channel row: the glint BookCallLink, a big EmailLink (Ysabeau 300, voice size) with Copy, and WhatsAppLink with its displayed number.
- A 40px avatar, the breathing dot, `availableNote` and LocalTime.
- The lamp sits behind.

**Footer bottom row** (all pages)
- Pages (Work / About / Contact).
- Elsewhere (socials, `rel="me"`).
- "Say hello" (email).
- "© {year} Muhammad Ammaad Tehseen".
- "Built with Next.js — no template" in muted (8.17:1).
- "Back to top ↑".
- Headings are sentence case, 0.9375rem, weight 500.

**404** (`app/not-found.tsx`). `robots: { index: false }` and no inherited canonical. h1 "Nothing lives at this address.", links to Home, Work and Contact, then the footer bottom row.

## 6. Motion system

**Tokens**
- Easings:
  - `--ease-out: cubic-bezier(.22,1,.36,1)`
  - `--ease-expo: cubic-bezier(.16,1,.3,1)`
  - `--ease-inout: cubic-bezier(.65,0,.35,1)`
- Durations: 150 / 300 / 500 / 900 / 1400ms.
- Staggers: 55–90ms, capped at 8 items.
- No bounce or overshoot anywhere.
- Hover changes last 350ms or less. Nothing scales text above 1.03.

**Gate.** An inline script in `<head>` runs before paint:

```js
try{const d=document.documentElement;d.classList.add('js');
if(matchMedia('(prefers-reduced-motion: no-preference)').matches){d.classList.add('m');
if(sessionStorage.getItem('ag:lit'))d.classList.add('lit-seen');else sessionStorage.setItem('ag:lit','1')}
if(CSS.supports('animation-timeline: view()'))d.classList.add('sd');
setTimeout(()=>{if(!window.__ag)d.classList.remove('js','m')},3000)}catch(e){}
```

- `RevealRoot` sets `window.__ag = 1`.
- Every hidden or dim start state lives under `html.m`. Scrubbed variants live under `html.m.sd`. State swaps that must also work under reduced motion live under `html.js`.
- `window.addEventListener('beforeprint')` marks every reveal as `data-in`.
- `<noscript><style>` and `@media (scripting: none)` pin every reveal, tab panel, bio and filter to its final, visible, stacked state.
- Global reduced-motion block: `@media (prefers-reduced-motion: reduce){*,::before,::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}`.
- One element tree is rendered for everyone. Markup never branches on `useReducedMotion` (that caused hydration mismatches).

**Floor rule.** No element ever starts at opacity 0.
- Above-the-fold entrances start at opacity .35 or higher.
- Below-fold reveals start at opacity .4 or higher.
- Light-ups start at `--faint`, 3.35:1 or better on display text.
- `data-reveal` is never placed in the first viewport.

### Effects

| # | Effect | Where | Trigger | Mechanism | Timing | Reduced motion |
|---|---|---|---|---|---|---|
| 1 | **Lights on** | Hero offer; page h1s (step 50ms) | First paint, once per session (`html.m:not(.lit-seen)`) | Server `LightUp` splits into `<span class="w" style="--i:n">` words joined by real spaces, with no aria tricks. `.lu .w{display:inline-block;animation:lit .95s var(--ease-out) calc(160ms + var(--i)*70ms) both}` `@keyframes lit{from{color:var(--faint);filter:blur(3px);translate:0 .06em}}`. Only `from` is defined, so glow words end in glow. At most 12 words. Pure CSS, before hydration. | ≈1.35s | Final colour immediately |
| 2 | **Window opens** | Home portrait | First paint, once per session | `.portrait{animation:open 1.5s var(--ease-expo) .1s both}` `@keyframes open{from{clip-path:inset(6% round 14px)}}`; img `@keyframes settle{from{scale:1.06}}` 1.9s. Frame background is the photo's dominant tone `oklch(.42 .05 55)`. next/image with priority and a static import (blur placeholder). | 1.5–1.9s | Static |
| 3 | **Spill wakes** | `.portrait::before` | First paint, once | Two `closest-side` radials (sun #fecf76 at 26% at 68% 28%; ember at 16% at 45% 55%), inset -30% -40% -20% -40%. `@keyframes spill{from{opacity:0}}` 2.4s var(--ease-out), 550ms delay. | 2.4s | Static glow |
| 4 | **Hero cascade** | Services sentence, lead, CTA row, availability, proof line | First paint, once | `.rise{animation:rise .7s var(--ease-out) calc(420ms + var(--i)*90ms) both}` `@keyframes rise{from{opacity:.35;translate:0 14px}}` | Settled ≈1.3s | Static |
| 5 | **Sundown** | Hero leaving the viewport | Scroll (`html.m.sd`) | `.hero{view-timeline:--hero block}`. Spill: `animation:sundown linear both;animation-timeline:--hero;animation-range:exit 0% exit 90%` `{to{opacity:.12;translate:0 14%}}`. Portrait wrapper drifts to `translate:0 -6%`, copy to `-3%`, horizon fades to 0. Compositor only. | Scroll-linked | Static; Firefox is static too |
| 6 | **Horizon band** | Home, under the hero | Time | `.track{animation:drift-x 90s linear infinite}` `{to{translate:-100% 0}}`. Paused on `:hover`, on `:focus-within`, and when `[data-off]` (off-screen, set by the shared observer). Apricot 4px dots between items. | 90s loop | Duplicate `display:none`; first list wraps as static centred lines |
| 7 | **Availability breathe** | Hero dot, closing-room dot, contact dot | Time | `::after` `@keyframes breathe{to{opacity:.55;scale:.85}}` 2.8s ease-in-out infinite alternate, paused when `[data-off]`. The nav dot is static. | 2.8s | Static |
| 8 | **Lenis glide** | Global, fine pointers only | Wheel | Dynamic `import('lenis')` only when `(pointer:fine)` and motion is allowed. `new Lenis({lerp:.1,smoothWheel:true,syncTouch:false,anchors:{offset:-96},autoRaf:false})`. The rAF loop starts on `wheel` and on `scrollTo`, and stops after 2 frames of `!isScrolling`. The mid-session reduced-motion listener destroys it. `stop()` while the menu dialog is open. | ≈98% of the travel in 0.7s | Never constructed |
| 9 | **Nav condense and tuck** | Header | Scroll | `NavState`: one passive, rAF-coalesced listener writes `data-compact` (y > 80) and `data-hidden` (y > 480 and dy > 6; cleared on dy < -6) via setAttribute. `.pill{transition:max-width .55s var(--ease-out),background-color .4s}` `header{transition:translate .5s var(--ease-out)}` `[data-hidden]:not(:focus-within){translate:0 -140%}` | 400–550ms | Instant; never hides |
| 10 | **Progress line** | Nav pill, case pages | Scroll | `.progress{transform-origin:0 50%;animation:grow linear both;animation-timeline:scroll(root)}` `@keyframes grow{from{transform:scaleX(0)}}` in plain CSS (not Tailwind `scale-x-*`, which sets the `scale` property). | Scroll-linked | Hidden |
| 11 | **Menu sheet** | Mobile header | Click "Menu" | Native `<dialog>.showModal()` (focus trap and Esc). `dialog[open]{animation:fade .3s var(--ease-out)}`; items use `rise` with `--i*50ms`. `::backdrop` is `--bg` at 96%, no blur. Focus returns to the button. | 300ms | Instant |
| 12 | **Focus-pull reveals** | Below-fold h2 (`focus`), rows and list items (`rise`), paragraphs (`fade`) | Enter the viewport, once | `data-reveal` + `--i`. `RevealRoot` (≈0.7 KB) runs one IntersectionObserver (rootMargin `0px 0px -12% 0px`) that sets `data-in` and unobserves, and re-scans on pathname change. `html.m [data-reveal]:not([data-in])`: focus `{opacity:.4;translate:0 24px;filter:blur(6px)}`, rise `{opacity:.4;translate:0 18px}`, fade `{opacity:.5;translate:0 8px}`. Transition 900ms var(--ease-out), delay `min(var(--i),8)*70ms`. Blur on headings only. | 900ms | No start state |
| 13 | **Focus-dimming** | Services rows, /work rows, About approach, contact channels, footer lists | Hover or focus | `@media(hover:hover){.list:has(.row:is(:hover,:focus-visible)) .row:not(:hover,:focus-visible) :is(h3,.name,p,.meta){color:var(--dim)}}`. Hovered `.name{translate:10px 0;color:var(--ink)}`. 300ms colour, 400ms translate. Dim is a colour token (5.20:1 or better), never opacity. | 300–400ms | Colour only, instant |
| 14 | **Featured stage** | Home, 1024px and up | Click, arrow keys, Home/End, pointerenter after 120ms intent (fine pointers) | Server tablist (`role=tablist aria-orientation=vertical`, 8 `role=tab` with `aria-controls`, 8 `role=tabpanel`). The first tab and panel carry `data-active` in SSR. `FeaturedTabs` (≈1.2 KB, no props) uses roving tabindex and toggles attributes only; nothing remounts. `html.js .panel:not([data-active]){opacity:0;visibility:hidden;transition:opacity .3s,visibility 0s .3s}`; `[data-active]{transition:opacity .5s var(--ease-out) 50ms}`. Info block `@keyframes sw-in{from{opacity:.35;translate:0 12px}}` .5s. Hairline 32px span, scaleX .5 → 1, 300ms. | 500ms | 150ms fade; static complete diagram |
| 15 | **Lit windows (time-based)** | Active stage panel | Activation and first view (`data-play`) | Edges `pathLength=1`: `@keyframes draw{from{stroke-dasharray:1;stroke-dashoffset:1}}` .8s var(--ease-out) `calc(.15s + var(--e)*60ms)`. Dashed edges fade instead. Nodes stay opacity 1: `@keyframes window{0%{fill:var(--surface-2)}40%{fill:var(--flare)}100%{fill:var(--lit)}}` 1.1s `calc(120ms + var(--i)*80ms)`. Packets `.pk{stroke-dasharray:.05 .95;opacity:0}`, `[data-sent] .pk{animation:packet 1.6s var(--ease-inout) calc(var(--e)*140ms) 1}` after (edges×60 + 900)ms. Hover or focus of the stage re-sends one pass (toggle between two identical keyframe names). No infinite loop. | ≈2.5s total | Complete lit diagram, no packets |
| 16 | **Lit windows (scroll)** | Case "How it fits together" | Scroll (`html.m.sd`) | `figure{view-timeline:--fig block}`; edges `animation:draw linear both;animation-timeline:--fig;animation-range:entry calc(10% + var(--e)*4%) cover calc(38% + var(--e)*3%)`; node fill uses the same pattern. Labels are always ink and never animate. Packets: one pass when the observer reports 60% visible; replay on hover or focus. Fallback without timelines: the observer adds `data-play` (time-based #15). | Completes by cover ≈50% | Static complete |
| 17 | **Short-version switch** | Home | Radio change | Zero JS. Inside `@supports selector(:has(*))`: `.bio{grid-area:1/1;transition:opacity .45s var(--ease-out),translate .45s var(--ease-out),visibility 0s .45s}` `.bio:not(.on){opacity:0;visibility:hidden;translate:0 12px}`; `.short:has(#r-client:checked) .bio-client` etc. become visible with 120ms delay; `@starting-style` handles the 12px rise. `label::before{width:36px;scale:.44 1;transform-origin:left;transition:scale .45s}`, `:has(:checked)` → `scale:1` in glow. `label:has(:focus-visible)` gets the ring. Without `:has` support: all three bios stacked under their labels. | 450ms | Instant swap |
| 18 | **Torch** | Short-version card only | Pointer over the card (fine pointers, `html.m`) | An aria-hidden, `inert`, `user-select:none` duplicate of the active bio in `color-mix(in oklch,var(--glow) 14%,var(--ink))` with `mask-image:radial-gradient(circle 220px at var(--mx) var(--my),#000 22%,transparent 70%)`. Opacity 0 → 1 over .3s on enter, back over .4s on leave. rAF-throttled pointermove writes px vars. Base text is muted, 7.60:1. | 300–400ms | No torch |
| 19 | **Work index preview** | /work, `(hover:hover) and (pointer:fine)`, 1024px and up | First pointerenter on the list loads it | `PreviewGate` loads `WorkPreview` via `next/dynamic({ssr:false})` on the first mouse pointerenter. It uses only `useSpring(useMotionValue(0),{stiffness:150,damping:22,mass:.6})` and writes the CSS `translate` of the server-rendered card directly, so no `m.div` and no LazyMotion feature bundle ship. 19 server-rendered silhouettes and ledes inside the card (aria-hidden, `content-visibility:auto`); `data-on` crossfades them over 300ms. Card fade and scale .96 → 1 over 300ms. The native cursor is always shown. | ≈0.5s catch-up | No card; rows only |
| 20 | **Tier filter** | /work | Radio change | Zero JS `:has()` under `@supports`: rows whose `data-tier` does not match are `display:none`; the list height changes without animation. Without support, all rows show. | Instant | Same |
| 21 | **Case sheet** | /work/[slug] at 1024px and up | Scroll | Poster `position:fixed;inset:0;z-index:0`. Sheet `position:relative;z-index:10`. `html.m.sd .case-poster svg{animation:sink linear both;animation-timeline:scroll(root);animation-range:0 90svh}` `{from{opacity:.5}to{opacity:.18;scale:.96}}`. A sentinel IntersectionObserver sets `visibility:hidden` on the poster once it is covered. | Scroll-linked | Static poster at .35; the sheet still scrolls over |
| 22 | **Tick scroll-spy** | Case pages, 1360px and up | Scroll | `CaseTicks` (≈0.5 KB): IntersectionObserver with rootMargin `-38% 0px -55% 0px` sets `aria-current`. Tick 32px, scaleX .5 → 1, glow, 300ms. Labels stay visible in their own gutter and never overlap the text. Real anchors; `scroll-margin-top` covers no-JS. | 300ms | Instant |
| 23 | **Converging close** | Closing room | Scroll (`html.m.sd`) | `.close{view-timeline:--close block}`, lines inside `overflow-x:clip`. `.l1{animation:from-left linear both;animation-timeline:--close;animation-range:entry 10% entry 100%}` `{from{translate:-10vw 0;color:var(--faint)}}`; `.l2` mirrors from +10vw. Because the room is min-height 92svh and the range is entry-only, it always completes. Without timelines: static. | Scroll-linked | Static |
| 24 | **Lamp** | Closing room, fine pointers | Pointer inside the room | A 56rem `closest-side` radial at 11% glow, moved by `translate:var(--lx) var(--ly)` with `transition:translate .9s var(--ease-out)`. The listener is attached only while the room intersects. | 0.9s lag | Static, centred (touch too) |
| 25 | **Glint, once** | Primary "Book a 30-minute call" in the closing room and on /contact | Hover, focus-visible, and once when the room first enters view | `@property --a{syntax:'<angle>';inherits:false;initial-value:40deg}`; 1.5px border via `padding-box` glow fill plus `conic-gradient(from var(--a), transparent 0 70%, #ffd691 80%, oklch(.6 .16 48) 88%, transparent 96%)` `border-box`; `@keyframes glint{to{--a:400deg}}` 1.6s var(--ease-expo), 1 iteration. Hover: fill `--glow-hover`, arrow translate 3px, `translate:0 -1px`; `:active{scale:.98}`. | 1.6s, once | No glint; colour only |
| 26 | **Micro-interactions** | Global | Hover or focus | Underline: `background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat` → `100% 1px` over 300ms. → nudges 3px; ↗ nudges 2px up and right. Back-to-top lifts 3px. Mobile posters scale 1.03 inside their frame. | ≤350ms | Instant |
| 27 | **Arrival** | Client navigations, not first load | Pathname change | `Arrival` island: skip the first render; `main.animate([{opacity:.4,translate:'0 10px'},{opacity:1,translate:'0 0'}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'})`; then `main.focus({preventScroll:true})` and `lenis?.scrollTo(0,{immediate:true})`. No veil; links are never intercepted. | 420ms | Focus only |
| 28 | **Copy email** | Closing room, /contact | Click | `navigator.clipboard.writeText(profile.email)`; label crossfades to "Copied" for 2s over 200ms; announced by `aria-live="polite"`. Hidden under `scripting:none`. | 200ms | Instant |

**Loops on the whole site: exactly two.** The horizon band and the breathing dot, both paused when off-screen. There is no timer-driven text, no infinite packets and no infinite glint.

## 7. Imagery

1. **Portrait** (`/ammaad-tehseen.jpg`, 960×1200, stays at that path).
   - In colour from the first frame, one next/image layer.
   - Placements:
     - home hero: priority, `sizes="(min-width:1024px) 420px, 92vw"`, quality 80
     - About: priority, static
     - /contact: 72px round
     - nav avatar: 32px
     - closing room: 40px
     - root OG card
   - Alt comes from `profile.photo.alt`. When linked, it keeps `aria-label="About Muhammad Ammaad Tehseen"`.
   - The palette is sampled from this photo: sun #fecf76, sky #fad9ac, haze #b9958b, tee #1e1819.
2. **Architecture diagrams, "lit windows".** One server function in three modes (see §8).
3. **Light.** Spill, horizon, band dots and lamp. All CSS gradients.

There are no project screenshots (disclosure), no stock, no illustration and no WebGL. The 4 short projects are shown as rows, with no cover image.
- **Favicon:** a #120d0c rounded square (rx 7 on 32) holding a #fbc576 half-disc sun resting on a 1.5px #726662 horizon line.
- **OG cards** (next/og, Ysabeau Office and Afacad Flux):
  - Root: charcoal ground, the portrait on the right (4:5, 12px radius) with its spill, "Ammaad Tehseen" at 96px, the role line, `bio.client.lede`, a dot with `availableNote`, and ammaad.online.
  - Per project: brand, descriptor, tier · year, `lede.client` cut on a word boundary (150 characters or fewer) with an ellipsis, and the silhouette as a data-URI SVG in baked colours.

## 8. Diagrams

**Module and server rendering.** A pure `lib/flow-geometry.ts` is lifted from the current FlowDiagram maths: 5×3 grid, one corridor per edge, right-to-left edges, and a viewBox fitted to the columns and rows actually used. `FlowDiagram` becomes a server component with no `'use client'` and no motion import. The markup contains no `opacity="0"`.

**Modes**
- `full` (stage, case page):
  - Nodes 156×64u on `--surface-2` with a 1px `--line` stroke.
  - Kind is shown by shape: edge/outside world = pill; service = rx 10 box; store = box with a second box offset 5u behind it; worker = box with a 12u circular-arrow glyph.
  - Labels: 17u Afacad 500 ink; sub 13.5u muted.
  - Edges: 1.4u `--line-strong` with rounded 10u elbows and open chevron arrowheads in muted. Dashed edges mean scheduled or async.
  - Edge labels are pill chips (`--bg-deep` fill, `--line` stroke, 13u muted) centred on their run.
  - Legend below: Entry point / Service / Data store / Background job.
- `poster`: no text, aria-hidden. Edges at 5u stroke, 45% of `currentColor`. Nodes filled by kind in muted, glow, ink-2 and dim. About 1.5 KB. Used for the /work preview, mobile rows, prev/next glyphs, the case backdrop and OG.
- `vertical`: the transposed layout (x from row, y from column), viewBox about 600×1150. Used at 700px wide or less so labels stay at 12px or more with no horizontal scroll. Swapped with `<picture>`-style CSS (`display` by media query) between two server SVGs.

**Scaling rule.** `full` renders only where its container is at least 700px. Label floor = (13u / viewBox width) × rendered width ≥ 12px. Fitted viewBoxes grow the smaller systems automatically.

**Accessibility**
- `role="img"` with `aria-label="How {brand} fits together: {n} parts, {m} connections"`.
- A visible `<details><summary>Read it as text</summary>` listing "Intake → Edge Functions (webhook)" and marking dashed edges "(scheduled)".

**Dev assertions** (build-time, in `lib/flow-geometry.ts`)
- No edge chip rectangle intersects a node box.
- Chips do not overlap each other.
- Every node has a unique cell.
- Per-edge `labelOffset` overrides are allowed in the geometry module only. No site.ts changes.

## 9. What was removed and why

| Removed | Why |
|---|---|
| Boot counter, `useBootReady`, BOOT_GATE, `html.boot-done`, `#boot` rules, `--z-boot` | Theatre: a 2.6s wait, and it held back the LCP text |
| `SignalCanvas` WebGL hero | A pointer toy; about 224 sin() per pixel per frame, plus a WebGL context |
| `Cursor` reticle and 45+ `data-cursor` attributes | HUD; `cursor:none !important` hid the I-beam and focus cues |
| `ScrambleText` | Decoder effect; unreadable while running |
| `ChannelSwitch`, `lib/channel.tsx` provider, `readout:channel` storage | Site-wide retune felt like tuning an instrument. Replaced by the zero-JS short-version radios |
| Portrait scanned plate (grayscale layer, scan, brackets, coordinates, tilt, sheen, blend layers, blur chips, 7s re-scan) | Greyed out the most human asset; two bitmaps plus filters |
| Hero letter mask, sr-only-only h1, LED readout, measurement grid, bobbing Scroll cue | Invisible without JS; gamified |
| `Reel` 360vh pinned runway and 01—08 rail | Scroll-jacking |
| `Systems` skew, reticles, '01 / 18' counter, scroll-picked remounting panel, 91 KB flight | Instrument theatre and the main runtime cost on /work |
| `StackPanel` on home, Marquee's amber diamonds | Recruiter content on the client path; duplicated About |
| `Reveal`, `SplitText`, `lib/motion` useMagnetic and useScrollSkew, magnetic email, permanent will-change | Shipped opacity:0 and translateY(112%); misused aria-label; springs |
| motion/react in the root layout (≈49 KB gz on every page) | Replaced by CSS; kept only in the lazy /work preview island |
| Infinite diagram packets, SVG `opacity="0"` | Endless repaints; empty diagrams without JS |
| Instrument materials, olive and amber palette, Archivo wdth and Martian Mono, custom scrollbar, optimizeLegibility, duplicated z-scale | The "Read-out" costume; 114 KB of fonts |
| Nav backdrop blur and spring 'signal level' bar | Glassmorphism; a per-frame blur repaint |
| Services 01–04, eyebrow, 2×2 card grid; /work tier panels and zero-padded counts; '01' breadcrumb; 'Three readings' grid | House rules (scaffolding, identical card grids, eyebrows) |
| Reticle favicon, instrument OG cards | Old motif; stale recruiter copy |
| Afterglow's rotator, pinned strip, '3 / 8' pill, looping glint, veil | Timer text, scroll-jacking, a counter idiom, and a continuous repaint: all read as gamified |
| Jaali lattice light and light theme; Last Light opacity dimming | Wallpaper-like pattern and a beige footer band; the 3.06:1 dimmed text failed contrast |
