import { notFound } from "next/navigation";
import { ServiceLandingPage } from "@/app/components/CategoryPages";
import { getService, getAllSlugs } from "@/lib/site-config";
import { KITCHEN_KEYWORD_SLUGS } from "@/lib/keyword-slugs";
import Sinkdoorreformlanding from "@/app/components/landing/Sinkdoorreformlanding";
import type { Metadata } from "next";

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

function getLandingType(slug: string): "door" | null {
  const kw = slug.replace(/-/g, " ");
  if (kw.includes("문짝") || kw.includes("도어") || kw.includes("문 교체"))
    return "door";
  return null;
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
    return {
      title: `${service.title} | Re'Story`,
      description: service.description,
    };
  }

  const kw = slug.replace(/-/g, " ");
  const type = getLandingType(slug);

  let desc = `${kw} 전문 리스토리. 당일 시공, 3년 무상 A/S.`;
  if (type === "door")
    desc = `${kw} 전문 리스토리. 전체 교체 비용의 1/3~1/5. 100가지 이상 색상 선택. 당일 시공, 3년 무상 A/S.`;

  return {
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
          url: "/images/hero-door.webp",
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

  const service = getService("kitchen", slug);
  if (service) return <ServiceLandingPage service={service} />;

  const type = getLandingType(slug);
  if (type === "door") return <Sinkdoorreformlanding keyword={slug} />;

  return notFound();
}
