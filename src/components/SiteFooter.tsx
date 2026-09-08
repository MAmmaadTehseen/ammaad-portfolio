import Link from "next/link";
import { profile } from "@/content/site";

const SECTIONS = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * Sits in the root layout, so every page ends with a way out — the project
 * pages previously dead-ended with no footer at all. Deliberately compact: the
 * home page keeps its own full contact section, and repeating that at the foot
 * of every page would flatten it.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-line-soft mt-auto border-t px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-start justify-between gap-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className={`u-led ${profile.available ? "u-led-live" : ""}`} aria-hidden />
            <span className="u-mono text-muted text-[11px] tracking-[0.14em] uppercase">
              {profile.available ? profile.availableNote : "Not taking work right now"}
            </span>
          </div>
          <a
            href={`mailto:${profile.email}`}
            data-cursor="Write to me"
            className="text-signal mt-3 inline-block text-lg break-all hover:underline"
          >
            {profile.email}
          </a>
        </div>

        <nav aria-label="Footer" className="flex gap-10">
          <div>
            <span className="u-engrave">Pages</span>
            <ul className="mt-3 space-y-1.5">
              {SECTIONS.map((section) => (
                <li key={section.href}>
                  <Link
                    href={section.href}
                    data-cursor={section.label}
                    className="text-muted hover:text-ink text-sm transition-colors"
                  >
                    {section.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="u-engrave">Elsewhere</span>
            <ul className="mt-3 space-y-1.5">
              {profile.socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener me"
                    data-cursor={social.label}
                    className="text-muted hover:text-ink group inline-flex items-center gap-2 text-sm transition-colors"
                  >
                    {social.label}
                    <span
                      className="text-dim transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="border-line-soft mx-auto mt-10 flex max-w-[1400px] flex-wrap items-center justify-between gap-3 border-t pt-6">
        <span className="u-mono text-dim text-[10px] tracking-[0.12em] uppercase">
          © {year} {profile.name} — {profile.location}
        </span>
        <span className="u-mono text-dim/70 text-[10px] tracking-[0.12em] uppercase">
          Built with Next.js — no template
        </span>
      </div>
    </footer>
  );
}
