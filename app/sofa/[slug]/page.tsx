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

  const desc = `${kw} 복원 상담. 사진으로 복원 가능성과 예상 비용 범위를 먼저 살펴보고, 내부 스펀지·밴드·스프링 상태에 맞는 작업을 안내합니다. 실제 시공 사례와 방문 일정을 확인하세요.`;

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
        description={`${kw} 상태를 사진으로 먼저 살펴보고 복원 가능성과 예상 비용 범위를 안내합니다. 내부 손상 등 추가 확인이 필요한 부분은 현장에서 확인합니다.`}
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
