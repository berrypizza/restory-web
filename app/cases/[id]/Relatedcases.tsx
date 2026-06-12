"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cases, type CaseItem } from "@/lib/case-data";

const REFORM_CATEGORIES = ["싱크대 리폼", "가죽 리폼"] as const;
function isReformCategory(cat: string) {
  return REFORM_CATEGORIES.includes(cat as (typeof REFORM_CATEGORIES)[number]);
}

interface Props {
  currentId: string;
  currentParentCategory: string;
}

export default function RelatedCases({
  currentId,
  currentParentCategory,
}: Props) {
  const [tab, setTab] = useState<"similar" | "other">("similar");

  // 비슷한 사례: 같은 parentCategory, 최신 6개
  const similar = cases
    .filter(
      (c) => c.parentCategory === currentParentCategory && c.id !== currentId,
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  // 다른 서비스: 다른 parentCategory에서 카테고리별 최신 1개씩
  const OTHER_CATEGORIES = [
    "싱크대 수리",
    "싱크대 리폼",
    "가죽 리폼",
    "소파 복원",
  ].filter((c) => c !== currentParentCategory);
  const other = OTHER_CATEGORIES.flatMap((cat) =>
    cases
      .filter((c) => c.parentCategory === cat && c.id !== currentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 2),
  );

  const list = tab === "similar" ? similar : other;

  const CaseCard = ({ item }: { item: CaseItem }) => {
    const reform = isReformCategory(item.parentCategory);
    return (
      <Link
        href={`/cases/${item.id}`}
        className="flex-shrink-0 block overflow-hidden rounded-2xl"
        style={{
          width: 148,
          textDecoration: "none",
          border: "1px solid #eef0f5",
        }}>
        <div
          className="relative overflow-hidden bg-neutral-100"
          style={{ height: 120 }}>
          <Image
            src={reform ? item.afterImg : item.beforeImg}
            alt={`${item.title} ${reform ? "리폼 후" : "수리 전"}`}
            fill
            className="object-cover"
            sizes="148px"
          />
        </div>
        <div className="p-2.5">
          <span
            className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full mb-1"
            style={{ backgroundColor: "#1f66ff15", color: "#1f66ff" }}>
            {item.parentCategory}
          </span>
          <p
            className="text-[12px] font-bold leading-snug"
            style={{
              color: "#111827",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
            {item.title}
          </p>
          <p className="text-[11px] mt-1" style={{ color: "#94a3b8" }}>
            {item.region}
          </p>
        </div>
      </Link>
    );
  };

  if (similar.length === 0 && other.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="h-px mb-6" style={{ backgroundColor: "#f3f4f6" }} />

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          <button
            onClick={() => setTab("similar")}
            className="px-3 py-1.5 rounded-full text-[13px] font-bold transition-all"
            style={{
              backgroundColor: tab === "similar" ? "#1f66ff" : "#f3f4f6",
              color: tab === "similar" ? "white" : "#64748b",
            }}>
            비슷한 사례
          </button>
          <button
            onClick={() => setTab("other")}
            className="px-3 py-1.5 rounded-full text-[13px] font-bold transition-all"
            style={{
              backgroundColor: tab === "other" ? "#1f66ff" : "#f3f4f6",
              color: tab === "other" ? "white" : "#64748b",
            }}>
            다른 서비스
          </button>
        </div>
        <Link
          href="/cases"
          className="text-[12px] font-bold"
          style={{ color: "#1f66ff", textDecoration: "none" }}>
          전체 보기 →
        </Link>
      </div>

      {/* 가로 스크롤 슬라이더 */}
      {list.length > 0 ? (
        <div
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <style>{`.related-scroll::-webkit-scrollbar{display:none}`}</style>
          <div
            className="related-scroll flex gap-3 overflow-x-auto pb-2 w-full"
            style={{ scrollbarWidth: "none" }}>
            {list.map((item) => (
              <CaseCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-[13px]" style={{ color: "#94a3b8" }}>
          등록된 사례가 없습니다
        </p>
      )}
    </section>
  );
}
