import { notFound } from "next/navigation";
import { BusinessLinePage } from "@/app/components/CategoryPages";
import { getBusinessLine } from "@/lib/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "가죽 리폼 | 의자 천갈이 · 회의실 테이블 가죽 교체 | 리스토리",
  description:
    "식당 의자 천갈이, 카페 의자 가죽 교체, 회의실·중역 테이블 인조가죽 교체까지 사진으로 수리 가능 여부를 확인해드립니다.",
  keywords: [
    "가죽 리폼",
    "의자 천갈이",
    "의자 가죽 교체",
    "식당 의자 천갈이",
    "회의실 테이블 가죽 교체",
    "회의실 테이블 인조가죽 교체",
    "중역 테이블 가죽 교체",
    "리스토리",
  ],
  openGraph: {
    title: "가죽 리폼 | 의자 천갈이 · 회의실 테이블 가죽 교체 | 리스토리",
    description:
      "버리지 말고 가죽만 교체하세요. 의자와 회의실 테이블 상판 가죽 리폼을 방문 작업으로 안내합니다.",
    url: "https://www.restorystudio.co.kr/leather",
    type: "website",
    siteName: "리스토리",
    locale: "ko_KR",
  },
  alternates: {
    canonical: "https://www.restorystudio.co.kr/leather",
  },
};

export default function Page() {
  const line = getBusinessLine("leather");
  if (!line) return notFound();

  return <BusinessLinePage line={line} />;
}
