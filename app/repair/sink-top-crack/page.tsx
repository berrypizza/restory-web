import type { Metadata } from "next";
import CountertopCrackLanding from "@/app/components/landing/CountertopCrackLanding";
import { withLandingSeo } from "@/lib/landing-seo";
import { makeRegionalKeywords } from "@/lib/seo-regions";

const MAIN_IMAGE = "/images/sink-top-crack/main.png";

const BASE_KEYWORDS = [
  "싱크대 상판 크랙 수리",
  "싱크대 상판 수리",
  "싱크대 상판 갈라짐",
  "싱크대 상판 깨짐",
  "주방 상판 크랙",
  "주방 상판 수리",
  "인조대리석 상판 크랙",
  "인조대리석 상판 수리",
  "상판 크랙 보수",
  "상판 갈라짐 수리",
  "리스토리",
];

export const metadata: Metadata = withLandingSeo({
  title: "싱크대 상판 크랙 수리 | 갈라짐·깨짐 먼저 확인 | 리스토리",
  description:
    "갈라진 상판, 다시 쓰는 주방. 수리 비용 범위는 30~50만 원, 부가세 별도이며 최종 금액은 상태를 보고 상담 후 안내합니다. 실제 전후 사례와 예상 마감, 시공 부위 3년 A/S 적용 조건을 확인하세요.",
  keywords: [
    ...BASE_KEYWORDS,
    ...makeRegionalKeywords("싱크대 상판 크랙 수리", "싱크대 상판 수리"),
  ],
  openGraph: {
    title: "싱크대 상판 크랙 수리 | 리스토리",
    description:
      "수리 비용 범위 30~50만 원, 부가세 별도. 최종 금액은 상태를 보고 상담 후 안내합니다. 사진으로 수리 범위·예상 마감·방문 일정을 확인하세요.",
    url: "https://www.restorystudio.co.kr/repair/sink-top-crack",
    images: [
      {
        url: MAIN_IMAGE,
        width: 590,
        height: 500,
        alt: "리스토리 싱크대 상판 크랙 수리",
      },
    ],
    type: "website",
    siteName: "리스토리",
    locale: "ko_KR",
  },
  alternates: {
    canonical: "https://www.restorystudio.co.kr/repair/sink-top-crack",
  },
});

export default function Page() {
  return <CountertopCrackLanding />;
}
