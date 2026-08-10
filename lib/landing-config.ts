export interface LandingConfig {
  slug: string;
  title: string;
  description: string;
  heroTitle: string;
}

export const landingPages: LandingConfig[] = [
  {
    slug: "cheongali",
    title: "의자 천갈이 리폼 | Re'Story",
    description: "식당·카페·병원 의자 가죽 천갈이와 리폼 가능 여부를 사진으로 먼저 확인합니다.",
    heroTitle: "의자 천갈이 리폼",
  },
  {
    slug: "sangbujang",
    title: "싱크대 상부장 처짐 수리 | Re'Story",
    description: "싱크대 상부장 처짐·추락 위험을 사진으로 확인하고 수리 가능 여부를 안내합니다.",
    heroTitle: "싱크대 상부장 처짐 수리",
  },
  {
    slug: "cheongali-2",
    title: "식당 의자 천갈이 | Re'Story",
    description: "식당 의자 좌판 가죽 손상, 뜯김, 오염 상태를 확인하고 천갈이 기준을 안내합니다.",
    heroTitle: "식당 의자 천갈이",
  },
  {
    slug: "cheongali-3",
    title: "카페 의자 가죽 교체 | Re'Story",
    description: "카페 의자와 벤치 좌석 가죽 교체 가능 여부를 사진으로 먼저 확인합니다.",
    heroTitle: "카페 의자 가죽 교체",
  },
  {
    slug: "cheongali-4",
    title: "병원 의자 천갈이 | Re'Story",
    description: "병원 대기 의자와 진료 의자 가죽 손상 상태를 확인하고 교체 범위를 안내합니다.",
    heroTitle: "병원 의자 천갈이",
  },
  {
    slug: "cheongali-5",
    title: "붙박이 소파 천갈이 | Re'Story",
    description: "매장 붙박이 소파와 부스석 가죽 손상 상태를 확인하고 천갈이 가능 여부를 안내합니다.",
    heroTitle: "붙박이 소파 천갈이",
  },
  {
    slug: "cheongali-6",
    title: "회의실 의자 가죽 리폼 | Re'Story",
    description: "회의실 의자와 사무용 의자 가죽 마모 상태를 확인하고 리폼 범위를 안내합니다.",
    heroTitle: "회의실 의자 가죽 리폼",
  },
];

export function getLandingBySlug(slug: string): LandingConfig | undefined {
  return landingPages.find((lp) => lp.slug === slug);
}
