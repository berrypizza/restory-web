import Link from "next/link";
import { notFound } from "next/navigation";
import { cases } from "@/lib/case-data";
import BeforeAfterToggle from "./BeforeAfterToggle";

export function generateStaticParams() {
  return cases.map((item) => ({
    id: item.id,
  }));
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = cases.find((c) => c.id === id);

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white pb-28 mx-auto max-w-2xl px-4 pt-5">
      <div
        className="sticky top-0 z-30 bg-white px-4 py-3 flex items-center gap-3"
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

      <div className="mx-auto max-w-2xl px-4 pt-5">
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

        <BeforeAfterToggle item={item} />

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

        <div className="h-px mb-6" style={{ backgroundColor: "#f3f4f6" }} />

        <a
          href={item.blogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-2xl px-5 py-4 transition hover:shadow-md"
          style={{
            backgroundColor: "#f8fbff",
            border: "1px solid #dbe8ff",
            textDecoration: "none",
          }}>
          <div>
            <p
              className="text-sm font-black mb-0.5"
              style={{ color: "#1f66ff" }}>
              블로그에서 자세히 보기
            </p>
            <p className="text-xs" style={{ color: "#94a3b8" }}>
              작업 과정과 상세 후기를 확인하세요
            </p>
          </div>
          <span className="text-lg" style={{ color: "#1f66ff" }}>
            ›
          </span>
        </a>

        <div className="mt-6 flex flex-col gap-2.5">
          <a
            href="http://pf.kakao.com/_hQExjX/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black transition hover:opacity-90"
            style={{ backgroundColor: "#FEE500", color: "#1a1a1a" }}>
            💬 카카오톡 상담하기
          </a>

          <a
            href="tel:010-6855-0957"
            className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black text-white"
            style={{
              background: "linear-gradient(to right, #1f66ff, #4f8fff)",
            }}>
            📞 전화 문의
          </a>
        </div>
      </div>
    </main>
  );
}
