"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/site";

const CITY = profile.location.split(",")[0].trim();

/** "UTC+5" for Asia/Karachi. Same answer on the server and the client, so it is safe in the first render. */
function utcOffset(timeZone: string) {
  try {
    const part = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" })
      .formatToParts(new Date())
      .find((p) => p.type === "timeZoneName")?.value;
    // "GMT+5" -> "UTC+5"; a bare "GMT" is UTC itself
    if (part) return part === "GMT" ? "UTC" : part.replace("GMT", "UTC");
  } catch {
    // an engine without shortOffset falls through to the plain city
  }
  return null;
}

const OFFSET = utcOffset(profile.timezone);
const FALLBACK = OFFSET ? `${CITY} (${OFFSET})` : CITY;

const clock = (timeZone?: string) =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone });

type Props = {
  /** short: "18:42 in Lahore" (nav). sentence: adds ", 14:42 where you are" when the visitor's clock differs. */
  variant: "short" | "sentence";
  /** Keep "(UTC+5)" after the city once the time is known, as the contact page does. */
  showOffset?: boolean;
  className?: string;
};

/**
 * Ammaad's local time, and the visitor's when it differs.
 *
 * The server cannot know either clock at request time without making the page
 * dynamic, so it prints "Lahore (UTC+5)", which is true forever, and the
 * client fills in the time after hydration. It ticks every 30s, but only while
 * the tab is visible. Width is reserved in ch with tabular figures so the
 * swap and each tick leave the line where it was.
 */
export default function LocalTime({ variant, showOffset = false, className }: Props) {
  const [now, setNow] = useState<{ there: string; here: string } | null>(null);

  useEffect(() => {
    let there: Intl.DateTimeFormat;
    let here: Intl.DateTimeFormat;
    try {
      there = clock(profile.timezone);
      here = clock();
    } catch {
      return; // keep the static fallback
    }

    const update = () => {
      const date = new Date();
      setNow({ there: there.format(date), here: here.format(date) });
    };

    let timer = 0;
    const sync = () => {
      window.clearInterval(timer);
      timer = 0;
      if (document.visibilityState !== "visible") return;
      update();
      timer = window.setInterval(update, 30_000);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      window.clearInterval(timer);
    };
  }, []);

  const place = showOffset && OFFSET ? `${CITY} (${OFFSET})` : CITY;
  // Room for the longer of the fallback and "18:42 in <place>" (5 + 4 chars).
  const reserve = Math.max(FALLBACK.length, 9 + place.length);
  // Same wall clock means same offset right now; only then is "where you are" noise.
  const differs = now !== null && now.here !== now.there;

  // The reserve sits on the outer box, so any slack trails the text instead of
  // opening a gap before ", 14:42 where you are".
  return (
    <span
      className={["inline-block tabular-nums", className].filter(Boolean).join(" ")}
      style={{ minWidth: `${reserve}ch` }}
    >
      {now ? `${now.there} in ${place}` : FALLBACK}
      {variant === "sentence" && differs ? `, ${now.here} where you are` : null}
    </span>
  );
}
