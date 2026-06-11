import type { Metadata } from "next";
import SangbujangLanding from "@/app/components/landing/Sangbujanglanding";
import { makeRegionalKeywords } from "@/lib/seo-regions";

const BASE_KEYWORDS = [
  "싱크대 상부장 수리",
  "상부장 처짐",
  "상부장 추락",
  "싱크대 수리",
  "주방 수리",
  "상부장 내려앉음",
  "싱크대 상부장 뜸",
  "싱크대 상부장 보강",
  "주방 상부장 수리",
  "상부장 고정",
  "상부장 떨어짐",
  "싱크대 상부장 보수",
  "싱크대 상부장 수리 업체",
  "싱크대 상부장 수리 비용",
  "리스토리",
  "싱크대 상부장 수리 후기",
  "싱크대 상부장 수리 가격",
  "싱크대 상부장 수리 전문 업체",
  "싱크대 상부장 떨어짐 수리",
  "싱크대 상부장 처졌을 때",
];

export const metadata: Metadata = {
  title: "싱크대 상부장 수리 전문 | 처짐·추락·뜸 | 리스토리",
  description:
    "싱크대 상부장 처짐·추락·뜸 증상, 합판 시공목으로 튼튼하게 수리. 교체 비용의 1/3~1/5. 3년 무상 A/S. 사진 한 장이면 수리 가능 여부 바로 안내.",
  keywords: [
    ...BASE_KEYWORDS,
    ...makeRegionalKeywords("싱크대 상부장 수리", "상부장 처짐 수리"),
  ],
  openGraph: {
    title: "싱크대 상부장 수리 | 리스토리",
    description:
      "상부장 처짐·추락, 합판으로 튼튼하게. 교체 비용의 1/3. 3년 A/S.",
    url: "https://restorystudio.co.kr/repair/sangbujang",
    images: [
      {
        url: "/images/hero-sangbujang.webp",
        width: 1080,
        height: 1350,
        alt: "리스토리 싱크대 상부장 수리",
      },
    ],
    type: "website",
    siteName: "리스토리",
    locale: "ko_KR",
  },
  alternates: {
    canonical: "https://restorystudio.co.kr/repair/sangbujang",
  },
};

export default function Page() {
  return <SangbujangLanding />;
}
