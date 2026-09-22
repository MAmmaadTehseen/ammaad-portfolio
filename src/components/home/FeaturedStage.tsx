import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { TIERS, featured, projects, type Project, type Tier } from "@/content/site";
import FlowDiagram, { FlowLegend } from "../FlowDiagram";
import FeaturedTabs from "../islands/FeaturedTabs";
import { brand, descriptor } from "@/lib/names";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * The tier as a client reads it. "Closed" is the data's word; the site says
 * "Private source", which is the first clause of the closed tier's note.
 */
function tierName(tier: Tier): string {
  if (tier === "closed") return TIERS.closed.note.split(" — ")[0];
  if (tier === "open") return `${TIERS.open.label} source`;
  return TIERS[tier].label;
}

const liveLink = (project: Project) => project.links?.find((link) => link.label === "Live");

/** An inline text link whose underline draws under the label, not the arrow. */
function TextLink({
  href,
  external = false,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  const label = (
    <span className="u-link group-hover:[background-size:100%_1px] group-focus-visible:[background-size:100%_1px]">
      {children}
    </span>
  );
  const className = "group inline-flex items-center gap-1.5 t-ui font-medium text-ink";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={className}>
        {label}
        <span className="arr-out" aria-hidden="true">
          ↗
        </span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
      <span className="arr" aria-hidden="true">
        →
      </span>
    </Link>
  );
}

/**
 * Selected work (DESIGN.md effect #14): most of it is private client code, so
 * each project is shown as its architecture rather than a screenshot.
 *
 * Two server-rendered layouts of the same featured list, swapped by CSS so
 * only one is ever displayed (and in the accessibility tree):
 *
 * - From 1024px: a vertical tablist on the left and a sticky --bg-deep stage
 *   on the right. All panels sit stacked in one grid cell; the first tab and
 *   panel carry data-active in the HTML, so the stage is complete before any
 *   script. FeaturedTabs (no props) only moves attributes: roving tabindex,
 *   aria-selected, data-active, and data-play / data-sent on the new panel's
 *   diagram so it switches on like windows at dusk. Without JS the panels
 *   simply stack.
 * - Below 1024px: a plain <ol> of rows with a small silhouette of each system,
 *   where a 1250-unit drawing would be too small to read.
 */
export default function FeaturedStage() {
  return (
    <section
      id="selected-work"
      aria-labelledby="selected-work-title"
      className="frame rhythm"
      data-featured=""
    >
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div>
          <h2 id="selected-work-title" className="t-h2" data-reveal="focus">
            Selected work
          </h2>
          <p className="t-lead mt-5" data-reveal="fade" style={step(1)}>
            Most of this is client software with private code, so it is drawn rather than
            screenshotted: how a request actually moves through it.
          </p>
        </div>
        <p data-reveal="fade" style={step(2)}>
          <TextLink href="/work">All {projects.length} projects</TextLink>
        </p>
      </div>

      {/* ---------- 1024px and up: tablist + stage ---------- */}
      <div className="mt-14 hidden items-start gap-x-10 lg:grid lg:grid-cols-12 xl:gap-x-14">
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-labelledby="selected-work-title"
          className="border-t lg:col-span-4"
        >
          {featured.map((project, i) => {
            const active = i === 0;
            return (
              <button
                key={project.id}
                type="button"
                role="tab"
                id={`tab-${project.id}`}
                aria-controls={`panel-${project.id}`}
                aria-selected={active}
                tabIndex={active ? 0 : -1}
                data-active={active ? "" : undefined}
                className="tab grid w-full grid-cols-[32px_minmax(0,1fr)] items-center gap-x-4 border-b py-4 text-left"
              >
                <span className="tab-hair" aria-hidden="true" />
                <span className="block font-display text-[1.625rem] leading-[1.15] font-[350] tracking-[-0.01em]">
                  {brand(project.name)}
                </span>
                <span className="meta col-start-2 mt-1 block text-[0.9375rem] leading-[1.45] tabular-nums">
                  {descriptor(project.name) ?? tierName(project.tier)} · {project.year}
                </span>
              </button>
            );
          })}
        </div>

        <div
          className="sticky top-24 rounded-card border bg-bg-deep p-6 lg:col-span-8 xl:p-8"
          data-stage=""
        >
          <div className="stage-panels">
            {featured.map((project, i) => {
              const live = liveLink(project);
              const desc = descriptor(project.name);
              return (
                <div
                  key={project.id}
                  role="tabpanel"
                  id={`panel-${project.id}`}
                  aria-labelledby={`tab-${project.id}`}
                  className="panel"
                  data-active={i === 0 ? "" : undefined}
                >
                  <div className="panel-info">
                    <p className="t-meta">
                      {tierName(project.tier)} · {project.year} · {project.role}
                    </p>
                    <h3 className="t-h3 mt-3">
                      {brand(project.name)}
                      {desc && <span className="text-muted"> — {desc}</span>}
                    </h3>
                    <p className="t-body mt-4">{project.lede.client}</p>
                  </div>

                  {project.flow && (
                    <>
                      {/* the frame fixes the height, so switching panels never
                          moves the page; the drawing fits inside it */}
                      <div className="mt-8 h-[clamp(260px,26vw,360px)]">
                        <FlowDiagram
                          project={project}
                          mode="full"
                          assemble
                          vertical={false}
                          legend={false}
                          className="h-full [&>div]:h-full"
                          svgClassName="block h-full w-full"
                        />
                      </div>
                      <FlowLegend flow={project.flow} />
                    </>
                  )}

                  <p className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                    <TextLink href={`/work/${project.id}`}>Read the case study</TextLink>
                    {live && (
                      <TextLink href={live.href} external>
                        Visit live
                      </TextLink>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------- below 1024px: plain rows ---------- */}
      <ol role="list" className="list mt-12 border-t lg:hidden">
        {featured.map((project) => {
          const desc = descriptor(project.name);
          return (
            <li key={project.id} className="row border-b" data-reveal="rise">
              {/* phones: title and glyph share the first line, the lede runs under
                  both; from 640px the glyph takes its own column */}
              <Link
                href={`/work/${project.id}`}
                className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-5 gap-y-3 py-7 sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-x-7"
              >
                <div
                  className="glyph flex h-16 w-24 items-center justify-center overflow-hidden rounded-[10px] border bg-bg-deep px-2 text-muted max-sm:order-2 sm:row-span-2"
                  aria-hidden="true"
                >
                  <FlowDiagram
                    project={project}
                    mode="poster"
                    className="h-auto max-h-full w-full"
                  />
                </div>
                <div className="max-sm:order-1">
                  <span className="name t-h3 font-[350]">{brand(project.name)}</span>
                  {desc && (
                    <span className="meta mt-1 block text-[1.0625rem] text-muted">{desc}</span>
                  )}
                  <span className="meta t-meta mt-2 block">
                    {tierName(project.tier)} · {project.year}
                  </span>
                </div>
                <div className="col-span-2 max-sm:order-3 sm:col-span-1 sm:col-start-2">
                  <p className="t-body">{project.lede.client}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 t-ui font-medium text-ink">
                    <span className="u-link group-hover:[background-size:100%_1px] group-focus-visible:[background-size:100%_1px]">
                      Read the case study
                    </span>
                    <span className="arr" aria-hidden="true">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      <FeaturedTabs />
    </section>
  );
}
