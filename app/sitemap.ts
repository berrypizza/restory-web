import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://restorystudio.co.kr";
  const now = new Date().toISOString();

  // 정적 페이지
  const staticPages = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    {
      path: "/repair/sangbujang",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/kitchen/sink-door",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/leather/restaurant-chair",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    { path: "/sofa", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/cases", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/events", priority: 0.7, changeFrequency: "weekly" as const },
    // 서브 랜딩들
    {
      path: "/repair/habujang",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/repair/hinge",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/repair/door-fall",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/repair/drawer-rail",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/repair/sliding-door",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/repair/bed-frame",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/repair/sofa-frame",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/repair/sofa-sag",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/repair/table-leg",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/leather/dining-chair",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/leather/office-chair",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/leather/restaurant-sofa",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/leather/custom",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/kitchen/fridge-cabinet",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/kitchen/rocheong",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
  ];

  return staticPages.map((page) => ({
    url: `${base}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
