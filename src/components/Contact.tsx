import { profile } from "@/content/site";
import Reveal from "./Reveal";

export default function Contact() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="border-line-soft u-grain scroll-mt-24 border-t px-5 pt-24 pb-10 sm:px-8 sm:pt-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className={`u-led ${profile.available ? "u-led-live" : ""}`} aria-hidden />
            <span className="u-mono text-muted text-[11px] tracking-[0.14em] uppercase">
              {profile.available ? profile.availableNote : "Not taking work right now"}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="u-display text-ink mt-8 text-[clamp(2.25rem,8vw,6rem)]">
            Let&rsquo;s build
            <br />
            something that lasts.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href={`mailto:${profile.email}`}
            data-cursor="Write to me"
            className="group text-signal mt-10 inline-flex flex-wrap items-center gap-3 text-[clamp(1.1rem,3.4vw,2rem)] break-all"
          >
            <span className="decoration-signal/40 underline-offset-8 group-hover:underline">
              {profile.email}
            </span>
            <span
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            >
              →
            </span>
          </a>
        </Reveal>

        <div className="border-line-soft mt-20 grid gap-8 border-t pt-8 sm:grid-cols-3">
          <div>
            <span className="u-engrave">Elsewhere</span>
            <ul className="mt-3 space-y-1.5">
              {profile.socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener me"
                    data-cursor={social.label}
                    className="text-muted hover:text-ink group inline-flex items-center gap-2 text-sm transition-colors"
                  >
                    {social.label}
                    <span className="u-mono text-dim text-[11px]">{social.handle}</span>
                    <span
                      className="text-dim transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="u-engrave">Based in</span>
            <p className="text-muted mt-3 text-sm">{profile.location}</p>
            <p className="u-mono text-dim mt-1 text-[11px]">UTC+05:00 · works with any timezone</p>
          </div>

          <div className="sm:text-right">
            <span className="u-engrave">Index</span>
            <p className="text-muted mt-3 text-sm">{profile.name}</p>
            <a
              href="#top"
              data-cursor="Top"
              className="u-mono text-dim hover:text-signal mt-3 inline-block text-[11px] tracking-[0.14em] uppercase transition-colors"
            >
              Back to top ↑
            </a>
          </div>
        </div>

        <div className="border-line-soft mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
          <span className="u-mono text-dim text-[10px] tracking-[0.12em] uppercase">
            © {year} {profile.name}
          </span>
          <span className="u-mono text-dim/70 text-[10px] tracking-[0.12em] uppercase">
            Built with Next.js — no template
          </span>
        </div>
      </div>
    </footer>
  );
}
