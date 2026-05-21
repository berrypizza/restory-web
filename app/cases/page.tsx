"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cases, CASE_CATEGORIES, type CaseCategory } from "@/lib/case-data";

export default function CasesPage() {
  const [cat, setCat] = useState<CaseCategory>("전체");

  const filtered =
    cat === "전체" ? cases : cases.filter((c) => c.category === cat);

  return (
    <main className="min-h-screen bg-white">
      {/* 헤더 */}
      <div
        className="sticky top-0 z-30 bg-white"
        style={{ borderBottom: "1px solid #f3f4f6" }}>
        <div className="mx-auto max-w-3xl px-4 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-black" style={{ color: "#111827" }}>
              작업사례
            </h1>
            <span className="text-sm font-bold" style={{ color: "#94a3b8" }}>
              총 {filtered.length}건
            </span>
          </div>

          {/* 카테고리 탭 */}
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}>
            <style>{`.cat-tabs::-webkit-scrollbar{display:none}`}</style>
            {CASE_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className="flex-shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all"
                style={{
                  backgroundColor: cat === c ? "#1f66ff" : "#f3f4f6",
                  color: cat === c ? "white" : "#64748b",
                }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 사례 리스트 */}
      <div className="mx-auto max-w-3xl px-4 py-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-3xl mb-3">📋</p>
            <p className="text-sm" style={{ color: "#94a3b8" }}>
              등록된 사례가 없어요
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((item) => (
              <Link
                key={item.id}
                href={`/cases/${item.id}`}
                className="flex gap-4 rounded-2xl p-3 transition hover:bg-gray-50"
                style={{ border: "1px solid #f3f4f6", textDecoration: "none" }}>
                {/* 썸네일 (before 이미지) */}
                <div
                  className="flex-shrink-0 rounded-xl overflow-hidden"
                  style={{ width: 88, height: 88, backgroundColor: "#f3f4f6" }}>
                  <Image
                    src={item.beforeImg}
                    alt={item.title}
                    width={88}
                    height={88}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 텍스트 */}
                <div className="flex-1 min-w-0 py-0.5">
                  <h3
                    className="text-[15px] font-bold truncate mb-1"
                    style={{ color: "#111827" }}>
                    {item.title}
                  </h3>
                  <p
                    className="text-xs mb-2 line-clamp-2"
                    style={{ color: "#64748b" }}>
                    {item.summary}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "#1f66ff15",
                        color: "#1f66ff",
                      }}>
                      {item.category}
                    </span>
                    <span className="text-[11px]" style={{ color: "#94a3b8" }}>
                      {item.region}
                    </span>
                    <span className="text-[11px]" style={{ color: "#d1d5db" }}>
                      ·
                    </span>
                    <span className="text-[11px]" style={{ color: "#94a3b8" }}>
                      {new Date(item.date).toLocaleDateString("ko-KR", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
