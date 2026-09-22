"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Past this, the full-width row condenses into the pill and drops the clock. */
const COMPACT_AT = 80;
/** Past this, reading downward tucks the header away. */
const HIDE_AFTER = 480;
/** Sub-pixel jitter and trackpad noise are not a direction; a deliberate move is. */
const THRESHOLD = 6;

/**
 * The fixed header element and its scroll state (effect #9).
 *
 * It only writes two attributes, data-compact and data-hidden, and the CSS
 * does the rest: the pill transition, the tuck, the :focus-within reveal and
 * the reduced-motion rule that never hides it. One passive listener, coalesced
 * to one read per frame, so an idle page does no work at all.
 *
 * The direction is measured from the last point a direction was decided, not
 * frame to frame: a slow scroll moves less than 6px a frame and would
 * otherwise never count as a move.
 */
export default function NavState({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;

    let anchor = Math.max(0, window.scrollY);
    let frame = 0;

    const apply = () => {
      frame = 0;
      // iOS rubber-banding reports negative offsets at the top
      const y = Math.max(0, window.scrollY);
      header.toggleAttribute("data-compact", y > COMPACT_AT);

      if (y <= HIDE_AFTER) {
        header.removeAttribute("data-hidden");
        anchor = y;
        return;
      }
      const dy = y - anchor;
      if (dy > THRESHOLD) {
        header.setAttribute("data-hidden", "");
        anchor = y;
      } else if (dy < -THRESHOLD) {
        header.removeAttribute("data-hidden");
        anchor = y;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    // a reload mid-page restores the scroll before hydration: start in the right state
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header ref={ref} className="site-header">
      {children}
    </header>
  );
}

const LINKS = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * The three page links, with the current one marked.
 *
 * The exact page gets aria-current="page". A case study is not the Work page,
 * but it lives under it, so there Work gets aria-current="true": still
 * announced as current, and drawn the same way, without claiming to be the
 * page the reader is on.
 *
 * `bar` is the header row; `menu` is the mobile sheet, in Ysabeau at 2rem,
 * with each item on the sheet's rise stagger.
 */
export function NavLinks({
  variant,
  className,
}: {
  variant: "bar" | "menu";
  className?: string;
}) {
  const pathname = usePathname() ?? "/";

  return (
    <ul className={className}>
      {LINKS.map((link, i) => {
        const exact = pathname === link.href;
        const within = !exact && pathname.startsWith(`${link.href}/`);
        const active = exact || within;
        return (
          <li
            key={link.href}
            className={variant === "menu" ? "menu-item" : undefined}
            style={
              variant === "menu" ? ({ "--i": i } as CSSProperties) : undefined
            }
          >
            <Link
              href={link.href}
              aria-current={exact ? "page" : within ? "true" : undefined}
              className={[
                "u-link",
                variant === "bar"
                  ? "t-ui inline-flex min-h-11 items-center"
                  : "font-display inline-block py-1 text-[2rem] leading-tight font-light",
                // the underline for aria-current="true", which .u-link keys only off "page"
                active
                  ? "text-ink [background-size:100%_1px]"
                  : "text-ink-2 hover:text-ink",
              ].join(" ")}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** A case study: /work/<slug>, and nothing deeper or shallower. */
const CASE = /^\/work\/[^/]+\/?$/;

/**
 * The 1px reading-progress line along the pill's bottom edge (effect #10),
 * on case pages only. The CSS keeps it hidden unless scroll timelines exist
 * and motion is allowed, and drives it from scroll(root) with no JS at all.
 */
export function NavProgress() {
  const pathname = usePathname() ?? "/";
  if (!CASE.test(pathname)) return null;
  return <span className="progress" aria-hidden="true" />;
}

/**
 * Renders the closing room everywhere except /contact, which is itself the
 * ask. The room stays server-rendered and arrives as children; only this
 * route check runs on the client.
 */
export function ClosingGate({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  if (pathname === "/contact" || pathname === "/contact/") return null;
  return children;
}
