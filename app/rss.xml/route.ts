import { cases } from "@/lib/case-data";
import { NextResponse } from "next/server";

export async function GET() {
  const base = "https://www.restorystudio.co.kr";

  const items = cases
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((c) => {
      const pubDate = new Date(c.date).toUTCString();
      const url = `${base}/cases/${c.id}`;
      const content = c.content
        ? c.content
            .trim()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
        : c.summary
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

      return `
    <item>
      <title>${c.title.replace(/&/g, "&amp;")}</title>
      <link>${url}</link>
      <description>${content}</description>
      <pubDate>${pubDate}</pubDate>
      <guid>${url}</guid>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>리스토리 Re'Story - 작업사례</title>
    <link>${base}</link>
    <description>싱크대 수리·리폼, 의자 가죽 교체, 소파 복원 실제 작업사례. 서울·경기·인천 출장.</description>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=1800",
    },
  });
}
