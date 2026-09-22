import type { CSSProperties } from "react";
import Link from "next/link";
import { profile } from "@/content/site";
import Avatar from "./Avatar";
import AvailDot from "./AvailDot";
import BookCallLink from "./BookCallLink";
import EmailLink from "./EmailLink";
import WhatsAppLink from "./WhatsAppLink";
import LocalTime from "./islands/LocalTime";
import MenuDialog from "./islands/MenuDialog";
import NavState, { NavLinks, NavProgress } from "./islands/NavState";

/** "Ammaad Tehseen": the name he goes by, with the family name from profile.name. */
const FULL = `${profile.short} ${profile.name.split(" ").slice(-1)[0]}`;

/**
 * The fixed header on every page.
 *
 * Server markup inside three small islands: NavState owns the <header> and
 * its two scroll attributes, NavLinks marks the current page, and NavProgress
 * adds the reading line on case pages. At the top of a page it is a
 * transparent full-width row; past 80px it condenses into a solid pill and
 * drops the clock; past 480px it tucks away while reading down and comes back
 * on any upward scroll or as soon as keyboard focus lands inside it.
 *
 * Below 768px the links move into the Menu sheet, and the name shortens to
 * "Ammaad". "Book a call" stays in the bar at every width: it is the one
 * action every page leads to.
 */
export default function Nav() {
  return (
    <NavState>
      <div className="nav-pill">
        <nav
          aria-label="Main"
          className="flex min-h-14 items-center gap-4 py-1.5 pr-1.5 pl-2 md:gap-8 md:pr-2 md:pl-3"
        >
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="relative inline-flex">
              <Avatar size={32} />
              <AvailDot className="ring-bg absolute -right-0.5 -bottom-0.5 ring-2" />
            </span>
            <span className="t-ui text-ink font-medium">
              <span className="max-[23rem]:sr-only md:hidden">
                {profile.short}
              </span>
              <span className="hidden md:inline">{FULL}</span>
            </span>
          </Link>

          <NavLinks
            variant="bar"
            className="hidden items-center gap-6 md:flex"
          />

          <div className="ml-auto flex items-center gap-2 md:gap-5">
            {/* the wrapper carries .nav-clock: LocalTime's own inline-block would outrank it */}
            <span className="nav-clock t-meta">
              <LocalTime variant="short" />
            </span>
            <BookCallLink arrow={false} className="px-4">
              Book a call
            </BookCallLink>
            <MenuDialog>
              <nav aria-label="Pages" className="mt-6">
                <NavLinks variant="menu" className="space-y-2" />
              </nav>

              <div
                className="menu-item border-line mt-10 flex flex-col items-start gap-3 border-t pt-8"
                style={{ "--i": 3 } as CSSProperties}
              >
                <BookCallLink className="w-full" />
                <div className="flex w-full flex-wrap gap-3">
                  <WhatsAppLink className="flex-1" />
                  <EmailLink variant="ghost" className="flex-1" />
                </div>
              </div>

              <p
                className="menu-item t-meta mt-auto flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-10"
                style={{ "--i": 4 } as CSSProperties}
              >
                <AvailDot />
                {profile.available && <span>{profile.availableNote}</span>}
                <LocalTime variant="sentence" />
              </p>
            </MenuDialog>
          </div>
        </nav>
        <NavProgress />
      </div>
    </NavState>
  );
}
