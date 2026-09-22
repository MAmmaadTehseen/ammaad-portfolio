import type { Metadata } from "next";
import Link from "next/link";
import LightUp from "@/components/LightUp";

// Not indexed, but its links are still worth following. canonical: null
// drops the layout's "/" so a missing page never claims to be the home page.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

const WAYS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Contact", href: "/contact" },
];

/**
 * The designed 404. One sentence, three ways back, then the footer's bottom
 * row. The closing room is hidden here with a scoped style rather than a
 * route check: a 404 can sit at any address, so the path cannot say it is
 * one, and a style works before (and without) any script. It leaves with the
 * page on the next navigation.
 */
export default function NotFound() {
  return (
    <div className="frame flex min-h-[80svh] flex-col justify-end pt-40 pb-24 md:pb-32">
      <style>{".closing-room{display:none}"}</style>
      <LightUp
        as="h1"
        step={50}
        text="Nothing lives at this address."
        className="t-page-long max-w-[16ch]"
      />

      <nav aria-label="Ways back" className="mt-14">
        <ul className="list border-line border-t">
          {WAYS.map((way) => (
            <li key={way.href} className="row border-line border-b">
              <Link
                href={way.href}
                className="flex min-h-11 items-center justify-between gap-6 py-5"
              >
                <span className="name t-h3 text-ink font-[350]">
                  {way.label}
                </span>
                <span
                  className="arr text-muted t-h3 font-[350]"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
