import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cases } from "@/lib/case-data";
import BeforeAfterToggle from "./BeforeAfterToggle";
import FloatingCTA from "@/app/components/landing/shared/FloatingCTA";
import CollapsibleContent from "./CollapsibleContent";
import RelatedCases from "./Relatedcases";
import type { Metadata } from "next";

export function generateStaticParams() {
  return cases.map((item) => ({ id: item.id }));
}

const REFORM_CATEGORIES = ["싱크대 리폼", "가죽 리폼"] as const;

function isReformCategory(cat: string) {
  return REFORM_CATEGORIES.includes(cat as (typeof REFORM_CATEGORIES)[number]);
}

// OG 이미지: 리폼 → after(결과물), 수리/복원 → before(문제 상황)
function getOgImage(item: (typeof cases)[number]) {
  return isReformCategory(item.parentCategory) ? item.afterImg : item.beforeImg;
}

// 네이버 스니펫용 description — 120자 이내, 지역+서비스+CTA
function buildMetaDescription(item: (typeof cases)[number]): string {
  const action = isReformCategory(item.parentCategory)
    ? "리폼 결과가 궁금하다면?"
    : "수리가 필요하다면?";
  const desc = `${item.region} ${item.parentCategory} ${action} 리스토리가 현장 확인 후 바로 해결합니다. 사진 한 장으로 견적 확인 →`;
  // 120자 초과 시 자름
  return desc.length > 120 ? desc.slice(0, 119) + "…" : desc;
}

// title: "지역 서비스명 | 당일출장 리스토리" — "사례" 제거, 행동 유도
function buildMetaTitle(item: (typeof cases)[number]): string {
  // item.title에서 " 사례" 접미어 제거
  const cleanTitle = item.title.replace(/\s*사례$/, "");
  return `${cleanTitle} | 리스토리 스튜디오`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = cases.find((c) => c.id === id);
  if (!item) return {};

  const ogImage = getOgImage(item);
  const metaDesc = buildMetaDescription(item);
  const metaTitle = buildMetaTitle(item);
  const isReform = isReformCategory(item.parentCategory);

  return {
    title: metaTitle,
    description: metaDesc,
    alternates: {
      canonical: `https://restorystudio.co.kr/cases/${item.id}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: `https://restorystudio.co.kr/cases/${item.id}`,
      type: "article",
      images: [
        {
          url: `https://restorystudio.co.kr${ogImage}`,
          width: 1200,
          height: 900,
          alt: isReform
            ? `${item.title} 리폼 후 결과`
            : `${item.title} 수리 전 상태`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDesc,
      images: [`https://restorystudio.co.kr${ogImage}`],
    },
  };
}

const PHONE = "tel:010-6855-0957";
const KAKAO_URL = "http://pf.kakao.com/_hQExjX/chat";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = cases.find((c) => c.id === id);
  if (!item) notFound();

  const isReform = isReformCategory(item.parentCategory);

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: buildMetaDescription(item),
    datePublished: item.date,
    dateModified: item.date,
    image: `https://restorystudio.co.kr${item.afterImg}`,
    keywords: item.tags.map((t) => t.trim()).join(", "),
    articleSection: item.parentCategory,
    about: {
      "@type": "Service",
      name: item.parentCategory,
      serviceType: item.category,
      areaServed: {
        "@type": "Place",
        name: item.region,
      },
    },
    author: {
      "@type": "LocalBusiness",
      name: "리스토리 스튜디오",
      url: "https://restorystudio.co.kr",
      telephone: "010-6855-0957",
      address: {
        "@type": "PostalAddress",
        addressLocality: item.region,
        addressCountry: "KR",
      },
    },
    publisher: {
      "@type": "LocalBusiness",
      name: "리스토리 스튜디오",
      url: "https://restorystudio.co.kr",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://restorystudio.co.kr/cases/${item.id}`,
    },
  };

  return (
    <main className="min-h-screen bg-white mx-auto max-w-2xl px-4 pt-5">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 헤더 */}
      <div
        className="sticky top-0 z-30 bg-white px-4 py-3 -mx-4 flex items-center gap-3"
        style={{ borderBottom: "1px solid #f3f4f6" }}>
        <Link
          href="/cases"
          className="text-lg"
          style={{ color: "#64748b", textDecoration: "none" }}>
          ←
        </Link>
        <span
          className="text-base font-bold truncate"
          style={{ color: "#111827" }}>
          {item.title}
        </span>
      </div>

      <div className="pt-5 pb-32">
        {/* 메타 */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: "#1f66ff15", color: "#1f66ff" }}>
            {item.parentCategory}
          </span>
          <span className="text-xs" style={{ color: "#94a3b8" }}>
            {item.region}
          </span>
          <span style={{ color: "#d1d5db" }}>·</span>
          <span className="text-xs" style={{ color: "#94a3b8" }}>
            {new Date(item.date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* h1 — 페이지 전체에서 하나 */}
        <h1 className="text-2xl font-black mb-2" style={{ color: "#111827" }}>
          {item.title}
        </h1>
        <p
          className="text-base leading-relaxed mb-6"
          style={{ color: "#64748b" }}>
          {item.summary}
        </p>

        {/* Before / After 토글 */}
        <BeforeAfterToggle item={item} />

        {/* 인라인 CTA */}
        <div
          className="rounded-2xl p-5 mb-8"
          style={{
            background: "linear-gradient(135deg, #0a1628 0%, #1a3a6b 100%)",
          }}>
          <p
            className="text-[13px] font-semibold mb-1"
            style={{ color: "rgba(255,255,255,0.5)" }}>
            이런 증상 있으신가요?
          </p>
          <p className="text-[17px] font-black text-white mb-4">
            사진 한 장이면 바로 견적 드립니다
          </p>
          <div className="flex flex-col gap-2">
            <a
              href={KAKAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-[15px] font-black"
              style={{ background: "#FEE500", color: "#1a1a1a" }}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
              </svg>
              카카오로 사진 보내기
            </a>
            <a
              href={PHONE}
              className="flex items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-bold text-white"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}>
              📞 전화 문의
            </a>
          </div>
        </div>

        {/* 작업 내용 */}
        {item.content && (
          <section className="mb-8">
            <h2
              className="text-xl font-black mb-4"
              style={{ color: "#111827" }}>
              작업 내용
            </h2>
            <CollapsibleContent content={item.content} collapsedHeight={160} />
          </section>
        )}

        {/* 태그 — 클릭 시 해당 태그 검색 결과로 이동 (내부 링크) */}
        <div className="flex flex-wrap gap-2 mb-8">
          {item.tags.map((tag) => (
            <Link
              key={tag}
              href={`/cases?tag=${encodeURIComponent(tag.trim())}`}
              className="text-xs font-bold px-3 py-1.5 rounded-full transition-colors hover:bg-[#1f66ff] hover:text-white"
              style={{
                backgroundColor: "#f3f4f6",
                color: "#64748b",
                textDecoration: "none",
              }}>
              #{tag.trim()}
            </Link>
          ))}
        </div>

        {/* 관련 사례 */}
        <RelatedCases
          currentId={item.id}
          currentParentCategory={item.parentCategory}
        />

        {/* 하단 CTA */}
        <div className="h-px mb-6" style={{ backgroundColor: "#f3f4f6" }} />
        <div
          className="rounded-2xl p-5 mb-4"
          style={{ background: "#f8f9fb", border: "1px solid #e5e7eb" }}>
          <p
            className="text-[15px] font-black mb-1"
            style={{ color: "#111827" }}>
            {item.parentCategory} 문의하기
          </p>
          <p className="text-[13px] mb-4" style={{ color: "#64748b" }}>
            사진 한 장이면 수리 가능 여부 바로 확인해드립니다
          </p>
          <div className="flex flex-col gap-2">
            <a
              href={KAKAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-[15px] font-black"
              style={{ background: "#FEE500", color: "#1a1a1a" }}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
              </svg>
              카카오로 문의하기
            </a>
            <a
              href={PHONE}
              className="flex items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #3672ff 0%, #1a5cff 100%)",
              }}>
              📞 전화 문의
            </a>
          </div>
        </div>

        {/* 블로그 / 카페 링크 */}
        <a
          href={item.blogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-2xl px-5 py-4 mb-2 transition hover:shadow-md"
          style={{
            backgroundColor: "#f8fbff",
            border: "1px solid #b7d1ff",
            textDecoration: "none",
          }}>
          <div>
            <p
              className="text-medium font-black mb-0.5"
              style={{ color: "#1f66ff" }}>
              블로그에서 자세히 보기
            </p>
            <p className="text-xs" style={{ color: "#748aa8" }}>
              작업 과정과 상세 후기를 확인하세요
            </p>
          </div>
          <span className="text-lg" style={{ color: "#1f66ff" }}>
            ›
          </span>
        </a>
        <a
          href="https://cafe.naver.com/f-e/cafes/22748193/menus/85?viewType=L"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-2xl px-5 py-4 transition hover:shadow-md"
          style={{
            backgroundColor: "#1f66ff",
            border: "1px solid #dbe8ff",
            textDecoration: "none",
          }}>
          <div>
            <p
              className="text-medium font-black mb-0.5"
              style={{ color: "#ffffff" }}>
              궁금한 점 문의하기
            </p>
            <p className="text-xs" style={{ color: "#ffffffde" }}>
              사소한 질문이라도 언제든지 환영입니다!
            </p>
          </div>
          <span className="text-lg" style={{ color: "#ffffff" }}>
            ›
          </span>
        </a>
      </div>

      <FloatingCTA />
    </main>
  );
}
