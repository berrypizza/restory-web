import { notFound } from "next/navigation";
import { ServiceLandingPage } from "@/app/components/CategoryPages";
import { getService, getAllSlugs } from "@/lib/site-config";
import type { Metadata } from "next";
import SangbujangLanding from "@/app/components/landing/Sangbujanglanding";
import HabujangLanding from "@/app/components/landing/HabujangLanding";
import { REPAIR_KEYWORD_SLUGS } from "@/lib/keyword-slugs";

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

function getLandingType(slug: string): "sangbujang" | "habujang" | null {
  const kw = slug.replace(/-/g, " ");
  if (kw.includes("하부장") || kw.includes("밑판")) return "habujang";
  if (kw.includes("상부장") || kw.includes("주방장")) return "sangbujang";
  return null;
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
    return {
      title: `${service.title} | Re'Story`,
      description: service.description,
    };
  }

  const kw = slug.replace(/-/g, " ");
  const type = getLandingType(slug);

  let desc = `${kw} 전문 리스토리. 당일 출장, 3년 무상 A/S.`;
  if (type === "habujang")
    desc = `${kw} 전문 리스토리. 하부장 밑판 물먹음·부풀음 지판 교체. 교체 비용의 1/5. 당일 시공, 3년 무상 A/S.`;
  else if (type === "sangbujang")
    desc = `${kw} 전문 리스토리. 합판 시공목으로 더 튼튼하게. 교체 비용의 1/3~. 당일 시공, 3년 무상 A/S.`;

  return {
    title: `${kw} | 리스토리 스튜디오`,
    description: desc,
    robots: { index: true, follow: true },
    alternates: { canonical: `${BASE}/repair/${slug}` },
    openGraph: {
      title: `${kw} | 리스토리 스튜디오`,
      description: desc,
      url: `${BASE}/repair/${slug}`,
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

  const service = getService("repair", slug);
  if (service) return <ServiceLandingPage service={service} />;

  const type = getLandingType(slug);
  if (type === "sangbujang") return <SangbujangLanding keyword={slug} />;
  if (type === "habujang") return <HabujangLanding keyword={slug} />;

  return notFound();
}
