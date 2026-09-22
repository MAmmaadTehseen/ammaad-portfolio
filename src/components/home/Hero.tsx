import type { CSSProperties } from "react";
import Link from "next/link";
import { bio, featured, profile, services } from "@/content/site";
import { brand } from "@/lib/names";
import AvailDot from "../AvailDot";
import BookCallLink from "../BookCallLink";
import EmailLink from "../EmailLink";
import LightUp from "../LightUp";
import Portrait from "../Portrait";
import WhatsAppLink from "../WhatsAppLink";
import LocalTime from "../islands/LocalTime";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/** "Full-stack & AI engineer" continues a sentence, so its first letter drops. */
const lowerFirst = (text: string) =>
  // an acronym ("AI features") keeps its capitals
  /^[A-Z]{2}/.test(text) ? text : text.charAt(0).toLowerCase() + text.slice(1);

/** "I take on SaaS & web apps, AI features & agents, … and rescue & maintenance." */
function servicesSentence(titles: string[]): string {
  const items = titles.map((title, i) => (i === 0 ? title : lowerFirst(title)));
  if (items.length < 2) return `I take on ${items.join("")}.`;
  return `I take on ${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}.`;
}

/** The first sentence of the client bio: the lead under the offer. */
const firstSentence = (text: string) => text.split(/(?<=[.!?])\s+/)[0];

/** "UTC+5", worked out at build time; the same string LocalTime prints before it knows the time. */
function utcOffset(timeZone: string): string | undefined {
  try {
    const part = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" })
      .formatToParts(new Date())
      .find((p) => p.type === "timeZoneName")?.value;
    if (part) return part === "GMT" ? "UTC" : part.replace("GMT", "UTC");
  } catch {
    // an engine without shortOffset: the caption drops the offset
  }
  return undefined;
}

const CITY = profile.location.split(",")[0].trim();
const OFFSET = utcOffset(profile.timezone);

/**
 * Four real, shipped names, derived rather than typed: featured work that is
 * live and has a Live link to prove it. Private work never lands here.
 */
const shipped = featured
  .filter((p) => p.tier === "live" && p.links?.some((link) => link.label === "Live"))
  .slice(0, 4);

/**
 * The first view. In ten seconds a client should have his face, the offer,
 * his name, role and place, four shipped products, the call button and
 * whether he is free, all as server text that needs no script to read.
 *
 * Motion is CSS keyed off classes the pre-paint gate adds, and plays once per
 * session: the offer lights up word by word (LightUp), the lines under it
 * rise in a short cascade (.rise with --i), the portrait's window opens and
 * its sunset spills onto the page. As the hero scrolls away the light sinks
 * with it (view-timeline --hero, html.m.sd only). Reduced motion, a repeat
 * visit and no-JS all get the finished page at first paint.
 */
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="hero flex min-h-[100svh] items-end pt-28 pb-16 md:pt-32 lg:pb-20"
    >
      <div className="frame grid items-end gap-[clamp(32px,5vw,88px)] lg:grid-cols-12">
        <div className="hero-copy lg:col-span-7">
          <h1 id="hero-title">
            <span className="block font-text text-[1.0625rem] leading-[1.4] font-normal tracking-normal text-muted">
              <span className="font-medium text-ink">{profile.name}</span>,{" "}
              {lowerFirst(profile.role)} in {profile.location}
              {/* the two visible parts read as two sentences, not one run-on */}
              <span className="sr-only">.</span>
            </span>{" "}
            <LightUp
              text={bio.client.lede}
              // "actually runs on." is the promise, so it is the part in glow
              accentFrom={-3}
              className="t-hero mt-4 block text-ink md:mt-5"
            />
          </h1>

          <p
            className="rise mt-7 max-w-[52ch] text-[1.0625rem] leading-[1.55] text-ink"
            style={step(0)}
          >
            {servicesSentence(services.map((service) => service.title))}
          </p>

          <p className="rise t-lead mt-4" style={step(1)}>
            {firstSentence(bio.client.body)}
          </p>

          {/* phones: the call is a full-width 52px bar, the other two share a row */}
          <div className="rise mt-9 flex flex-wrap gap-3" style={step(2)}>
            <BookCallLink className="min-h-[52px] basis-full sm:min-h-11 sm:basis-auto" />
            <WhatsAppLink className="flex-1 sm:flex-none" />
            <EmailLink variant="ghost" className="flex-1 sm:flex-none" />
          </div>

          <p
            className="rise t-meta mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-1"
            style={step(3)}
          >
            {profile.available && (
              <>
                <AvailDot breathe className="mr-1" />
                <span>{profile.availableNote}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <LocalTime variant="sentence" />
          </p>

          {shipped.length > 0 && (
            <p className="rise t-meta mt-3" style={step(4)}>
              Recently shipped:{" "}
              {shipped.map((project, i) => (
                <span key={project.id}>
                  {i > 0 && ", "}
                  <Link
                    href={`/work/${project.id}`}
                    // the underline is always drawn: colour alone would not
                    // tell a link from the muted text around it
                    className="text-ink-2 underline decoration-line-strong underline-offset-[5px] transition-colors duration-300 hover:text-ink hover:decoration-glow"
                  >
                    {brand(project.name)}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </div>

        <div className="flex justify-start lg:col-span-5 lg:justify-end">
          <Portrait
            variant="hero"
            caption={
              <span className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                <span>{profile.discipline}</span>
                <span className="sr-only">, </span>
                <span>{OFFSET ? `${CITY}, ${OFFSET}` : CITY}</span>
              </span>
            }
          />
        </div>
      </div>
    </section>
  );
}
