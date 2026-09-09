import type { Metadata } from "next";
import Link from "next/link";
import { TIERS, profile, projects } from "@/content/site";
import type { Tier } from "@/content/site";
import SplitText from "@/components/SplitText";
import Systems from "@/components/Systems";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Client platforms and personal builds by Muhammad Ammaad Tehseen — coliving operations, AI lead conversion, an AI-augmented LMS, workflow automation and a Swiss business marketplace.",
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
          {projects.length} builds, disclosed at three depths. What you can see of each one
          depends on whether the source is mine to show.
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
      <Systems heading={false} />

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
