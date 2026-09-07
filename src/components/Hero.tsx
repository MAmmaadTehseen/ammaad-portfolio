"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import SignalCanvas from "./SignalCanvas";
import { profile } from "@/content/site";
import { useBootReady } from "@/lib/useBootReady";

export default function Hero() {
  const ready = useBootReady();
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });
  // the trace sinks slower than the type, so the panel feels like it has depth
  const traceY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const typeY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const letters = profile.display.split("");
  const animate = reduced || ready;

  return (
    <section
      ref={section}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-24 pb-8"
    >
      <motion.div
        data-motion
        className="pointer-events-none absolute inset-0"
        style={{ y: traceY, opacity: fade }}
      >
        <SignalCanvas className="h-full w-full" />
      </motion.div>

      {/* scrim: guarantees the type reads no matter what the trace is doing */}
      <div
        aria-hidden
        className="from-bg via-bg/85 pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t to-transparent"
      />

      {/* faint measurement grid — the panel this instrument is printed on */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-line-soft) 1px, transparent 1px)",
          backgroundSize: "clamp(80px, 8vw, 140px) 100%",
          maskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
        }}
      />

      <motion.div
        data-motion
        className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-8"
        style={{ y: typeY }}
      >
        <div className="mb-8 flex items-end justify-between gap-6 sm:mb-12">
          <div className="max-w-md">
            <motion.p
              data-motion
              className="text-muted text-balance"
              initial={{ opacity: 0, y: 14 }}
              animate={animate ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              {profile.role} in {profile.location}. I build the load-bearing half —
              the billing, the queues, the real-time, the data you make decisions on.
            </motion.p>
          </div>

          <motion.div
            data-motion
            className="hidden shrink-0 text-right md:block"
            initial={{ opacity: 0 }}
            animate={animate ? { opacity: 1 } : undefined}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <span className="u-engrave block">Status</span>
            <span className="mt-2 flex items-center justify-end gap-2">
              <span className={`u-led ${profile.available ? "u-led-live" : ""}`} aria-hidden />
              <span className="u-mono text-ink text-xs">
                {profile.available ? "Available" : "Booked"}
              </span>
            </span>
          </motion.div>
        </div>

        {/* the name, machined out of the panel one letter at a time */}
        <h1
          className="u-display text-ink flex flex-wrap text-[clamp(2.75rem,14vw,11rem)]"
          aria-label={profile.name}
        >
          {letters.map((letter, index) => (
            <span key={`${letter}-${index}`} className="overflow-hidden pb-[0.06em]" aria-hidden>
              <motion.span
                data-motion
                className="block"
                initial={{ y: "108%" }}
                animate={animate ? { y: "0%" } : undefined}
                transition={{
                  duration: 0.95,
                  delay: 0.06 * index,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {letter}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          data-motion
          className="border-line-soft mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t pt-4"
          initial={{ opacity: 0 }}
          animate={animate ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <span className="u-mono text-muted text-[11px] tracking-[0.14em] uppercase">
            {profile.discipline}
          </span>
          <a
            href="#index"
            data-cursor="Read on"
            className="u-mono text-dim hover:text-signal group flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase transition-colors"
          >
            Scroll
            <motion.span
              aria-hidden
              animate={reduced ? undefined : { y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
