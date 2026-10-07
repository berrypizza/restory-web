import type { Metadata } from "next";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/app/components/JsonLd";
import Sinkdoorreformlanding from "@/app/components/landing/Sinkdoorreformlanding";
import { makeRegionalKeywords } from "@/lib/seo-regions";
import { withLandingSeo } from "@/lib/landing-seo";

const BASE_KEYWORDS = [
  "싱크대 문짝 교체",
  "싱크대 리폼",
  "싱크대 도어 교체",
  "주방 리모델링",
  "문짝 리폼",
  "싱크대 문 교체",
  "주방 인테리어",
  "싱크대 수리",
  "싱크대 리페어",
  "주방 문짝 교체",
  "주방 도어 교체",
  "싱크대 문짝 색상 변경",
  "싱크대 문짝 교체 비용",
  "리스토리",
  "주방 도어 리폼",
  "제로 조인트 싱크대 문짝",
];

export const metadata: Metadata = withLandingSeo({
  title: "싱크대 문짝 교체·리폼 전문 | 당일 시공 | 리스토리",
  description:
    "싱크대 문짝 교체·리폼으로 새 주방처럼. 전체 교체 비용의 1/3~1/5. 당일 시공 완료. 3년 무상 A/S. 100가지 이상 색상 선택 가능.",
  keywords: [
    ...BASE_KEYWORDS,
    ...makeRegionalKeywords("싱크대 문짝 교체", "싱크대 리폼"),
  ],
  openGraph: {
    title: "싱크대 문짝 교체·리폼 | 리스토리",
    description: "문짝만 바꿔도 새 주방처럼. 전체 교체의 1/5 비용. 당일 시공.",
    url: "https://www.restorystudio.co.kr/kitchen/sink-door",
    images: [
      {
        url: "/images/door/sink-door-main-renewal.png",
        width: 1080,
        height: 1350,
        alt: "리스토리 싱크대 문짝 교체 리폼",
      },
    ],
    type: "website",
    siteName: "리스토리",
    locale: "ko_KR",
  },
  alternates: {
    canonical: "https://www.restorystudio.co.kr/kitchen/sink-door",
  },
});

export default function Page() {
  return (
    <>
      <WebPageJsonLd
        name="싱크대 문짝 교체·리폼"
        description="싱크대 전체 교체 전 문짝만 교체해 주방 분위기를 바꿀 수 있는지 사진으로 먼저 확인합니다."
        url="https://www.restorystudio.co.kr/kitchen/sink-door"
        image="/images/door/sink-door-main-renewal.png"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "홈", url: "https://www.restorystudio.co.kr" },
          { name: "주방 리폼", url: "https://www.restorystudio.co.kr/kitchen" },
          {
            name: "싱크대 문짝 교체",
            url: "https://www.restorystudio.co.kr/kitchen/sink-door",
          },
        ]}
      />
      <Sinkdoorreformlanding />
    </>
  );
}
