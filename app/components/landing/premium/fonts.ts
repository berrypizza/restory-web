import { Hahmlet, Montserrat } from "next/font/google";

/* 영문 라벨·대형 타이포 — 굵은 기하학 산세리프 */
export const display = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-sofa-display",
  display: "swap",
});

/* 파란 띠 마퀴 전용 굵은 명조 — 한글은 쓰인 글자 조각만 받도록 미리 불러오지 않음 */
export const bandSerif = Hahmlet({
  subsets: ["latin"],
  weight: "900",
  variable: "--font-band-serif",
  display: "swap",
  preload: false,
});
