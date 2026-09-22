# Afterglow — ammaad.online

Personal portfolio and freelance sales page for **Muhammad Ammaad Tehseen**, a
full-stack and AI engineer in Lahore.

The design is called **Afterglow**. The page is a dark, quiet room lit only by
the sunset in his own photograph. The sky from that photo spills onto the page,
the offer sentence switches on word by word, the light sinks as you scroll, the
architecture diagrams switch on node by node like windows at dusk, and every
page ends under a warm lamp that follows your hand. Things come into focus;
they do not fly in. One moment plays once per session, and everything else
answers the reader's scroll or pointer.

The full design system (tokens, type, layout, every effect and its
reduced-motion path) is in [`DESIGN.md`](DESIGN.md). Audience, voice and
content rules are in [`PRODUCT.md`](PRODUCT.md).

## Who it is for

Clients first: founders and operations leads who want one of four things built
or fixed. Recruiters and engineers get their depth further down, in "My part",
"How it fits together", "Under the hood" and the short-version readings. The
site never retunes itself for them.

## Honest disclosure

Most of the work is private client software, so instead of screenshots each
system is **drawn**: an architecture diagram generated from real data, with a
plain-text version beside it. Every project states its tier in words: Live,
Open source or Private source.

## Editing it

Everything the site renders lives in one file:

```
src/content/site.ts
```

Profile, bio, services, projects, flow diagrams, stack and contact copy. Edit
only that file to change copy or add a project; no component edits are needed.
Every count on the site is derived from its arrays, never typed by hand.

## Running it

```bash
npm install
npm run dev
npm run build
npm run typecheck
```

`npx jiti scripts/check-flows.ts` checks every diagram's geometry (no label
chip over a node, no overlapping chips, one node per cell).

## Stack

Next.js 15 (App Router, fully static) · React 19 · TypeScript · Tailwind v4.
Motion is CSS: scroll-driven animations where the browser supports them,
static otherwise. Lenis is loaded only for fine pointers with motion allowed,
and the `motion` library only on /work, after the first mouse hover over the
list. Fonts are Ysabeau Office and Afacad Flux, self-hosted through
`next/font`.

## Craft notes

- **Nothing is gated on JavaScript.** All content is in the server HTML. Start
  states exist only after a pre-paint class, never begin from opacity 0, and a
  3-second failsafe removes them if scripts never hydrate. No-script and print
  show everything.
- **Reduced motion is a designed path.** No light-ups, scrubs, loops or smooth
  scrolling; diagrams render complete and the capability band becomes a static
  list.
- **Contrast is computed, not guessed.** Dimmed text uses a colour token that
  holds 5.2:1 or better, never opacity.
- **Two loops on the whole site** (the capability band and the availability
  dot), both paused off-screen. No WebGL, no custom cursor, no idle frame work.

## Budgets

- First Load JS at most 110 KB gz on `/`, `/about`, `/contact` and case pages;
  `/work` at most 112 KB before interaction; the lazy preview chunk at most
  25 KB gz.
- Client islands on home at most 6 KB gz in total.
- HTML: home at most 160 KB raw / 32 KB gz; `/work` at most 120 KB raw /
  26 KB gz.
- Fonts: exactly two woff2 files, at most 80 KB together.
- Lighthouse mobile: LCP 2.0 s or less, CLS 0.02 or less, TBT 100 ms or less,
  Performance 95+, Accessibility 100, SEO 100.

## Findable

- Linked JSON-LD (`WebSite`, `Person`, the work list, and `ProfilePage` on the
  home page only), per-page canonicals and Open Graph cards generated with
  `next/og`, plus a sitemap and robots.

## Deploying

Static output, so anything works. Vercel is the path of least resistance:

```bash
npx vercel --prod
```

Then point **ammaad.online** at it. Change the domain in one place,
`profile.site` in `src/content/site.ts`, and metadata, canonical URLs, sitemap,
robots and JSON-LD all follow.
