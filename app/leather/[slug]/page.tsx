import { notFound } from "next/navigation";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/app/components/JsonLd";
import { ServiceLandingPage } from "@/app/components/CategoryPages";
import { getService, getAllSlugs } from "@/lib/site-config";
import type { Metadata } from "next";
import RestaurantChairLanding from "@/app/components/landing/Restaurantchairlanding";
import MeetingTableLeatherLanding from "@/app/components/landing/MeetingTableLeatherLanding";
import { LEATHER_KEYWORD_SLUGS } from "@/lib/keyword-slugs";
import { withLandingSeo } from "@/lib/landing-seo";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

const BASE = "https://www.restorystudio.co.kr";

export function generateStaticParams() {
  const existing = getAllSlugs("leather").map((slug) => ({ slug }));
  const seen = new Set(existing.map((p) => p.slug));

  const keywords = LEATHER_KEYWORD_SLUGS.filter((s) => !seen.has(s)).map(
    (slug) => ({
      slug,
    }),
  );

  return [...existing, ...keywords];
}

function getLandingType(slug: string): "chair" | "table" | null {
  const kw = slug.replace(/-/g, " ");

  if (
    kw.includes("테이블") ||
    kw.includes("회의테이블") ||
    kw.includes("중역") ||
    kw.includes("책상") ||
    kw.includes("meeting table") ||
    slug === "meeting-table"
  ) {
    return "table";
  }

  if (kw.includes("의자") || kw.includes("천갈이") || kw.includes("가죽")) {
    return "chair";
  }

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
          { name: "가죽 리폼", url: `${BASE}/leather` },
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

  const service = getService("leather", slug);
  const type = getLandingType(slug);

  if (service && type !== "table") {
    return withLandingSeo({
      title: `${service.title} | Re'Story`,
      description: service.description,
      alternates: { canonical: `${BASE}/leather/${slug}` },
      openGraph: {
        title: `${service.title} | Re'Story`,
        description: service.description,
        url: `${BASE}/leather/${slug}`,
      },
    });
  }

  const kw = slug.replace(/-/g, " ");

  let desc = `${kw} 전문 리스토리. 당일 출장, 무상 A/S.`;

  if (type === "chair") {
    desc = `${kw} 전문 리스토리. 새 의자 대비 1/3~1/5 비용. 국내산 가죽 사용. 당일 시공 가능.`;
  } else if (type === "table") {
    desc = `${kw} 전문 리스토리. 회의실 테이블·중역 테이블 상판 가죽 벗겨짐, 오염, 갈라짐을 새 인조가죽으로 교체합니다. 사무실 방문 시공, 무상 A/S.`;
  }

  return withLandingSeo({
    title: `${kw} | 리스토리 스튜디오`,
    description: desc,
    robots: { index: true, follow: true },
    alternates: { canonical: `${BASE}/leather/${slug}` },
    openGraph: {
      title: `${kw} | 리스토리 스튜디오`,
      description: desc,
      url: `${BASE}/leather/${slug}`,
      images: [
        {
          url:
            type === "table"
              ? "/images/cases/case-014-after.jpg"
              : "/images/chair/hero-chair.webp",
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

  const service = getService("leather", slug);
  const type = getLandingType(slug);
  const kw = slug.replace(/-/g, " ");
  if (type === "table")
    return (
      <>
        <LandingSeoScripts
          name={kw}
          description={`${kw} 상판 가죽 손상 상태를 사진으로 먼저 확인하고 교체 가능 여부를 안내합니다.`}
          url={`${BASE}/leather/${slug}`}
          image="/images/cases/case-014-after.jpg"
        />
        <MeetingTableLeatherLanding keyword={slug} />
      </>
    );
  if (service)
    return (
      <>
        <LandingSeoScripts
          name={service.title}
          description={service.description}
          url={`${BASE}/leather/${slug}`}
          image="/images/chair/hero-chair.webp"
        />
        <ServiceLandingPage service={service} />
      </>
    );
  if (type === "chair")
    return (
      <>
        <LandingSeoScripts
          name={kw}
          description={`${kw} 상태를 사진으로 먼저 확인하고 의자 가죽 교체 가능 여부를 안내합니다.`}
          url={`${BASE}/leather/${slug}`}
          image="/images/chair/hero-chair.webp"
        />
        <RestaurantChairLanding keyword={slug} />
      </>
    );

  return notFound();
}
