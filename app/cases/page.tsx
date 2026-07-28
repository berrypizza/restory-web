// app/cases/page.tsx

import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import CaseCategoryFilters from "./CaseCategoryFilters";
import {
  cases,
  PARENT_CATEGORIES,
  SUB_CATEGORIES,
  type CaseCategory,
  type CaseItem,
  type ParentCategory,
} from "@/lib/case-data";

const PER_PAGE = 6;
const PAGE_WINDOW = 10;

const REFORM_CATEGORIES = ["싱크대 리폼", "가죽 리폼"] as const;

type SearchParams = Record<string, string | string[] | undefined>;

export const metadata: Metadata = {
  title: "작업 사례 | 리스토리 스튜디오",
  description:
    "싱크대 수리·리폼, 가죽 리폼, 소파 복원 실제 작업 사례 모음. 강남·인천·경기 당일 출장 가능. 사진 한 장으로 견적 확인.",
  alternates: {
    canonical: "https://www.restorystudio.co.kr/cases",
  },
  openGraph: {
    title: "작업 사례 | 리스토리 스튜디오",
    description:
      "싱크대 수리·리폼, 가죽 리폼, 소파 복원 실제 작업 사례 모음. 사진 한 장으로 견적 확인.",
    url: "https://www.restorystudio.co.kr/cases",
    type: "website",
  },
};

function getStringParam(
  searchParams: SearchParams,
  key: string,
): string | undefined {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function getParentFromCategory(category: string): ParentCategory {
  for (const [parent, subs] of Object.entries(SUB_CATEGORIES)) {
    if (subs?.includes(category as CaseCategory)) {
      return parent as ParentCategory;
    }
  }

  if (PARENT_CATEGORIES.includes(category as ParentCategory)) {
    return category as ParentCategory;
  }

  return "전체";
}

function getSubFromCategory(category: string): CaseCategory | "전체" {
  for (const subs of Object.values(SUB_CATEGORIES)) {
    if (subs?.includes(category as CaseCategory)) {
      return category as CaseCategory;
    }
  }

  return "전체";
}

function isReformCategory(category: string) {
  return REFORM_CATEGORIES.includes(
    category as (typeof REFORM_CATEGORIES)[number],
  );
}

function filterCases(
  parentCat: ParentCategory,
  subCat: CaseCategory | "전체",
  activeTag: string,
) {
  const subCategories =
    parentCat !== "전체" ? SUB_CATEGORIES[parentCat] : undefined;

  return cases
    .filter((item) => {
      if (activeTag) {
        return item.tags.map((tag) => tag.trim()).includes(activeTag);
      }

      if (parentCat === "전체") return true;
      if (item.parentCategory !== parentCat) return false;
      if (subCat !== "전체" && subCategories) return item.category === subCat;

      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function getCaseImage(item: CaseItem) {
  return isReformCategory(item.parentCategory) ? item.afterImg : item.beforeImg;
}

function makePageHref(
  page: number,
  activeCategory: string,
  activeTag: string,
) {
  const params = new URLSearchParams();
  if (activeCategory !== "전체") params.set("cat", activeCategory);
  if (activeTag) params.set("tag", activeTag);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/cases?${query}` : "/cases";
}

function Pagination({
  page,
  totalPages,
  activeCategory,
  activeTag,
}: {
  page: number;
  totalPages: number;
  activeCategory: string;
  activeTag: string;
}) {
  if (totalPages <= 1) return null;

  const windowStart = Math.floor((page - 1) / PAGE_WINDOW) * PAGE_WINDOW + 1;
  const windowEnd = Math.min(windowStart + PAGE_WINDOW - 1, totalPages);
  const windowPages = Array.from(
    { length: windowEnd - windowStart + 1 },
    (_, index) => windowStart + index,
  );

  const previousWindowPage = Math.max(1, windowStart - PAGE_WINDOW);
  const nextWindowPage = Math.min(totalPages, windowEnd + 1);

  return (
    <nav
      className="flex items-center justify-center gap-2 mt-8 mb-4"
      aria-label="사례 목록 페이지">
      <Link
        href={makePageHref(previousWindowPage, activeCategory, activeTag)}
        aria-disabled={windowStart === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition"
        style={{
          color: windowStart === 1 ? "#d1d5db" : "#64748b",
          border: "1px solid #e5e7eb",
          backgroundColor: "#fff",
          pointerEvents: windowStart === 1 ? "none" : "auto",
        }}>
        ‹
      </Link>

      {windowPages.map((itemPage) => (
        <Link
          key={itemPage}
          href={makePageHref(itemPage, activeCategory, activeTag)}
          aria-current={page === itemPage ? "page" : undefined}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition"
          style={{
            backgroundColor: page === itemPage ? "#1f66ff" : "#fff",
            color: page === itemPage ? "white" : "#64748b",
            border: page === itemPage ? "none" : "1px solid #e5e7eb",
          }}>
          {itemPage}
        </Link>
      ))}

      <Link
        href={makePageHref(nextWindowPage, activeCategory, activeTag)}
        aria-disabled={windowEnd === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition"
        style={{
          color: windowEnd === totalPages ? "#d1d5db" : "#64748b",
          border: "1px solid #e5e7eb",
          backgroundColor: "#fff",
          pointerEvents: windowEnd === totalPages ? "none" : "auto",
        }}>
        ›
      </Link>
    </nav>
  );
}

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const activeTag = getStringParam(resolvedSearchParams, "tag") ?? "";
  const requestedCategory =
    (getStringParam(resolvedSearchParams, "cat") as CaseCategory) || "전체";
  const parentCat = activeTag
    ? "전체"
    : getParentFromCategory(requestedCategory);
  const subCat = activeTag ? "전체" : getSubFromCategory(requestedCategory);
  const activeCategory = activeTag
    ? "전체"
    : subCat !== "전체"
      ? subCat
      : parentCat;
  const requestedPage = Number(getStringParam(resolvedSearchParams, "page"));
  const filtered = filterCases(parentCat, subCat, activeTag);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(1, requestedPage), totalPages)
    : 1;
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "리스토리 작업사례",
    description:
      "싱크대 수리, 상부장 처짐 수리, 가죽 리폼, 소파 복원, 의자 천갈이 작업사례 모음",
    itemListElement: filtered.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.restorystudio.co.kr/cases/${item.id}`,
      name: item.title,
      image: `https://www.restorystudio.co.kr${getCaseImage(item)}`,
    })),
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd),
        }}
      />

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

          <CaseCategoryFilters
            activeCategory={activeCategory}
            activeTag={activeTag}
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-4">
        {paged.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm" style={{ color: "#94a3b8" }}>
              등록된 사례가 없어요
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {paged.map((item) => {
              const imageSrc = getCaseImage(item);
              const imageAlt = `${item.title} ${
                isReformCategory(item.parentCategory) ? "리폼 후" : "수리 전"
              }`;

              return (
                <article key={item.id}>
                  <Link
                    href={`/cases/${item.id}`}
                    className="flex gap-4 rounded-2xl p-3 transition hover:bg-gray-50"
                    style={{
                      border: "1px solid #f3f4f6",
                      textDecoration: "none",
                    }}>
                    <div
                      className="flex-shrink-0 rounded-xl overflow-hidden"
                      style={{
                        width: 88,
                        height: 88,
                        backgroundColor: "#f3f4f6",
                      }}>
                      <Image
                        src={imageSrc}
                        alt={imageAlt}
                        width={88}
                        height={88}
                        className="w-full h-full object-cover"
                      />
                    </div>

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
                        <time
                          className="text-[11px]"
                          dateTime={item.date}
                          style={{ color: "#94a3b8" }}>
                          {new Date(item.date).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          activeCategory={activeCategory}
          activeTag={activeTag}
        />
      </div>
    </main>
  );
}
