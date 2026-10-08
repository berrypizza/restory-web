import { notFound } from "next/navigation";
import { BusinessLinePage } from "@/app/components/CategoryPages";
import { getBusinessLine } from "@/lib/site-config";
import type { Metadata } from "next";
import { withLandingSeo } from "@/lib/landing-seo";

export const metadata: Metadata = withLandingSeo({
  title: "가구 수리 | 싱크대 상부장·하부장·상판 수리 | 리스토리",
  description:
    "싱크대 상부장 처짐, 하부장 파손, 상판 크랙 등 가구 수리 가능 여부를 사진으로 먼저 확인합니다. 교체 전 살릴 수 있는 범위를 안내합니다.",
  alternates: {
    canonical: "https://www.restorystudio.co.kr/repair",
  },
  openGraph: {
    title: "가구 수리 | 리스토리",
    description:
      "상부장 처짐, 하부장 파손, 상판 크랙 등 교체 전 수리 가능 여부를 먼저 확인합니다.",
    url: "https://www.restorystudio.co.kr/repair",
    images: [
      {
        url: "/images/hero-sangbujang.webp",
        width: 1080,
        height: 1350,
        alt: "리스토리 가구 수리",
      },
    ],
  },
});

export default function Page() {
  const line = getBusinessLine("repair");
  if (!line) return notFound();
  return <BusinessLinePage line={line} />;
}
