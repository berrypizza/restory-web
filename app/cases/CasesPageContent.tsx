// app/cases/CasesPageContent.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  cases,
  PARENT_CATEGORIES,
  SUB_CATEGORIES,
  type ParentCategory,
  type CaseCategory,
} from "@/lib/case-data";

const PER_PAGE = 6;

const REFORM_CATEGORIES = ["싱크대 리폼", "가죽 리폼"] as const;
function isReformCategory(cat: string) {
  return REFORM_CATEGORIES.includes(cat as (typeof REFORM_CATEGORIES)[number]);
}

export default function CasesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCat = (searchParams.get("cat") as CaseCategory) || "전체";
  const initialTag = searchParams.get("tag") || "";

  // 초기 부모 카테고리 추론
  const getInitialParent = (): ParentCategory => {
    for (const [parent, subs] of Object.entries(SUB_CATEGORIES)) {
      if (subs?.includes(initialCat as CaseCategory)) {
        return parent as ParentCategory;
      }
    }
    if (PARENT_CATEGORIES.includes(initialCat as ParentCategory)) {
      return initialCat as ParentCategory;
    }
    return "전체";
  };

  const getInitialSub = (): CaseCategory | "전체" => {
    for (const subs of Object.values(SUB_CATEGORIES)) {
      if (subs?.includes(initialCat as CaseCategory)) {
        return initialCat as CaseCategory;
      }
    }
    return "전체";
  };

  const [parentCat, setParentCat] = useState<ParentCategory>(getInitialParent);
  const [subCat, setSubCat] = useState<CaseCategory | "전체">(getInitialSub);
  const [activeTag, setActiveTag] = useState<string>(initialTag);
  const [page, setPage] = useState(1);

  const subCategories =
    parentCat !== "전체" ? SUB_CATEGORIES[parentCat] : undefined;

  // 태그 필터 활성화 시 카테고리 초기화
  useEffect(() => {
    if (activeTag) {
      setParentCat("전체");
      setSubCat("전체");
      setPage(1);
    }
  }, [activeTag]);

  const filtered = cases
    .filter((c) => {
      // 태그 필터 우선
      if (activeTag) {
        return c.tags.map((t) => t.trim()).includes(activeTag);
      }
      if (parentCat === "전체") return true;
      if (c.parentCategory !== parentCat) return false;
      if (subCat !== "전체" && subCategories) return c.category === subCat;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const changeParent = (p: ParentCategory) => {
    setParentCat(p);
    setSubCat("전체");
    setActiveTag("");
    setPage(1);
  };

  const changeSub = (s: CaseCategory | "전체") => {
    setSubCat(s);
    setActiveTag("");
    setPage(1);
  };

  const clearTag = () => {
    setActiveTag("");
    router.replace("/cases");
  };

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

          {/* 태그 필터 활성 상태 표시 */}
          {activeTag && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold" style={{ color: "#64748b" }}>
                태그 필터:
              </span>
              <span
                className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: "#1f66ff", color: "white" }}>
                #{activeTag}
                <button
                  onClick={clearTag}
                  className="ml-1 leading-none"
                  style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
                  ×
                </button>
              </span>
            </div>
          )}

          {/* 부모 카테고리 탭 */}
          <div
            className="cat-tabs flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}>
            <style>{`.cat-tabs::-webkit-scrollbar{display:none}`}</style>
            {PARENT_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => changeParent(c)}
                className="flex-shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all"
                style={{
                  backgroundColor:
                    parentCat === c && !activeTag ? "#1f66ff" : "#f3f4f6",
                  color: parentCat === c && !activeTag ? "white" : "#64748b",
                }}>
                {c}
              </button>
            ))}
          </div>

          {/* 서브카테고리 탭 */}
          {subCategories && subCategories.length > 0 && !activeTag && (
            <div
              className="cat-tabs flex gap-2 overflow-x-auto pt-2 pb-1"
              style={{ scrollbarWidth: "none" }}>
              <button
                onClick={() => changeSub("전체")}
                className="flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all"
                style={{
                  backgroundColor: subCat === "전체" ? "#111827" : "#f3f4f6",
                  color: subCat === "전체" ? "white" : "#64748b",
                }}>
                전체
              </button>
              {subCategories.map((s) => (
                <button
                  key={s}
                  onClick={() => changeSub(s)}
                  className="flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all"
                  style={{
                    backgroundColor: subCat === s ? "#111827" : "#f3f4f6",
                    color: subCat === s ? "white" : "#64748b",
                  }}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 사례 리스트 */}
      <div className="mx-auto max-w-3xl px-4 py-4">
        {paged.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-3xl mb-3">📋</p>
            <p className="text-sm" style={{ color: "#94a3b8" }}>
              등록된 사례가 없어요
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {paged.map((item) => {
              const rIsReform = isReformCategory(item.parentCategory);
              return (
                <Link
                  key={item.id}
                  href={`/cases/${item.id}`}
                  className="flex gap-4 rounded-2xl p-3 transition hover:bg-gray-50"
                  style={{
                    border: "1px solid #f3f4f6",
                    textDecoration: "none",
                  }}>
                  {/* 썸네일 — 리폼: after, 수리/복원: before */}
                  <div
                    className="flex-shrink-0 rounded-xl overflow-hidden"
                    style={{
                      width: 88,
                      height: 88,
                      backgroundColor: "#f3f4f6",
                    }}>
                    <Image
                      src={rIsReform ? item.afterImg : item.beforeImg}
                      alt={`${item.title} ${rIsReform ? "리폼 후" : "수리 전"}`}
                      width={88}
                      height={88}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 텍스트 */}
                  <div className="flex-1 min-w-0 py-0.5">
                    <h2
                      className="text-[15px] font-bold truncate mb-1"
                      style={{ color: "#111827" }}>
                      {item.title}
                    </h2>
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
                        {item.parentCategory}
                      </span>
                      {item.category !== item.parentCategory && (
                        <span
                          className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "#f0f4ff",
                            color: "#4f7fff",
                          }}>
                          {item.category}
                        </span>
                      )}
                      <span
                        className="text-[11px]"
                        style={{ color: "#94a3b8" }}>
                        {item.region}
                      </span>
                      <span style={{ color: "#d1d5db" }}>·</span>
                      <span
                        className="text-[11px]"
                        style={{ color: "#94a3b8" }}>
                        {new Date(item.date).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 mb-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition"
              style={{
                color: page === 1 ? "#d1d5db" : "#64748b",
                border: "1px solid #e5e7eb",
                backgroundColor: "#fff",
                cursor: page === 1 ? "default" : "pointer",
              }}>
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition"
                style={{
                  backgroundColor: page === p ? "#1f66ff" : "#fff",
                  color: page === p ? "white" : "#64748b",
                  border: page === p ? "none" : "1px solid #e5e7eb",
                }}>
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition"
              style={{
                color: page === totalPages ? "#d1d5db" : "#64748b",
                border: "1px solid #e5e7eb",
                backgroundColor: "#fff",
                cursor: page === totalPages ? "default" : "pointer",
              }}>
              ›
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
