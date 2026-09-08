"use client";

import { useInView } from "@/lib/useInView";

/**
 * The capability band. One CSS animation on a duplicated track — no JS, no
 * layout thrash, and reduced-motion users get a static, scrollable strip.
 */
export default function Marquee({ items, seconds = 46 }: { items: string[]; seconds?: number }) {
  const track = [...items, ...items];
  // a wide promoted layer scrolling forever, even when it is nowhere near screen
  const [ref, inView] = useInView<HTMLDivElement>("100px");

  return (
    <div ref={ref} className="border-line-soft relative overflow-hidden border-y py-5">
      {/* edges fade into the page rather than being cut by a hard border */}
      <div className="from-bg pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r to-transparent" />
      <div className="from-bg pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l to-transparent" />

      <div
        className="flex w-max items-center gap-10 will-change-transform motion-reduce:animate-none"
        style={{
          animation: `marquee-track ${seconds}s linear infinite`,
          animationPlayState: inView ? "running" : "paused",
        }}
      >
        {track.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-10">
            <span className="text-muted text-lg whitespace-nowrap sm:text-xl">{item}</span>
            <span className="bg-signal/70 h-1 w-1 shrink-0 rotate-45" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
