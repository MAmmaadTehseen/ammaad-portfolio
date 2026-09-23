"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { profile } from "@/content/site";

// real routes rather than home-page anchors, so the nav works identically from
// a project page as from the home page
const LINKS = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    // rendered client-only: the server has no business guessing Lahore's clock
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: profile.timezone,
      }).format(new Date());

    setTime(format());
    const id = window.setInterval(() => setTime(format()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  if (!time) return null;
  return (
    <span className="u-mono text-dim hidden text-[11px] sm:inline">
      {time} <span className="text-dim/70">PKT</span>
    </span>
  );
}

/** Ignore sub-pixel jitter and trackpad noise; only a deliberate move counts. */
const DIRECTION_THRESHOLD = 6;
/** Above this, the page is "at the top" and the header defers to the hero. */
const TOP_ZONE = 90;

export default function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Hidden while reading downward, back on the first flick upward. At the very
  // top of the home page it stays out of the way entirely, so the hero is the
  // whole screen rather than a hero with a bar across it.
  const [hidden, setHidden] = useState(false);
  const previous = useRef(0);

  useEffect(() => {
    setHidden(isHome && window.scrollY < TOP_ZONE);
    previous.current = window.scrollY;
  }, [isHome]);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - previous.current;
    if (Math.abs(delta) < DIRECTION_THRESHOLD) return;
    previous.current = y;

    if (y < TOP_ZONE) {
      setHidden(isHome);
      return;
    }
    setHidden(delta > 0);
  });

  return (
    <motion.header
      className="border-line-soft bg-bg/80 fixed inset-x-0 top-0 border-b backdrop-blur-md"
      style={{ zIndex: "var(--z-nav)" }}
      animate={{ y: hidden ? "-102%" : "0%" }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* the scroll position, read as a signal level */}
      <motion.div
        className="bg-signal absolute inset-x-0 top-0 h-px origin-left"
        style={{ scaleX: progress }}
        aria-hidden
      />

      <nav className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5" data-cursor="Home">
          <span className={`u-led ${profile.available ? "u-led-live" : ""}`} aria-hidden />
          <span className="u-mono text-ink text-[11px] tracking-[0.14em] uppercase">
            {profile.short}
          </span>
        </Link>

        <div className="flex items-center gap-5 sm:gap-7">
          <LocalTime />
          <ul className="flex items-center gap-4 sm:gap-6">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  data-cursor={link.label}
                  className="u-mono text-muted hover:text-ink text-[11px] tracking-[0.12em] uppercase transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </motion.header>
  );
}
