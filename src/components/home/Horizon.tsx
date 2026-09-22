import { capabilities } from "@/content/site";

/**
 * The capability band under the hero (DESIGN.md effect #6), full bleed
 * between two hairlines, with a small apricot dot before each item.
 *
 * The first list is the real one, named for assistive tech. The second is an
 * aria-hidden copy that only exists so the loop has no seam: under html.m both
 * drift left together over 90s and the copy slides into the gap the first
 * leaves. The band pauses on hover, on keyboard focus and whenever RevealRoot
 * marks it data-off (off-screen), so it is one of only two loops on the site
 * and never runs where nobody can see it. Without motion the copy is gone and
 * the first list wraps as centred, static lines.
 */
export default function Horizon() {
  return (
    <div className="band t-band" data-ambient="">
      {/* role="list": Safari drops list semantics from a list with no bullets */}
      <ul className="track" role="list" aria-label="What I work on">
        {capabilities.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <ul className="track" aria-hidden="true">
        {capabilities.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
