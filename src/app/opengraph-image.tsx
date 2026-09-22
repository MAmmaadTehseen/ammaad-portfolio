import { ImageResponse } from "next/og";
import { bio, profile } from "@/content/site";
import { OG, OG_CONTENT_TYPE, OG_HOST, OG_SIZE, glow, loadOgFonts, loadPortrait } from "@/lib/og";

export const alt = `${profile.name} — ${profile.role} in ${profile.location}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const PAD = 64;
const PHOTO_H = OG_SIZE.height - PAD * 2;
const PHOTO_W = Math.round((PHOTO_H * 4) / 5);

/** The card uses the name people say, not the full legal one that heads the About page. */
const SPILL = glow(PHOTO_W + 480, PHOTO_H + 360, [
  { at: 0, color: OG.glow, opacity: 0.22 },
  { at: 0.45, color: OG.ember, opacity: 0.12 },
  { at: 0.75, color: OG.haze, opacity: 0.05 },
]);
const HORIZON = glow(OG_SIZE.width + 400, 360, [
  { at: 0, color: OG.ember, opacity: 0.16 },
  { at: 0.6, color: OG.haze, opacity: 0.06 },
]);

const SPOKEN_NAME = `${profile.short} ${profile.name.split(" ").at(-1)}`;

/**
 * The share card. Without one, every link posted to LinkedIn, X or WhatsApp
 * renders as a bare URL, which is the difference between a click and a scroll
 * past.
 *
 * The same room as the site: charcoal ground, the rooftop portrait as the one
 * window of light, its sky spilling onto the wall behind it. Everything is a
 * plain box or gradient so it renders the same wherever it is generated.
 */
export default async function OpengraphImage() {
  const [{ fonts, displayFont, textFont }, portrait] = await Promise.all([
    loadOgFonts(),
    loadPortrait(),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: OG.bg,
          padding: PAD,
          fontFamily: textFont,
        }}
      >
        {/* the spill: the photo's sky on the wall around it, fading out well inside its box */}
        <img
          src={SPILL}
          alt=""
          width={PHOTO_W + 480}
          height={PHOTO_H + 360}
          style={{ position: "absolute", right: PAD - 240, top: PAD - 180 }}
        />
        {/* the horizon: a low ember glow along the floor */}
        <img
          src={HORIZON}
          alt=""
          width={OG_SIZE.width + 400}
          height={360}
          style={{ position: "absolute", left: -200, bottom: -200 }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            paddingRight: 56,
          }}
        >
          {profile.available ? (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 12, height: 12, borderRadius: 999, background: OG.glow }} />
              <div style={{ fontSize: 24, fontWeight: 500, color: OG.muted }}>
                {profile.availableNote}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex" }} />
          )}

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontFamily: displayFont,
                fontWeight: 300,
                fontSize: 96,
                lineHeight: 1,
                letterSpacing: -1.5,
                color: OG.ink,
              }}
            >
              {SPOKEN_NAME}
            </div>
            <div style={{ display: "flex", marginTop: 20, fontSize: 30, fontWeight: 500, color: OG.ink2 }}>
              {profile.role}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontFamily: displayFont,
                fontWeight: 300,
                fontSize: 38,
                lineHeight: 1.2,
                color: OG.ink,
                maxWidth: 560,
              }}
            >
              {bio.client.lede}
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 24, color: OG.muted }}>{OG_HOST}</div>
        </div>

        {portrait ? (
          <img
            src={portrait}
            alt=""
            width={PHOTO_W}
            height={PHOTO_H}
            style={{ borderRadius: 12, objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: PHOTO_W,
              height: PHOTO_H,
              borderRadius: 12,
              background: OG.surface2,
            }}
          />
        )}
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
