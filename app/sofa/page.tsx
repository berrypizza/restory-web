import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBusinessLine } from "@/lib/site-config";
import Sofacushionlanding from "@/app/components/landing/Sofacushionlanding";
import { makeRegionalKeywords } from "@/lib/seo-regions";

const BASE_KEYWORDS = [
  "소파 쿠션 복원",
  "소파 수리",
  "소파 꺼짐",
  "소파 복원",
  "쿠션 교체",
  "소파 쿠션 꺼짐",
  "소파 주저앉음",
  "소파 스펀지 교체",
  "소파 탄성 복원",
  "소파 리폼",
  "리스토리",
  "소파 쿠션 복원 후기",
  "소파 쿠션 복원 가격",
  "소파 쿠션 복원 전문 업체",
  "소파 꺼짐 수리",
];

export const metadata: Metadata = {
  title: "소파 쿠션 복원 전문 | 꺼짐·주저앉음 | 리스토리",
  description:
    "꺼진 소파를 바꾸기 전, 내부 보강으로 다시 사용할 수 있는지 확인하세요. 사진으로 복원 가능성과 예상 비용 범위를 먼저 안내하고, 스펀지·밴드·스프링 상태에 맞는 작업을 살펴봅니다.",
  keywords: [
    ...BASE_KEYWORDS,
    ...makeRegionalKeywords("소파 쿠션 복원", "소파 수리"),
  ],
  openGraph: {
    title: "소파 쿠션 복원 | 리스토리",
    description:
      "마음에 드는 소파, 꺼진 자리부터 확인하세요. 실제 복원 사례와 작업 방식을 살펴보고 내 소파의 복원 가능성·예상 비용을 사진으로 문의하세요.",
    url: "https://www.restorystudio.co.kr/sofa",
    images: [
      {
        url: "/images/sofa/hero-sofa-2.webp",
        width: 1080,
        height: 1350,
        alt: "리스토리 소파 쿠션 복원",
      },
    ],
    type: "website",
    siteName: "리스토리",
    locale: "ko_KR",
  },
  alternates: {
    canonical: "https://www.restorystudio.co.kr/sofa",
  },
};

export default function Page() {
  const line = getBusinessLine("sofa");
  if (!line) return notFound();
  return <Sofacushionlanding />;
}
