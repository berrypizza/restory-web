"use client";

import Link from "next/link";
import {
  PARENT_CATEGORIES,
  SUB_CATEGORIES,
  type CaseCategory,
  type ParentCategory,
} from "@/lib/case-data";

function categoryHref(category: ParentCategory | CaseCategory | "전체") {
  if (category === "전체") return "/cases";
  return `/cases?cat=${encodeURIComponent(category)}`;
}

export default function CaseCategoryFilters({
  activeCategory,
  activeTag,
}: {
  activeCategory: string;
  activeTag: string;
}) {
  const parentCat = PARENT_CATEGORIES.includes(activeCategory as ParentCategory)
    ? (activeCategory as ParentCategory)
    : (Object.entries(SUB_CATEGORIES).find(([, subs]) =>
        subs?.includes(activeCategory as CaseCategory),
      )?.[0] as ParentCategory | undefined) || "전체";

  const subCategories =
    parentCat !== "전체" ? SUB_CATEGORIES[parentCat] : undefined;

  return (
    <>
      {activeTag && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold" style={{ color: "#64748b" }}>
            태그 필터:
          </span>
          <Link
            href="/cases"
            className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full"
            style={{
              backgroundColor: "#1f66ff",
              color: "white",
              textDecoration: "none",
            }}>
            #{activeTag}
            <span
              aria-hidden="true"
              className="ml-1 leading-none"
              style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
              ×
            </span>
          </Link>
        </div>
      )}

      <div
        className="cat-tabs flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}>
        <style>{`.cat-tabs::-webkit-scrollbar{display:none}`}</style>
        {PARENT_CATEGORIES.map((category) => (
          <Link
            key={category}
            href={categoryHref(category)}
            className="flex-shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all"
            style={{
              backgroundColor:
                parentCat === category && !activeTag ? "#1f66ff" : "#f3f4f6",
              color: parentCat === category && !activeTag ? "white" : "#64748b",
              textDecoration: "none",
            }}>
            {category}
          </Link>
        ))}
      </div>

      {subCategories && subCategories.length > 0 && !activeTag && (
        <div
          className="cat-tabs flex gap-2 overflow-x-auto pt-2 pb-1"
          style={{ scrollbarWidth: "none" }}>
          <Link
            href={categoryHref(parentCat)}
            className="flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all"
            style={{
              backgroundColor: activeCategory === parentCat ? "#111827" : "#f3f4f6",
              color: activeCategory === parentCat ? "white" : "#64748b",
              textDecoration: "none",
            }}>
            전체
          </Link>
          {subCategories.map((category) => (
            <Link
              key={category}
              href={categoryHref(category)}
              className="flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all"
              style={{
                backgroundColor:
                  activeCategory === category ? "#111827" : "#f3f4f6",
                color: activeCategory === category ? "white" : "#64748b",
                textDecoration: "none",
              }}>
              {category}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
