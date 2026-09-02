import type { Metadata } from "next";
import Sinkdoorreformlanding from "@/app/components/landing/Sinkdoorreformlanding";
import { KITCHEN_KEYWORD_SLUGS } from "@/lib/keyword-slugs";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

const BASE = "https://www.restorystudio.co.kr";

export function generateStaticParams() {
  return KITCHEN_KEYWORD_SLUGS.map((keyword) => ({ keyword }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ keyword: string }>;
}): Promise<Metadata> {
  const { keyword: rawKeyword } = await params;
  const keyword = decodeURIComponent(rawKeyword);
  const titleKeyword = keyword.replace(/-/g, " ");
  const description = `${titleKeyword} 리스토리. 전체 철거 없이 문짝만 교체해 주방 분위기를 바꾸는 싱크대 문짝 리폼입니다. 사진으로 가능 여부를 먼저 확인합니다.`;

  return {
    title: `${titleKeyword} | 리스토리`,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${BASE}/kitchen/sink-door/${encodeURIComponent(keyword)}`,
    },
    openGraph: {
      title: `${titleKeyword} | 리스토리`,
      description,
      url: `${BASE}/kitchen/sink-door/${encodeURIComponent(keyword)}`,
      images: [
        {
          url: "/images/door/sink-door-main.png",
          width: 1834,
          height: 850,
          alt: `리스토리 ${titleKeyword}`,
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
  params: Promise<{ keyword: string }>;
}) {
  const { keyword: rawKeyword } = await params;
  const keyword = decodeURIComponent(rawKeyword);

  return <Sinkdoorreformlanding keyword={keyword} />;
}
