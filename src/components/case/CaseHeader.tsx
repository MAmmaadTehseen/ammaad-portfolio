import Link from "next/link";
import type { Project } from "@/content/site";
import BookCallLink from "@/components/BookCallLink";
import FlowDiagram from "@/components/FlowDiagram";
import LightUp from "@/components/LightUp";
import { brand, descriptor } from "@/lib/names";

/** Past this many characters a brand takes the smaller page-title clamp. */
const LONG_NAME = 18;

/**
 * The first view of a case page: the project's silhouette lit behind it, and
 * the name, what it is and what it did for the business in front.
 *
 * The poster (effect #21) is fixed from 1024px up so the sheet can slide over
 * it. Its wrapper spans the whole <article> and clips with clip-path, which,
 * unlike overflow, also clips a fixed descendant: whatever happens to the
 * sentinel, the poster can never show through the closing room or the footer
 * after the article. Its left side is masked out in CSS, so it never sits
 * behind the h1. A project without a flow gets the horizon glow instead.
 */
export default function CaseHeader({
  project,
}: {
  project: Pick<Project, "id" | "name" | "flow" | "lede" | "links">;
}) {
  const name = brand(project.name);
  const what = descriptor(project.name);
  const links = project.links ?? [];

  return (
    <>
      {project.flow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [clip-path:inset(0)]"
        >
          {/* below 1024px it scrolls with the page, so it waits up in the
              top-right corner, clear of the text, rather than mid-screen */}
          <div className="case-poster max-lg:items-start max-lg:pt-[72px]">
            <FlowDiagram
              project={project}
              mode="poster"
              className="max-lg:w-[min(64vw,440px)]"
            />
          </div>
        </div>
      )}

      <header className="case-header">
        {!project.flow && (
          // lifted by the sheet's overlap from 1024px, so the light rises
          // off the sheet's edge instead of hiding under it
          <div aria-hidden="true" className="horizon-glow lg:bottom-[12svh]" />
        )}

        <div className="frame flex min-h-[88svh] flex-col justify-end pt-44 pb-16 md:pt-56 lg:pt-36 lg:pb-[calc(12svh+4.5rem)]">
          <nav aria-label="Breadcrumb">
            <ol className="t-meta flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="u-link hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/work" className="u-link hover:text-ink">
                  Work
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page" className="text-ink-2">
                  {name}
                </span>
              </li>
            </ol>
          </nav>

          <LightUp
            as="h1"
            text={name}
            step={50}
            className={`${name.length > LONG_NAME ? "t-page-long" : "t-page"} mt-6 max-w-[18ch]`}
          />
          {what && (
            <p className="t-voice mt-4 max-w-[30ch] text-muted">{what}</p>
          )}

          <p className="t-voice mt-8 max-w-[40ch] text-ink-2">
            {project.lede.client}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
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
            <BookCallLink>Book a call about something similar</BookCallLink>
          </div>
        </div>
      </header>
    </>
  );
}
