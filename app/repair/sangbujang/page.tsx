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
    "처진 상부장을 보강·재설치하고 수평과 문짝 닫힘까지 맞춥니다. 상태별 비용 예시 25·30·35만 원(부가세 별도), 최종 금액은 상담으로 확정합니다. 실제 시공 사례와 보강·고정부 3년 무상 A/S를 확인하세요.",
  keywords: [
    ...BASE_KEYWORDS,
    ...makeRegionalKeywords("싱크대 상부장 수리", "상부장 처짐 수리"),
  ],
  openGraph: {
    title: "싱크대 상부장 수리 | 리스토리",
    description:
      "처진 상부장, 다시 단단하게. 사진으로 수리 범위·금액·방문일을 상담하세요. 상담 후 금액 변경 없음, 수리 불가 시 비용 없음.",
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
