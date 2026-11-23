import type { BusinessLineId } from "./site-config";

export const primaryPages = [
  { href: "/cases", label: "작업 사례" },
  { href: "/tips", label: "수리 가이드" },
  { href: "/events", label: "이벤트" },
];

export const studioPages = [
  { href: "/philosophy", label: "리스토리 소개" },
  { href: "/community", label: "커뮤니티" },
  { href: "/academy", label: "기술로 살아남기" },
];

export const fieldInfo = {
  repair: { label: "싱크대 수리", detail: "상부장 처짐 · 밑판 · 상판", category: "싱크대 수리", image: "/images/cases/case-037-after.jpg", position: "38% 57%" },
  kitchen: { label: "주방 리폼", detail: "문짝 교체 · 냉장고장 · 로청장", category: "싱크대 리폼", image: "/images/cases/case-104-after.png", position: "50% 64%" },
  leather: { label: "가죽 리폼", detail: "의자 천갈이 · 테이블 가죽", category: "가죽 리폼", image: "/images/cases/case-086-after.jpg", position: "49% 58%" },
  sofa: { label: "소파 복원", detail: "쿠션 꺼짐 · 밴드와 스프링", category: "소파 복원", image: "/images/cases/case-076-afterr.jpg", position: "58% 60%" },
} as const satisfies Record<BusinessLineId, { label: string; detail: string; category: string; image: string; position: string }>;

export function fieldCases(id: BusinessLineId) {
  return "/cases?" + new URLSearchParams({ cat: fieldInfo[id].category });
}

export function serviceHref(id: BusinessLineId, slug: string) {
  return id === "sofa" && slug === "sofa-sagging" ? "/sofa" : `/${id}/${slug}`;
}

export function sinkDoorGuide(path: string) {
  let decoded = path;
  try { decoded = decodeURIComponent(path); } catch { return false; }
  return decoded === "/kitchen/sink-door" || decoded.startsWith("/kitchen/sink-door/") ||
    (decoded.startsWith("/kitchen/") && !/냉장고장|냉장고-수납장/.test(decoded) && /문짝|도어|문-교체|주방-문-리폼|리폼-vs-교체/.test(decoded));
}
