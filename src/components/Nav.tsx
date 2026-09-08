"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "motion/react";
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

export default function Nav() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });

  return (
    <header
      className="border-line-soft bg-bg/80 fixed inset-x-0 top-0 border-b backdrop-blur-md"
      style={{ zIndex: "var(--z-nav)" }}
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
    </header>
  );
}
