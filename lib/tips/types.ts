/* ═══════════════════════════════════════════
   꿀팁 타입 & 카테고리 정의
   ═══════════════════════════════════════════ */

export type TipCategory =
  | "싱크대 수리"
  | "의자 천갈이"
  | "가죽 리폼"
  | "소파 리폼"
  | "싱크대 리폼";

export interface Tip {
  id: string;
  title: string;
  description: string;
  category: TipCategory;
  tags: string[];
  thumbnail: string;
  createdAt: string;
  views: number;
  readingTime: number;
  ctaBanner?: {
    text: string;
    sub: string;
    href: string;
  };
  content: string;
}

export const TIP_CATEGORIES: { label: TipCategory; emoji: string }[] = [
  { label: "싱크대 수리", emoji: "🔧" },
  { label: "싱크대 리폼", emoji: "🔨" },
  { label: "가죽 리폼", emoji: "🧵" },
  { label: "의자 천갈이", emoji: "🪑" },
  { label: "소파 리폼", emoji: "🛋️" },
];
