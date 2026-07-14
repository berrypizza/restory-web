"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { tips, type Tip, type TipCategory } from "@/lib/tips";

/* ═══════════════════════════════════════════
   카테고리별 하단 배너 데이터
   ═══════════════════════════════════════════ */

const CATEGORY_BANNER: Record<
  TipCategory,
  { text: string; sub: string; href: string; emoji: string }
> = {
  "싱크대 수리": {
    text: "싱크대 수리 해도 또 떨어지면 어쩌지....?",
    sub: "본사 책임 AS 3년 보장으로 안심!",
    href: "/repair/sangbujang",
    emoji: "🔧",
  },
  "싱크대 리폼": {
    text: "문짝 교체로 새 주방 만들기, 가능할까?",
    sub: "전체 교체의 1/5 비용으로 해결!",
    href: "/kitchen/sink-door",
    emoji: "🔨",
  },
  "의자 천갈이": {
    text: "가죽 교체 했는데 금방 또 찢어지면 어쩌지...?",
    sub: "국내산 고급 가죽만 고집!!",
    href: "/leather/restaurant-chair",
    emoji: "🪑",
  },
  "가죽 리폼": {
    text: "가죽만 바꿔도 새 가구처럼 가능할까?",
    sub: "테이블·팔걸이·특수 가죽까지 맞춤 교체!",
    href: "/leather/meeting-table",
    emoji: "🧵",
  },
  "소파 리폼": {
    text: "복원 하고 또 소파 꺼지면 어쩌지..?",
    sub: "본사 책임 AS 3년 보장으로 안심!",
    href: "/sofa",
    emoji: "🛋️",
  },
};

/* ═══════════════════════════════════════════
   마크다운 → HTML 변환기
   ═══════════════════════════════════════════ */
function parseMarkdown(md: string): string {
  let html = md
    .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^## (.+)$/gm, '<h2 class="tip-h2">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="tip-h3">$1</h3>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/^> (.+)$/gm, '<blockquote class="tip-quote">$1</blockquote>')
    .replace(/^---$/gm, "<hr />")
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="tip-img" />',
    )
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="tip-link" target="_blank" rel="noopener noreferrer">$1</a>',
    )
    .replace(/^- (.+)$/gm, '<li class="tip-li">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="tip-li-num">$1</li>');

  html = html.replace(
    /(<li class="tip-li">[\s\S]*?<\/li>(\n|$))+/g,
    (match) => `<ul class="tip-ul">${match}</ul>`,
  );
  html = html.replace(
    /(<li class="tip-li-num">[\s\S]*?<\/li>(\n|$))+/g,
    (match) => `<ol class="tip-ol">${match}</ol>`,
  );

  const lines = html.split("\n");
  let inTable = false;
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const isTableRow = trimmed.startsWith("|") && trimmed.endsWith("|");
    const isSeparator = isTableRow && /^\|[\s\-:|]+\|$/.test(trimmed);

    if (isTableRow && !isSeparator) {
      const cells = trimmed
        .split("|")
        .filter((c) => c.trim() !== "")
        .map((c) => c.trim());

      if (!inTable) {
        inTable = true;
        result.push(
          '<div class="tip-table-wrap"><table class="tip-table"><thead><tr>',
        );
        result.push(cells.map((c) => `<th>${c}</th>`).join(""));
        result.push("</tr></thead><tbody>");
      } else {
        result.push(`<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`);
      }
    } else if (isSeparator) {
      // skip
    } else {
      if (inTable) {
        result.push("</tbody></table></div>");
        inTable = false;
      }
      if (
        trimmed &&
        !trimmed.startsWith("<h") &&
        !trimmed.startsWith("<blockquote") &&
        !trimmed.startsWith("<hr") &&
        !trimmed.startsWith("<ul") &&
        !trimmed.startsWith("<ol") &&
        !trimmed.startsWith("<li") &&
        !trimmed.startsWith("<table") &&
        !trimmed.startsWith("<div") &&
        !trimmed.startsWith("<pre") &&
        !trimmed.startsWith("<img") &&
        !trimmed.startsWith("</")
      ) {
        result.push(`<p class="tip-p">${trimmed}</p>`);
      } else {
        result.push(line);
      }
    }
  }
  if (inTable) result.push("</tbody></table></div>");

  return result.join("\n");
}

const PHONE = "tel:010-6855-0957";
const KAKAO_URL = "http://pf.kakao.com/_hQExjX/chat";
const PHOTO_URL = "http://pf.kakao.com/_hQExjX/chat";

export default function TipDetailContent({ tip }: { tip: Tip }) {
  const related = tips
    .filter((t) => t.category === tip.category && t.id !== tip.id)
    .slice(0, 4);

  const contentHtml = parseMarkdown(tip.content);
  const banner = CATEGORY_BANNER[tip.category];

  return (
    <main
      className="bg-white min-h-screen pb-[72px]"
      style={{
        fontFamily:
          "'Wanted Sans Variable', 'Wanted Sans', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
      }}>
      {/* BREADCRUMB */}
      <div className="border-b border-neutral-100 bg-white px-5 py-3">
        <div className="mx-auto max-w-3xl text-[12px] text-neutral-400 md:text-[13px]">
          <Link
            href="/tips"
            className="hover:text-[#1f66ff] transition-colors"
            style={{ textDecoration: "none", color: "inherit" }}>
            꿀팁게시판
          </Link>
          <span className="mx-1.5 text-neutral-300">›</span>
          <Link
            href={`/tips?cat=${tip.category}`}
            className="hover:text-[#1f66ff] transition-colors"
            style={{ textDecoration: "none", color: "inherit" }}>
            {tip.category}
          </Link>
        </div>
      </div>

      {/* ARTICLE */}
      <article className="px-5 pt-6 pb-12 md:pt-10 md:pb-16">
        <div className="mx-auto max-w-3xl">
          {/* HEADER */}
          <div className="border-b border-neutral-200 pb-5 md:pb-6">
            <h1 className="text-[22px] font-black leading-[1.4] text-neutral-900 md:text-[28px]">
              {tip.title}
            </h1>
            <div className="mt-3 flex items-center gap-3 text-[12px] text-neutral-400 md:text-[13px]">
              <span className="flex items-center gap-1">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {tip.views.toLocaleString()}
              </span>
              <span>·</span>
              <span>{tip.createdAt}</span>
              <span>·</span>
              <span>⏱ {tip.readingTime}분</span>
            </div>
          </div>

          {/* CONTENT */}
          <div
            className="tip-content mt-7 md:mt-8"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* CTA BOX */}
          <div
            className="mt-12 rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1f66ff 0%, #003bbb 100%)",
            }}>
            <div className="p-6 text-center text-white md:p-8">
              <p
                className="text-[14px] font-medium"
                style={{ color: "rgba(255,255,255,0.7)" }}>
                가구 수리가 필요하신가요?
              </p>
              <p className="mt-1 text-[22px] font-black md:text-[26px]">
                리스토리에서 📞 무료 견적 받기
              </p>
              <div className="mx-auto mt-5 flex max-w-sm flex-col gap-2.5 sm:flex-row">
                <a
                  href={PHONE}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-[15px] font-extrabold text-[#1f66ff]">
                  📞 전화 문의
                </a>
                <a
                  href={KAKAO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-[15px] font-extrabold"
                  style={{ background: "#FEE500", color: "#1a1a1a" }}>
                  💬 카카오톡 상담
                </a>
              </div>
              <a
                href={PHOTO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium"
                style={{ color: "rgba(255,255,255,0.6)" }}>
                📷 사진으로 견적 받기 →
              </a>
            </div>
          </div>

          {/* RELATED */}
          {related.length > 0 && (
            <div className="mt-10">
              <h3 className="text-[17px] font-black md:text-[19px]">
                관련 꿀팁
              </h3>
              <div className="mt-4 flex flex-col">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/tips/${r.id}`}
                    className="group flex gap-3.5 py-3 border-b border-neutral-100 last:border-b-0"
                    style={{ textDecoration: "none" }}>
                    <div className="relative flex-shrink-0 w-[80px] h-[60px] overflow-hidden rounded-lg bg-neutral-100">
                      {r.thumbnail ? (
                        <Image
                          src={r.thumbnail}
                          alt={r.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-[24px]">💡</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[14px] font-bold leading-[1.4] text-neutral-900 line-clamp-2 group-hover:text-[#1f66ff] transition-colors">
                        {r.title}
                      </p>
                      <span className="mt-1 text-[11px] text-neutral-400">
                        👁 {r.views.toLocaleString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* BACK */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/tips"
              className="inline-flex items-center gap-1 rounded-full border border-neutral-300 px-6 py-2.5 text-[14px] font-bold text-neutral-600 hover:border-[#1f66ff] hover:text-[#1f66ff] transition-colors"
              style={{ textDecoration: "none" }}>
              ← 꿀팁 목록으로
            </Link>
          </div>
        </div>
      </article>

      {/* ═══════════════════════════════════════
         하단 고정 배너 — 카테고리별 랜딩 유도
         아정당 스타일: 둥근 다크 배너
         ═══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 safe-bottom md:pb-5 mb-7 ">
        <Link
          href={banner.href}
          className="mx-auto flex max-w-3xl items-center justify-between rounded-2xl px-5 py-4 border-2 border-transparent"
          style={{
            background: "linear-gradient(135deg, #1f66ff 0%, #003bbb 100%)",
          }}>
          <div className="min-w-0">
            <p className="text-[17px] font-extrabold text-white truncate md:text-[16px]">
              {banner.text}
            </p>
            <p className="mt-0.5 text-[12px] font-medium text-white/90 md:text-[13px]">
              {banner.sub}
            </p>
          </div>
          <span className="flex-shrink-0 ml-3 text-white text-[20px]">›</span>
        </Link>
      </div>

      {/* 마크다운 콘텐츠 스타일 */}
      <style jsx global>{`
        .tip-content .tip-h2 {
          font-size: 20px;
          font-weight: 900;
          margin-top: 2.2rem;
          margin-bottom: 0.7rem;
          color: #111827;
          line-height: 1.4;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
        }
        .tip-content .tip-h3 {
          font-size: 17px;
          font-weight: 800;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: #1f2937;
          line-height: 1.4;
        }
        .tip-content .tip-p {
          font-size: 15px;
          line-height: 1.85;
          color: #374151;
          margin-bottom: 0.4rem;
        }
        .tip-content .tip-quote {
          border-left: 4px solid #1f66ff;
          padding: 14px 18px;
          margin: 1.2rem 0;
          background: #f0f4ff;
          border-radius: 0 10px 10px 0;
          font-size: 15px;
          line-height: 1.7;
          color: #1e40af;
          font-weight: 500;
        }
        .tip-content hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 2rem 0;
        }
        .tip-content .tip-ul,
        .tip-content .tip-ol {
          margin: 0.75rem 0;
          padding-left: 1.25rem;
        }
        .tip-content .tip-li,
        .tip-content .tip-li-num {
          font-size: 15px;
          line-height: 1.85;
          color: #374151;
          margin-bottom: 0.3rem;
        }
        .tip-content .tip-table-wrap {
          overflow-x: auto;
          margin: 1.2rem 0;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }
        .tip-content .tip-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          min-width: 400px;
        }
        .tip-content .tip-table th {
          background: #1f66ff;
          color: white;
          font-weight: 700;
          padding: 11px 14px;
          text-align: center;
          white-space: nowrap;
        }
        .tip-content .tip-table td {
          padding: 11px 14px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }
        .tip-content .tip-table tbody tr:nth-child(even) {
          background: #f9fafb;
        }
        .tip-content .tip-link {
          color: #1f66ff;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .tip-content strong {
          color: #1f66ff;
          font-weight: 800;
        }
        .tip-content .tip-img {
          width: 100%;
          border-radius: 12px;
          margin: 1rem 0;
        }
        .tip-content code {
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 13px;
        }
        .tip-content pre {
          background: #1e293b;
          color: #e2e8f0;
          padding: 16px;
          border-radius: 12px;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .tip-content pre code {
          background: transparent;
          padding: 0;
          color: inherit;
        }
        @media (min-width: 768px) {
          .tip-content .tip-h2 {
            font-size: 24px;
          }
          .tip-content .tip-h3 {
            font-size: 20px;
          }
          .tip-content .tip-p,
          .tip-content .tip-li,
          .tip-content .tip-li-num {
            font-size: 16px;
          }
          .tip-content .tip-table {
            font-size: 15px;
          }
        }
        .safe-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
      `}</style>
    </main>
  );
}
