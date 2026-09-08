import { ImageResponse } from "next/og";
import { profile } from "@/content/site";

export const alt = `${profile.name} — ${profile.role} in ${profile.location}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The share card. Without one, every link posted to LinkedIn, X or WhatsApp
 * renders as a bare URL, which is the difference between a click and a scroll
 * past.
 *
 * Same instrument panel as the site: anodised olive, machined type, one amber
 * signal. Drawn with plain boxes so it renders identically wherever it is
 * generated.
 */

/** Google serves TTF to plain clients and WOFF2 to modern ones; satori needs
 *  the former. Falls back to the built-in font rather than failing the build. */
async function loadFont(family: string, weight: number) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`,
      { headers: { "User-Agent": "Mozilla/4.0" } },
    ).then((res) => res.text());
    const url = css.match(/src:\s*url\((.+?)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((res) => res.arrayBuffer());
  } catch {
    return null;
  }
}

const BG = "#0e1108";
const INK = "#f2f2ec";
const MUTED = "#a4a699";
const DIM = "#74766a";
const SIGNAL = "#fa9524";
const PRIMARY = "#a4c752";
const LINE = "#2b2f22";

export default async function OpengraphImage() {
  const [display, mono] = await Promise.all([
    loadFont("Archivo", 700),
    loadFont("Martian+Mono", 400),
  ]);

  const fonts = [
    ...(display ? [{ name: "Archivo", data: display, weight: 700 as const, style: "normal" as const }] : []),
    ...(mono ? [{ name: "Martian Mono", data: mono, weight: 400 as const, style: "normal" as const }] : []),
  ];

  const displayFont = display ? "Archivo" : "sans-serif";
  const monoFont = mono ? "Martian Mono" : "monospace";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: 64,
          position: "relative",
        }}
      >
        {/* signal traces, flattened into static bands */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 70 + i * 46,
              height: 2,
              background: i === 2 ? PRIMARY : LINE,
              opacity: i === 2 ? 0.55 : 0.9,
            }}
          />
        ))}

        {/* top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: SIGNAL }} />
            <div
              style={{
                fontFamily: monoFont,
                fontSize: 20,
                letterSpacing: 4,
                color: MUTED,
                textTransform: "uppercase",
              }}
            >
              {profile.available ? "Available for work" : "Read-out"}
            </div>
          </div>
          <div style={{ fontFamily: monoFont, fontSize: 20, letterSpacing: 3, color: DIM }}>
            {profile.location.toUpperCase()}
          </div>
        </div>

        {/* the name */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 132,
              lineHeight: 1,
              letterSpacing: -4,
              color: INK,
              display: "flex",
            }}
          >
            AMMAAD TEHSEEN
          </div>
          <div
            style={{
              marginTop: 26,
              fontFamily: displayFont,
              fontSize: 36,
              color: MUTED,
              display: "flex",
            }}
          >
            Full-stack engineer — billing, queues, real-time, retrieval.
          </div>
        </div>

        {/* bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: `1px solid ${LINE}`,
            paddingTop: 24,
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", maxWidth: 780 }}>
            {["TypeScript", "Node", "Next.js", "Prisma", "PostgreSQL", "Redis"].map((tech) => (
              <div
                key={tech}
                style={{
                  fontFamily: monoFont,
                  fontSize: 18,
                  color: MUTED,
                  border: `1px solid ${LINE}`,
                  padding: "6px 12px",
                }}
              >
                {tech}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: monoFont, fontSize: 22, color: SIGNAL }}>ammaad.online</div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
