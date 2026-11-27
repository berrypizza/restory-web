import { Montserrat } from "next/font/google";

/* 영문 라벨·대형 타이포 — 굵은 기하학 산세리프 */
export const display = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-sofa-display",
  display: "swap",
});
