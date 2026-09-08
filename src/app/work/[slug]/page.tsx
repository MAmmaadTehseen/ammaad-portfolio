import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CHANNELS, TIERS, profile, projects } from "@/content/site";
import type { Channel, Tier } from "@/content/site";
import FlowDiagram from "@/components/FlowDiagram";
import Reveal from "@/components/Reveal";
import SplitText from "@/components/SplitText";

/** Every project is known at build time, so nothing here is ever dynamic. */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((entry) => entry.id === slug);
  if (!project) return {};

  // the root layout appends "— Ammaad Tehseen" via its title template, so the
  // page title here is the bare project name; the social titles are not
  // templated, so they carry the full string themselves
  const title = `${project.name} — ${profile.short} Tehseen`;
  const description = `${project.lede.recruiter} Built with ${project.stack.slice(0, 6).join(", ")}.`;

  return {
    title: project.name,
    description,
    alternates: { canonical: `/work/${project.id}` },
    openGraph: {
      type: "article",
      url: `${profile.site}/work/${project.id}`,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const TIER_DOT: Record<Tier, string> = {
  live: "bg-primary",
  open: "bg-muted",
  closed: "bg-signal",
};

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((entry) => entry.id === slug);
  const project = projects[index];
  if (!project) notFound();

  const previous = projects[index - 1];
  const next = projects[index + 1];
  const url = `${profile.site}/work/${project.id}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name: project.name,
        headline: project.name,
        description: project.lede.recruiter,
        keywords: project.stack.join(", "),
        dateCreated: project.year,
        url,
        creator: { "@id": `${profile.site}/#person` },
        author: { "@id": `${profile.site}/#person` },
        ...(project.links?.[0] ? { sameAs: project.links.map((link) => link.href) } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: profile.site },
          { "@type": "ListItem", position: 2, name: "Work", item: `${profile.site}/#work` },
          { "@type": "ListItem", position: 3, name: project.name, item: url },
        ],
      },
    ],
  };

  return (
    <article className="mx-auto max-w-[1100px] px-5 pt-32 pb-24 sm:px-8 sm:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <nav aria-label="Breadcrumb" className="mb-10">
        <ol className="u-mono text-dim flex flex-wrap items-center gap-2 text-[11px] tracking-[0.12em] uppercase">
          <li>
            <Link href="/" className="hover:text-signal transition-colors" data-cursor="Home">
              {profile.short}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/#work" className="hover:text-signal transition-colors" data-cursor="All work">
              Work
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-muted">{String(index + 1).padStart(2, "0")}</li>
        </ol>
      </nav>

      <header className="border-line-soft border-b pb-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2" title={TIERS[project.tier].note}>
            <span className={`h-1.5 w-1.5 rounded-full ${TIER_DOT[project.tier]}`} aria-hidden />
            <span className="u-mono text-dim text-[10px] tracking-[0.14em] uppercase">
              {TIERS[project.tier].label} — {TIERS[project.tier].note}
            </span>
          </span>
          <span className="u-mono text-dim text-[10px] tracking-[0.14em] uppercase">
            {project.year}
          </span>
        </div>

        <h1 className="u-display text-ink text-[clamp(2rem,6.5vw,4.5rem)]">
          <SplitText text={project.name} />
        </h1>
        <p className="u-mono text-primary mt-4 text-xs tracking-[0.1em]">{project.role}</p>
      </header>

      {/*
        The home page shows one reading at a time because that is the idea.
        A project's own page is where all three belong: it is the fullest
        description of the work that exists, for a reader and for a crawler.
      */}
      <section className="mt-14">
        <span className="u-engrave">Three readings</span>
        <dl className="mt-6 grid gap-px sm:grid-cols-3">
          {CHANNELS.map((option) => (
            <div key={option.id} className="u-panel u-chamfer h-full p-5">
              <dt className="u-mono text-ink text-[11px] tracking-[0.14em] uppercase">
                {option.label}
              </dt>
              <dd className="text-muted mt-3 text-sm leading-relaxed">
                {project.lede[option.id as Channel]}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {project.outcomes && project.outcomes.length > 0 && (
        <Reveal>
          <section className="mt-16">
            <h2 className="u-display text-ink text-[clamp(1.4rem,3vw,2rem)]">What it does</h2>
            <ul className="border-line-soft mt-6 border-t">
              {project.outcomes.map((entry) => (
                <li key={entry} className="border-line-soft flex gap-4 border-b py-4">
                  <span className="bg-primary/70 mt-2.5 h-1 w-1 shrink-0 rotate-45" aria-hidden />
                  <span className="text-muted leading-relaxed">{entry}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      {project.internals && project.internals.length > 0 && (
        <Reveal>
          <section className="mt-16">
            <h2 className="u-display text-ink text-[clamp(1.4rem,3vw,2rem)]">Under the hood</h2>
            <ul className="border-line-soft mt-6 border-t">
              {project.internals.map((entry) => (
                <li key={entry} className="border-line-soft flex gap-4 border-b py-4">
                  <span className="bg-signal/80 mt-2.5 h-1 w-1 shrink-0 rotate-45" aria-hidden />
                  <span className="text-muted leading-relaxed">{entry}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      <Reveal>
        <section className="mt-16">
          <h2 className="u-display text-ink text-[clamp(1.4rem,3vw,2rem)]">Built with</h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((entry) => (
              <li
                key={entry}
                className="u-mono border-line-soft bg-surface-2 text-muted border px-3 py-1.5 text-[11px] tracking-[0.06em]"
              >
                {entry}
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {project.flow && (
        <Reveal>
          <section className="mt-16">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="u-display text-ink text-[clamp(1.4rem,3vw,2rem)]">Signal path</h2>
              <span className="u-mono text-dim text-[11px]">
                {project.tier === "closed"
                  ? "source private — architecture only"
                  : "architecture"}
              </span>
            </div>
            <div className="u-panel u-chamfer p-5 sm:p-7">
              <FlowDiagram nodes={project.flow.nodes} edges={project.flow.edges} />
            </div>
          </section>
        </Reveal>
      )}

      <Reveal>
        <section className="border-line-soft mt-16 border-t pt-8">
          {project.links && project.links.length > 0 ? (
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor={link.label}
                  className="u-mono text-ink hover:text-signal group inline-flex items-center gap-2 text-xs tracking-[0.12em] uppercase transition-colors"
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
          ) : (
            <p className="u-mono text-dim text-[11px] leading-relaxed">
              Source is private. Happy to walk through the architecture on a call —{" "}
              <a href={`mailto:${profile.email}`} className="text-signal hover:underline">
                {profile.email}
              </a>
            </p>
          )}
        </section>
      </Reveal>

      {/* internal links, so every project is one hop from every other */}
      <nav className="border-line-soft mt-16 grid gap-px border-t pt-8 sm:grid-cols-2">
        {previous ? (
          <Link
            href={`/work/${previous.id}`}
            data-cursor={previous.name}
            className="group u-panel u-chamfer p-5 transition-colors hover:border-line"
          >
            <span className="u-engrave">Previous</span>
            <span className="u-display text-muted group-hover:text-ink mt-2 block text-lg transition-colors">
              {previous.name}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/work/${next.id}`}
            data-cursor={next.name}
            className="group u-panel u-chamfer p-5 text-right transition-colors hover:border-line"
          >
            <span className="u-engrave">Next</span>
            <span className="u-display text-muted group-hover:text-ink mt-2 block text-lg transition-colors">
              {next.name}
            </span>
          </Link>
        )}
      </nav>

      <div className="mt-10">
        <Link
          href="/#work"
          data-cursor="All work"
          className="u-mono text-dim hover:text-signal text-[11px] tracking-[0.14em] uppercase transition-colors"
        >
          ← All work
        </Link>
      </div>
    </article>
  );
}
