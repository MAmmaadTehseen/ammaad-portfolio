import type { Metadata, Viewport } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import "./globals.css";
import { ChannelProvider } from "@/lib/channel";
import Boot from "@/components/Boot";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import SiteFooter from "@/components/SiteFooter";
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

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const martian = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian",
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
  themeColor: "#0e1108",
  colorScheme: "dark",
};

/**
 * Marks the document before first paint so a repeat visitor never sees the
 * boot overlay flash in and straight back out. Same trick for reduced motion.
 */
const BOOT_GATE = `try{(sessionStorage.getItem('readout:boot')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches)&&document.documentElement.classList.add('boot-done')}catch(e){}`;

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
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: project.name,
          description: project.lede.recruiter,
          keywords: project.stack.join(", "),
          dateCreated: project.year,
          creator: { "@id": `${profile.site}/#person` },
          ...(project.links?.[0] ? { url: project.links[0].href } : {}),
        },
      })),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${martian.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_GATE }} />
        <noscript>
          {/* without JS there is no boot sequence to dismiss, so never show one */}
          {/* [data-reveal] alone left the split headings and the motion-driven
              bits invisible: they start hidden and are animated in by JS that
              never runs here. Everything that hides itself for motion has to be
              put back, or the page ships with holes in it. */}
          <style>{`#boot{display:none!important}[data-reveal],[data-motion],[data-split] span{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_SCHEMA) }}
        />
      </head>
      <body className="antialiased">
        <a
          href="#index"
          className="u-mono focus:bg-signal focus:text-bg sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-3 focus:py-2 focus:text-[11px] focus:tracking-[0.12em] focus:uppercase"
        >
          Skip to content
        </a>
        <ChannelProvider>
          <Boot />
          <SmoothScroll />
          <Nav />
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ChannelProvider>
      </body>
    </html>
  );
}
