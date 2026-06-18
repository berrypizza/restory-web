export type Status = "대기" | "배정" | "완료" | "취소";
export type Tech = "" | "고관호" | "고현호" | "이주형" | "강영훈";
export type UserRole = "admin" | "tech";

export const TECHS: Tech[] = ["고관호", "고현호", "이주형", "강영훈"];
export const STATUSES: Status[] = ["대기", "배정", "완료", "취소"];

export const TECH_COLOR: Record<string, string> = {
  고관호: "#e32e40",
  고현호: "#60a5fa",
  이주형: "#f59e0b",
  강영훈: "#f472b6",
  "": "#64748b",
};

export const TECH_PHOTO: Record<string, string> = {
  고관호: "/images/knight/knights-1.png",
  고현호: "/images/knight/knights-2.png",
  이주형: "/images/knight/knights-3.png",
  강영훈: "/images/knight/knights-4.png",
};

export const TECH_HOME: Record<string, string> = {
  고관호: "인천 서구 가정동 612-18",
  고현호: "인천 서구 가정동 612-18",
  이주형: "인천 서구 가정동 612-18",
  강영훈: "인천 서구 가정동 612-18",
};

export const STATUS_STYLE: Record<
  Status,
  { bg: string; color: string; border: string }
> = {
  대기: { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" },
  배정: { bg: "#eaf1ff", color: "#1f66ff", border: "#a9c4ff" },
  완료: { bg: "#eff6ff", color: "#1f66ff", border: "#bfd3ff" },
  취소: { bg: "#fef2f2", color: "#ef4444", border: "#ef444433" },
};

export const USERS: {
  id: string;
  name: Tech;
  role: UserRole;
  password: string;
}[] = [
  { id: "고관호", name: "고관호", role: "admin", password: "su3024" },
  { id: "kohh1115", name: "고현호", role: "admin", password: "7071" },
  { id: "juhyung", name: "이주형", role: "tech", password: "su2000" },
  { id: "younghun", name: "강영훈", role: "tech", password: "su2000" },
];

export const QUICK_TIMES = [
  { label: "오전 9시", ampm: "AM" as const, h: 9, m: 0 },
  { label: "오전 10시", ampm: "AM" as const, h: 10, m: 0 },
  { label: "오전 11시", ampm: "AM" as const, h: 11, m: 0 },
  { label: "오후 1시", ampm: "PM" as const, h: 1, m: 0 },
  { label: "오후 2시", ampm: "PM" as const, h: 2, m: 0 },
  { label: "오후 3시", ampm: "PM" as const, h: 3, m: 0 },
];

export const AM_HOURS = [6, 7, 8, 9, 10, 11, 12];
export const PM_HOURS = [1, 2, 3, 4, 5, 6, 7, 8];

// ── 자재 ─────────────────────────────────────────────────────
export type MaterialStatus = "발주필요" | "발주완료" | "준비완료";
export type MaterialSupplier = "지엔공장" | "대명상사" | "탑소파" | "기타";

export const MATERIAL_STATUSES: MaterialStatus[] = [
  "발주필요",
  "발주완료",
  "준비완료",
];
export const MATERIAL_SUPPLIERS: MaterialSupplier[] = [
  "지엔공장",
  "대명상사",
  "탑소파",
  "기타",
];

export const MATERIAL_STATUS_STYLE: Record<
  MaterialStatus,
  { bg: string; color: string; border: string }
> = {
  발주필요: { bg: "#fef2f2", color: "#ef4444", border: "#ef444433" },
  발주완료: { bg: "#f59e0b18", color: "#f59e0b", border: "#f59e0b33" },
  준비완료: { bg: "#eaf1ff", color: "#1f66ff", border: "#bfd3ff" },
};

export const MATERIAL_SUPPLIER_STYLE: Record<
  MaterialSupplier,
  { bg: string; color: string }
> = {
  지엔공장: { bg: "#a855f718", color: "#a855f7" },
  대명상사: { bg: "#f59e0b18", color: "#f59e0b" },
  탑소파: { bg: "#10b98118", color: "#10b981" },
  기타: { bg: "#64748b18", color: "#64748b" },
};
