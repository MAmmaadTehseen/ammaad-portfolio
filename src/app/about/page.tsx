import type { Metadata } from "next";
import Link from "next/link";
import { about, profile, stackGroups } from "@/content/site";
import Reveal from "@/components/Reveal";
import SplitText from "@/components/SplitText";

export const metadata: Metadata = {
  title: "About",
  description:
    "Muhammad Ammaad Tehseen — full-stack engineer in Lahore, Pakistan. How I work: the boring layers on purpose, instrument it before you need it, and production is not a staging environment.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: `${profile.site}/about`,
    title: `About — ${profile.short} Tehseen`,
    description: about.lede,
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[900px] px-5 pt-32 pb-24 sm:px-8 sm:pt-40">
      <header>
        <span className="u-engrave">{profile.location} · UTC+05:00</span>
        <h1 className="u-display text-ink mt-4 text-[clamp(2rem,6vw,3.6rem)]">
          <SplitText text={about.lede} />
        </h1>
      </header>

      <div className="border-line-soft mt-10 border-t pt-10">
        {about.body.map((paragraph, index) => (
          <Reveal key={paragraph} delay={index * 0.05}>
            <p className="text-muted u-prose mt-0 mb-6 text-lg leading-relaxed">{paragraph}</p>
          </Reveal>
        ))}
      </div>

      {/* three named positions rather than a list of adjectives */}
      <section className="mt-16">
        <h2 className="u-display text-ink text-[clamp(1.4rem,3.4vw,2rem)]">How I work</h2>
        <div className="mt-8 grid gap-px">
          {about.approach.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <div className="u-panel u-chamfer grid gap-2 p-6 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] sm:gap-8">
                <h3 className="u-display text-ink text-lg">{item.title}</h3>
                <p className="text-muted text-[15px] leading-relaxed">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="u-display text-ink text-[clamp(1.4rem,3.4vw,2rem)]">What I am doing now</h2>
        <ul className="border-line-soft mt-6 border-t">
          {about.now.map((item) => (
            <li key={item} className="border-line-soft flex gap-4 border-b py-4">
              <span className="bg-signal/80 mt-2.5 h-1 w-1 shrink-0 rotate-45" aria-hidden />
              <span className="text-muted leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="u-display text-ink text-[clamp(1.4rem,3.4vw,2rem)]">Tools</h2>
          <p className="u-mono text-dim text-[11px]">Grouped by how often they are in my hands</p>
        </div>
        <div className="mt-8 grid gap-px sm:grid-cols-3">
          {stackGroups.map((group, index) => (
            <Reveal key={group.label} delay={index * 0.06}>
              <div className="u-panel u-chamfer h-full p-5">
                <h3 className="u-mono text-ink text-[11px] tracking-[0.14em] uppercase">
                  {group.label}
                </h3>
                <p className="text-dim mt-1.5 text-xs">{group.note}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="u-mono border-line-soft bg-surface-2 text-muted border px-2 py-1 text-[10px]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <nav className="border-line-soft mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t pt-8">
        <Link
          href="/work"
          data-cursor="Work"
          className="u-mono text-ink hover:text-signal text-[11px] tracking-[0.14em] uppercase transition-colors"
        >
          See the work →
        </Link>
        <Link
          href="/contact"
          data-cursor="Contact"
          className="u-mono text-dim hover:text-signal text-[11px] tracking-[0.14em] uppercase transition-colors"
        >
          Get in touch →
        </Link>
      </nav>
    </div>
  );
}
