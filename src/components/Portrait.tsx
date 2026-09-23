"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { profile } from "@/content/site";
import { EASE } from "@/lib/motion";
import { useInView } from "@/lib/useInView";
import ScrambleText from "./ScrambleText";

/** Lahore to two places. The plate reads as an instrument, not a caption. */
const COORDS = "31.52°N  74.36°E";

/** In-out rather than the site's ease-out: a scan should cross at an even pace. */
const SCAN_EASE = [0.65, 0, 0.35, 1] as const;

const TILT = { stiffness: 170, damping: 17, mass: 0.6 };

const CORNERS = [
  {
    id: "tl",
    at: "-top-2 -left-2",
    edges: "border-t-2 border-l-2 group-hover:-translate-x-1 group-hover:-translate-y-1",
    from: { x: -12, y: -12 },
  },
  {
    id: "tr",
    at: "-top-2 -right-2",
    edges: "border-t-2 border-r-2 group-hover:translate-x-1 group-hover:-translate-y-1",
    from: { x: 12, y: -12 },
  },
  {
    id: "bl",
    at: "-bottom-2 -left-2",
    edges: "border-b-2 border-l-2 group-hover:-translate-x-1 group-hover:translate-y-1",
    from: { x: -12, y: 12 },
  },
  {
    id: "br",
    at: "-bottom-2 -right-2",
    edges: "border-r-2 border-b-2 group-hover:translate-x-1 group-hover:translate-y-1",
    from: { x: 12, y: 12 },
  },
] as const;

/**
 * The one photograph on the site, treated as a plate being read rather than a
 * picture being shown.
 *
 * It arrives undeveloped — a dim monochrome — and a scan line crosses it once,
 * developing colour behind it, while the corner brackets lock on and the
 * readout decodes. Under a mouse it tilts toward the pointer with a lamp-like
 * sheen; while it is on screen a faint re-scan passes every few seconds.
 *
 * Everything that moves is a transform, an opacity or a one-off clip-path on a
 * 300px element. The photo is one file: both layers request the same URL, so
 * the monochrome plate costs no second download.
 */
export default function Portrait({
  sizes,
  priority = false,
  href,
  className,
}: {
  sizes: string;
  priority?: boolean;
  /** Makes the whole plate a link — used on the home page to lead to About. */
  href?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const [wellRef, onScreen] = useInView<HTMLDivElement>("0px");

  // pointer position over the plate, 0..1 — motion values, so no re-renders
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), TILT);
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), TILT);
  const sheenX = useTransform(px, (v) => `${v * 100}%`);
  const sheenY = useTransform(py, (v) => `${v * 100}%`);
  const sheen = useMotionTemplate`radial-gradient(240px circle at ${sheenX} ${sheenY}, color-mix(in oklch, var(--color-signal) 22%, transparent), transparent 62%)`;

  const time = (duration: number, delay = 0) => ({
    duration: reduced ? 0 : duration,
    delay: reduced ? 0 : delay,
    ease: EASE,
  });
  const scanTime = { duration: reduced ? 0 : 1.5, delay: reduced ? 0 : 0.35, ease: SCAN_EASE };

  const plate = (
    <motion.figure
      data-reveal
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.35 }}
      onViewportEnter={() => setRevealed(true)}
      variants={{
        hidden: { opacity: 0, y: 18 },
        shown: { opacity: 1, y: 0, transition: time(0.8) },
      }}
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse") return;
        const box = event.currentTarget.getBoundingClientRect();
        px.set((event.clientX - box.left) / box.width);
        py.set((event.clientY - box.top) / box.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`group relative ${className ?? ""}`}
    >
      {/* brackets lock on from outside the frame, and open a little on hover */}
      {CORNERS.map((corner, index) => (
        <motion.span
          key={corner.id}
          aria-hidden
          data-motion
          variants={{
            hidden: { opacity: 0, ...corner.from },
            shown: { opacity: 1, x: 0, y: 0, transition: time(0.7, 0.15 + index * 0.05) },
          }}
          className={`pointer-events-none absolute z-20 h-5 w-5 ${corner.at}`}
        >
          <span
            className={`border-signal block h-full w-full transition-transform duration-300 ${corner.edges}`}
          />
        </motion.span>
      ))}

      <div className="u-panel u-chamfer relative p-1.5">
        <div ref={wellRef} className="bg-surface-2 relative aspect-[4/5] overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.045]">
            {/* the undeveloped plate */}
            <Image
              src={profile.photo.src}
              alt=""
              aria-hidden
              fill
              sizes={sizes}
              priority={priority}
              className="object-cover brightness-[0.5] contrast-125 grayscale"
            />
            {/* developed colour, uncovered by the scan */}
            <motion.div
              className="absolute inset-0"
              variants={{
                hidden: { clipPath: "inset(0% 0% 100% 0%)" },
                shown: { clipPath: "inset(0% 0% 0% 0%)", transition: scanTime },
              }}
            >
              <Image
                src={profile.photo.src}
                alt={profile.photo.alt}
                fill
                sizes={sizes}
                priority={priority}
                className="object-cover"
              />
            </motion.div>
          </div>

          {/* fine scanline texture, so the photo sits in the panel's material */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
            style={{
              background:
                "repeating-linear-gradient(to bottom, rgb(255 255 255 / 0.55) 0 1px, transparent 1px 3px)",
            }}
          />

          {/* the scan that develops it — a bright edge with a short glow trailing */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-full"
            variants={{
              hidden: { y: "0%", opacity: 0 },
              shown: {
                y: "100%",
                opacity: [0, 1, 1, 0],
                transition: { y: scanTime, opacity: { ...scanTime, times: [0, 0.04, 0.92, 1] } },
              },
            }}
          >
            <span
              className="bg-signal absolute inset-x-0 top-0 block h-[2px]"
              style={{
                boxShadow:
                  "0 0 18px 4px color-mix(in oklch, var(--color-signal) 55%, transparent)",
              }}
            />
            <span
              className="absolute inset-x-0 bottom-full block h-16"
              style={{
                background:
                  "linear-gradient(to top, color-mix(in oklch, var(--color-signal) 22%, transparent), transparent)",
              }}
            />
          </motion.div>

          {/* a faint re-scan while on screen; paused the moment it is not */}
          <span
            aria-hidden
            data-pulse
            className="pointer-events-none absolute inset-x-0 top-0 block h-full"
            style={{
              background:
                "linear-gradient(to bottom, transparent 70%, color-mix(in oklch, var(--color-signal) 10%, transparent) 97%, color-mix(in oklch, var(--color-signal) 60%, transparent) 100%)",
              animation: "portrait-sweep 7s linear 3s infinite both",
              animationPlayState: onScreen ? "running" : "paused",
            }}
          />

          {/* lamp-like sheen that follows the pointer */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: sheen }}
          />

          {/* readout */}
          <motion.div
            data-motion
            variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: time(0.6, 1.5) } }}
            className="pointer-events-none absolute inset-0 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between p-2.5">
              <span className="u-mono text-ink bg-bg/70 inline-flex items-center gap-1.5 px-1.5 py-1 text-[9px] tracking-[0.16em] uppercase backdrop-blur-sm">
                <span className={`u-led ${profile.available ? "u-led-live" : ""}`} />
                {profile.available ? "Available" : "Booked"}
              </span>
              <span className="u-mono text-ink/80 bg-bg/70 px-1.5 py-1 text-[9px] tracking-[0.16em] uppercase backdrop-blur-sm">
                UTC+5
              </span>
            </div>
            <div className="from-bg/85 bg-gradient-to-t to-transparent px-2.5 pt-10 pb-2.5">
              <span className="u-mono text-ink/85 text-[9px] tracking-[0.16em] whitespace-pre">
                {COORDS}
              </span>
            </div>
          </motion.div>
        </div>

        <figcaption className="u-mono text-dim flex items-center justify-between gap-3 px-1 pt-2.5 pb-0.5 text-[10px] tracking-[0.14em] uppercase">
          <ScrambleText
            text={`${profile.short} Tehseen`}
            runKey={revealed ? "revealed" : null}
            speed={34}
            className="text-ink"
          />
          <span>{profile.location.split(",")[0]}</span>
        </figcaption>
      </div>
    </motion.figure>
  );

  if (!href) return plate;

  return (
    <Link href={href} data-cursor="About me" className="block w-fit" aria-label={`About ${profile.name}`}>
      {plate}
    </Link>
  );
}
