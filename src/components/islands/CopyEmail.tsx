"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/site";

type Props = {
  /** Defaults to profile.email. */
  email?: string;
  /** Replaces the default pill styling. */
  className?: string;
};

/**
 * Copies the address to the clipboard, for people whose mail client is not
 * the one a mailto: would open.
 *
 * The visible label crossfades "Copy" -> "Copied" for 2s; the accessible name
 * stays "Copy email" throughout and the confirmation is spoken once from a
 * separate polite live region, so a screen reader neither hears a renamed
 * button nor the word twice. data-js-only keeps it off no-script pages and
 * print, where it could not work.
 */
export default function CopyEmail({ email = profile.email, className = "btn btn-ghost t-ui" }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    const ok = await write(email);
    if (!ok) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button type="button" onClick={copy} className={className} data-js-only="">
        <span className="inline-grid">
          <span
            className={`[grid-area:1/1] transition-opacity duration-200 ease-out ${copied ? "opacity-0" : ""}`}
          >
            Copy<span className="sr-only"> email</span>
          </span>
          <span
            aria-hidden="true"
            className={`[grid-area:1/1] transition-opacity duration-200 ease-out ${copied ? "" : "opacity-0"}`}
          >
            Copied
          </span>
        </span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </>
  );
}

/** Clipboard API first; the old selection route for non-secure contexts (a LAN preview). */
async function write(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // select() moves focus into the textarea; hand it back to the button after
    const back = document.activeElement as HTMLElement | null;
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
    document.body.append(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    area.remove();
    back?.focus({ preventScroll: true });
    return ok;
  }
}
