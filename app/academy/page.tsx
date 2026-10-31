import type { Metadata, Viewport } from "next";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/app/components/JsonLd";
import { withLandingSeo } from "@/lib/landing-seo";
import GisalLanding from "./GisalLanding";

const PAGE_URL = "https://www.restorystudio.co.kr/academy";
const description = "몰입 환경부터 브랜딩, 마케팅, 직접 운영하는 사업 사이트까지 배우는 5주 과정. 5주간 주 2회 현장 기술 수업, 수료 후에도 요청에 따른 기술 교육. 1기 4명 소수 정예, 2026년 12월 1일 개강. 수강료 490만 원.";

export const viewport: Viewport = { themeColor: "#0b0e0c", viewportFit: "cover" };
export const metadata: Metadata = withLandingSeo({
  title: { absolute: "기술로 살아남기 — 기술부터 사업까지, 1기 모집 | 리스토리" },
  description,
  keywords: ["기술로 살아남기", "기살", "기술 창업 교육", "가구 수리 교육", "리폼 교육", "기술 창업 마케팅", "브랜딩", "리스토리"],
  alternates: { canonical: PAGE_URL },
  icons: { icon: [{ url: "/gisal-assets/favicon.svg", type: "image/svg+xml" }] },
  openGraph: {
    title: "기술로 살아남기 | 1기 4명 모집",
    description: "손님 없는 기술자는 기술이 있어도 무쓸모! 기술부터 사업까지, 행복하게 사업하는 법. 2026년 12월 1일 개강 · 490만 원",
    url: PAGE_URL,
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/gisal-assets/workshop-hero.webp", width: 1536, height: 1024, alt: "기술로 살아남기 — 교육 방향을 표현한 공구 작업대 연출 이미지" }],
  },
});

export default function AcademyPage() {
  return <>
    <WebPageJsonLd name="기술로 살아남기 · 1기 모집" description={description} url={PAGE_URL} image="/gisal-assets/workshop-hero.webp" />
    <BreadcrumbJsonLd items={[{ name: "홈", url: "https://www.restorystudio.co.kr" }, { name: "기술로 살아남기", url: PAGE_URL }]} />
    <link rel="preload" href="/gisal-assets/gisal-korean.woff" as="font" type="font/woff" crossOrigin="anonymous" />
    <GisalLanding />
  </>;
}
