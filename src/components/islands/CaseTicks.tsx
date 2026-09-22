"use client";

import { useEffect, useState } from "react";

export type TickSection = { id: string; label: string };

/**
 * The case page's scroll-spy (effect #22): one tick per section that the page
 * actually rendered, in their own gutter from 1360px up so the labels never
 * sit over the text.
 *
 * The links are real anchors, so without JS they still jump (scroll-margin-top
 * clears the header). The observer only decides which one carries
 * aria-current; the tick's growth and colour are CSS on that attribute.
 */
export default function CaseTicks({ sections }: { sections: TickSection[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = sections
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const inBand = new Set<string>();
    // a thin band a little above the middle of the screen: the section
    // crossing it is the one being read
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        }
        const current = targets.find((el) => inBand.has(el.id));
        if (current) {
          setActive(current.id);
          return;
        }
        // between two sections the last one stays marked, but back up in the
        // header nothing is being read yet
        const first = targets[0]!;
        if (first.getBoundingClientRect().top > window.innerHeight * 0.38)
          setActive(null);
      },
      { rootMargin: "-38% 0px -55% 0px" },
    );
    for (const el of targets) observer.observe(el);
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="On this page" className="ticks hidden wide:block">
      <ol className="sticky top-28 space-y-1">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? "true" : undefined}
              className="t-ui flex items-center gap-3 py-1.5 text-[0.9375rem]"
            >
              <span className="tick shrink-0" aria-hidden="true" />
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
