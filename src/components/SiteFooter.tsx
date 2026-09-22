import Link from "next/link";
import { profile } from "@/content/site";
import ClosingRoom from "./ClosingRoom";
import EmailLink from "./EmailLink";
import { ClosingGate } from "./islands/NavState";

const PAGES = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Small, sentence case, Afacad 500: labels for the lists, not display type. */
const HEADING =
  "font-text text-ink text-[0.9375rem] leading-[1.35] font-medium";

/**
 * The end of every page: the closing room, then the bottom row.
 *
 * The room is skipped on /contact (the page is itself the ask), and the 404
 * hides it too, so both end on the bottom row alone. The room sits outside
 * <footer> on purpose: it is the page's last section, with its own heading,
 * not site-wide small print.
 *
 * The lists use the shared focus-dimming (.list / .row / .name), so pointing
 * at one link quietly steps its neighbours down to --dim.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <>
      <ClosingGate>
        <ClosingRoom />
      </ClosingGate>

      <footer className="bg-bg-deep border-line border-t">
        <div className="frame pt-14 pb-10">
          <div className="grid gap-10 sm:grid-cols-3 lg:grid-cols-[repeat(3,minmax(0,16rem))] lg:gap-16">
            <nav aria-labelledby="footer-pages">
              <h2 id="footer-pages" className={HEADING}>
                Pages
              </h2>
              <ul className="list t-ui mt-4 space-y-1">
                {PAGES.map((page) => (
                  <li key={page.href} className="row">
                    <Link
                      href={page.href}
                      className="name text-ink-2 inline-block py-1.5"
                    >
                      <span className="u-link">{page.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 id="footer-elsewhere" className={HEADING}>
                Elsewhere
              </h2>
              <ul
                aria-labelledby="footer-elsewhere"
                className="list t-ui mt-4 space-y-1"
              >
                {profile.socials.map((social) => (
                  <li key={social.href} className="row">
                    <a
                      href={social.href}
                      target="_blank"
                      rel="me noopener noreferrer"
                      className="name text-ink-2 inline-flex items-center gap-1.5 py-1.5"
                    >
                      <span className="u-link">{social.label}</span>
                      <span className="arr-out text-muted" aria-hidden="true">
                        ↗
                      </span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className={HEADING}>Say hello</h2>
              <p className="t-ui mt-4 py-1.5">
                <EmailLink variant="plain" className="text-ink-2" />
              </p>
            </div>
          </div>

          <div className="border-line t-meta mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t pt-6">
            <p>
              © {year} {profile.name}
            </p>
            <p>Built with Next.js — no template</p>
            <a
              href="#main"
              className="lift inline-flex items-center gap-1.5 py-1.5"
            >
              <span className="u-link">Back to top</span>
              <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
