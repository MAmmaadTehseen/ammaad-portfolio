import { ImageResponse } from "next/og";
import { profile } from "@/content/site";
import { OG, OG_CONTENT_TYPE, OG_SIZE, loadOgFonts } from "@/lib/og";

export const alt = `${profile.name} — ${profile.role} in ${profile.location}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * The share card. Without one, every link posted to LinkedIn, X or WhatsApp
 * renders as a bare URL, which is the difference between a click and a scroll
 * past.
 *
 * Same instrument panel as the site: anodised olive, machined type, one amber
 * signal. Drawn with plain boxes so it renders identically wherever it is
 * generated.
 */

export default async function OpengraphImage() {
  const { fonts, displayFont, monoFont } = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: OG.bg,
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
              background: i === 2 ? OG.primary : OG.line,
              opacity: i === 2 ? 0.55 : 0.9,
            }}
          />
        ))}

        {/* top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: OG.signal }} />
            <div
              style={{
                fontFamily: monoFont,
                fontSize: 20,
                letterSpacing: 4,
                color: OG.muted,
                textTransform: "uppercase",
              }}
            >
              {profile.available ? "Available for work" : "Read-out"}
            </div>
          </div>
          <div style={{ fontFamily: monoFont, fontSize: 20, letterSpacing: 3, color: OG.dim }}>
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
              color: OG.ink,
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
              color: OG.muted,
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
            borderTop: `1px solid ${OG.line}`,
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
                  color: OG.muted,
                  border: `1px solid ${OG.line}`,
                  padding: "6px 12px",
                }}
              >
                {tech}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: monoFont, fontSize: 22, color: OG.signal }}>ammaad.online</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
