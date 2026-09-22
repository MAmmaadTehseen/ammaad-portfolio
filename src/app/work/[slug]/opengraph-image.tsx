import { ImageResponse } from "next/og";
import { profile, projects } from "@/content/site";
import { posterSvg } from "@/lib/flow-geometry";
import { brand, descriptor } from "@/lib/names";
import {
  OG,
  OG_CONTENT_TYPE,
  OG_HOST,
  OG_POSTER,
  OG_SIZE,
  clip,
  glow,
  loadOgFonts,
  tierName,
} from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const PAD = 64;
/** The silhouette's box: the right side of the card, bleeding off the edge like the case page backdrop. */
const POSTER_W = 600;
const POSTER_RIGHT = -24;
const POSTER_MAX_H = 380;

const HORIZON = glow(OG_SIZE.width + 400, 400, [
  { at: 0, color: OG.ember, opacity: 0.18 },
  { at: 0.6, color: OG.haze, opacity: 0.07 },
]);

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

/**
 * The poster as an <img> source, sized to fit its box without distortion.
 * The left mask is baked into the SVG rather than laid over it as a gradient
 * div, because an overlay would also paint over the horizon glow and leave a
 * seam where it starts.
 */
function poster(project: (typeof projects)[number]) {
  if (!project.flow) return undefined;
  const inner = posterSvg(project.flow, OG_POSTER, project.id);
  const [, , vw, vh] = (inner.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 1 1").split(" ").map(Number);
  const scale = Math.min(POSTER_W / vw, POSTER_MAX_H / vh);
  const width = Math.round(vw * scale);
  const height = Math.round(vh * scale);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<defs><linearGradient id="f"><stop offset=".08" stop-color="#fff" stop-opacity="0"/><stop offset=".45" stop-color="#fff"/></linearGradient>` +
    `<mask id="m"><rect width="${width}" height="${height}" fill="url(#f)"/></mask></defs>` +
    `<g mask="url(#m)" opacity=".6">${inner.replace(/ width="[^"]*" height="[^"]*"/, ` width="${width}" height="${height}"`)}</g></svg>`;
  return { src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`, width, height };
}

/** Long brands drop a size so the name stays on one or two lines beside the silhouette. */
function brandSize(text: string) {
  if (text.length <= 12) return 104;
  if (text.length <= 20) return 88;
  return 72;
}

/**
 * A share card per project, so a link to one reads as that project rather
 * than as the site in general. The silhouette stands in for a screenshot, as
 * it does on the page: most of this work is private source.
 */
export default async function ProjectOgImage({ params }: { params: { slug: string } }) {
  const project = projects.find((entry) => entry.id === params.slug);
  const { fonts, displayFont, textFont } = await loadOgFonts();

  if (!project) {
    return new ImageResponse(
      <div style={{ width: "100%", height: "100%", display: "flex", background: OG.bg }} />,
      { ...OG_SIZE, fonts },
    );
  }

  const name = brand(project.name);
  const kind = descriptor(project.name);
  const art = poster(project);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: OG.bg,
          fontFamily: textFont,
        }}
      >
        {/* the horizon: a low ember glow along the floor, as on the case page */}
        <img
          src={HORIZON}
          alt=""
          width={OG_SIZE.width + 400}
          height={400}
          style={{ position: "absolute", left: -200, bottom: -220 }}
        />

        {art ? (
          <div
            style={{
              position: "absolute",
              right: POSTER_RIGHT,
              top: 0,
              bottom: 0,
              width: POSTER_W,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <img src={art.src} alt="" width={art.width} height={art.height} />
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: PAD,
          }}
        >
          <div style={{ display: "flex", fontSize: 24, fontWeight: 500, color: OG.muted }}>
            {`${tierName(project.tier)} · ${project.year}`}
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 620 }}>
            <div
              style={{
                display: "flex",
                fontFamily: displayFont,
                fontWeight: 300,
                fontSize: brandSize(name),
                lineHeight: 1.02,
                letterSpacing: -1.5,
                color: OG.ink,
              }}
            >
              {name}
            </div>
            {kind ? (
              <div
                style={{
                  display: "flex",
                  marginTop: 14,
                  fontFamily: displayFont,
                  fontWeight: 300,
                  fontSize: 38,
                  lineHeight: 1.15,
                  color: OG.muted,
                }}
              >
                {kind}
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontSize: 27,
                lineHeight: 1.35,
                color: OG.ink2,
              }}
            >
              {clip(project.lede.client)}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: OG.muted }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: OG.glow }} />
            {OG_HOST}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
