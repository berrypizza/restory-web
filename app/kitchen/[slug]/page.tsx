import { notFound } from "next/navigation";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/app/components/JsonLd";
import { ServiceLandingPage } from "@/app/components/CategoryPages";
import { getService, getAllSlugs } from "@/lib/site-config";
import { KITCHEN_KEYWORD_SLUGS } from "@/lib/keyword-slugs";
import Sinkdoorreformlanding from "@/app/components/landing/Sinkdoorreformlanding";
import FridgeCabinetLanding from "@/app/components/landing/FridgeCabinetLanding";
import type { Metadata } from "next";
import { withLandingSeo } from "@/lib/landing-seo";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

const BASE = "https://www.restorystudio.co.kr";

export function generateStaticParams() {
  const existing = getAllSlugs("kitchen").map((slug) => ({ slug }));
  const seen = new Set(existing.map((p) => p.slug));
  const keywords = KITCHEN_KEYWORD_SLUGS.filter((s) => !seen.has(s)).map(
    (slug) => ({ slug }),
  );
  return [...existing, ...keywords];
}

function getLandingType(slug: string): "door" | "fridge-cabinet" | null {
  const kw = slug.replace(/-/g, " ");
  if (kw.includes("냉장고장")) return "fridge-cabinet";
  if (kw.includes("문짝") || kw.includes("도어") || kw.includes("문 교체"))
    return "door";
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
          { name: "주방 리폼", url: `${BASE}/kitchen` },
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

  const service = getService("kitchen", slug);
  if (service) {
    return withLandingSeo({
      title: `${service.title} | Re'Story`,
      description: service.description,
      alternates: { canonical: `${BASE}/kitchen/${slug}` },
      openGraph: {
        title: `${service.title} | Re'Story`,
        description: service.description,
        url: `${BASE}/kitchen/${slug}`,
      },
    });
  }

  const kw = slug.replace(/-/g, " ");
  const type = getLandingType(slug);

  let desc = `${kw} 전문 리스토리. 당일 시공, 3년 무상 A/S.`;
  if (type === "door")
    desc = `${kw} 전문 리스토리. 전체 교체 비용의 1/3~1/5. 100가지 이상 색상 선택. 당일 시공, 3년 무상 A/S.`;
  if (type === "fridge-cabinet")
    desc = `${kw} 전문 리스토리. 전체 주방 공사 전 냉장고장 문짝·패널 교체 가능 여부를 사진으로 먼저 확인합니다.`;

  return withLandingSeo({
    title: `${kw} | 리스토리 스튜디오`,
    description: desc,
    robots: { index: true, follow: true },
    alternates: { canonical: `${BASE}/kitchen/${slug}` },
    openGraph: {
      title: `${kw} | 리스토리 스튜디오`,
      description: desc,
      url: `${BASE}/kitchen/${slug}`,
      images: [
        {
          url:
            type === "fridge-cabinet"
              ? "/images/fridge-cabinet/refmain.png"
              : "/images/hero-door.webp",
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

  const service = getService("kitchen", slug);
  if (service)
    return (
      <>
        <LandingSeoScripts
          name={service.title}
          description={service.description}
          url={`${BASE}/kitchen/${slug}`}
          image="/images/og-image.png"
        />
        <ServiceLandingPage service={service} />
      </>
    );

  const type = getLandingType(slug);
  const kw = slug.replace(/-/g, " ");
  if (type === "door")
    return (
      <>
        <LandingSeoScripts
          name={kw}
          description={`${kw} 가능 여부를 사진으로 먼저 확인하고 싱크대 문짝 교체·리폼 기준을 안내합니다.`}
          url={`${BASE}/kitchen/${slug}`}
          image="/images/hero-door.webp"
        />
        <Sinkdoorreformlanding keyword={slug} />
      </>
    );
  if (type === "fridge-cabinet")
    return (
      <>
        <LandingSeoScripts
          name={kw}
          description={`${kw} 문짝·패널 교체 가능 여부를 사진으로 먼저 확인합니다.`}
          url={`${BASE}/kitchen/${slug}`}
          image="/images/fridge-cabinet/refmain.png"
        />
        <FridgeCabinetLanding keyword={slug} />
      </>
    );

  return notFound();
}
