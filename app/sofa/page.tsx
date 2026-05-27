import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBusinessLine } from "@/lib/site-config";
import Sofacushionlanding from "@/app/components/landing/Sofacushionlanding";

export const metadata: Metadata = {
  title: "소파 쿠션 복원",
  description:
    "소파 쿠션 꺼짐·주저앉음 복원. 새 소파 구매 비용의 1/10. HR계열 고탄성 스펀지 + 이태리 엘라스틱 밴드. 당일 시공 완료. 100% 무상 A/S.",
  keywords: [
    "소파 쿠션 복원",
    "소파 수리",
    "소파 꺼짐",
    "소파 복원",
    "쿠션 교체",
  ],
  openGraph: {
    title: "소파 쿠션 복원 | 리스토리",
    description:
      "소파를 새로 살 필요 없습니다. 쿠션 복원만 하면 새것처럼. 1/10 비용.",
    url: "https://restorystudio.co.kr/sofa",
    images: [
      { url: "/images/sofa/hero-sofa-2.webp", width: 1080, height: 1350 },
    ],
  },
  alternates: {
    canonical: "https://restorystudio.co.kr/sofa",
  },
};

export default function Page() {
  const line = getBusinessLine("sofa");
  if (!line) return notFound();
  return <Sofacushionlanding />;
}
