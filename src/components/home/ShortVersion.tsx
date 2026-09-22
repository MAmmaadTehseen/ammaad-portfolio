import type { CSSProperties } from "react";
import Link from "next/link";
import { CHANNELS, about, bio, experience } from "@/content/site";
import Torch from "../islands/Torch";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * "The short version" (DESIGN.md effect #17): the same person told three
 * ways, chosen with native radios, with no script involved in the switch.
 *
 * All three bios are in the HTML, so a crawler and a reader without CSS
 * support see every word. Under html.js with :has() support they share one
 * grid cell and the checked radio decides which is showing (globals.css,
 * inside @supports selector(:has(*))). Anywhere else they stack, each under a
 * small heading naming its reading; where the swap applies that heading is
 * only for screen readers, since the radio above already says it.
 *
 * Client leads with about.lede rather than bio.client.lede, because the hero
 * has just said that sentence in lights. The card carries the torch: on a
 * fine pointer a warm circle follows the hand over the muted body text.
 */
export default function ShortVersion() {
  const now = experience[0];

  return (
    <section aria-labelledby="short-title" className="frame rhythm">
      <div className="short grid gap-10 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-4">
          <h2 id="short-title" className="t-h2" data-reveal="focus">
            The short version
          </h2>

          <fieldset className="mt-8 min-w-0 md:mt-10" data-reveal="fade" style={step(1)}>
            <legend className="t-meta">Read this as a</legend>
            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:gap-x-10 lg:flex-col lg:gap-6">
              {CHANNELS.map((channel) => (
                <label
                  key={channel.id}
                  htmlFor={`r-${channel.id}`}
                  // the hairline is the label's ::before; the grid gives it a
                  // column of its own so the words line up beside it
                  className="choice grid grid-cols-[36px_minmax(0,1fr)] items-center gap-x-3.5 before:mb-0"
                >
                  <input
                    type="radio"
                    name="reading"
                    id={`r-${channel.id}`}
                    value={channel.id}
                    defaultChecked={channel.id === "client"}
                  />
                  <span className="col-start-2 font-display text-[1.625rem] leading-[1.15] font-[350] tracking-[-0.01em]">
                    {channel.label}
                  </span>
                  <span className="col-start-2 mt-1 text-[0.9375rem] leading-[1.45] text-muted">
                    {channel.hint}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div
          className="torch-host relative rounded-card border bg-surface p-6 sm:p-10 lg:col-span-8 lg:p-14"
          data-reveal="rise"
          style={step(2)}
        >
          <div className="bios relative">
            {CHANNELS.map((channel) => (
              <div key={channel.id} className={`bio bio-${channel.id}`}>
                <h3 className="t-meta mb-4 print:not-sr-only supports-[selector(:has(*))]:in-[.js]:sr-only">
                  {channel.label} · {channel.hint}
                </h3>
                <p className="t-voice text-ink">
                  {channel.id === "client" ? about.lede : bio[channel.id].lede}
                </p>
                <p className="t-body mt-6 text-muted">{bio[channel.id].body}</p>
              </div>
            ))}
            <Torch />
          </div>

          <p className="t-meta mt-8 flex flex-wrap items-center gap-x-2.5 gap-y-2">
            <span>
              Currently {now.role} at {now.org}
            </span>
            <span aria-hidden="true">·</span>
            <Link
              href="/about"
              className="group inline-flex items-center gap-1.5 text-ink-2 hover:text-ink"
            >
              <span className="u-link group-hover:[background-size:100%_1px] group-focus-visible:[background-size:100%_1px]">
                More about how I work
              </span>
              <span className="arr" aria-hidden="true">
                →
              </span>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
