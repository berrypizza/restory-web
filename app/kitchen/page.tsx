import { notFound } from "next/navigation";
import { BusinessLinePage } from "@/app/components/CategoryPages";
import { getBusinessLine } from "@/lib/site-config";
import type { Metadata } from "next";
import { withLandingSeo } from "@/lib/landing-seo";

export const metadata: Metadata = withLandingSeo({
  title: "주방 리폼 | 싱크대 문짝 교체·냉장고장 리폼 | 리스토리",
  description:
    "싱크대 문짝 교체, 냉장고장 리폼, 주방 부분 리폼 가능 여부를 사진으로 먼저 확인합니다. 전체 교체 전 살릴 수 있는 범위를 안내합니다.",
  alternates: {
    canonical: "https://www.restorystudio.co.kr/kitchen",
  },
  openGraph: {
    title: "주방 리폼 | 리스토리",
    description:
      "싱크대 문짝 교체와 냉장고장 리폼을 사진으로 먼저 확인하고 필요한 범위만 안내합니다.",
    url: "https://www.restorystudio.co.kr/kitchen",
    images: [
      {
        url: "/images/door/sink-door-main-renewal.png",
        width: 1080,
        height: 1350,
        alt: "리스토리 주방 리폼",
      },
    ],
  },
});

export default function Page() {
  const line = getBusinessLine("kitchen");
  if (!line) return notFound();
  return <BusinessLinePage line={line} />;
}
