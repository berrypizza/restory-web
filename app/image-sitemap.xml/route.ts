import { cases } from "@/lib/case-data";
import { NextResponse } from "next/server";

const REFORM_CATEGORIES = ["싱크대 리폼", "가죽 리폼"] as const;
function isReformCategory(cat: string) {
  return REFORM_CATEGORIES.includes(cat as (typeof REFORM_CATEGORIES)[number]);
}

export async function GET() {
  const base = "https://restorystudio.co.kr";

  const urlEntries = cases
    .map((c) => {
      const isReform = isReformCategory(c.parentCategory);
      // 썸네일 우선 이미지 (리폼: after, 수리/복원: before) — 리스트와 동일한 로직
      const primaryImg = isReform ? c.afterImg : c.beforeImg;
      const secondaryImg = isReform ? c.beforeImg : c.afterImg;

      return `
  <url>
    <loc>${base}/cases/${c.id}</loc>
    <image:image>
      <image:loc>${base}${primaryImg}</image:loc>
      <image:title>${c.title}</image:title>
      <image:caption>${c.summary}</image:caption>
    </image:image>
    <image:image>
      <image:loc>${base}${secondaryImg}</image:loc>
      <image:title>${c.title} - ${isReform ? "리폼 전" : "수리 후"}</image:title>
      <image:caption>${c.summary}</image:caption>
    </image:image>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
