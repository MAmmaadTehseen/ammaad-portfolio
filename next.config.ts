import type { NextConfig } from "next";

/** Old project URLs that search engines may still hold. */
const MOVED: Record<string, string> = {
  em: "/work",
  "psx-tracker": "/work",
  samosa: "/work/rain-alert",
  "samosa-rain-alert": "/work/rain-alert",
  // the meeting automation is now told as one project with the meeting platform
  "meeting-automation": "/work/ai-meeting-platform",
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  // AVIF first: the portrait is the heaviest byte on the page and the LCP
  // candidate on home, and AVIF roughly halves it against WebP
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return Object.entries(MOVED).map(([slug, destination]) => ({
      source: `/work/${slug}`,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
