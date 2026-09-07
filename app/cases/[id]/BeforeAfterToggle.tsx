"use client";

import { useState } from "react";
import Image from "next/image";
import type { CaseItem } from "@/lib/case-data";

export default function BeforeAfterToggle({ item }: { item: CaseItem }) {
  const [view, setView] = useState<"before" | "after">("before");
  const [afterLoaded, setAfterLoaded] = useState(false);

  return (
    <>
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
            boxShadow: view === "after" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}>
          🔵 After
        </button>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl mb-6"
        style={{ backgroundColor: "#f3f4f6", aspectRatio: "4/3" }}>
        {/* Before — priority로 LCP 최우선, 항상 HTML에 존재 (네이버 크롤러 수집) */}
        <Image
          src={item.beforeImg}
          alt={`${item.title} 수리 전`}
          fill
          sizes="(max-width: 768px) 100vw, 672px"
          className="object-cover transition-opacity duration-300"
          priority
          style={{ opacity: view === "before" ? 1 : 0 }}
        />

        {/* After — before 로드 완료 후 idle 시점에 lazy 로드
            항상 HTML에 존재하므로 네이버가 수집 가능 */}
        <Image
          src={item.afterImg}
          alt={`${item.title} 수리 후`}
          fill
          sizes="(max-width: 768px) 100vw, 672px"
          className="object-cover transition-opacity duration-300"
          loading="lazy"
          onLoad={() => setAfterLoaded(true)}
          style={{
            opacity: view === "after" && afterLoaded ? 1 : 0,
          }}
        />

        {/* After 탭인데 아직 로딩 중이면 스피너 */}
        {view === "after" && !afterLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-6 h-6 rounded-full border-2 animate-spin"
              style={{ borderColor: "#e5e7eb", borderTopColor: "#1f66ff" }}
            />
          </div>
        )}

        <div
          className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-black"
          style={{
            backgroundColor: view === "before" ? "#ef4444" : "#1f66ff",
            color: "white",
            transition: "background-color 0.2s",
          }}>
          {view === "before" ? "BEFORE" : "AFTER"}
        </div>
      </div>
    </>
  );
}
