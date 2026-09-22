import type { ReactNode } from "react";
import { profile } from "@/content/site";

/** Opens with a line already typed, so the first message is never a blank box. */
const OPENER = "Hi Ammaad, I found you through your portfolio. ";

/**
 * Click-to-chat on WhatsApp. `ghost` is the outlined pill that sits beside
 * the primary CTA; `plain` drops the pill for rows that do their own layout
 * (the contact channel list, the mobile menu). `withNumber` appends the
 * displayed number, for places where the number itself is the reassurance.
 */
export default function WhatsAppLink({
  variant = "ghost",
  children = "WhatsApp",
  withNumber = false,
  className,
}: {
  variant?: "ghost" | "plain";
  children?: ReactNode;
  withNumber?: boolean;
  className?: string;
}) {
  const look = variant === "ghost" ? "btn btn-ghost" : "inline-flex items-center gap-2";
  return (
    <a
      href={`https://wa.me/${profile.whatsapp.number}?text=${encodeURIComponent(OPENER)}`}
      target="_blank"
      rel="noreferrer noopener"
      className={className ? `${look} ${className}` : look}
    >
      {children}
      {withNumber && (
        <span className="text-muted tabular-nums">
          <span aria-hidden="true">· </span>
          {profile.whatsapp.display}
        </span>
      )}
      <span className="arr-out" aria-hidden="true">
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
