import { notFound } from "next/navigation";
import { ServiceLandingPage } from "@/app/components/CategoryPages";
import { getService, getAllSlugs } from "@/lib/site-config";
import type { Metadata } from "next";
import SangbujangLanding from "@/app/components/landing/Sangbujanglanding";
import HabujangLanding from "@/app/components/landing/HabujangLanding";
import CountertopCrackLanding from "@/app/components/landing/CountertopCrackLanding";
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
  else if (type === "sink-top-crack")
    desc = `${kw} 전문 리스토리. 싱크대 상판 크랙·갈라짐·깨짐 상태를 사진으로 먼저 확인하고 수리 가능 여부를 안내합니다.`;

  return {
    title: `${kw} | 리스토리 스튜디오`,
    description: desc,
    robots: { index: true, follow: true },
    alternates: { canonical: `${BASE}/repair/${slug}` },
    openGraph: {
      title: `${kw} | 리스토리 스튜디오`,
      description: desc,
      url: `${BASE}/repair/${slug}`,
      images:
        type === "sink-top-crack"
          ? [
              {
                url: "/images/sink-top-crack/main.png",
                width: 590,
                height: 500,
                alt: "리스토리 싱크대 상판 크랙 수리",
              },
            ]
          : undefined,
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
  if (type === "sink-top-crack")
    return <CountertopCrackLanding keyword={slug} />;

  return notFound();
}
