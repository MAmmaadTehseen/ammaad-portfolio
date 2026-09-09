"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { TIERS, projects } from "@/content/site";
import type { Tier } from "@/content/site";

const TIER_DOT: Record<Tier, string> = {
  live: "bg-primary",
  open: "bg-muted",
  closed: "bg-signal",
};

/**
 * Nine builds, taken sideways: the section pins and vertical scroll drives the
 * track horizontally.
 *
 * The travel distance is measured rather than guessed at a percentage — a
 * percentage assumes every card is the same width and that the viewport never
 * changes, and gets the last card wrong on every screen it was not authored on.
 *
 * Below `lg` this is a plain scroll-snap strip you swipe. Pinning hijacks the
 * scroll gesture, which on a phone is the only gesture there is; taking it over
 * to move something sideways is worse than letting the thumb do it directly.
 */
export default function Reel() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(false);

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });

  const rawX = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const x = useSpring(rawX, { stiffness: 240, damping: 40, mass: 0.45 });
  const railScale = useSpring(scrollYProgress, { stiffness: 240, damping: 40, mass: 0.45 });

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");

    const measure = () => {
      setPinned(desktop.matches);
      const el = track.current;
      if (!el || !desktop.matches) {
        setDistance(0);
        return;
      }
      // how far the track has to travel for its right edge to reach the viewport's
      setDistance(Math.max(0, el.scrollWidth - window.innerWidth + 48));
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (track.current) observer.observe(track.current);
    window.addEventListener("resize", measure);
    desktop.addEventListener("change", measure);
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      desktop.removeEventListener("change", measure);
    };
  }, []);

  return (
    <section
      ref={section}
      id="reel"
      aria-label="Selected work"
      className="relative scroll-mt-24"
      // ~1:1 — the runway is sized so the track's horizontal travel roughly
      // matches the vertical distance scrolled, which reads as direct rather
      // than as cards drifting behind the gesture
      style={pinned ? { height: `${Math.max(200, projects.length * 45)}vh` } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-screen flex-col justify-center" : "py-20"}>
        <div className="mx-auto mb-8 flex w-full max-w-[1400px] flex-wrap items-end justify-between gap-4 px-5 sm:px-8">
          <div>
            <span className="u-engrave">Selected work</span>
            <h2 className="u-display text-ink mt-3 text-[clamp(1.8rem,5vw,3.2rem)]">
              {projects.length} builds, sideways
            </h2>
          </div>
          <p className="u-mono text-dim text-[11px] tracking-[0.14em] uppercase">
            {pinned ? "Scroll →" : "Swipe →"}
          </p>
        </div>

        <div className={pinned ? "overflow-hidden" : "overflow-x-auto pb-4"}>
          <motion.div
            ref={track}
            style={pinned ? { x } : undefined}
            className="flex w-max gap-5 px-5 sm:px-8"
          >
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={`/work/${project.id}`}
                data-cursor={project.name}
                className="group u-panel u-chamfer flex w-[78vw] shrink-0 flex-col justify-between p-6 transition-colors sm:w-[420px] lg:w-[440px]"
                style={{ scrollSnapAlign: "start" }}
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="u-mono text-signal text-[11px] tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${TIER_DOT[project.tier]}`}
                        aria-hidden
                      />
                      <span className="u-mono text-dim text-[10px] tracking-[0.14em] uppercase">
                        {TIERS[project.tier].label}
                      </span>
                    </span>
                  </div>

                  <h3 className="u-display text-muted group-hover:text-ink mt-8 text-[clamp(1.3rem,2.4vw,1.8rem)] transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-dim mt-3 text-sm leading-relaxed">
                    {project.lede.recruiter}
                  </p>
                </div>

                <div className="mt-8">
                  <ul className="flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 5).map((tech) => (
                      <li
                        key={tech}
                        className="u-mono border-line-soft text-dim border px-2 py-0.5 text-[10px]"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                  <span className="u-mono text-dim group-hover:text-signal mt-5 inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase transition-colors">
                    Open
                    <span
                      className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    >
                      ↗
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* travel readout — the same gauge language as the rest of the panel */}
        {pinned && (
          <div className="mx-auto mt-10 flex w-full max-w-[1400px] items-center gap-4 px-5 sm:px-8">
            <span className="u-mono text-dim text-[10px] tracking-[0.14em] uppercase">01</span>
            <div className="bg-surface-2 h-px flex-1 overflow-hidden">
              <motion.div
                className="bg-signal h-full w-full origin-left"
                style={{ scaleX: railScale }}
              />
            </div>
            <span className="u-mono text-dim text-[10px] tracking-[0.14em] uppercase">
              {String(projects.length).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
