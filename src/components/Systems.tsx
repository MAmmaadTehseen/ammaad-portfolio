"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { projects, TIERS } from "@/content/site";
import type { Channel, Project, Tier } from "@/content/site";
import { useChannel } from "@/lib/channel";
import FlowDiagram from "./FlowDiagram";
import ChannelSwitch from "./ChannelSwitch";

const TIER_DOT: Record<Tier, string> = {
  live: "bg-primary",
  open: "bg-muted",
  closed: "bg-signal",
};

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

function Detail({ project, channel }: { project: Project; channel: Channel }) {
  const reduced = useReducedMotion();
  // what each reader actually wants out of the same project
  const list = channel === "client" ? project.outcomes : channel === "engineer" ? project.internals : undefined;
  const listLabel = channel === "client" ? "What it does" : "Under the hood";

  return (
    <motion.div
      key={`${project.id}-${channel}`}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="u-panel u-chamfer u-grain min-w-0 max-w-full overflow-hidden p-5 sm:p-7"
    >
      <div className="border-line-soft mb-5 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <TierChip tier={project.tier} />
        <span className="u-mono text-dim text-[10px] tracking-[0.14em] uppercase">
          {project.year}
        </span>
      </div>

      <h3 className="u-display text-ink text-[clamp(1.5rem,3.4vw,2.25rem)]">{project.name}</h3>
      <p className="u-mono text-primary mt-2 text-[11px] tracking-[0.1em]">{project.role}</p>

      <p className="text-muted u-prose mt-5">{project.lede[channel]}</p>

      {list && list.length > 0 && (
        <div className="mt-7">
          <span className="u-engrave">{listLabel}</span>
          <ul className="mt-3 space-y-2.5">
            {list.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="bg-signal/80 mt-2 h-1 w-1 shrink-0 rotate-45" aria-hidden />
                <span className="text-muted text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-7">
        <span className="u-engrave">Built with</span>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((item) => (
            <li
              key={item}
              className="u-mono border-line-soft bg-surface-2 text-muted border px-2 py-1 text-[10px] tracking-[0.06em]"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {project.flow && (
        <div className="mt-8">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <span className="u-engrave">Signal path</span>
            <span className="u-mono text-dim/80 text-[10px]">
              {project.tier === "closed" ? "source private" : "architecture"}
            </span>
          </div>
          <FlowDiagram nodes={project.flow.nodes} edges={project.flow.edges} />
        </div>
      )}

      {project.links && project.links.length > 0 && (
        <div className="border-line-soft mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t pt-5">
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
        </div>
      )}

      {project.tier === "closed" && !project.links?.length && (
        <p className="u-mono text-dim border-line-soft mt-7 border-t pt-5 text-[11px] leading-relaxed">
          Source is private. Happy to walk through the architecture on a call.
        </p>
      )}
    </motion.div>
  );
}

export default function Systems() {
  const { channel } = useChannel();
  const [activeId, setActiveId] = useState(projects[0].id);
  const active = projects.find((project) => project.id === activeId) ?? projects[0];

  return (
    <section id="work" className="mx-auto max-w-[1400px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <div className="border-line-soft mb-12 flex flex-wrap items-end justify-between gap-6 border-b pb-6">
        <div>
          <h2 className="u-display text-ink text-[clamp(2.25rem,6vw,4.5rem)]">Work</h2>
          <p className="text-muted u-prose mt-3 text-sm">
            Nine builds, disclosed at three depths.{" "}
            <span className="text-ink">Open</span> means you can read the source,{" "}
            <span className="text-ink">Live</span> means it is running for someone right now, and{" "}
            <span className="text-ink">Closed</span> means the source is private — so you get the
            architecture instead of a screenshot.
          </p>
        </div>
        <div className="hidden lg:block">
          <ChannelSwitch compact />
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
        {/* the index */}
        <ul className="border-line-soft min-w-0 border-t">
          {projects.map((project, index) => {
            const isActive = project.id === active.id;
            return (
              <li key={project.id} className="border-line-soft border-b">
                <button
                  onClick={() => setActiveId(project.id)}
                  onMouseEnter={() => setActiveId(project.id)}
                  onFocus={() => setActiveId(project.id)}
                  data-cursor={project.name}
                  aria-expanded={isActive}
                  className="group flex w-full items-center gap-4 py-4 text-left sm:gap-5 sm:py-5"
                >
                  <span
                    className={`u-mono shrink-0 text-[11px] transition-colors duration-200 ${
                      isActive ? "text-signal" : "text-dim"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* a reticle, not a coloured side stripe */}
                  <span className="relative h-3 w-3 shrink-0" aria-hidden>
                    <motion.span
                      className="border-signal absolute inset-0 border"
                      animate={{ opacity: isActive ? 1 : 0, rotate: isActive ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </span>

                  <span
                    className={`u-display min-w-0 flex-1 text-[clamp(1.05rem,2.4vw,1.7rem)] transition-colors duration-200 ${
                      isActive ? "text-ink" : "text-muted group-hover:text-ink"
                    }`}
                  >
                    {project.name}
                  </span>

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
        </ul>

        {/* the readout */}
        <div className="hidden min-w-0 lg:block">
          <div className="sticky top-24">
            <AnimatePresence mode="wait" initial={false}>
              <Detail key={`${active.id}-${channel}`} project={active} channel={channel} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
