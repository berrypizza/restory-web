import type { MetadataRoute } from "next";
import { cases } from "@/lib/case-data";
import {
  REPAIR_KEYWORD_SLUGS,
  KITCHEN_KEYWORD_SLUGS,
  LEATHER_KEYWORD_SLUGS,
  SOFA_KEYWORD_SLUGS,
} from "@/lib/keyword-slugs";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.restorystudio.co.kr";

  // ── 정적 페이지 ──────────────────────────────────────────
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
      path: "/leather/meeting-table",
      priority: 0.8,
      changeFrequency: "weekly" as const,
      lastModified: "2026-07-13",
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
      path: "/repair/sink-top-crack",
      priority: 0.8,
      changeFrequency: "weekly" as const,
      lastModified: "2026-08-25",
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

  // ── 키워드 랜딩 페이지 ───────────────────────────────────
  // priority 0.5 — 메인/서비스 페이지보다 낮게 설정 (네이버 크롤 우선순위 조정)
  const repairKeywordEntries = REPAIR_KEYWORD_SLUGS.map((slug) => ({
    url: `${base}/repair/${encodeURIComponent(slug)}`,
    lastModified: new Date("2026-06-01").toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const kitchenKeywordEntries = KITCHEN_KEYWORD_SLUGS.map((slug) => ({
    url: `${base}/kitchen/sink-door/${encodeURIComponent(slug)}`,
    lastModified: new Date("2026-06-01").toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const leatherKeywordEntries = LEATHER_KEYWORD_SLUGS.map((slug) => ({
    url: `${base}/leather/${encodeURIComponent(slug)}`,
    lastModified: new Date("2026-06-01").toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const sofaKeywordEntries = SOFA_KEYWORD_SLUGS.map((slug) => ({
    url: `${base}/sofa/${encodeURIComponent(slug)}`,
    lastModified: new Date("2026-06-01").toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // ── 케이스 페이지 ────────────────────────────────────────
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

  return [
    ...staticEntries,
    ...repairKeywordEntries,
    ...kitchenKeywordEntries,
    ...leatherKeywordEntries,
    ...sofaKeywordEntries,
    ...caseEntries,
  ];
}
