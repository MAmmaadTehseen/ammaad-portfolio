import type { ReactNode } from "react";
import { profile } from "@/content/site";

type Variant = "primary" | "glint";

/**
 * The 30-minute intro call, the site's primary action.
 *
 * `primary` is the filled apricot pill (.btn-glow). `glint` is the same
 * button drawn with the conic border (.glint-cta) that sweeps once on hover
 * or focus; with `arrival` it also sweeps once when RevealRoot first sees it,
 * which is how the closing room and /contact announce it. It opens the
 * booking page in a new tab, so the sr-only note says so rather than letting
 * a screen reader user find out by losing their place.
 */
export default function BookCallLink({
  variant = "primary",
  children = "Book a 30-minute call",
  arrow = true,
  arrival = variant === "glint",
  className,
}: {
  variant?: Variant;
  /** The visible label. The nav uses the short "Book a call". */
  children?: ReactNode;
  /** The trailing → that nudges on hover. */
  arrow?: boolean;
  /** Glint variant only: sweep once on first view. On by default for glint. */
  arrival?: boolean;
  className?: string;
}) {
  const look = variant === "glint" ? "btn glint-cta" : "btn btn-glow";
  return (
    <a
      href={profile.booking}
      target="_blank"
      rel="noreferrer noopener"
      data-reveal={variant === "glint" && arrival ? "glint" : undefined}
      className={className ? `${look} ${className}` : look}
    >
      {children}
      {arrow && (
        <span className="arr" aria-hidden="true">
          →
        </span>
      )}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
