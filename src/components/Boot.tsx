"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "@/content/site";

const SESSION_KEY = "readout:boot";
const DURATION = 1500;

/**
 * Instrument power-on. Runs once per session; the inline script in layout.tsx
 * marks <html class="boot-done"> before first paint on repeat visits, so there
 * is never a flash of an overlay that is about to be skipped. A <noscript>
 * rule hides it entirely when JS never arrives.
 */
export default function Boot() {
  const [done, setDone] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (document.documentElement.classList.contains("boot-done")) return;

    setDone(false);
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // ease-out-quart, so the count decelerates into 100 instead of snapping
      const eased = 1 - Math.pow(1 - t, 4);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      window.setTimeout(() => {
        setDone(true);
        document.documentElement.classList.add("boot-done");
        // the hero waits for this before playing its entrance
        window.dispatchEvent(new Event("boot:done"));
        try {
          window.sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          /* the boot just replays next visit; harmless */
        }
      }, 260);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          id="boot"
          key="boot"
          className="bg-bg u-grain fixed inset-0 flex flex-col justify-between p-6 sm:p-10"
          style={{ zIndex: "var(--z-boot)" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-start justify-between">
            <span className="u-engrave">Read-out</span>
            <span className="u-engrave">{profile.location}</span>
          </div>

          <div className="flex items-end justify-between gap-6">
            <motion.span
              className="u-mono text-ink text-[clamp(3.5rem,14vw,9rem)] leading-none tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {String(count).padStart(3, "0")}
            </motion.span>
            <span className="u-engrave hidden pb-3 sm:block">Calibrating</span>
          </div>

          <div>
            {/* the fill rule is the progress bar; the counter is the readout */}
            <div className="bg-line-soft relative h-px w-full overflow-hidden">
              <motion.span
                className="bg-signal absolute inset-y-0 left-0 block"
                style={{ width: `${count}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="u-engrave">{profile.name}</span>
              <span className="u-engrave">{profile.role}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
