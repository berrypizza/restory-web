"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cases } from "@/lib/case-data";

export default function CaseDetailPage() {
  const { id } = useParams();
  const item = cases.find((c) => c.id === id);
  const [view, setView] = useState<"before" | "after">("before");

  if (!item) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-lg font-bold" style={{ color: "#111827" }}>
            사례를 찾을 수 없어요
          </p>
          <Link
            href="/cases"
            className="mt-4 inline-block text-sm font-bold"
            style={{ color: "#1f66ff" }}>
            ← 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-28">
      {/* 상단 네비 */}
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
        {/* 카테고리 + 날짜 */}
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

        {/* 제목 */}
        <h2 className="text-2xl font-black mb-2" style={{ color: "#111827" }}>
          {item.title}
        </h2>
        <p
          className="text-base leading-relaxed mb-6"
          style={{ color: "#64748b" }}>
          {item.summary}
        </p>

        {/* 전/후 토글 */}
        <div
          className="flex rounded-xl p-1 mb-4"
          style={{ backgroundColor: "#f3f4f6" }}>
          <button
            onClick={() => setView("before")}
            className="flex-1 rounded-lg py-2.5 text-sm font-bold transition-all"
            style={{
              backgroundColor: view === "before" ? "#ffffff" : "transparent",
              color: view === "before" ? "#ef4444" : "#94a3b8",
              boxShadow:
                view === "before" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}>
            🔴 Before
          </button>
          <button
            onClick={() => setView("after")}
            className="flex-1 rounded-lg py-2.5 text-sm font-bold transition-all"
            style={{
              backgroundColor: view === "after" ? "#ffffff" : "transparent",
              color: view === "after" ? "#1f66ff" : "#94a3b8",
              boxShadow:
                view === "after" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}>
            🔵 After
          </button>
        </div>

        {/* 사진 */}
        <div
          className="relative overflow-hidden rounded-2xl mb-6"
          style={{ backgroundColor: "#f3f4f6", aspectRatio: "4/3" }}>
          <Image
            src={view === "before" ? item.beforeImg : item.afterImg}
            alt={`${item.title} ${view === "before" ? "수리 전" : "수리 후"}`}
            fill
            className="object-cover transition-opacity duration-300"
          />
          {/* 수리 전/후 라벨 */}
          <div
            className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-black"
            style={{
              backgroundColor: view === "before" ? "#ef4444" : "#1f66ff",
              color: "white",
            }}>
            {view === "before" ? "BEFORE" : "AFTER"}
          </div>
        </div>

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

        {/* 구분선 */}
        <div className="h-px mb-6" style={{ backgroundColor: "#f3f4f6" }} />

        {/* 블로그 링크 */}
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

        {/* CTA */}
        <div className="mt-6 flex flex-col gap-2.5">
          <a
            href="https://pf.kakao.com/_aHYsX/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black transition hover:opacity-90"
            style={{ backgroundColor: "#FEE500", color: "#1a1a1a" }}>
            💬 카카오톡 상담하기
          </a>
          <a
            href="tel:010-9127-3024"
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
