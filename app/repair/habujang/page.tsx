import type { Metadata } from "next";
import HabujangLanding from "@/app/components/landing/HabujangLanding";
import { makeRegionalKeywords } from "@/lib/seo-regions";

const BASE_KEYWORDS = [
  "싱크대 하부장 수리",
  "하부장 파손",
  "하부장 뒤틀림",
  "싱크대 하부장 물빠짐",
  "싱크대 수리",
  "주방 수리",
  "싱크대 하부장 교체",
  "싱크대 하부장 보강",
  "주방 하부장 수리",
  "싱크대 바닥 수리",
  "하부장 썩음",
  "하부장 바닥 교체",
  "리스토리",
  "싱크대 하부장 밑판 교체",
];

export const metadata: Metadata = {
  title: "싱크대 하부장 수리 전문 | 파손·뒤틀림·물빠짐 | 리스토리",
  description:
    "싱크대 하부장 뒤틀림·파손·물 빠짐 증상, 합판 시공목으로 튼튼하게 수리. 교체 비용의 1/3~1/5. 3년 무상 A/S. 사진 한 장이면 수리 가능 여부 바로 안내.",
  keywords: [
    ...BASE_KEYWORDS,
    ...makeRegionalKeywords("싱크대 하부장 수리", "하부장 파손 수리"),
  ],
  openGraph: {
    title: "싱크대 하부장 수리 | 리스토리",
    description:
      "하부장 파손·물빠짐, 합판으로 튼튼하게. 교체 비용의 1/3. 3년 A/S.",
    url: "https://restorystudio.co.kr/repair/habujang",
    images: [
      {
        url: "/images/hero-habujang.webp",
        width: 1080,
        height: 1350,
        alt: "리스토리 싱크대 하부장 수리",
      },
    ],
    type: "website",
    siteName: "리스토리",
    locale: "ko_KR",
  },
  alternates: {
    canonical: "https://restorystudio.co.kr/repair/habujang",
  },
};

export default function Page() {
  return <HabujangLanding />;
}
