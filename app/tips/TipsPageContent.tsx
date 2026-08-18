"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { tips, TIP_CATEGORIES, type TipCategory } from "@/lib/tips";
import { useTipViews } from "./useTipViews";

function TipsPageInner() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") as TipCategory | null;
  const [activeCat, setActiveCat] = useState<TipCategory | "전체">(
    initialCat && TIP_CATEGORIES.some((c) => c.label === initialCat)
      ? initialCat
      : "전체",
  );
  const [sortBy, setSortBy] = useState<"popular" | "latest">("popular");
  const viewCounts = useTipViews(tips);
  const getViews = (id: string, fallback: number) => viewCounts[id] ?? fallback;

  const filtered =
    activeCat === "전체" ? tips : tips.filter((t) => t.category === activeCat);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "popular") {
      const viewDiff =
        getViews(b.id, b.views) - getViews(a.id, a.views);
      if (viewDiff !== 0) return viewDiff;
      return b.createdAt.localeCompare(a.createdAt);
    }
    return b.createdAt.localeCompare(a.createdAt);
  });

  return (
    <main
      className="bg-white min-h-screen"
      style={{
        fontFamily:
          "'Wanted Sans Variable', 'Wanted Sans', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
      }}>
      {/* HEADER */}
      <section className="bg-white px-5 pt-8 md:pt-12">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-[24px] font-black md:text-center md:text-[32px]">
            꿀팁게시판
          </h1>
        </div>
      </section>

      {/* CATEGORY TABS */}
      <section className="border-b border-neutral-200 bg-white px-5 pt-5">
        <div className="mx-auto max-w-5xl">
          <div
            className="flex gap-0 overflow-x-auto -mb-px md:justify-center"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}>
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {[{ label: "전체" as const, emoji: "" }, ...TIP_CATEGORIES].map(
              (cat) => {
                const isActive = activeCat === cat.label;
                return (
                  <button
                    key={cat.label}
                    onClick={() => setActiveCat(cat.label)}
                    className="flex-shrink-0 px-5 pb-3 text-[17px] font-bold transition-all md:px-7 md:text-[20px]"
                    style={{
                      color: isActive ? "#111" : "#9ca3af",
                      borderBottom: isActive
                        ? "2.5px solid #111"
                        : "2.5px solid transparent",
                      background: "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}>
                    {cat.label}
                  </button>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* COUNT + SORT */}
      <section className="px-5 pt-5 md:pt-7">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <p className="text-[14px] text-neutral-600 md:text-[15px]">
            {activeCat === "전체" ? "" : activeCat}{" "}
            <span className="font-bold text-[#1f66ff]">
              총 {sorted.length}건
            </span>
          </p>
          <div className="flex gap-3 text-[14px] md:text-[15px]">
            <button
              onClick={() => setSortBy("popular")}
              style={{
                fontWeight: sortBy === "popular" ? 800 : 500,
                color: sortBy === "popular" ? "#111" : "#9ca3af",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}>
              인기순
            </button>
            <button
              onClick={() => setSortBy("latest")}
              style={{
                fontWeight: sortBy === "latest" ? 800 : 500,
                color: sortBy === "latest" ? "#111" : "#9ca3af",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}>
              최신순
            </button>
          </div>
        </div>
      </section>

      {/* CONTENT AREA */}
      <section className="px-5 pt-3 pb-20 md:pt-5 md:pb-28">
        <div className="mx-auto max-w-5xl">
          {sorted.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-[48px]">📝</p>
              <p className="mt-4 text-[16px] font-bold text-neutral-400">
                아직 등록된 꿀팁이 없습니다
              </p>
              <p className="mt-1 text-[14px] text-neutral-400">
                곧 유용한 정보가 올라옵니다!
              </p>
            </div>
          ) : (
            <>
              {/* ── 데스크탑: 카드 그리드 (아정당 PC 스타일) ── */}
              <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-5">
                {sorted.map((tip) => (
                  <Link
                    key={tip.id}
                    href={`/tips/${tip.id}`}
                    className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg"
                    style={{ textDecoration: "none" }}>
                    {/* CARD THUMBNAIL */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                      {tip.thumbnail ? (
                        <Image
                          src={tip.thumbnail}
                          alt={tip.title}
                          fill
                          sizes="(max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                          <span className="text-[48px]">💡</span>
                        </div>
                      )}
                    </div>
                    {/* CARD CONTENT */}
                    <div className="p-4">
                      <h3 className="text-[15px] font-extrabold leading-[1.45] text-neutral-900 line-clamp-2 group-hover:text-[#1f66ff] transition-colors">
                        {tip.title}
                      </h3>
                      <p className="mt-1.5 text-[13px] leading-[1.5] text-neutral-500 line-clamp-2">
                        {tip.description}
                      </p>
                      <div className="mt-3 flex items-center gap-3 text-[12px] text-neutral-400">
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
                          {getViews(tip.id, tip.views).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          0
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* ── 모바일: 가로 리스트 (아정당 모바일 스타일) ── */}
              <div className="flex flex-col divide-y divide-neutral-100 md:hidden">
                {sorted.map((tip) => (
                  <Link
                    key={tip.id}
                    href={`/tips/${tip.id}`}
                    className="group flex gap-4 py-5"
                    style={{ textDecoration: "none" }}>
                    {/* THUMBNAIL */}
                    <div
                      className="relative flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100"
                      style={{ width: 120, height: 90 }}>
                      {tip.thumbnail ? (
                        <Image
                          src={tip.thumbnail}
                          alt={tip.title}
                          fill
                          sizes="120px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                          <span className="text-[28px]">💡</span>
                        </div>
                      )}
                    </div>
                    {/* CONTENT */}
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <h3 className="text-[16px] font-extrabold leading-[1.45] text-neutral-900 line-clamp-2 group-hover:text-[#1f66ff] transition-colors">
                        {tip.title}
                      </h3>
                      <p className="mt-1 text-[13px] leading-[1.5] text-neutral-500 line-clamp-2">
                        {tip.description}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-[12px] text-neutral-400">
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
                          {getViews(tip.id, tip.views).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          0
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default function TipsPageContent() {
  return (
    <Suspense>
      <TipsPageInner />
    </Suspense>
  );
}
