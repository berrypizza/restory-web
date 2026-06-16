/**
 * SEO 키워드 랜딩 슬러그 단일 관리
 *
 * ✅ 이 파일만 수정하면 사이트맵 + 각 라우트 자동 반영
 * ✅ 새 서비스 추가: 섹션 작성 후 해당 export에 스프레드
 *
 * import { REPAIR_KEYWORD_SLUGS } from "@/lib/keyword-slugs";
 * import { KITCHEN_KEYWORD_SLUGS } from "@/lib/keyword-slugs";
 */

import { REGIONS } from "@/lib/seo-regions";

// ─────────────────────────────────────────────
// 지역 세분화 기준
// ─────────────────────────────────────────────

/** 주요 지역: 증상 4가지 × 지역 / 나머지는 주증상 1개만 */
const REGIONS_MAJOR = new Set([
  "인천",
  "청라",
  "송도",
  "영종도",
  "검단",
  "계양",
  "부평",
  "김포",
  "파주",
  "부천",
  "광명",
  "일산",
  "강서구",
  "마곡",
  "마포",
  "영등포",
  "목동",
  "구로",
  "서초",
  "강남",
  "과천",
]);

/** 밑판 교체는 검색량 있는 지역만 */
const REGIONS_MILPAN = new Set([
  "인천",
  "청라",
  "송도",
  "김포",
  "부천",
  "광명",
  "일산",
  "강서구",
  "마포",
  "영등포",
  "목동",
  "구로",
  "강남",
]);

/** 문짝 리폼은 주요 지역만 추가 */
const REGIONS_DOOR_REFORM = new Set([
  "인천",
  "청라",
  "송도",
  "김포",
  "파주",
  "부천",
  "광명",
  "일산",
  "강서구",
  "마곡",
  "마포",
  "영등포",
  "목동",
  "구로",
  "서초",
  "강남",
  "과천",
]);

// ─────────────────────────────────────────────
// REPAIR — 상부장
// ─────────────────────────────────────────────
const SANGBUJANG_SYMPTOMS = ["처짐", "떨어짐", "들뜸", "내려앉음"] as const;

const SANGBUJANG_BASE = [
  "싱크대-상부장-처짐",
  "싱크대-상부장-처짐-수리",
  "싱크대-상부장-떨어짐",
  "싱크대-상부장-떨어짐-수리",
  "싱크대-상부장-들뜸",
  "싱크대-상부장-들뜸-수리",
  "싱크대-상부장-수리",
  "싱크대-상부장-내려앉음",
  "싱크대-상부장-내려앉음-수리",
  "싱크대-주방장-수리",
  "주방장-처짐-수리",
];

const SANGBUJANG_REGIONAL = REGIONS.flatMap((region) => {
  const symptoms = REGIONS_MAJOR.has(region)
    ? SANGBUJANG_SYMPTOMS
    : (["처짐"] as const);
  return symptoms.map((s) => `${region}-싱크대-상부장-${s}`);
});

const SANGBUJANG_SHORT = [
  "인천-상부장-처짐",
  "사당-상부장-처짐",
  "사당-상부장-수리",
  "관악-상부장-처짐",
  "관악-상부장-수리",
  "신림-상부장-처짐",
  "신림-상부장-수리",
];

// ─────────────────────────────────────────────
// REPAIR — 하부장
// ─────────────────────────────────────────────
const HABUJANG_BASE = [
  "싱크대-하부장-수리",
  "싱크대-하부장-물먹음",
  "싱크대-하부장-교체",
  "싱크대-하부장-썩음",
  "싱크대-하부장-부식",
  "싱크대-하부장-파손",
  "싱크대-하부장-곰팡이",
  "싱크대-하부장-냄새",
  "싱크대-하부장-밑판-교체",
  "하부장-밑판-교체",
  "하부장-물먹음-수리",
];

const HABUJANG_REGIONAL = REGIONS.flatMap((region) => {
  const slugs = [`${region}-싱크대-하부장-수리`];
  if (REGIONS_MILPAN.has(region)) slugs.push(`${region}-하부장-밑판-교체`);
  return slugs;
});

// ─────────────────────────────────────────────
// KITCHEN — 문짝 교체
// ─────────────────────────────────────────────
const DOOR_BASE = [
  "싱크대-문짝-교체",
  "싱크대-문짝-리폼",
  "싱크대-도어-교체",
  "싱크대-문-교체",
  "주방-문짝-교체",
  "주방-도어-교체",
  "주방-문짝-리폼",
  "싱크대-문짝-색상-변경",
  "제로조인트-싱크대-문짝",
  "싱크대-문짝-교체-비용",
];

const DOOR_REGIONAL = REGIONS.flatMap((region) => {
  const slugs = [`${region}-싱크대-문짝-교체`];
  if (REGIONS_DOOR_REFORM.has(region)) slugs.push(`${region}-싱크대-문짝-리폼`);
  return slugs;
});

// ─────────────────────────────────────────────
// 소파 — 추후 추가
// ─────────────────────────────────────────────
// const SOFA_BASE = ["소파-쿠션-복원", "소파-꺼짐-수리", ...];
// const SOFA_REGIONAL = REGIONS.map((r) => `${r}-소파-쿠션-복원`);

// ─────────────────────────────────────────────
// 의자 천갈이 — 추후 추가
// ─────────────────────────────────────────────
// const CHAIR_BASE = ["의자-천갈이", "의자-가죽-교체", ...];
// const CHAIR_REGIONAL = REGIONS.map((r) => `${r}-의자-천갈이`);

// ─────────────────────────────────────────────
// Named exports (라우트별)
// ─────────────────────────────────────────────
export const REPAIR_KEYWORD_SLUGS: string[] = [
  ...SANGBUJANG_BASE,
  ...SANGBUJANG_REGIONAL,
  ...SANGBUJANG_SHORT,
  ...HABUJANG_BASE,
  ...HABUJANG_REGIONAL,
];

export const KITCHEN_KEYWORD_SLUGS: string[] = [...DOOR_BASE, ...DOOR_REGIONAL];

// export const SOFA_KEYWORD_SLUGS: string[] = [...SOFA_BASE, ...SOFA_REGIONAL];
// export const LEATHER_KEYWORD_SLUGS: string[] = [...CHAIR_BASE, ...CHAIR_REGIONAL];
