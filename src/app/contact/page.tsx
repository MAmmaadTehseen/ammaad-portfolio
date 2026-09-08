import type { Metadata } from "next";
import Link from "next/link";
import { contact, profile } from "@/content/site";
import Reveal from "@/components/Reveal";
import SplitText from "@/components/SplitText";
import EmailLink from "@/components/EmailLink";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Muhammad Ammaad Tehseen — full-stack engineer in Lahore, Pakistan. Open to contract and full-time work, remote, any timezone.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: `${profile.site}/contact`,
    title: `Contact — ${profile.short} Tehseen`,
    description: contact.lede,
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[900px] px-5 pt-32 pb-24 sm:px-8 sm:pt-40">
      <header>
        <div className="flex items-center gap-3">
          <span className={`u-led ${profile.available ? "u-led-live" : ""}`} aria-hidden />
          <span className="u-mono text-muted text-[11px] tracking-[0.14em] uppercase">
            {profile.available ? profile.availableNote : "Not taking work right now"}
          </span>
        </div>

        <h1 className="u-display text-ink mt-6 text-[clamp(2rem,6.5vw,4rem)]">
          <SplitText text={contact.lede} />
        </h1>

        <p className="text-muted u-prose mt-6 text-lg">{contact.body}</p>

        <EmailLink />
      </header>

      <div className="mt-16 grid gap-px sm:grid-cols-2">
        <Reveal>
          <section className="u-panel u-chamfer h-full p-6">
            <h2 className="u-mono text-ink text-[11px] tracking-[0.14em] uppercase">
              What helps me answer well
            </h2>
            <ul className="mt-5 space-y-3">
              {contact.helpful.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="bg-primary/70 mt-2 h-1 w-1 shrink-0 rotate-45" aria-hidden />
                  <span className="text-muted text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal delay={0.06}>
          <section className="u-panel u-chamfer h-full p-6">
            <h2 className="u-mono text-ink text-[11px] tracking-[0.14em] uppercase">
              Straight answers
            </h2>
            <ul className="mt-5 space-y-3">
              {contact.honest.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="bg-signal/80 mt-2 h-1 w-1 shrink-0 rotate-45" aria-hidden />
                  <span className="text-muted text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      </div>

      <section className="mt-16">
        <h2 className="u-display text-ink text-[clamp(1.4rem,3.4vw,2rem)]">Elsewhere</h2>
        <ul className="border-line-soft mt-6 border-t">
          {profile.socials.map((social) => (
            <li key={social.href} className="border-line-soft border-b">
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer noopener me"
                data-cursor={social.label}
                className="group flex items-baseline justify-between gap-4 py-5"
              >
                <span className="u-display text-muted group-hover:text-ink text-xl transition-colors">
                  {social.label}
                </span>
                <span className="u-mono text-dim flex items-center gap-3 text-xs">
                  {social.handle}
                  <span
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  >
                    ↗
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-line-soft mt-16 grid gap-6 border-t pt-8 sm:grid-cols-3">
        <div>
          <span className="u-engrave">Based in</span>
          <p className="text-muted mt-2 text-sm">{profile.location}</p>
          <p className="u-mono text-dim mt-1 text-[11px]">UTC+05:00 · works with any timezone</p>
        </div>
        <div>
          <span className="u-engrave">Open to</span>
          <p className="text-muted mt-2 text-sm">Contract and full-time, remote</p>
        </div>
        <div>
          <span className="u-engrave">Read first</span>
          <p className="mt-2 text-sm">
            <Link href="/work" className="text-signal hover:underline" data-cursor="Work">
              The work →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
