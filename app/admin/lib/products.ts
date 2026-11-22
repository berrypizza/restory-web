export const PRODUCT_OPTIONS = [
  "주방 장 제작",
  "싱크대 문짝 교체",
  "냉장고장 리폼",
  "싱크대 상판 교체",
  "싱크대 상부장 처짐 수리",
  "업소용 천갈이",
  "가정용 천갈이",
  "회의 테이블 천갈이",
  "소파 수리",
] as const;

export type ProductOption = (typeof PRODUCT_OPTIONS)[number];

export function isProductOption(value: string): value is ProductOption {
  return PRODUCT_OPTIONS.includes(value as ProductOption);
}

export function productBucket(value: string) {
  return isProductOption(value) ? value : "기타";
}
