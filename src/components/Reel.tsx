"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TIERS } from "@/content/site";
import type { Tier } from "@/content/site";

/**
 * Only what a card shows. The page passes these in rather than this client
 * component importing the project list, which would ship every project's full
 * write-up in the JavaScript of every page.
 */
export type ReelItem = { id: string; name: string; tier: Tier; lede: string; stack: string[] };

const TIER_DOT: Record<Tier, string> = {
  live: "bg-primary",
  open: "bg-muted",
  closed: "bg-signal",
};

/**
 * The builds, taken sideways: a rail you scroll, swipe or step through.
 *
 * It used to pin the section and drive the track from vertical scroll. That
 * cost about two thousand pixels of scrolling in which the page looked frozen,
 * and it took the one gesture a reader has away from them. Now the rail is an
 * ordinary scroll container: the wheel, a trackpad, a thumb, the arrow buttons
 * and the Tab key all move it, the page never stops moving underneath, and the
 * section is as tall as the cards in it.
 *
 * Progress is written straight to the DOM on scroll rather than held in state —
 * scrolling fires often, and rendering React on every frame of a swipe is what
 * makes a rail feel heavy.
 */
export default function Reel({ items: projects, total }: { items: ReelItem[]; total: number }) {
  const rail = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const progress = max > 0 ? el.scrollLeft / max : 1;
    if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
    // a pixel of slack: sub-pixel scroll positions never land exactly on the end
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(max - el.scrollLeft <= 1);
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [sync]);

  /** One card and its gap, measured rather than assumed. */
  const step = (direction: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const width = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * width, behavior: "smooth" });
  };

  return (
    <section id="reel" aria-label="Selected work" className="relative scroll-mt-24 py-20">
      <div className="mx-auto mb-8 flex w-full max-w-[1400px] flex-wrap items-end justify-between gap-4 px-5 sm:px-8">
        <div>
          <span className="u-engrave">Selected work</span>
          <h2 className="u-display text-ink mt-3 text-[clamp(1.8rem,5vw,3.2rem)]">
            {projects.length} builds, sideways
          </h2>
          <Link
            href="/work"
            className="u-mono text-dim hover:text-signal mt-3 inline-block text-[11px] tracking-[0.14em] uppercase transition-colors"
          >
            All {total} projects →
          </Link>
        </div>

        {/* the controls sit with the heading, so the rail itself stays all cards */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={atStart}
            aria-label="Previous projects"
            className="u-panel text-muted hover:text-signal hover:border-line flex h-9 w-9 items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-35"
          >
            <span aria-hidden>←</span>
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={atEnd}
            aria-label="More projects"
            className="u-panel text-muted hover:text-signal hover:border-line flex h-9 w-9 items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-35"
          >
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <div
        ref={rail}
        className="u-rail snap-x snap-mandatory scroll-px-5 overflow-x-auto overscroll-x-contain pb-4 sm:scroll-px-8"
      >
        <div className="flex w-max gap-5 px-5 sm:px-8">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              data-card
              href={`/work/${project.id}`}
              className="group u-panel u-chamfer flex w-[78vw] shrink-0 snap-start flex-col justify-between p-6 transition-colors sm:w-[420px] lg:w-[440px]"
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
                    <span className="u-mono text-dim text-[11px] tracking-[0.14em] uppercase">
                      {TIERS[project.tier].label}
                    </span>
                  </span>
                </div>

                <h3 className="u-display text-muted group-hover:text-ink mt-8 text-[clamp(1.3rem,2.4vw,1.8rem)] transition-colors">
                  {project.name}
                </h3>
                <p className="text-dim mt-3 text-sm leading-relaxed">{project.lede}</p>
              </div>

              <div className="mt-8">
                <ul className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="u-mono border-line-soft text-dim border px-2 py-0.5 text-[11px]"
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
        </div>
      </div>

      {/* travel readout — the same gauge language as the rest of the panel */}
      <div className="mx-auto mt-8 flex w-full max-w-[1400px] items-center gap-4 px-5 sm:px-8">
        <span className="u-mono text-dim text-[11px] tracking-[0.14em] uppercase">01</span>
        <div className="bg-surface-2 h-px flex-1 overflow-hidden">
          <span ref={bar} className="bg-signal block h-full w-full origin-left scale-x-0" />
        </div>
        <span className="u-mono text-dim text-[11px] tracking-[0.14em] uppercase">
          {String(projects.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
