import type { Metadata } from "next";
import Link from "next/link";
import { TIERS, profile, projects } from "@/content/site";
import type { Tier } from "@/content/site";
import Reveal from "@/components/Reveal";
import SplitText from "@/components/SplitText";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Nine builds by Muhammad Ammaad Tehseen — AI platforms, billing lifecycles, real-time systems and internal tooling, in TypeScript, Node.js, Next.js, Prisma and PostgreSQL.",
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    url: `${profile.site}/work`,
    title: `Work — ${profile.short} Tehseen`,
    description: "Nine builds, disclosed at three depths: open source, live in production, or architecture only.",
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
          Nine builds, disclosed at three depths. What you can see of each one depends on
          whether the source is mine to show.
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

      <ul className="border-line-soft mt-2 border-t">
        {projects.map((project, index) => (
          <li key={project.id} className="border-line-soft border-b">
            <Reveal delay={Math.min(index, 6) * 0.04}>
              <Link
                href={`/work/${project.id}`}
                data-cursor={project.name}
                className="group grid items-baseline gap-x-6 gap-y-3 py-8 sm:grid-cols-[auto_minmax(0,1fr)_auto] lg:py-10"
              >
                <span className="u-mono text-dim group-hover:text-signal text-[11px] transition-colors">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <h2 className="u-display text-muted group-hover:text-ink text-[clamp(1.35rem,3.6vw,2.3rem)] transition-colors">
                    {project.name}
                  </h2>
                  <p className="text-dim u-prose mt-2 text-sm">{project.lede.recruiter}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 7).map((tech) => (
                      <li
                        key={tech}
                        className="u-mono border-line-soft text-dim border px-2 py-0.5 text-[10px] tracking-[0.06em]"
                      >
                        {tech}
                      </li>
                    ))}
                    {project.stack.length > 7 && (
                      <li className="u-mono text-dim px-2 py-0.5 text-[10px]">
                        +{project.stack.length - 7}
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${TIER_DOT[project.tier]}`}
                      aria-hidden
                    />
                    <span className="u-mono text-dim text-[10px] tracking-[0.14em] uppercase">
                      {TIERS[project.tier].label}
                    </span>
                  </span>
                  <span className="u-mono text-dim text-[10px] tracking-[0.14em] uppercase">
                    {project.year}
                  </span>
                  <span
                    className="text-dim group-hover:text-signal ml-auto transition-all duration-200 group-hover:translate-x-0.5 sm:ml-0"
                    aria-hidden
                  >
                    ↗
                  </span>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>

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
