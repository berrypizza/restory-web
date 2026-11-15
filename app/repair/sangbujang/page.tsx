import type { Metadata } from "next";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/app/components/JsonLd";
import SangbujangLanding from "@/app/components/landing/Sangbujanglanding";
import { makeRegionalKeywords } from "@/lib/seo-regions";
import { withLandingSeo } from "@/lib/landing-seo";

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

export const metadata: Metadata = withLandingSeo({
  title: "싱크대 상부장 수리 전문 | 처짐·추락·뜸 | 리스토리",
  description:
    "처진 싱크대 상부장, 고정 상태를 확인하고 보강·재설치합니다. 실제 시공 전후 사진, 25만 원 수리의 포함 범위와 비용이 달라지는 조건, 시공 부위 3년 A/S를 확인하세요.",
  keywords: [
    ...BASE_KEYWORDS,
    ...makeRegionalKeywords("싱크대 상부장 수리", "상부장 처짐 수리"),
  ],
  openGraph: {
    title: "싱크대 상부장 수리 | 리스토리",
    description:
      "처진 상부장, 다시 단단하게. 실제 시공 사례와 보강·재설치 범위를 확인하고 사진으로 예상 비용과 방문 일정을 상담하세요.",
    url: "https://www.restorystudio.co.kr/repair/sangbujang",
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
    canonical: "https://www.restorystudio.co.kr/repair/sangbujang",
  },
});

export default function Page() {
  return (
    <>
      <WebPageJsonLd
        name="싱크대 상부장 처짐 수리"
        description="싱크대 상부장 처짐·추락 위험 상태를 사진으로 먼저 확인하고 수리 가능 여부를 안내합니다."
        url="https://www.restorystudio.co.kr/repair/sangbujang"
        image="/images/hero-sangbujang.webp"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "홈", url: "https://www.restorystudio.co.kr" },
          { name: "가구 수리", url: "https://www.restorystudio.co.kr/repair" },
          {
            name: "싱크대 상부장 처짐 수리",
            url: "https://www.restorystudio.co.kr/repair/sangbujang",
          },
        ]}
      />
      <SangbujangLanding />
    </>
  );
}
