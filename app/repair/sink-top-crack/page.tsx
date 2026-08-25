import type { Metadata } from "next";
import CountertopCrackLanding from "@/app/components/landing/CountertopCrackLanding";
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

export const metadata: Metadata = {
  title: "싱크대 상판 크랙 수리 | 갈라짐·깨짐 먼저 확인 | 리스토리",
  description:
    "싱크대 상판 크랙·갈라짐·깨짐 상태를 사진으로 먼저 확인하고 수리 가능 여부와 작업 방향을 안내합니다.",
  keywords: [
    ...BASE_KEYWORDS,
    ...makeRegionalKeywords("싱크대 상판 크랙 수리", "싱크대 상판 수리"),
  ],
  openGraph: {
    title: "싱크대 상판 크랙 수리 | 리스토리",
    description:
      "갈라진 싱크대 상판, 교체 전에 사진으로 수리 가능 여부를 먼저 확인합니다.",
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
};

export default function Page() {
  return <CountertopCrackLanding />;
}
