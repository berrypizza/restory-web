import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cases } from "@/lib/case-data";
import BeforeAfterToggle from "./BeforeAfterToggle";
import FloatingCTA from "@/app/components/landing/shared/FloatingCTA";
import type { Metadata } from "next";

export function generateStaticParams() {
  return cases.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = cases.find((c) => c.id === id);
  if (!item) return {};

  return {
    title: item.title,
    description: item.summary,
    alternates: {
      canonical: `https://restorystudio.co.kr/cases/${item.id}`,
    },
    openGraph: {
      title: item.title,
      description: item.summary,
      url: `https://restorystudio.co.kr/cases/${item.id}`,
      type: "article",
      images: [
        {
          url: `https://restorystudio.co.kr${item.afterImg}`,
          width: 1200,
          height: 900,
          alt: `${item.title} 시공 후`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.summary,
      images: [`https://restorystudio.co.kr${item.afterImg}`],
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

  // 같은 카테고리 관련 사례 (현재 것 제외, 최신 3개)
  const related = cases
    .filter((c) => c.category === item.category && c.id !== item.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-white mx-auto max-w-2xl px-4 pt-5">
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
        <h1
          className="text-base font-bold truncate"
          style={{ color: "#111827" }}>
          {item.title}
        </h1>
      </div>

      <div className="pt-5 pb-32">
        {/* 메타 */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: "#1f66ff15", color: "#1f66ff" }}>
            {item.category}
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

        <h2 className="text-2xl font-black mb-2" style={{ color: "#111827" }}>
          {item.title}
        </h2>
        <p
          className="text-base leading-relaxed mb-6"
          style={{ color: "#64748b" }}>
          {item.summary}
        </p>

        {/* Before / After 토글 */}
        <BeforeAfterToggle item={item} />

        {/* ── 인라인 CTA — Before/After 바로 아래 ── */}
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
            <h3
              className="text-xl font-black mb-4"
              style={{ color: "#111827" }}>
              작업 내용
            </h3>
            <p
              className="leading-8 whitespace-pre-line"
              style={{ color: "#475569" }}>
              {item.content}
            </p>
          </section>
        )}

        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "#f3f4f6", color: "#64748b" }}>
              #{tag}
            </span>
          ))}
        </div>

        {/* ── 관련 사례 ── */}
        {related.length > 0 && (
          <section className="mb-8">
            <div className="h-px mb-6" style={{ backgroundColor: "#f3f4f6" }} />
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-[15px] font-black"
                style={{ color: "#111827" }}>
                비슷한 사례
              </h3>
              <Link
                href={`/cases?cat=${item.category}`}
                className="text-[12px] font-bold"
                style={{ color: "#1a5cff", textDecoration: "none" }}>
                전체 보기 →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/cases/${r.id}`}
                  className="block overflow-hidden rounded-xl"
                  style={{
                    border: "1px solid #e5e7eb",
                    textDecoration: "none",
                  }}>
                  <div className="relative aspect-square overflow-hidden bg-neutral-100">
                    <Image
                      src={
                        r.parentCategory === "싱크대 리폼" ||
                        r.parentCategory === "가죽 리폼"
                          ? r.afterImg
                          : r.beforeImg
                      }
                      alt={r.title}
                      fill
                      className="object-cover"
                      sizes="33vw"
                    />
                  </div>
                  <div className="p-2">
                    <p
                      className="text-[11px] font-bold truncate"
                      style={{ color: "#111827" }}>
                      {r.title}
                    </p>
                    <p
                      className="text-[10px] mt-0.5"
                      style={{ color: "#94a3b8" }}>
                      {r.region}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── 하단 CTA ── */}
        <div className="h-px mb-6" style={{ backgroundColor: "#f3f4f6" }} />
        <div
          className="rounded-2xl p-5 mb-4"
          style={{ background: "#f8f9fb", border: "1px solid #e5e7eb" }}>
          <p
            className="text-[15px] font-black mb-1"
            style={{ color: "#111827" }}>
            {item.category} 문의하기
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

        {/* 블로그 / 카페 링크 (SEO + 추가 정보) */}
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
