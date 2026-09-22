import { Fragment, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { CHANNELS, type Project } from "@/content/site";
import BookCallLink from "@/components/BookCallLink";
import EmailLink from "@/components/EmailLink";
import FlowDiagram from "@/components/FlowDiagram";
import FlowText from "@/components/FlowText";
import CaseTicks, { type TickSection } from "@/components/islands/CaseTicks";
import PosterSentinel from "@/components/islands/PosterSentinel";
import { brand, descriptor } from "@/lib/names";
import Facts, { tierStatus } from "./Facts";

const plural = (n: number, one: string) => `${n} ${one}${n === 1 ? "" : "s"}`;
const hint = (id: (typeof CHANNELS)[number]["id"]) =>
  CHANNELS.find((channel) => channel.id === id)?.hint ?? "";
const delay = (i: number) => ({ "--i": i }) as CSSProperties;

type SectionSpec = TickSection & {
  summary: string;
  body?: ReactNode;
  /** Spans both columns under the rail: the diagram needs the width. */
  wide?: ReactNode;
};

/**
 * The sheet that slides up over the poster (effect #21): the facts row, then
 * one section per kind of evidence the project actually has, then the way on
 * to the neighbouring projects.
 *
 * A section renders only when its data exists, and the tick scroll-spy is
 * built from the same list, so a project with no outcomes or no internals
 * loses the section and its tick together rather than showing an empty
 * heading. The engineer's one-liner is never dropped: without internals it
 * introduces the diagram instead, and without either it stands alone under
 * "Under the hood".
 */
export default function CaseSheet({
  project,
  previous,
  next,
}: {
  project: Project;
  previous: Project;
  next: Project;
}) {
  const outcomes = project.outcomes ?? [];
  const internals = project.internals ?? [];
  const links = project.links ?? [];
  const flow = project.flow;
  const status = tierStatus(project.tier);

  const engineerLede = (
    <p className="t-voice max-w-[34ch] text-ink-2" data-reveal="fade">
      {project.lede.engineer}
    </p>
  );

  const sections: SectionSpec[] = [];

  if (outcomes.length > 0) {
    sections.push({
      id: "outcomes",
      label: "What it does for the business",
      summary: plural(outcomes.length, "outcome"),
      body: <Marked items={outcomes} marker="bg-glow" />,
    });
  }

  sections.push({
    id: "my-part",
    label: "My part",
    summary: hint("recruiter"),
    body: (
      <>
        <p className="t-ui text-ink" data-reveal="fade">
          {project.role}
          <span className="text-muted tabular-nums"> · {project.year}</span>
        </p>
        <p
          className="t-body-case mt-4 text-ink-2"
          data-reveal="fade"
          style={delay(1)}
        >
          {project.lede.recruiter}
        </p>
        <h3 className="t-ui mt-10 font-medium text-ink">
          Stack and integrations
        </h3>
        <p
          className="t-body mt-2 text-muted"
          data-reveal="fade"
          style={delay(2)}
        >
          {project.stack.map((item, i) => (
            <Fragment key={`${i}-${item}`}>
              {/* the dot is glued to the item before it, so a wrapped line
                  never starts with one */}
              {i > 0 && "\u00a0· "}
              <span className="whitespace-nowrap">{item}</span>
            </Fragment>
          ))}
        </p>
      </>
    ),
  });

  if (flow) {
    sections.push({
      id: "how-it-fits",
      label: "How it fits together",
      summary: `${plural(flow.nodes.length, "part")}, ${plural(flow.edges.length, "connection")}`,
      body: internals.length === 0 ? engineerLede : undefined,
      wide: (
        <>
          {/* scroll-assembled where timelines exist (view-timeline --fig);
              elsewhere it waits dark for RevealRoot's data-play. Without
              motion or JS it is simply complete. */}
          <figure className="case-fig rounded-card border bg-bg-deep p-4 sm:p-6 lg:p-10">
            <FlowDiagram project={project} mode="full" assemble />
          </figure>
          <FlowText project={project} className="mt-6" />
        </>
      ),
    });
  }

  if (internals.length > 0 || !flow) {
    sections.push({
      id: "under-the-hood",
      label: "Under the hood",
      summary: hint("engineer"),
      body: (
        <>
          {engineerLede}
          {internals.length > 0 && (
            <div className="mt-10">
              <Marked items={internals} marker="bg-line-strong" />
            </div>
          )}
        </>
      ),
    });
  }

  sections.push({
    id: "see-it",
    label: "See it",
    summary: status.detail
      ? `${status.label} · ${status.detail}`
      : status.label,
    body:
      links.length > 0 ? (
        <div className="flex flex-wrap gap-3" data-reveal="rise">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-ghost"
            >
              {/* the label from site.ts, never the hostname */}
              {link.label}
              <span className="arr-out" aria-hidden="true">
                ↗
              </span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </div>
      ) : (
        <>
          <p className="t-voice max-w-[34ch] text-ink-2" data-reveal="fade">
            The source is private — happy to walk you through it.
          </p>
          <div
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
            data-reveal="rise"
            style={delay(1)}
          >
            <BookCallLink />
            <EmailLink
              variant="plain"
              className="t-ui text-ink-2 hover:text-ink"
            />
          </div>
        </>
      ),
  });

  return (
    <div className="case-sheet">
      <PosterSentinel />

      <div className="frame pt-12 pb-24 lg:pt-16 lg:pb-32">
        <Facts project={project} />

        <div className="mt-14 wide:grid wide:grid-cols-[176px_minmax(0,1fr)] wide:gap-x-12">
          <CaseTicks
            sections={sections.map(({ id, label }) => ({ id, label }))}
          />

          <div className="min-w-0">
            {sections.map((section) => (
              <Section key={section.id} {...section} />
            ))}
          </div>
        </div>

        <nav aria-label="More work" className="mt-4 border-t pt-14">
          <ul className="grid gap-4 md:grid-cols-2">
            <li className="min-w-0">
              <Neighbour project={previous} direction="Previous" />
            </li>
            <li className="min-w-0">
              <Neighbour project={next} direction="Next" />
            </li>
          </ul>
          <p className="mt-10">
            <Link
              href="/work"
              className="t-ui inline-flex items-center gap-2 text-ink-2 hover:text-ink"
            >
              <span className="u-link">All work</span>
              <span className="arr" aria-hidden="true">
                →
              </span>
            </Link>
          </p>
        </nav>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/**
 * One section: a sticky 240px rail (the heading and a one-line summary)
 * beside the text from 1024px up, stacked below that.
 */
function Section({ id, label, summary, body, wide }: SectionSpec) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="grid gap-x-16 gap-y-8 border-t py-16 lg:grid-cols-[240px_minmax(0,1fr)] lg:py-20"
    >
      <div className="lg:sticky lg:top-28 lg:self-start">
        <h2
          id={`${id}-title`}
          className="t-h3 lg:text-[2rem]"
          data-reveal="focus"
        >
          {label}
        </h2>
        <p className="t-meta mt-3">{summary}</p>
      </div>
      {body && <div className="min-w-0">{body}</div>}
      {wide && <div className="min-w-0 lg:col-span-2">{wide}</div>}
    </section>
  );
}

/** Hairline rows with a 12px dash marker: outcomes in apricot, internals in line. */
function Marked({ items, marker }: { items: string[]; marker: string }) {
  return (
    <ul className="border-b">
      {items.map((item, i) => (
        <li
          key={`${i}-${item}`}
          className="flex gap-4 border-t py-5"
          data-reveal="rise"
          style={delay(i)}
        >
          <span
            aria-hidden="true"
            className={`mt-[0.84em] h-px w-3 shrink-0 ${marker}`}
          />
          <span className="t-body-case text-ink-2">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** A large link to the project before or after this one, with its silhouette. */
function Neighbour({
  project,
  direction,
}: {
  project: Project;
  direction: "Previous" | "Next";
}) {
  const what = descriptor(project.name);
  return (
    <Link
      href={`/work/${project.id}`}
      rel={direction === "Previous" ? "prev" : "next"}
      className="flex h-full items-center gap-5 rounded-card border p-5 transition-colors duration-(--dur-s) hover:bg-surface-2 sm:p-6"
    >
      {project.flow && (
        <span className="glyph block w-24 shrink-0 text-muted sm:w-32">
          <FlowDiagram
            project={project}
            mode="poster"
            className="block h-auto w-full"
          />
        </span>
      )}
      <span className="min-w-0">
        <span className="t-meta block">{direction}</span>
        <span className="t-name mt-1 block text-ink">
          {brand(project.name)}
        </span>
        {what && <span className="t-meta mt-1 block">{what}</span>}
      </span>
    </Link>
  );
}
