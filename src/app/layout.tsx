import type { Metadata, Viewport } from "next";
import { Afacad_Flux, Ysabeau_Office } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import RevealRoot from "@/components/islands/RevealRoot";
import SmoothScroll from "@/components/islands/SmoothScroll";
import Arrival from "@/components/islands/Arrival";
import {
  bio,
  capabilities,
  education,
  experience,
  meta,
  profile,
  projects,
  services,
  stackGroups,
} from "@/content/site";

// Display and voice. Roman only: the design never sets an italic, so the
// italic files would be weight on every page for nothing.
const display = Ysabeau_Office({
  subsets: ["latin"],
  style: "normal",
  variable: "--font-display",
  display: "swap",
});

// Body, UI and diagram labels. The slnt axis is left out for the same reason.
const text = Afacad_Flux({
  subsets: ["latin"],
  variable: "--font-text",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: {
    default: meta.title,
    template: `%s — ${profile.short} Tehseen`,
  },
  description: meta.description,
  applicationName: meta.title,
  authors: [{ name: profile.name, url: profile.site }],
  creator: profile.name,
  keywords: [
    "full-stack engineer",
    "backend engineer",
    "Node.js",
    "Next.js",
    "TypeScript",
    "Prisma",
    "PostgreSQL",
    "Lahore",
    "Pakistan",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: profile.site,
    siteName: meta.title,
    title: meta.title,
    description: meta.description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
    creator: "@MAmmaadTehseen",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // the page ground, so the browser chrome on a phone continues the room
  themeColor: "#120d0c",
  colorScheme: "dark",
};

/**
 * The pre-paint gate. It runs in <head> before the first frame, so every
 * start state can be keyed off a class that is already there when the page
 * paints; nothing flashes lit and then dims.
 *
 * - `js`: scripts run, so state swaps (tabs, bios) may collapse into one cell.
 * - `m`: motion is allowed. Every dim or offset start state lives under it.
 * - `lit-seen`: the light-up already played in this tab session; a reload
 *   renders the page lit.
 * - `sd`: the browser has scroll-driven timelines, so the scrubbed variants
 *   apply. Firefox gets the static final states instead.
 *
 * The failsafe: RevealRoot sets window.__ag once it hydrates. If it has not
 * within 3s (the chunk was blocked, or hydration threw), `js` and `m` come off
 * and every start state falls back to its final, readable one.
 */
const GATE = `try{const d=document.documentElement;d.classList.add('js');
if(matchMedia('(prefers-reduced-motion: no-preference)').matches){d.classList.add('m');
if(sessionStorage.getItem('ag:lit'))d.classList.add('lit-seen');else sessionStorage.setItem('ag:lit','1')}
if(CSS.supports('animation-timeline: view()'))d.classList.add('sd');
setTimeout(()=>{if(!window.__ag)d.classList.remove('js','m')},3000)}catch(e){}`;

/**
 * Without scripts the gate never runs, so no start state applies anyway. This
 * is the belt to that brace: it pins anything that could still be collapsed or
 * hidden to its final, stacked, visible state, and drops controls that only
 * work with JS.
 */
const NO_SCRIPT_CSS = `[data-reveal]{opacity:1!important;translate:none!important;filter:none!important}.panel,.bio{grid-area:auto!important;opacity:1!important;visibility:visible!important;translate:none!important}[data-js-only],.preview-card,.torch{display:none!important}`;

/** Four digits at the start of a year string ("2025", "2026 — now"). */
function yearCreated(year: string): string | undefined {
  return /^\d{4}/.exec(year)?.[0];
}

/**
 * One linked graph rather than a lone Person.
 *
 * The projects are the substance of this site, and none of them were
 * described to a machine at all. Structured data is the right channel for that
 * inventory: it carries every project's name, summary and stack without adding
 * a node to the DOM or a frame to the render.
 *
 * Only nodes that are true of every page belong here. ProfilePage is not: it
 * lives on the home page, because from the layout it declared every project
 * page a profile page as well.
 */
const SITE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${profile.site}/#website`,
      url: profile.site,
      name: meta.title,
      description: meta.description,
      inLanguage: "en",
      publisher: { "@id": `${profile.site}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${profile.site}/#person`,
      name: profile.name,
      alternateName: [profile.short, "Ammad Tehseen"],
      url: profile.site,
      image: `${profile.site}${profile.photo.src}`,
      jobTitle: profile.role,
      description: bio.recruiter.body,
      email: `mailto:${profile.email}`,
      knowsAbout: [
        ...capabilities,
        ...stackGroups.flatMap((group) => group.items),
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lahore",
        addressRegion: "Punjab",
        addressCountry: "PK",
      },
      // current employer and school: the two entity links Google most often
      // uses to connect a person to organisations it already knows
      worksFor: { "@type": "Organization", name: experience[0].org },
      alumniOf: { "@type": "EducationalOrganization", name: education.org },
      hasOccupation: experience.map((role) => ({
        "@type": "Occupation",
        name: role.role,
        occupationLocation: { "@type": "City", name: "Lahore" },
      })),
      sameAs: profile.socials.map((social) => social.href),
      // the freelance offer, stated to machines the same way it is to people
      makesOffer: services.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service.title, description: service.body },
      })),
    },
    {
      "@type": "ItemList",
      "@id": `${profile.site}/#work`,
      name: "Selected work",
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => {
        const created = yearCreated(project.year);
        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            name: project.name,
            description: project.lede.recruiter,
            keywords: project.stack.join(", "),
            // "2026 — now" is not a date; only the leading year is
            ...(created ? { dateCreated: created } : {}),
            creator: { "@id": `${profile.site}/#person` },
            // the case page on this site, never the product's own host: every
            // project has one, and it is the page the list is actually about
            url: `${profile.site}/work/${project.id}`,
          },
        };
      }),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // the gate edits this element's classes before React hydrates it
    <html lang="en" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: GATE }} />
        <noscript>
          <style>{NO_SCRIPT_CSS}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_SCHEMA) }}
        />
      </head>
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <Nav />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <RevealRoot />
        <SmoothScroll />
        <Arrival />
      </body>
    </html>
  );
}
