import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { profile, projects } from "@/content/site";
import CaseHeader from "@/components/case/CaseHeader";
import CaseSheet from "@/components/case/CaseSheet";

/** Every project is known at build time, so nothing here is ever dynamic. */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

/** The X handle, from the socials rather than a second copy of it. */
const X_HANDLE = profile.socials.find((social) => social.label === "X")?.handle;

/** Four digits at the start of a year string ("2025", "2026 — now"). */
function yearCreated(year: string): string | undefined {
  return /^\d{4}/.exec(year)?.[0];
}

/**
 * Links that name the work itself: the running product or its public repo.
 * Anything else (an internal app on a vendor's test host) stays a link on the
 * page but is kept out of sameAs, where it would claim to be the work.
 */
const IDENTITY_LINKS = new Set(["Live", "Source"]);

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
    // A page-level twitter object replaces the layout's whole, so the creator
    // is restated here. images is left unset on purpose: Next fills
    // twitter:image from this segment's opengraph-image, whatever URL that
    // file ends up generating.
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(X_HANDLE ? { creator: X_HANDLE } : {}),
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((entry) => entry.id === slug);
  const project = projects[index];
  if (!project) notFound();

  // wraps at both ends, so every case page has somewhere to go either way and
  // every project is one hop from its neighbours
  const previous = projects[(index - 1 + projects.length) % projects.length]!;
  const next = projects[(index + 1) % projects.length]!;
  const url = `${profile.site}/work/${project.id}`;
  const sameAs = (project.links ?? [])
    .filter((link) => IDENTITY_LINKS.has(link.label))
    .map((link) => link.href);
  const created = yearCreated(project.year);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name: project.name,
        headline: project.name,
        description: project.lede.recruiter,
        abstract: project.lede.client,
        keywords: project.stack.join(", "),
        ...(created ? { dateCreated: created } : {}),
        url,
        creator: { "@id": `${profile.site}/#person` },
        author: { "@id": `${profile.site}/#person` },
        isPartOf: { "@id": `${profile.site}/#website` },
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: profile.site,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Work",
            item: `${profile.site}/work`,
          },
          { "@type": "ListItem", position: 3, name: project.name, item: url },
        ],
      },
    ],
  };

  return (
    // relative: the poster's clip wrapper spans exactly this article
    <article className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <CaseHeader project={project} />
      <CaseSheet project={project} previous={previous} next={next} />
    </article>
  );
}
