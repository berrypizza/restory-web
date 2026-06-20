import type { Metadata } from "next";
import Sofacushionlanding from "@/app/components/landing/Sofacushionlanding";

const BASE = "https://www.restorystudio.co.kr";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const kw = slug.replace(/-/g, " ");

  const desc = `${kw} 전문 리스토리. 새 소파 구매 비용의 1/10 수준. HR계열 고탄성 스펀지 + 이태리 엘라스틱 밴드. 당일 시공, 무상 A/S.`;

  return {
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
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  return <Sofacushionlanding keyword={slug} />;
}
