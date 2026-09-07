"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { projects, TIERS } from "@/content/site";
import type { Channel, Project, Tier } from "@/content/site";
import { useChannel } from "@/lib/channel";
import { EASE, useScrollSkew } from "@/lib/motion";
import FlowDiagram from "./FlowDiagram";
import ChannelSwitch from "./ChannelSwitch";
import SplitText from "./SplitText";

const TIER_DOT: Record<Tier, string> = {
  live: "bg-primary",
  open: "bg-muted",
  closed: "bg-signal",
};

/** Where in the viewport a row becomes "the one being read". */
const FOCAL = 0.42;

function TierChip({ tier }: { tier: Tier }) {
  return (
    <span className="inline-flex items-center gap-1.5" title={TIERS[tier].note}>
      <span className={`h-1.5 w-1.5 rounded-full ${TIER_DOT[tier]}`} aria-hidden />
      <span className="u-mono text-dim text-[10px] tracking-[0.14em] uppercase">
        {TIERS[tier].label}
      </span>
    </span>
  );
}

/**
 * Entrance only — deliberately no exit.
 *
 * The panel is driven by scroll position, so its key can change many times a
 * second. An exit animation (and the AnimatePresence that waits on one) queues
 * up faster than it can drain, which strands the panel on a stale project.
 * Remounting on a key and animating in is the only behaviour that stays correct
 * at any scroll speed.
 */
const panelVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: EASE } },
};

function Detail({ project, channel }: { project: Project; channel: Channel }) {
  const list =
    channel === "client" ? project.outcomes : channel === "engineer" ? project.internals : undefined;
  const listLabel = channel === "client" ? "What it does" : "Under the hood";

  // always the same element type — see panelVariants on why reduced motion is
  // a CSS concern here rather than a branch
  const Item = motion.div;
  const itemProps = { variants: itemVariants, "data-motion": true } as const;

  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="show"
      className="u-panel u-chamfer u-grain min-w-0 max-w-full overflow-hidden p-5 sm:p-7"
    >
      <Item
        {...itemProps}
        className="border-line-soft mb-5 flex flex-wrap items-center justify-between gap-3 border-b pb-4"
      >
        <TierChip tier={project.tier} />
        <span className="u-mono text-dim text-[10px] tracking-[0.14em] uppercase">
          {project.year}
        </span>
      </Item>

      <Item {...itemProps}>
        <h3 className="u-display text-ink text-[clamp(1.5rem,3.4vw,2.25rem)]">{project.name}</h3>
        <p className="u-mono text-primary mt-2 text-[11px] tracking-[0.1em]">{project.role}</p>
      </Item>

      <Item {...itemProps}>
        <p className="text-muted u-prose mt-5">{project.lede[channel]}</p>
      </Item>

      {list && list.length > 0 && (
        <Item {...itemProps} className="mt-7">
          <span className="u-engrave">{listLabel}</span>
          <ul className="mt-3 space-y-2.5">
            {list.map((entry) => (
              <li key={entry} className="flex gap-3">
                <span className="bg-signal/80 mt-2 h-1 w-1 shrink-0 rotate-45" aria-hidden />
                <span className="text-muted text-sm leading-relaxed">{entry}</span>
              </li>
            ))}
          </ul>
        </Item>
      )}

      <Item {...itemProps} className="mt-7">
        <span className="u-engrave">Built with</span>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((entry) => (
            <li
              key={entry}
              className="u-mono border-line-soft bg-surface-2 text-muted border px-2 py-1 text-[10px] tracking-[0.06em]"
            >
              {entry}
            </li>
          ))}
        </ul>
      </Item>

      {project.flow && (
        <Item {...itemProps} className="mt-8">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <span className="u-engrave">Signal path</span>
            <span className="u-mono text-dim/80 text-[10px]">
              {project.tier === "closed" ? "source private" : "architecture"}
            </span>
          </div>
          <FlowDiagram nodes={project.flow.nodes} edges={project.flow.edges} />
        </Item>
      )}

      {project.links && project.links.length > 0 && (
        <Item
          {...itemProps}
          className="border-line-soft mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t pt-5"
        >
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor={link.label}
              className="u-mono text-ink hover:text-signal group inline-flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase transition-colors"
            >
              {link.label}
              <span
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              >
                ↗
              </span>
            </a>
          ))}
        </Item>
      )}

      {project.tier === "closed" && !project.links?.length && (
        <Item {...itemProps}>
          <p className="u-mono text-dim border-line-soft mt-7 border-t pt-5 text-[11px] leading-relaxed">
            Source is private. Happy to walk through the architecture on a call.
          </p>
        </Item>
      )}
    </motion.div>
  );
}

export default function Systems() {
  const { channel } = useChannel();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = projects[activeIndex] ?? projects[0];

  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const centers = useRef<number[]>([]);
  const listRef = useRef<HTMLUListElement>(null);
  const scrollDriven = useRef(false);

  const skew = useScrollSkew(1.2);
  const { scrollY } = useScroll();

  /** Cache each row's document-space centre so the scroll handler never
   *  measures layout on a frame. */
  const measure = useCallback(() => {
    centers.current = rows.current.map((el) => {
      if (!el) return Number.POSITIVE_INFINITY;
      const rect = el.getBoundingClientRect();
      return rect.top + window.scrollY + rect.height / 2;
    });
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    // below lg the readout sits inline and opening one would reflow the list
    // under the reader's thumb, so scroll-driving is desktop-only
    const sync = () => {
      scrollDriven.current = desktop.matches;
      measure();
    };
    sync();

    const observer = new ResizeObserver(measure);
    if (listRef.current) observer.observe(listRef.current);
    window.addEventListener("resize", sync);
    desktop.addEventListener("change", sync);
    // fonts land after first paint and change every row height
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
      desktop.removeEventListener("change", sync);
    };
  }, [measure]);

  useMotionValueEvent(scrollY, "change", (y) => {
    if (!scrollDriven.current) return;
    const focal = y + window.innerHeight * FOCAL;
    let best = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < centers.current.length; i += 1) {
      const distance = Math.abs(centers.current[i] - focal);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    }
    setActiveIndex((current) => (current === best ? current : best));
  });

  return (
    <section id="work" className="mx-auto max-w-[1400px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <div className="border-line-soft mb-12 flex flex-wrap items-end justify-between gap-6 border-b pb-6">
        <div>
          <h2 className="u-display text-ink text-[clamp(2.25rem,6vw,4.5rem)]">
            <SplitText text="Work" />
          </h2>
          <p className="text-muted u-prose mt-3 text-sm">
            Nine builds, disclosed at three depths. <span className="text-ink">Open</span> means you
            can read the source, <span className="text-ink">Live</span> means it is running for
            someone right now, and <span className="text-ink">Closed</span> means the source is
            private — so you get the architecture instead of a screenshot.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 lg:items-end">
          {/* the readout tracks what the scroll position is pointing at */}
          <div className="hidden items-baseline gap-1 lg:flex" aria-hidden>
            {/* keyed remount, no AnimatePresence — see panelVariants */}
            <span className="u-mono text-signal block overflow-hidden text-sm tabular-nums">
              <motion.span
                key={activeIndex}
                className="block"
                initial={{ y: "-110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.34, ease: EASE }}
              >
                {String(activeIndex + 1).padStart(2, "0")}
              </motion.span>
            </span>
            <span className="u-mono text-dim text-sm tabular-nums">
              / {String(projects.length).padStart(2, "0")}
            </span>
          </div>
          <div className="hidden lg:block">
            <ChannelSwitch compact />
          </div>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
        {/* the index */}
        <motion.ul
          ref={listRef}
          data-motion
          style={{ skewY: skew }}
          className="border-line-soft min-w-0 border-t"
        >
          {projects.map((project, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={project.id}
                ref={(node) => {
                  rows.current[index] = node;
                }}
                className="border-line-soft border-b"
              >
                <button
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  data-cursor={project.name}
                  aria-expanded={isActive}
                  // taller on lg so the list runs roughly as long as the sticky
                  // readout beside it, instead of ending in dead scroll
                  className="group flex w-full items-center gap-4 py-6 text-left sm:gap-5 lg:py-13"
                >
                  <span
                    className={`u-mono shrink-0 text-[11px] transition-colors duration-300 ${
                      isActive ? "text-signal" : "text-dim"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* a reticle, not a coloured side stripe */}
                  <span className="relative h-3 w-3 shrink-0" aria-hidden>
                    <motion.span
                      className="border-signal absolute inset-0 border"
                      animate={{
                        opacity: isActive ? 1 : 0,
                        rotate: isActive ? 45 : 0,
                        scale: isActive ? 1 : 0.6,
                      }}
                      transition={{ duration: 0.45, ease: EASE }}
                    />
                  </span>

                  <motion.span
                    animate={{ x: isActive ? 6 : 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className={`u-display min-w-0 flex-1 text-[clamp(1.05rem,2.4vw,1.7rem)] transition-colors duration-300 ${
                      isActive ? "text-ink" : "text-muted group-hover:text-ink"
                    }`}
                  >
                    {project.name}
                  </motion.span>

                  <span className="hidden shrink-0 sm:block">
                    <TierChip tier={project.tier} />
                  </span>
                </button>

                {/* below lg the detail lives inline, under the row it belongs to */}
                <div className="min-w-0 lg:hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    {isActive && (
                      <div className="pb-6">
                        <Detail project={project} channel={channel} />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            );
          })}
        </motion.ul>

        {/* the readout */}
        <div className="hidden min-w-0 lg:block">
          <div className="sticky top-24">
            <Detail key={`${active.id}-${channel}`} project={active} channel={channel} />
          </div>
        </div>
      </div>
    </section>
  );
}
