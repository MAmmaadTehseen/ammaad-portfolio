# PRODUCT.md

## Register
Brand site. It is a personal portfolio that also works as the sales page for a freelance practice.

## Who it is for, in priority order
1. **Freelance clients (primary).** These are founders, operations leads and product owners at small and mid-sized companies, mostly in the UK, EU, Gulf and US. They need one of four things:
   - **SaaS & web apps** built
   - **AI features & agents** added to a real product
   - **Automation & integrations** between the tools they already pay for
   - **Rescue & maintenance** of an app someone else left fragile

   They read at the end of the day, tired and wary. In two minutes they need to know four things: who he is, what he builds for them, whether it is real, and how to start. Every page ends with a way to start.
2. **Recruiters and hiring managers (secondary).** They need role, stack, scope and dates. They can find these on About, in "My part" on every case study, and in the "Recruiter" reading of the short version.
3. **Engineers (tertiary).** They need to know how things are actually built. They get this from "How it fits together", "Under the hood" and the "Engineer" reading.

The site leads with the client. The other audiences get their depth by scrolling or by choosing a reading. The site never retunes itself for them.

## The central idea: honest disclosure
Most of Ammaad's best work is private client software. He cannot show screenshots, so the site shows how each system fits together instead: 19 architecture diagrams drawn from real data, each with a plain-text version. The tier is always stated in words:
- **Live**: shipped and running
- **Open source**: code is public
- **Private source**: described by architecture only

Private work always ends with "happy to walk you through it", followed by a way to book.

## Emotional target
**Soft, warm, trustworthy. Lamplit, unhurried, exact.** The site should feel like a calm person with steady hands. It should not feel like a machine, a game or a template.
- The page is a dark, quiet room lit only by the sunset in his own photograph.
- Things come into focus. They do not fly in.
- One moment of choreography plays once. Everything else answers the reader's scroll or pointer.
- Nothing asks the reader to wait, click to start, chase a cursor or decode text.
- The "wow" comes from craft and restraint. Nothing is there just for effect.

Previous target, now retired: "precision instrument". That meant the boot screen, reticle cursor, WebGL trace, scanned-plate portrait and channel tuner, and the owner found it gamified.

## What a client must get in 10 seconds (first viewport, 390px and up)
- His face, in colour
- The offer sentence: "I build the software your business actually runs on."
- His name, role and location, as visible text in the h1
- Four real, shipped product names ("Recently shipped: …")
- A filled "Book a 30-minute call" button, plus WhatsApp and email
- Whether he is available, and what time it is in Lahore compared with the reader's own time

## Conversion principles
- **One primary action everywhere:** book the 30-minute call (Calendly). WhatsApp and email are always offered right next to it, and no form is ever required.
- **Services come before work.** Each service links to three projects that prove it.
- **Every case study asks at the moment of peak interest:** "Book a call about something similar."
- **The same closing block ends every page except /contact** (/contact is itself the ask). It carries a reassurance line taken from `contact.honest`.
- **The time-zone objection is answered in plain text:** "18:42 in Lahore, 14:42 where you are."
- **Availability is shown only when `profile.available` is true.** No stale dates.
- Upwork and Fiverr are deliberately not linked yet (phase two).

## Anti-references
- Boot or loading screens, counters, "click to start"
- Custom cursors that hide the pointer
- HUD or instrument chrome, scramble or decode text
- Game-world metaphors, sound prompts
- WebGL wallpaper
- Scroll-jacking or pinned horizontal runways
- Hero metric rows, proficiency bars, invented numbers, fake liveness
- Identical icon-card grids, uppercase eyebrows, 01/02/03 section scaffolding
- Glassmorphism, gradient text, side-stripe borders
- Lime-on-black v0/shadcn templates, navy-and-mint Brittany clones, synthwave sunsets, decorative glow blobs
- The editorial serif-italic-plus-mono lane
- Terminal green

## Voice
- British spelling. Short, concrete sentences. No superlatives. No invented metrics.
- Say "Private source", not "Closed".
- Describe the stack as "Stack and integrations", never as a framework list.
- New microcopy needs Ammaad's approval before launch:
  - "Recently shipped:"
  - "The short version"
  - "Read this as a"
  - "Each one points at the work that proves it."
  - "Not sure which of these it is?"
  - "drawn rather than screenshotted: how a request actually moves through it."
  - "What it does for the business"
  - "My part"
  - "How it fits together"
  - "Read it as text"
  - "Under the hood"
  - "See it"
  - "Book a call about something similar"
  - "Nothing lives at this address."

## Content rules
- `src/content/site.ts` is the single source of truth. Edit only that file for content, and change the domain only in `profile.site`.
- Counts always come from the arrays (`projects`, `showcase`, `shortEntries`, `alsoBuilt`, `featured`), never from literals. Today there are 23 projects: 19 showcase, 4 short, 2 alsoBuilt, 8 featured.
- Some projects were built on a no-code platform. Never name that platform anywhere: copy, alt text, JSON-LD, comments or commits.
- Link labels are printed as given. A hostname is never printed.
- Client names appear exactly as cleared in site.ts.
- Never import `projects` into a client component. Islands receive DOM attributes or trimmed props only.

## Commitments
**Accessibility**
- WCAG 2.2 AA. Body text is 4.5:1 or better at its real size. Non-text UI is 3:1 or better.
- A visible 2px focus ring.
- A skip link to `#main` on every page.
- The header is revealed whenever keyboard focus is inside it.
- Real radiogroup and tab semantics.
- Diagrams have a text alternative that lists their connections.

**Nothing is gated on JavaScript**
- All content is visible in the server HTML.
- Motion start states exist only after a pre-paint class, with a 3-second failsafe, and never begin from opacity 0.
- `scripting: none` and print both show everything.

**Reduced motion is a designed path**
- No light-ups, scrubs, loops or smooth scrolling.
- Diagrams render complete. The capability band becomes a static wrapped list.

**Performance ("less memory taking")**
- No WebGL.
- Two looping animations on the whole site, both paused off-screen.
- Zero requestAnimationFrame work when idle.
- The motion library loads on /work only, after the first hover.
- About 79 KB of fonts. Numeric budgets are in the acceptance checks.

**Findability**
- Keep the JSON-LD graph with stable @ids, ProfilePage on the home page only, CreativeWork and BreadcrumbList on project pages, per-page canonical, OG and Twitter metadata, the sitemap and robots.
- Keep the 308 redirects and the noindex header on the preview host.
