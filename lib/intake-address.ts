export type AddressMode = "detail" | "none" | "later";
export type VisitAddress = { base: string; detail: string; mode: AddressMode };
export type AddressIssue = { field: "address" | "addressDetail"; message: string };

export const emptyVisitAddress: VisitAddress = { base: "", detail: "", mode: "detail" };
export const normalizeAddress = (value: string) => value.trim().replace(/\s+/gu, " ");

export function addressIssue(value: VisitAddress): AddressIssue | null {
  const base = normalizeAddress(value.base);
  const detail = normalizeAddress(value.detail);
  if (base.length < 4 || base.length > 250 ||
    !/[로길동리가읍면]\s*(?:지하\s*|산\s*)?\d+(?:-\d+)?(?:$|[\s,(]|번지)/u.test(base)) {
    return { field: "address", message: "도로명과 건물번호 또는 지번까지 입력해 주세요." };
  }
  if (value.mode === "detail" && (!detail || /^(?:[?？._\s-]+|모름|몰라요|미정|없음)$/u.test(detail)))
    return { field: "addressDetail", message: "동·호수나 층을 적거나 아래 항목을 선택해 주세요." };
  if (detail.length > 100 || (value.mode === "detail" && Array.from(base + " " + detail).length > 250))
    return { field: "addressDetail", message: "기본주소와 상세주소를 합쳐 250자 이내로 적어 주세요." };
  return null;
}
