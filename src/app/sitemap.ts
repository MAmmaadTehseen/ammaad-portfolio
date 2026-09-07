import type { MetadataRoute } from "next";
import { profile } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: profile.site,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
