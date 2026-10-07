import type { Metadata } from "next";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/app/components/JsonLd";
import Sofacushionlanding from "@/app/components/landing/Sofacushionlanding";
import { SOFA_KEYWORD_SLUGS } from "@/lib/keyword-slugs";
import { withLandingSeo } from "@/lib/landing-seo";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

const BASE = "https://www.restorystudio.co.kr";

export function generateStaticParams() {
  return SOFA_KEYWORD_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const kw = slug.replace(/-/g, " ");

  const desc = `${kw} 전문 리스토리. 새 소파 구매 비용의 1/10 수준. HR계열 고탄성 스펀지 + 이태리 엘라스틱 밴드. 당일 시공, 무상 A/S.`;

  return withLandingSeo({
    title: `${kw} | 리스토리 스튜디오`,
    description: desc,
    robots: { index: true, follow: true },
    alternates: { canonical: `${BASE}/sofa/${slug}` },
    openGraph: {
      title: `${kw} | 리스토리 스튜디오`,
      description: desc,
      url: `${BASE}/sofa/${slug}`,
      images: [
        {
          url: "/images/sofa/hero-sofa-2.webp",
          width: 1080,
          height: 1350,
          alt: `리스토리 ${kw}`,
        },
      ],
      type: "website",
      siteName: "리스토리",
      locale: "ko_KR",
    },
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const kw = slug.replace(/-/g, " ");

  return (
    <>
      <WebPageJsonLd
        name={kw}
        description={`${kw} 상태를 사진으로 먼저 확인하고 소파 쿠션 복원 가능 여부를 안내합니다.`}
        url={`${BASE}/sofa/${slug}`}
        image="/images/sofa/hero-sofa-2.webp"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "홈", url: BASE },
          { name: "소파 수리", url: `${BASE}/sofa` },
          { name: kw, url: `${BASE}/sofa/${slug}` },
        ]}
      />
      <Sofacushionlanding keyword={slug} />
    </>
  );
}
