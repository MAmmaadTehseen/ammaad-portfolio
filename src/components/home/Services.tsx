import type { CSSProperties } from "react";
import Link from "next/link";
import { projects, services, type Project } from "@/content/site";
import { brand } from "@/lib/names";
import BookCallLink from "../BookCallLink";
import WhatsAppLink from "../WhatsAppLink";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

const byId = new Map(projects.map((project) => [project.id, project]));

/**
 * What a client can hire him for. Services come before work, because the
 * reader arrives with a problem, not a curiosity about projects.
 *
 * Four plain rows split 5/7 between hairlines: no cards, icons or numbers.
 * Each ends on the work that proves it, by brand name, so the claim is one
 * click from the evidence. The rows are a focus-dimming list: hovering or
 * focusing one dims its siblings to --dim (a colour, never opacity) and eases
 * its title 10px in.
 */
export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="frame rhythm">
      <h2 id="services-title" className="t-h2" data-reveal="focus">
        What I can build for you
      </h2>
      <p className="t-lead mt-5" data-reveal="fade" style={step(1)}>
        Each one points at the work that proves it.
      </p>

      <ul role="list" className="list mt-12 border-t md:mt-16">
        {services.map((service, i) => {
          const proof = service.proof
            .map((id) => byId.get(id))
            .filter((project): project is Project => project !== undefined);

          return (
            <li
              key={service.title}
              className="row grid gap-x-10 gap-y-4 border-b py-8 md:py-10 lg:grid-cols-12"
              data-reveal="rise"
              style={step(i)}
            >
              <h3 className="name t-h3 font-[350] lg:col-span-5">{service.title}</h3>
              <div className="lg:col-span-7">
                <p className="t-body">{service.body}</p>
                {proof.length > 0 && (
                  <p className="meta t-meta mt-4">
                    Proof:{" "}
                    {proof.map((project, j) => (
                      <span key={project.id}>
                        {j > 0 && <span aria-hidden="true"> · </span>}
                        {j > 0 && <span className="sr-only">, </span>}
                        <Link
                          href={`/work/${project.id}`}
                          className="text-ink-2 underline decoration-line-strong underline-offset-[5px] transition-colors duration-300 hover:text-ink hover:decoration-glow"
                        >
                          {brand(project.name)}
                        </Link>
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div
        className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4"
        data-reveal="rise"
        style={step(1)}
      >
        <p className="t-ui text-[1.0625rem] text-ink-2">Not sure which of these it is?</p>
        <div className="flex flex-wrap items-center gap-3">
          <BookCallLink>Book a call</BookCallLink>
          <WhatsAppLink />
          {/* the underline sits on the label so the arrow is not underlined too */}
          <Link href="/contact" className="group btn t-ui text-ink-2 hover:text-ink">
            <span className="u-link group-hover:[background-size:100%_1px] group-focus-visible:[background-size:100%_1px]">
              Or write it down
            </span>
            <span className="arr" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
