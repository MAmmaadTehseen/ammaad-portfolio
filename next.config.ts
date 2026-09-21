import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  // projects that moved from their own page to the one-line "Also built" list
  async redirects() {
    return ["em", "samosa"].map((slug) => ({
      source: `/work/${slug}`,
      destination: "/work",
      permanent: true,
    }));
  },
};

export default nextConfig;
