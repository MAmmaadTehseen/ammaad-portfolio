import type { Metadata } from "next";
import Link from "next/link";
import { TIERS, alsoBuilt, profile, projects, shortEntries, showcase } from "@/content/site";
import type { Tier } from "@/content/site";
import SplitText from "@/components/SplitText";
import Systems from "@/components/Systems";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Client platforms and products by Muhammad Ammaad Tehseen — oncology trial matching, live virtual tours, AI pricing reports, coliving operations, AI lead conversion, meeting automation and more.",
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    url: `${profile.site}/work`,
    title: `Work — ${profile.short} Tehseen`,
    description: `${projects.length} builds, disclosed at three depths: open source, live in production, or architecture only.`,
  },
};

const TIER_DOT: Record<Tier, string> = {
  live: "bg-primary",
  open: "bg-muted",
  closed: "bg-signal",
};

export default function WorkIndex() {
  const byTier = (tier: Tier) => projects.filter((project) => project.tier === tier).length;

  return (
    <div className="mx-auto max-w-[1400px] px-5 pt-32 pb-24 sm:px-8 sm:pt-40">
      <header className="border-line-soft border-b pb-8">
        <h1 className="u-display text-ink text-[clamp(2.5rem,8vw,5.5rem)]">
          <SplitText text="Work" />
        </h1>
        <p className="text-muted u-prose mt-5 text-lg">
          {projects.length} builds. The {showcase.length} below get the full treatment; smaller
          ones follow. What you can see of each depends on whether the source is mine to show.
        </p>

        {/* the tier system is the organising idea, so it is stated up front */}
        <dl className="mt-8 grid gap-px sm:grid-cols-3">
          {(Object.keys(TIERS) as Tier[]).map((tier) => (
            <div key={tier} className="u-panel u-chamfer p-4">
              <dt className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${TIER_DOT[tier]}`} aria-hidden />
                <span className="u-mono text-ink text-[11px] tracking-[0.14em] uppercase">
                  {TIERS[tier].label}
                </span>
                <span className="u-mono text-dim ml-auto text-[11px] tabular-nums">
                  {String(byTier(tier)).padStart(2, "0")}
                </span>
              </dt>
              <dd className="text-muted mt-2 text-sm">{TIERS[tier].note}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* the deep index: scroll-driven, and it retunes to the channel chosen
          on the home page because that choice is persisted */}
      <Systems projects={showcase} heading={false} />

      {/* smaller builds still get a page each, but a card rather than a row */}
      <section className="mt-24" aria-labelledby="smaller-builds">
        <div className="border-line-soft flex flex-wrap items-end justify-between gap-4 border-b pb-6">
          <h2 id="smaller-builds" className="u-display text-ink text-[clamp(1.6rem,4vw,2.6rem)]">
            Smaller builds
          </h2>
          <p className="u-mono text-dim text-[11px]">Personal tools and shorter engagements</p>
        </div>
        <div className="mt-8 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
          {shortEntries.map((project) => (
            <Link
              key={project.id}
              href={`/work/${project.id}`}
              data-cursor={project.name}
              className="group u-panel u-chamfer hover:border-line flex min-w-0 flex-col p-5 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${TIER_DOT[project.tier]}`} aria-hidden />
                  <span className="u-mono text-dim text-[10px] tracking-[0.14em] uppercase">
                    {TIERS[project.tier].label}
                  </span>
                </span>
                <span className="u-mono text-dim text-[10px] tracking-[0.14em]">{project.year}</span>
              </div>
              <h3 className="u-display text-muted group-hover:text-ink mt-5 text-lg transition-colors">
                {project.name}
              </h3>
              <p className="text-dim mt-2 text-sm leading-relaxed">{project.lede.client}</p>
              <span className="u-mono text-dim group-hover:text-signal mt-auto pt-5 text-[11px] tracking-[0.14em] uppercase transition-colors">
                Open ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* real work, but too small or too private for a page of its own */}
      <section className="mt-20" aria-labelledby="also-built">
        <h2 id="also-built" className="u-engrave">
          Also built
        </h2>
        <ul className="border-line-soft mt-4 border-t">
          {alsoBuilt.map((item) => (
            <li
              key={item.name}
              className="border-line-soft flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b py-4"
            >
              <span className="text-ink">{item.name}</span>
              <span className="text-dim text-sm">{item.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-dim mt-10 text-sm">
        Closed work has no screenshots on purpose. Open the project and you get the
        architecture instead —{" "}
        <Link href="/contact" className="text-signal hover:underline">
          ask me to walk through any of it
        </Link>
        .
      </p>
    </div>
  );
}
