export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export const OG = {
  bg: "#0e1108",
  ink: "#f2f2ec",
  muted: "#a4a699",
  dim: "#74766a",
  signal: "#fa9524",
  primary: "#a4c752",
  line: "#2b2f22",
};

/**
 * Google serves TTF to plain clients and WOFF2 to modern ones; satori needs the
 * former. Every failure path falls back to the built-in font rather than taking
 * the build down over a share card.
 */
async function loadFont(family: string, weight: number) {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`, {
      headers: { "User-Agent": "Mozilla/4.0" },
    }).then((res) => res.text());
    const url = css.match(/src:\s*url\((.+?)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((res) => res.arrayBuffer());
  } catch {
    return null;
  }
}

export async function loadOgFonts() {
  const [display, mono] = await Promise.all([
    loadFont("Archivo", 700),
    loadFont("Martian+Mono", 400),
  ]);

  const fonts = [
    ...(display
      ? [{ name: "Archivo", data: display, weight: 700 as const, style: "normal" as const }]
      : []),
    ...(mono
      ? [{ name: "Martian Mono", data: mono, weight: 400 as const, style: "normal" as const }]
      : []),
  ];

  return {
    fonts: fonts.length ? fonts : undefined,
    displayFont: display ? "Archivo" : "sans-serif",
    monoFont: mono ? "Martian Mono" : "monospace",
  };
}
