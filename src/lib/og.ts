import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { TIERS, profile, type Tier } from "@/content/site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * The site's tokens as hex. Satori cannot resolve CSS variables or OKLCH, so
 * the share cards carry their own copy of the handful they use. Keep these in
 * step with :root in globals.css.
 */
export const OG = {
  bg: "#120d0c",
  bgDeep: "#0b0706",
  surface2: "#261e1d",
  line: "#3c3331",
  lineStrong: "#726662",
  ink: "#f4efe8",
  ink2: "#d9d3cc",
  muted: "#b4a69e",
  dim: "#9d8f88",
  glow: "#fbc576",
  ember: "#de844f",
  haze: "#a27b74",
};

/** Poster colours baked for posterSvg(): the same kind-to-token mapping as FlowDiagram's poster mode. */
export const OG_POSTER = {
  edge: OG.muted,
  service: OG.glow,
  store: OG.ink2,
  worker: OG.dim,
  line: OG.muted,
};

/** "www.ammaad.online" reads as a URL to type; the bare host reads as a name. */
export const OG_HOST = new URL(profile.site).hostname.replace(/^www\./, "");

/**
 * Tier names as a client reads them. "Private source" is the first clause of
 * TIERS.closed.note, so the wording still lives in site.ts.
 */
export function tierName(tier: Tier): string {
  if (tier === "closed") return TIERS.closed.note.split(" — ")[0];
  if (tier === "open") return `${TIERS.open.label} source`;
  return TIERS[tier].label;
}

/**
 * Cuts on a word boundary at or under `max` characters and adds an ellipsis,
 * so a card never ends mid-word. Trailing punctuation is dropped first so the
 * ellipsis does not sit after a comma.
 */
export function clip(text: string, max = 150): string {
  if (text.length <= max) return text;
  const room = text.slice(0, max - 1);
  const cut = room.lastIndexOf(" ");
  const head = (cut > max * 0.5 ? room.slice(0, cut) : room).replace(/[\s,;:.—–-]+$/, "");
  return `${head}…`;
}

/**
 * A soft elliptical glow as an SVG data URI, for use as an <img>. Satori's CSS
 * radial-gradient ignores `closest-side` and leaves the box edge showing as a
 * seam; resvg draws a true SVG gradient that fades to nothing inside the box,
 * which is the site's "no box edge ever shows" rule.
 */
export function glow(
  width: number,
  height: number,
  stops: { at: number; color: string; opacity: number }[],
): string {
  const body = stops
    .map((s) => `<stop offset="${s.at}" stop-color="${s.color}" stop-opacity="${s.opacity}"/>`)
    .join("");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<defs><radialGradient id="g" cx=".5" cy=".5" r=".5">${body}<stop offset="1" stop-color="${OG.bg}" stop-opacity="0"/></radialGradient></defs>` +
    `<rect width="${width}" height="${height}" fill="url(#g)"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** The portrait as a data URI. Satori fetches remote images itself, but the file is already on disk at build time. */
export async function loadPortrait(): Promise<string | null> {
  try {
    const file = await readFile(join(process.cwd(), "public", profile.photo.src.replace(/^\//, "")));
    return `data:image/jpeg;base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}

type Weight = 300 | 400 | 500;
type OgFont = { name: string; data: ArrayBuffer; weight: Weight; style: "normal" };

/**
 * Google serves TTF to plain clients and WOFF2 to modern ones; satori needs the
 * former, hence the old user agent. One request per family returns one
 * @font-face block per weight. Every failure path returns an empty map, so the
 * card falls back to the built-in font rather than taking the build down.
 */
async function loadFamily(family: string, weights: Weight[]): Promise<Map<Weight, ArrayBuffer>> {
  const found = new Map<Weight, ArrayBuffer>();
  try {
    const query = `${family.replace(/ /g, "+")}:wght@${weights.join(";")}`;
    const css = await fetch(`https://fonts.googleapis.com/css2?family=${query}`, {
      headers: { "User-Agent": "Mozilla/4.0" },
    }).then((res) => (res.ok ? res.text() : ""));

    const blocks = css.split("@font-face").slice(1);
    await Promise.all(
      blocks.map(async (block) => {
        const weight = Number(block.match(/font-weight:\s*(\d+)/)?.[1]) as Weight;
        const url = block.match(/src:\s*url\((.+?)\)\s*format\(['"]truetype['"]\)/)?.[1];
        if (!url || !weights.includes(weight)) return;
        const res = await fetch(url);
        if (res.ok) found.set(weight, await res.arrayBuffer());
      }),
    );
  } catch {
    // Offline builds and CI without egress land here; the card still renders.
  }
  return found;
}

export const DISPLAY = "Ysabeau Office";
export const TEXT = "Afacad Flux";

let pending: Promise<OgFonts> | undefined;

type OgFonts = {
  fonts: OgFont[] | undefined;
  /** Ysabeau Office 300, or the built-in sans. */
  displayFont: string;
  /** Afacad Flux 400/500, or the built-in sans. */
  textFont: string;
};

/**
 * Every card in a build asks for the same three files, so the fetch is shared
 * per process instead of repeated 24 times.
 */
export function loadOgFonts(): Promise<OgFonts> {
  pending ??= (async () => {
    const [display, text] = await Promise.all([
      loadFamily(DISPLAY, [300]),
      loadFamily(TEXT, [400, 500]),
    ]);

    const fonts: OgFont[] = [
      ...[...display].map(([weight, data]) => ({ name: DISPLAY, data, weight, style: "normal" as const })),
      ...[...text].map(([weight, data]) => ({ name: TEXT, data, weight, style: "normal" as const })),
    ];

    return {
      fonts: fonts.length ? fonts : undefined,
      displayFont: display.size ? DISPLAY : "sans-serif",
      textFont: text.size ? TEXT : "sans-serif",
    };
  })();
  return pending;
}
