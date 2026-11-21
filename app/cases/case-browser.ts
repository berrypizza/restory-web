import { cases, PARENT_CATEGORIES, SUB_CATEGORIES, type CaseCategory, type CaseItem, type ParentCategory } from "@/lib/case-data";
import { sanitizePublicCaseText } from "@/lib/public-case-text";

export type CaseFilters = { category: string; tag: string; query: string };
export type CaseParams = Record<string, string | string[] | undefined>;
export const pageSize = 6;

// Older entries also use single-digit months and days.
export const caseDate = (date: string) => date.split("-").map(part => part.padStart(2, "0")).join("-");
const catalog = [...cases].sort((a, b) => caseDate(b.date).localeCompare(caseDate(a.date)));
const parents = new Map<string, ParentCategory>(PARENT_CATEGORIES.map(category => [category, category]));
for (const [parent, children] of Object.entries(SUB_CATEGORIES)) {
  for (const child of children) parents.set(child, parent as ParentCategory);
}

const normalize = (value: string) => value.normalize("NFKC").toLowerCase().replaceAll("쇼파", "소파").replaceAll("씽크대", "싱크대").replace(/[^\p{L}\p{N}]+/gu, "");
const searchText = new Map(catalog.map(item => [
  item.id, [item.title, publicRegion(item), item.parentCategory, item.category, sanitizePublicCaseText(item.summary), ...item.tags].map(normalize).join("\n"),
]));

export function publicRegion(item: CaseItem) {
  return /확인 필요|미상|미확인/.test(item.region) ? "" : item.region.trim();
}

export function parentOf(category: string) {
  return parents.get(category) ?? "전체";
}

export function browseCases(params: CaseParams) {
  function value(key: string) {
    const raw = params[key];
    return (Array.isArray(raw) ? raw[0] : raw)?.trim() || "";
  }
  const category = parents.has(value("cat")) ? value("cat") : "전체";
  const filters = { category, tag: value("tag"), query: value("q").slice(0, 80) };
  const terms = filters.query.split(/\s+/).map(normalize).filter(Boolean);
  const matches = catalog.filter(item =>
    (!filters.query || terms.length > 0) &&
    (category === "전체" || item.parentCategory === category || item.category === category) &&
    (!filters.tag || item.tags.some(tag => tag.trim() === filters.tag)) &&
    terms.every(term => searchText.get(item.id)!.includes(term)),
  );
  const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
  const requested = Number(value("page"));
  const page = Number.isInteger(requested) ? Math.min(totalPages, Math.max(1, requested)) : 1;
  return { filters, parent: parentOf(category), page, totalPages, matches, items: matches.slice((page - 1) * pageSize, page * pageSize) };
}

export function listQuery(filters: CaseFilters, page = 1) {
  const params = new URLSearchParams();
  if (filters.category !== "전체") params.set("cat", filters.category);
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.query) params.set("q", filters.query);
  if (page > 1) params.set("page", String(page));
  return params.toString();
}

export function listHref(filters: CaseFilters, page = 1) {
  const query = listQuery(filters, page);
  return query ? `/cases?${query}` : "/cases";
}

export function categoryHref(category: CaseCategory | ParentCategory) {
  return listHref({ category, tag: "", query: "" });
}

export const formatCaseDate = (date: string) => caseDate(date).replaceAll("-", ".");

export function relatedTo(item: CaseItem) {
  const others = catalog.filter(candidate => candidate.id !== item.id);
  const family = others.filter(candidate => candidate.parentCategory === item.parentCategory);
  return {
    similar: [...family.filter(candidate => candidate.category === item.category), ...family.filter(candidate => candidate.category !== item.category)].slice(0, 3),
    other: PARENT_CATEGORIES.filter(category => category !== "전체" && category !== item.parentCategory)
      .flatMap(category => others.find(candidate => candidate.parentCategory === category) ?? []),
  };
}
