import type { MetadataRoute } from "next";
import { profile, projects } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: profile.site,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...["/work", "/about", "/contact"].map((path) => ({
      url: `${profile.site}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...projects.map((project) => ({
      url: `${profile.site}/work/${project.id}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
