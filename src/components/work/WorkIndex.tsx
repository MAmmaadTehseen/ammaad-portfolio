import type { CSSProperties } from "react";
import Link from "next/link";
import { alsoBuilt, shortEntries, showcase } from "@/content/site";
import FlowDiagram from "@/components/FlowDiagram";
import { brand, descriptor } from "@/lib/names";
import { TIER_NAME } from "@/components/work/TierFilter";
import PreviewGate from "@/components/work/PreviewGate";

/** One section's worth of space: the site rhythm, applied once between sections. */
const SECTION = "mt-[clamp(96px,14vh,160px)]";

/** Rows that reveal together on load stagger; later ones arrive one by one, so they need no delay. */
const stagger = (i: number) => ({ "--i": i < 6 ? i : 0 }) as CSSProperties;

/**
 * The /work index. Server rendered from site.ts, with nothing but DOM
 * attributes handed to the one island.
 *
 * - The showcase is an <ol> of whole-row links, each carrying data-tier on
 *   its <li> for the zero-JS TierFilter, and focus-dimming (.list/.row).
 * - The preview card sits beside the list, aria-hidden and inert, holding
 *   every silhouette and lede already. globals.css keeps it display:none
 *   until a fine pointer on a wide screen with motion allowed, and
 *   PreviewGate only fetches the spring that moves it on the first
 *   pointerenter of the list. No Project object crosses into client code.
 * - Then the smaller builds as plain rows, the "also built" names without
 *   links, and the note that points at /contact.
 */
export default function WorkIndex() {
  const previews = showcase.filter((project) => project.flow);

  return (
    <>
      <PreviewGate>
        <ol className="list border-t">
          {showcase.map((project, i) => {
            const desc = descriptor(project.name);
            return (
              <li
                key={project.id}
                className="row border-b"
                data-tier={project.tier}
                data-reveal="rise"
                style={stagger(i)}
              >
                <Link
                  href={`/work/${project.id}`}
                  data-preview={project.id}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start py-6 md:py-8 lg:grid-cols-[auto_minmax(0,1fr)_auto_auto]"
                >
                  {/* The media variant below is where the preview card can exist (a mouse,
                      1024px and up). Those rows drop the glyph and keep two lines of lede;
                      everyone else, touch above all, gets the glyph and three lines. */}
                  {project.flow && (
                    <span
                      aria-hidden="true"
                      className="glyph bg-bg-deep text-muted col-start-1 row-span-2 mt-1.5 mr-4 block aspect-[4/3] w-16 overflow-hidden rounded-[10px] border p-1.5 sm:mr-6 sm:w-20 [@media(hover:hover)_and_(pointer:fine)_and_(min-width:64rem)]:hidden"
                    >
                      <FlowDiagram
                        project={project}
                        mode="poster"
                        className="block h-full w-full"
                      />
                    </span>
                  )}

                  <div className="col-start-2 row-start-1 min-w-0">
                    <span className="name t-name text-ink">
                      {brand(project.name)}
                    </span>
                    {desc && (
                      <span className="meta t-ui text-muted mt-1.5 block">
                        {desc}
                      </span>
                    )}
                    <p className="text-ink-2 mt-3 line-clamp-3 max-w-[62ch] [@media(hover:hover)_and_(pointer:fine)_and_(min-width:64rem)]:line-clamp-2">
                      {project.lede.client}
                    </p>
                  </div>

                  <span className="meta t-meta col-start-2 row-start-2 mt-3 block lg:col-start-3 lg:row-start-1 lg:ml-10 lg:text-right lg:whitespace-nowrap">
                    {TIER_NAME[project.tier]} · {project.year}
                  </span>

                  <span
                    aria-hidden="true"
                    className="arr text-muted t-h3 col-start-3 row-start-1 ml-4 font-[350] lg:col-start-4 lg:ml-8"
                  >
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="preview-card" aria-hidden="true" inert>
          <div className="rounded-card bg-surface border-line-strong w-[22rem] border p-3">
            <div className="pv-stack">
              {previews.map((project) => (
                <div key={project.id} className="pv" data-pv={project.id}>
                  <div className="bg-bg-deep text-muted flex aspect-[16/10] items-center justify-center rounded-[10px] p-5">
                    <FlowDiagram
                      project={project}
                      mode="poster"
                      className="block h-auto max-h-full w-full"
                    />
                  </div>
                  <p className="t-meta text-ink-2 mt-3 px-1 pb-1">
                    {project.lede.client}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PreviewGate>

      {shortEntries.length > 0 && (
        <section aria-labelledby="smaller-builds" className={SECTION}>
          <h2 id="smaller-builds" className="t-h2" data-reveal="focus">
            Smaller builds
          </h2>
          <p className="t-lead mt-4" data-reveal="fade">
            Personal tools and shorter engagements
          </p>
          <ul className="list mt-10 border-t md:mt-14">
            {shortEntries.map((project, i) => {
              const desc = descriptor(project.name);
              return (
                <li
                  key={project.id}
                  className="row border-b"
                  data-reveal="rise"
                  style={stagger(i)}
                >
                  <Link
                    href={`/work/${project.id}`}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-start py-6 lg:grid-cols-[minmax(0,1fr)_auto_auto]"
                  >
                    <div className="col-start-1 row-start-1 min-w-0">
                      <span className="name t-h3 text-ink font-[350]">
                        {brand(project.name)}
                      </span>
                      {desc && (
                        <span className="meta t-ui text-muted mt-1.5 block">
                          {desc}
                        </span>
                      )}
                      <p className="text-ink-2 mt-3 max-w-[62ch]">
                        {project.lede.client}
                      </p>
                    </div>
                    <span className="meta t-meta col-start-1 row-start-2 mt-3 block lg:col-start-2 lg:row-start-1 lg:mt-2 lg:ml-10 lg:text-right lg:whitespace-nowrap">
                      {TIER_NAME[project.tier]} · {project.year}
                    </span>
                    <span
                      aria-hidden="true"
                      className="arr text-muted t-h3 col-start-2 row-start-1 ml-4 font-[350] lg:col-start-3 lg:ml-8"
                    >
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {alsoBuilt.length > 0 && (
        <section aria-labelledby="also-built" className={SECTION}>
          <h2 id="also-built" className="t-h2" data-reveal="focus">
            Also built
          </h2>
          <ul className="mt-10 border-t md:mt-14">
            {alsoBuilt.map((item, i) => (
              <li
                key={item.name}
                className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b py-5"
                data-reveal="rise"
                style={stagger(i)}
              >
                <span className="text-ink font-medium">{item.name}</span>
                <span className="text-muted">{item.note}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Private work has no screenshots; this is where that stops being a gap and becomes an offer */}
      <p className="t-lead mt-14 md:mt-20" data-reveal="fade">
        Private-source work has no screenshots on purpose. Open the project and
        you get the architecture instead —{" "}
        <Link href="/contact" className="u-link text-ink">
          ask me to walk through any of it
        </Link>
        .
      </p>
    </>
  );
}
