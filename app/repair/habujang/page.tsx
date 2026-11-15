import type { Metadata } from "next";
import HabujangLanding from "@/app/components/landing/HabujangLanding";
import { withLandingSeo } from "@/lib/landing-seo";
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

export const metadata: Metadata = withLandingSeo({
  title: "싱크대 하부장 수리 전문 | 파손·뒤틀림·물빠짐 | 리스토리",
  description:
    "물 먹고 부푼 하부장 밑판, 기존 장을 살릴 수 있는지 먼저 확인합니다. 비용은 현장별 상담 견적. 실제 전후 사례와 교체 범위, 작업 시간·A/S 안내를 확인하세요.",
  keywords: [
    ...BASE_KEYWORDS,
    ...makeRegionalKeywords("싱크대 하부장 수리", "하부장 파손 수리"),
  ],
  openGraph: {
    title: "싱크대 하부장 수리 | 리스토리",
    description:
      "하부장 내부 사진으로 밑판 교체 가능 범위·현장별 견적·방문 일정을 상담하세요. 실제 작업 전후 사진과 A/S 안내를 확인할 수 있습니다.",
    url: "https://www.restorystudio.co.kr/repair/habujang",
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
    canonical: "https://www.restorystudio.co.kr/repair/habujang",
  },
});

export default function Page() {
  return <HabujangLanding />;
}
