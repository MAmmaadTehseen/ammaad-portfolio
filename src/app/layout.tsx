import type { Metadata, Viewport } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import "./globals.css";
import { ChannelProvider } from "@/lib/channel";
import Boot from "@/components/Boot";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import { meta, profile } from "@/content/site";

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
    template: `%s — ${profile.short}`,
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

const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: profile.short,
  url: profile.site,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Lahore", addressCountry: "PK" },
  sameAs: profile.socials.map((social) => social.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${martian.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_GATE }} />
        <noscript>
          {/* without JS there is no boot sequence to dismiss, so never show one */}
          <style>{`#boot{display:none!important}[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
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
          <Cursor />
          <Nav />
          <main>{children}</main>
        </ChannelProvider>
      </body>
    </html>
  );
}
