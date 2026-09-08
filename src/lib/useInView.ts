"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Whether an element is anywhere near the viewport.
 *
 * Used to stop work that nobody can see — a shader loop, a marquee, packets
 * crawling a diagram three screens up. Starts `true` so the server, the first
 * client render and the no-JS case all agree and nothing is ever stuck off.
 */
export function useInView<T extends Element>(rootMargin = "250px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, inView] as const;
}
