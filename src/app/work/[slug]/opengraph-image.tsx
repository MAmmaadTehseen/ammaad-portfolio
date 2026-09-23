import { ImageResponse } from "next/og";
import { TIERS, profile, projects } from "@/content/site";
import { OG, OG_CONTENT_TYPE, OG_SIZE, loadOgFonts } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
  const project = projects.find((entry) => entry.id === params.slug);
  return [
    {
      id: params.slug,
      size: OG_SIZE,
      contentType: OG_CONTENT_TYPE,
      alt: project ? `${project.name} — ${profile.name}` : profile.name,
    },
  ];
}

/** A share card per project, so a link to one reads as that project rather than
 *  as the site in general. */
export default async function ProjectOgImage({ params }: { params: { slug: string } }) {
  const project = projects.find((entry) => entry.id === params.slug);
  const { fonts, displayFont, monoFont } = await loadOgFonts();

  if (!project) {
    return new ImageResponse(
      <div style={{ width: "100%", height: "100%", background: OG.bg }} />,
      OG_SIZE,
    );
  }

  const tierColor =
    project.tier === "live" ? OG.primary : project.tier === "open" ? OG.muted : OG.signal;

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
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: tierColor }} />
            <div
              style={{
                fontFamily: monoFont,
                fontSize: 20,
                letterSpacing: 4,
                color: OG.muted,
                textTransform: "uppercase",
              }}
            >
              {TIERS[project.tier].label}
            </div>
          </div>
          <div style={{ fontFamily: monoFont, fontSize: 20, letterSpacing: 3, color: OG.dim }}>
            {project.year.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: displayFont,
              fontSize: project.name.length > 26 ? 76 : 104,
              lineHeight: 1.03,
              letterSpacing: -3,
              color: OG.ink,
              display: "flex",
            }}
          >
            {project.name}
          </div>
          <div
            style={{
              marginTop: 24,
              fontFamily: displayFont,
              fontSize: 28,
              color: OG.muted,
              display: "flex",
              maxWidth: 980,
            }}
          >
            {project.lede.recruiter.slice(0, 150)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: `1px solid ${OG.line}`,
            paddingTop: 24,
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", maxWidth: 800 }}>
            {project.stack.slice(0, 6).map((tech) => (
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
          <div style={{ fontFamily: monoFont, fontSize: 20, color: OG.signal }}>
            ammaad.online
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
