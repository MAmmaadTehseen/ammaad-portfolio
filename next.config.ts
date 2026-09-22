import type { NextConfig } from "next";

/** Old project URLs that search engines may still hold. */
const MOVED: Record<string, string> = {
  em: "/work",
  "psx-tracker": "/work",
  samosa: "/work/samosa-rain-alert",
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  async redirects() {
    return Object.entries(MOVED).map(([slug, destination]) => ({
      source: `/work/${slug}`,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
