import type { ReactNode } from "react";
import { TIERS, type Project, type Tier } from "@/content/site";
import { readingMinutes } from "@/lib/readingTime";

/**
 * A tier as a client reads it. Closed is "Private source", the first clause
 * of its own note, because "Closed" reads as a shut-down product; the rest of
 * that note becomes the detail. The other tiers keep their label and note.
 */
export function tierStatus(tier: Tier): { label: string; detail: string } {
  const { label, note } = TIERS[tier];
  if (tier === "closed") {
    const [head, ...rest] = note.split(" — ");
    return { label: head ?? label, detail: rest.join(" — ") };
  }
  return { label, detail: note };
}

type Fact = { term: string; value: ReactNode };

/**
 * The facts row that opens the case sheet: Role · Year · Status · Links ·
 * reading time. A real <dl>, laid out as a wrapping row. Links appear only
 * when the project has any; Status already says when the source is private.
 */
export default function Facts({
  project,
}: {
  project: Pick<
    Project,
    "role" | "year" | "tier" | "links" | "lede" | "outcomes" | "internals"
  >;
}) {
  const status = tierStatus(project.tier);
  const links = project.links ?? [];

  const facts: Fact[] = [
    { term: "Role", value: project.role },
    {
      term: "Year",
      value: <span className="tabular-nums">{project.year}</span>,
    },
    {
      term: "Status",
      value: (
        <>
          {status.label}
          {status.detail && (
            <span className="text-muted"> · {status.detail}</span>
          )}
        </>
      ),
    },
  ];
  if (links.length > 0) {
    facts.push({
      term: "Links",
      value: (
        <span className="flex flex-wrap gap-x-4 gap-y-1">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1"
            >
              {/* the label from site.ts, never the hostname */}
              <span className="u-link">{link.label}</span>
              <span className="arr-out text-muted" aria-hidden="true">
                ↗
              </span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </span>
      ),
    });
  }
  facts.push({
    term: "Reading",
    value: (
      <span className="tabular-nums">
        About {readingMinutes(project)} min read
      </span>
    ),
  });

  return (
    <dl className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 lg:flex lg:flex-wrap lg:gap-x-12">
      {facts.map((fact) => (
        <div key={fact.term} className="min-w-0 lg:max-w-[34ch]">
          <dt className="t-meta">{fact.term}</dt>
          <dd className="t-ui mt-1 text-ink">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
