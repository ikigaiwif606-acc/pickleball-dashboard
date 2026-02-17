import { MetadataRoute } from "next";
import courtsData from "@/data/courts.json";

const BASE_URL = "https://pickleball-dashboard.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const courtPages = courtsData.map((court) => ({
    url: `${BASE_URL}/courts/${court.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...courtPages,
  ];
}
