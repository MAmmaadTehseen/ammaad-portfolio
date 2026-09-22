import type { CSSProperties } from "react";
import { contact, profile } from "@/content/site";
import Avatar from "./Avatar";
import AvailDot from "./AvailDot";
import BookCallLink from "./BookCallLink";
import EmailLink from "./EmailLink";
import WhatsAppLink from "./WhatsAppLink";
import CopyEmail from "./islands/CopyEmail";
import Lamp from "./islands/Lamp";
import LocalTime from "./islands/LocalTime";

/**
 * The room every page ends in, except /contact, which is already the ask.
 *
 * One warm lamp in a darkening room: the ground runs from --bg to --bg-deep
 * and the only light is the lamp behind the words, which follows a mouse
 * (Lamp island) and sits still for everyone else. The two lines of the h2
 * converge as the room scrolls in (html.m.sd only); anywhere else they are
 * simply there. The heading is real text, and the reassurance under it is the
 * first of contact.honest, so a wary reader hears a limit before a pitch.
 *
 * overflow-clip on both axes, not just x: the 56rem lamp is taller than a
 * short room and must not bleed up into the section above it.
 */
export default function ClosingRoom() {
  return (
    <section
      aria-labelledby="closing-title"
      className="closing-room overflow-clip"
    >
      <Lamp />
      <div className="frame rhythm flex min-h-[92svh] flex-col justify-center">
        <h2 id="closing-title" className="t-close">
          <span className="l1">Let’s build</span>{" "}
          <span className="l2">something that lasts.</span>
        </h2>

        <p className="t-lead mt-8" data-reveal="fade">
          {contact.honest[0]}
        </p>

        <div
          className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5"
          data-reveal="rise"
          style={{ "--i": 1 } as CSSProperties}
        >
          <BookCallLink variant="glint" />
          <span className="inline-flex flex-wrap items-center gap-x-4 gap-y-2">
            <EmailLink />
            <CopyEmail />
          </span>
          <WhatsAppLink withNumber />
        </div>

        <div
          className="t-meta mt-16 flex flex-wrap items-center gap-x-4 gap-y-2"
          data-reveal="fade"
          style={{ "--i": 2 } as CSSProperties}
        >
          <Avatar size={40} />
          {profile.available && (
            <span className="inline-flex items-center gap-2.5">
              <AvailDot breathe />
              {profile.availableNote}
            </span>
          )}
          <LocalTime variant="sentence" />
        </div>
      </div>
    </section>
  );
}
