# Read-out — ammaad.online

Personal portfolio for **Muhammad Ammaad Tehseen** — full-stack engineer, Lahore.

Built as a precision instrument panel: anodised olive housing, machined type, one
hot amber signal. The idea is that a portfolio should read like a piece of
equipment you tune, not a brochure you scroll.

## The one thing that makes this site different

Most portfolios pick one audience and lose the other two. This one has a
**channel switch** — `Client · Recruiter · Engineer` — and the whole page retunes
to it:

| Channel | Gets |
| --- | --- |
| **Client** | What each build does for a business, and the outcomes |
| **Recruiter** | Role, scope, and the stack on each project |
| **Engineer** | The real internals — the decisions and the landmines |

The choice persists in `localStorage`, so a returning visitor lands back on their
own channel.

## Three tiers of disclosure

Work is labelled by how much of it is on the record:

- **Open** — source is public, link included.
- **Live** — running in production for someone right now.
- **Closed** — private source. Instead of a screenshot you get an **animated
  architecture diagram**: the actual services, stores and queues, with packets
  travelling the real request path. You can show the work without showing the code.

## Editing it

Everything the site renders lives in one file:

```
src/content/site.ts
```

Profile, bio (all three channels), capabilities, projects, stack groups, and the
flow diagrams. No component edits needed to change copy or add a project.

To add a project, append to `projects` with a `tier`, a `lede` for each of the
three channels, and optionally `outcomes` (client), `internals` (engineer), and a
`flow` diagram.

> **One decision left for you:** project 01 is described by capability with the
> client unnamed — the safe default for client software. If you have the go-ahead
> to name them, there is a comment in `site.ts` marking exactly what to change.

## Running it

```bash
npm install
npm run dev
```

```bash
npm run build
```

```bash
npm run typecheck
```

## Stack

Next.js 15 (App Router, fully static) · TypeScript · Tailwind v4 · Motion · Lenis.
The hero trace is a hand-written WebGL fragment shader — a few hundred bytes
instead of a 3D library.

## Craft notes

- **Contrast is verified, not guessed.** Ink 17:1, muted 7.7:1, dim 5.4:1,
  primary 9.9:1, signal 8.5:1 — all against the page background.
- **Reduced motion is a real path, not a stub.** The boot sequence is skipped, the
  shader renders one composed frame, reveals drop their transforms, the cursor
  reverts to the OS pointer, and diagram packets are not rendered at all.
- **Nothing is gated on JavaScript.** A `<noscript>` rule un-hides every reveal and
  removes the boot panel, so the page is fully readable if scripts never run.
- **The boot sequence runs once per session**, gated by a pre-paint inline script
  so a repeat visitor never sees it flash in and out.
- The shader stops on `visibilitychange` and caps DPR at 1.5.

## Deploying

Static output, so anything works. Vercel is the path of least resistance:

```bash
npx vercel --prod
```

Then point **ammaad.online** at it. Change the domain in one place —
`profile.site` in `src/content/site.ts` — and metadata, canonical URL, sitemap,
robots and JSON-LD all follow.
