import type { Metadata, Viewport } from "next";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/app/components/JsonLd";
import { withLandingSeo } from "@/lib/landing-seo";
import { ACADEMY_OFFER as offer } from "@/lib/academy/offer";
import GisalLanding from "./GisalLanding";

const PAGE_URL = "https://www.restorystudio.co.kr/academy";
const description = `기술로 먹고살기 위한 사업자의 마인드와 원칙, 브랜딩·마케팅·운영을 배웁니다. 기술이 처음이어도 실제 고객 현장에서 지도 실습을 병행합니다. ${offer.weeks}주 사업 교육과 주 ${offer.fieldSessionsPerWeek}회 현장 기술 교육. ${offer.cohort}기 ${offer.seats}명, 기본 ${offer.basicPrice}만 원. 고객 동의·안전·숙련도에 따라 실습 범위가 달라집니다.`;

export const viewport: Viewport = { themeColor: "#0b0e0c", viewportFit: "cover" };
export const metadata: Metadata = withLandingSeo({
  title: { absolute: `기술로 살아남기 — 기술로 먹고살기 위한 사업 교육과 현장 실습, ${offer.cohort}기 모집 | 리스토리` },
  description,
  keywords: ["기술로 살아남기", "기살", "기술 창업 교육", "가구 수리 교육", "리폼 교육", "기술 창업 마케팅", "브랜딩", "리스토리"],
  alternates: { canonical: PAGE_URL },
  icons: { icon: [{ url: "/gisal-assets/favicon.svg", type: "image/svg+xml" }] },
  openGraph: {
    title: `기술로 살아남기 | ${offer.cohort}기 ${offer.seats}명 모집`,
    description,
    url: PAGE_URL,
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/gisal-assets/workshop-hero.webp", width: 1536, height: 1024, alt: "기술로 살아남기 — 교육 방향을 표현한 공구 작업대 연출 이미지" }],
  },
});

export default function AcademyPage() {
  return <>
    <WebPageJsonLd name={`기술로 살아남기 · ${offer.cohort}기 모집`} description={description} url={PAGE_URL} image="/gisal-assets/workshop-hero.webp" />
    <BreadcrumbJsonLd items={[{ name: "홈", url: "https://www.restorystudio.co.kr" }, { name: "기술로 살아남기", url: PAGE_URL }]} />
    <link rel="preload" href="/gisal-assets/gisal-korean.woff" as="font" type="font/woff" crossOrigin="anonymous" />
    <GisalLanding />
  </>;
}
