import Link from "next/link";
import { projects, services } from "@/content/site";
import Reveal from "./Reveal";
import SplitText from "./SplitText";
import BookCallLink from "./BookCallLink";
import WhatsAppLink from "./WhatsAppLink";

/** "TomoDomo — Coliving Operations Platform" reads as "TomoDomo" in a proof line. */
const shortName = (name: string) => name.split(" — ")[0];

/**
 * What a client can actually hire me for. Freelance clients are the audience
 * the site leads with, so the offer is stated plainly — and every service
 * points at the running work that proves it rather than at adjectives.
 */
export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-[1400px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <div className="border-line-soft flex flex-wrap items-end justify-between gap-6 border-b pb-8">
        <div>
          <span className="u-engrave">Services</span>
          <h2 className="u-display text-ink mt-3 text-[clamp(2rem,5.5vw,4rem)]">
            <SplitText text="What I can build for you" />
          </h2>
        </div>
        <p className="text-muted max-w-sm leading-relaxed">
          Four kinds of work, each one backed by projects running in production today.
        </p>
      </div>

      <div className="mt-10 grid gap-px sm:grid-cols-2">
        {services.map((service, index) => (
          <Reveal key={service.title} delay={index * 0.06}>
            <article className="u-panel u-chamfer hover:border-line flex h-full flex-col p-6 transition-colors sm:p-8">
              <span className="u-mono text-signal text-[11px] tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="u-display text-ink mt-6 text-[clamp(1.4rem,2.6vw,2rem)]">
                {service.title}
              </h3>
              <p className="text-muted mt-3 leading-relaxed">{service.body}</p>

              <div className="mt-auto pt-8">
                <span className="u-engrave">Proof</span>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  {service.proof.map((id) => {
                    const project = projects.find((entry) => entry.id === id);
                    if (!project) return null;
                    return (
                      <li key={id}>
                        <Link
                          href={`/work/${id}`}
                          data-cursor={shortName(project.name)}
                          className="u-mono text-muted hover:text-signal group inline-flex items-center gap-1.5 text-[11px] tracking-[0.1em] uppercase transition-colors"
                        >
                          {shortName(project.name)}
                          <span
                            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden
                          >
                            ↗
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
        <BookCallLink primary />
        <WhatsAppLink className="text-muted hover:text-signal" />
        <Link
          href="/contact"
          data-cursor="Start a project"
          className="u-mono text-muted hover:text-signal text-[12px] tracking-[0.12em] uppercase transition-colors"
        >
          Or write it down →
        </Link>
      </div>
    </section>
  );
}
