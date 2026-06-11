import { notFound } from "next/navigation";
import { getBusinessLine } from "@/lib/site-config";
import RestaurantChairLanding from "../components/landing/Restaurantchairlanding";
import type { Metadata } from "next";

const REGIONS = [
  "인천",
  "청라",
  "송도",
  "영종도",
  "검단",
  "계양",
  "부평",
  "주안동",
  "간석동",
  "연수",
  "인천논현",
  "소래",
  "김포",
  "김포한강신도시",
  "장기동",
  "구래동",
  "파주",
  "운정",
  "부천",
  "중동",
  "상동",
  "역곡",
  "소사",
  "옥길",
  "광명",
  "시흥",
  "일산",
  "탄현동",
  "강서구",
  "마곡",
  "발산",
  "화곡",
  "등촌",
  "방화",
  "염창",
  "마포",
  "홍대",
  "합정",
  "상암",
  "영등포",
  "여의도",
  "당산",
  "신길",
  "목동",
  "양천",
  "신정동",
  "은평",
  "서대문",
  "연희동",
  "용산",
  "이태원",
  "동작",
  "노량진",
  "사당",
  "관악",
  "신림",
  "금천",
  "가산",
  "구로",
  "대림",
  "개봉",
  "서초",
  "반포",
  "잠원",
  "강남",
  "압구정",
  "신사",
  "논현",
  "과천",
];

const BASE_KEYWORDS = [
  "의자 가죽 교체",
  "의자 천갈이",
  "인조가죽 교체",
  "인조 가죽 천갈이",
  "업소용 소파 의자 천갈이",
  "붙박이 소파 천갈이",
  "식당 의자 교체",
  "카페 의자 천갈이",
  "고깃집 의자 교체",
  "가죽 리폼",
  "리스토리",
  "의자 수리",
  "식당 의자 천갈이",
  "카페 의자 가죽 교체",
  "고깃집 의자 천갈이",
  "업소용 의자 가죽 교체",
];

// "인천 의자 천갈이", "청라 의자 가죽 교체" 식으로 조합
const REGIONAL_KEYWORDS = REGIONS.flatMap((r) => [
  `${r} 의자 천갈이`,
  `${r} 의자 가죽 교체`,
]);

export const metadata: Metadata = {
  title: "식당·카페 의자 가죽 교체 전문 | 개당 3만원~ | 리스토리",
  description:
    "의자 새로 살 필요 없어요. 인조가죽 천갈이로 새것처럼. 업소용 붙박이 소파 의자 천갈이, 카페·식당·고깃집 의자 가죽 교체 전문. 개당 3만원~, 당일 완료, 영업 외 시간 방문 가능.",
  keywords: [...BASE_KEYWORDS, ...REGIONAL_KEYWORDS],
  openGraph: {
    title: "식당·카페 의자 가죽 교체 | 개당 3만원~ | 리스토리",
    description:
      "인조가죽 천갈이로 새 의자보다 3배 저렴하게. 업소용 붙박이 소파, 카페·식당 의자 당일 완료.",
    images: [
      {
        url: "/images/chair/hero-chair.webp",
        width: 1200,
        height: 630,
        alt: "리스토리 의자 가죽 교체 시공 사례",
      },
    ],
    url: "https://restorystudio.co.kr/leather",
    type: "website",
    siteName: "리스토리",
    locale: "ko_KR",
  },
  alternates: {
    canonical: "https://restorystudio.co.kr/leather",
  },
};

export default function Page() {
  const line = getBusinessLine("leather");
  if (!line) return notFound();
  return <RestaurantChairLanding />;
}
