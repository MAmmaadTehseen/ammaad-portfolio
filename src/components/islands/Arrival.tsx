"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * A soft settle for client navigations, never the first load (the first load
 * has its own entrances, and the page must not start dim).
 *
 * No veil and no intercepted links: the new page is already painted when this
 * runs, it just eases from .4 to full. Under reduced motion only the focus
 * move happens, which is the part that matters: a screen reader lands at the
 * top of the new content instead of on a link that no longer means anything.
 */
export default function Arrival() {
  const pathname = usePathname();
  // Compare against the previous pathname rather than a "first run" flag, so a
  // double-invoked effect (strict mode) cannot count as a navigation.
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;

    const main = document.getElementById("main");
    if (!main) return;

    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      main.animate(
        [
          { opacity: 0.4, translate: "0 10px" },
          { opacity: 1, translate: "0 0" },
        ],
        { duration: 420, easing: "cubic-bezier(.22,1,.36,1)" },
      );
    }
    main.focus({ preventScroll: true });

    // A glide still in flight from the old page would drag the new one back
    // down on its next frame. Snap Lenis to where the router left the window:
    // the top for a new page, or the restored position on back/forward and
    // hash links, which a hard scrollTo(0) would throw away.
    window.__lenis?.scrollTo(window.scrollY, { immediate: true });
  }, [pathname]);

  return null;
}
