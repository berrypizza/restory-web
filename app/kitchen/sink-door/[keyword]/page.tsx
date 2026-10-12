import { notFound, permanentRedirect } from "next/navigation";
import { KITCHEN_KEYWORD_SLUGS } from "@/lib/keyword-slugs";

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return KITCHEN_KEYWORD_SLUGS.map((keyword) => ({ keyword }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ keyword: string }>;
}) {
  const { keyword } = await params;
  if (!KITCHEN_KEYWORD_SLUGS.includes(keyword)) notFound();

  // 새 주소로 들어온 링크도 동일한 서비스의 기존 대표 주소로 연결합니다.
  // 실제 랜딩 화면은 /kitchen/[slug]에서 계속 제공합니다.
  permanentRedirect(`/kitchen/${encodeURIComponent(keyword)}`);
}
