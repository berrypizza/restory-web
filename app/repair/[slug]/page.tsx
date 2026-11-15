import { notFound } from "next/navigation";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/app/components/JsonLd";
import { ServiceLandingPage } from "@/app/components/CategoryPages";
import { getService, getAllSlugs } from "@/lib/site-config";
import type { Metadata } from "next";
import SangbujangLanding from "@/app/components/landing/Sangbujanglanding";
import HabujangLanding from "@/app/components/landing/HabujangLanding";
import CountertopCrackLanding from "@/app/components/landing/CountertopCrackLanding";
import { REPAIR_KEYWORD_SLUGS } from "@/lib/keyword-slugs";
import { withLandingSeo } from "@/lib/landing-seo";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

const BASE = "https://www.restorystudio.co.kr";

export function generateStaticParams() {
  const existing = getAllSlugs("repair").map((slug) => ({ slug }));
  const seen = new Set(existing.map((p) => p.slug));
  const keywords = REPAIR_KEYWORD_SLUGS.filter((s) => !seen.has(s)).map(
    (slug) => ({
      slug,
    }),
  );
  return [...existing, ...keywords];
}

function getLandingType(
  slug: string,
): "sangbujang" | "habujang" | "sink-top-crack" | null {
  const kw = slug.replace(/-/g, " ");
  if (kw.includes("하부장") || kw.includes("밑판")) return "habujang";
  if (kw.includes("상부장") || kw.includes("주방장")) return "sangbujang";
  if (
    (kw.includes("상판") || kw.includes("인조대리석")) &&
    (kw.includes("크랙") ||
      kw.includes("갈라짐") ||
      kw.includes("깨짐") ||
      kw.includes("수리") ||
      kw.includes("보수"))
  )
    return "sink-top-crack";
  return null;
}

function LandingSeoScripts({
  name,
  description,
  url,
  image,
}: {
  name: string;
  description: string;
  url: string;
  image: string;
}) {
  return (
    <>
      <WebPageJsonLd
        name={name}
        description={description}
        url={url}
        image={image}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "홈", url: BASE },
          { name: "가구 수리", url: `${BASE}/repair` },
          { name, url },
        ]}
      />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const service = getService("repair", slug);
  if (service) {
    return withLandingSeo({
      title: `${service.title} | Re'Story`,
      description: service.description,
      alternates: { canonical: `${BASE}/repair/${slug}` },
      openGraph: {
        title: `${service.title} | Re'Story`,
        description: service.description,
        url: `${BASE}/repair/${slug}`,
      },
    });
  }

  const kw = slug.replace(/-/g, " ");
  const type = getLandingType(slug);

  let desc = `${kw} 전문 리스토리. 당일 출장, 3년 무상 A/S.`;
  let image = {
    url: "/images/og-image-2.png",
    width: 1200,
    height: 630,
    alt: `리스토리 ${kw}`,
  };
  if (type === "habujang") {
    desc = `${kw} 전문 리스토리. 물 먹고 부푼 하부장 밑판 교체. 비용은 현장별 상담 견적이며, 사진으로 교체 가능 범위·견적·방문 일정을 확인합니다. 실제 시공 사례와 A/S 안내를 살펴보세요.`;
    image = {
      url: "/images/hero-habujang.webp",
      width: 1080,
      height: 1350,
      alt: `리스토리 ${kw}`,
    };
  } else if (type === "sangbujang") {
    desc = `${kw} 전문 리스토리. 처진 상부장 보강·재설치와 수평 조절. 상태별 비용 예시 25·30·35만 원(부가세 별도), 최종 금액은 상담으로 확정합니다. 실제 시공 사례와 보강·고정부 3년 무상 A/S를 확인하세요.`;
    image = {
      url: "/images/hero-sangbujang.webp",
      width: 1080,
      height: 1350,
      alt: `리스토리 ${kw}`,
    };
  } else if (type === "sink-top-crack") {
    desc = `${kw} 전문 리스토리. 수리 비용 범위는 30~50만 원, 부가세 별도이며 최종 금액은 상태를 보고 상담 후 안내합니다. 실제 전후 사례와 예상 마감, 시공 부위 3년 A/S 적용 조건을 확인하세요.`;
    image = {
      url: "/images/sink-top-crack/main.png",
      width: 590,
      height: 500,
      alt: "리스토리 싱크대 상판 크랙 수리",
    };
  }

  return withLandingSeo({
    title: `${kw} | 리스토리 스튜디오`,
    description: desc,
    robots: { index: true, follow: true },
    alternates: { canonical: `${BASE}/repair/${slug}` },
    openGraph: {
      title: `${kw} | 리스토리 스튜디오`,
      description: desc,
      url: `${BASE}/repair/${slug}`,
      images: [image],
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

  const service = getService("repair", slug);
  if (service)
    return (
      <>
        <LandingSeoScripts
          name={service.title}
          description={service.description}
          url={`${BASE}/repair/${slug}`}
          image="/images/og-image-2.png"
        />
        <ServiceLandingPage service={service} />
      </>
    );

  const type = getLandingType(slug);
  const kw = slug.replace(/-/g, " ");
  if (type === "sangbujang")
    return (
      <>
        <LandingSeoScripts
          name={kw}
          description={`${kw} 상태를 사진으로 먼저 확인하고 상부장 처짐 수리 가능 여부를 안내합니다.`}
          url={`${BASE}/repair/${slug}`}
          image="/images/hero-sangbujang.webp"
        />
        <SangbujangLanding keyword={slug} />
      </>
    );
  if (type === "habujang")
    return (
      <>
        <LandingSeoScripts
          name={kw}
          description={`${kw} 손상 범위를 사진으로 먼저 확인하고 수리·교체 기준을 안내합니다.`}
          url={`${BASE}/repair/${slug}`}
          image="/images/hero-habujang.webp"
        />
        <HabujangLanding keyword={slug} />
      </>
    );
  if (type === "sink-top-crack")
    return (
      <>
        <LandingSeoScripts
          name={kw}
          description={`${kw} 상태를 사진으로 먼저 확인하고 상판 수리 가능 여부를 안내합니다.`}
          url={`${BASE}/repair/${slug}`}
          image="/images/sink-top-crack/main.png"
        />
        <CountertopCrackLanding keyword={slug} />
      </>
    );

  return notFound();
}
