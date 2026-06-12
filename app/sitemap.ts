import type { MetadataRoute } from "next";
import { cases } from "@/lib/case-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.restorystudio.co.kr";

  // 정적 페이지 — lastModified를 실제 배포/수정일 기준으로 고정
  const staticPages = [
    {
      path: "",
      priority: 1.0,
      changeFrequency: "weekly" as const,
      lastModified: "2026-06-01",
    },
    {
      path: "/repair/sangbujang",
      priority: 0.9,
      changeFrequency: "weekly" as const,
      lastModified: "2026-06-01",
    },
    {
      path: "/kitchen/sink-door",
      priority: 0.9,
      changeFrequency: "weekly" as const,
      lastModified: "2026-06-01",
    },
    {
      path: "/leather/restaurant-chair",
      priority: 0.9,
      changeFrequency: "weekly" as const,
      lastModified: "2026-06-01",
    },
    {
      path: "/sofa",
      priority: 0.9,
      changeFrequency: "weekly" as const,
      lastModified: "2026-06-01",
    },
    {
      path: "/cases",
      priority: 0.8,
      changeFrequency: "weekly" as const,
      lastModified: "2026-06-01",
    },
    {
      path: "/events",
      priority: 0.7,
      changeFrequency: "weekly" as const,
      lastModified: "2026-06-01",
    },
    {
      path: "/repair/habujang",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: "2026-05-01",
    },
    {
      path: "/repair/hinge",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: "2026-05-01",
    },
    {
      path: "/repair/door-fall",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: "2026-05-01",
    },
    {
      path: "/repair/drawer-rail",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: "2026-05-01",
    },
    {
      path: "/repair/sliding-door",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: "2026-05-01",
    },
    {
      path: "/repair/bed-frame",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: "2026-05-01",
    },
    {
      path: "/repair/sofa-frame",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: "2026-05-01",
    },
    {
      path: "/repair/sofa-sag",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: "2026-05-01",
    },
    {
      path: "/repair/table-leg",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: "2026-05-01",
    },
    {
      path: "/leather/dining-chair",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: "2026-05-01",
    },
    {
      path: "/leather/office-chair",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: "2026-05-01",
    },
    {
      path: "/leather/restaurant-sofa",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: "2026-05-01",
    },
    {
      path: "/leather/custom",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: "2026-05-01",
    },
    {
      path: "/kitchen/fridge-cabinet",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: "2026-05-01",
    },
    {
      path: "/kitchen/rocheong",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: "2026-05-01",
    },
  ];

  const staticEntries = staticPages.map((page) => ({
    url: `${base}${page.path}`,
    lastModified: new Date(page.lastModified).toISOString(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // 케이스 페이지 — 최신 30일 이내는 0.8, 나머지 0.6
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const caseEntries = cases.map((c) => {
    const caseDate = c.date ? new Date(c.date) : new Date(0);
    const isRecent = caseDate >= thirtyDaysAgo;
    return {
      url: `${base}/cases/${c.id}`,
      lastModified: caseDate.toISOString(),
      changeFrequency: "monthly" as const,
      priority: isRecent ? 0.8 : 0.6,
    };
  });

  return [...staticEntries, ...caseEntries];
}
