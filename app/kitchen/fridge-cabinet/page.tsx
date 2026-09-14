import type { Metadata } from "next";
import FridgeCabinetLanding from "@/app/components/landing/FridgeCabinetLanding";
import { makeRegionalKeywords } from "@/lib/seo-regions";

const BASE_KEYWORDS = [
  "냉장고장 리폼",
  "냉장고장 문짝 교체",
  "냉장고장 패널 교체",
  "빌트인 냉장고장 리폼",
  "키큰장 리폼",
  "냉장고 수납장 리폼",
  "주방 수납장 리폼",
  "주방 문짝 리폼",
  "싱크대 리폼",
  "리스토리",
];

export const metadata: Metadata = {
  title: "냉장고장 리폼 | 문짝·패널 교체 | 리스토리",
  description:
    "냉장고장 리폼으로 주방 중심을 정돈합니다. 전체 주방 공사 전 문짝·패널 교체 가능 여부를 사진으로 먼저 확인합니다.",
  keywords: [
    ...BASE_KEYWORDS,
    ...makeRegionalKeywords("냉장고장 리폼", "냉장고장 문짝 교체"),
  ],
  openGraph: {
    title: "냉장고장 리폼 | 리스토리",
    description: "전체 주방 공사 없이 냉장고장 문짝·패널부터 확인합니다.",
    url: "https://www.restorystudio.co.kr/kitchen/fridge-cabinet",
    images: [
      {
        url: "/images/fridge-cabinet/refmain.png",
        width: 1254,
        height: 1254,
        alt: "리스토리 냉장고장 리폼",
      },
    ],
    type: "website",
    siteName: "리스토리",
    locale: "ko_KR",
  },
  alternates: {
    canonical: "https://www.restorystudio.co.kr/kitchen/fridge-cabinet",
  },
};

export default function Page() {
  return <FridgeCabinetLanding />;
}
