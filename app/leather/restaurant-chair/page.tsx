import type { Metadata } from "next";
import Restaurantchairlanding from "@/app/components/landing/Restaurantchairlanding";

export const metadata: Metadata = {
  title: "식당 의자 가죽 교체",
  description:
    "식당·카페·병원 의자 가죽 교체. 새 의자 구매 비용의 1/3~1/5. 영업 외 시간 시공 가능. 1,000건+ 연간 실적. 고급 인조가죽 1000+ 샘플.",
  keywords: [
    "식당 의자 가죽 교체",
    "카페 의자 수리",
    "의자 천갈이",
    "업소용 의자 수리",
    "가죽 교체",
    "의자 리폼",
    "붙박이 소파 의자 천갈이",
    "병원 의자 수리",
    "리스토리",
  ],
  openGraph: {
    title: "식당 의자 가죽 교체 | 리스토리",
    description:
      "의자를 새로 살 필요 없습니다. 가죽만 바꾸면 새것처럼. 1/3 비용.",
    url: "https://restorystudio.co.kr/leather/restaurant-chair",
    images: [
      { url: "/images/chair/hero-chair.webp", width: 1080, height: 1350 },
    ],
  },
  alternates: {
    canonical: "https://restorystudio.co.kr/leather/restaurant-chair",
  },
};

export default function Page() {
  return <Restaurantchairlanding />;
}
