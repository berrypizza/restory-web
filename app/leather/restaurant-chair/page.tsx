import type { Metadata } from "next";
import Restaurantchairlanding from "@/app/components/landing/Restaurantchairlanding";
import { makeRegionalKeywords } from "@/lib/seo-regions";

const BASE_KEYWORDS = [
  "식당 의자 가죽 교체",
  "카페 의자 천갈이",
  "의자 천갈이",
  "인조가죽 교체",
  "업소용 의자 수리",
  "가죽 교체",
  "의자 리폼",
  "붙박이 소파 의자 천갈이",
  "병원 의자 수리",
  "고깃집 의자 교체",
  "카페 의자 가죽 교체",
  "식당 의자 수리",
  "의자 가죽 교체",
  "리스토리",
  "업소용 붙박이 소파 천갈이",
];

export const metadata: Metadata = {
  title: "식당·카페 의자 가죽 교체 전문 | 개당 3만원~ | 리스토리",
  description:
    "식당·카페·병원 의자 가죽 교체. 새 의자 구매 비용의 1/3~1/5. 영업 외 시간 시공 가능. 1,000건+ 연간 실적. 고급 인조가죽 1000+ 샘플.",
  keywords: [
    ...BASE_KEYWORDS,
    ...makeRegionalKeywords("의자 천갈이", "의자 가죽 교체"),
  ],
  openGraph: {
    title: "식당·카페 의자 가죽 교체 | 개당 3만원~ | 리스토리",
    description:
      "의자를 새로 살 필요 없습니다. 가죽만 바꾸면 새것처럼. 1/3 비용.",
    url: "https://www.restorystudio.co.kr/leather/restaurant-chair",
    images: [
      {
        url: "/images/chair/hero-chair.webp",
        width: 1080,
        height: 1350,
        alt: "리스토리 식당 의자 가죽 교체",
      },
    ],
    type: "website",
    siteName: "리스토리",
    locale: "ko_KR",
  },
  alternates: {
    canonical: "https://www.restorystudio.co.kr/leather/restaurant-chair",
  },
};

export default function Page() {
  return <Restaurantchairlanding />;
}
