// lib/landing-config.ts
// 랜딩페이지별 설정을 여기서 관리합니다.
// slug를 추가하면 /landing/[slug] 경로로 자동 생성됩니다.

export interface LandingConfig {
  slug: string;
  title: string;
  description: string;
  heroTitle: string;
  heroSub: string;
  heroAccent: string;
  targetArea: string; // 타겟 지역
  phone: string;
  kakaoUrl: string;
  ogImage?: string;
}

export const landingPages: LandingConfig[] = [
  {
    slug: "incheon-sofa",
    title: "인천 소파 수리 전문 | 리스토리",
    description: "인천 소파 꺼짐·스프링 수리. 사진 보내주시면 즉시 안내드립니다.",
    heroTitle: "인천 소파 수리",
    heroSub: "꺼진 소파, 사진 한 장이면 충분합니다",
    heroAccent: "새 소파 사기 전에 한 번만 물어보세요",
    targetArea: "인천 전 지역",
    phone: "01000000000",
    kakaoUrl: "https://pf.kakao.com/_CHANGE_ME/chat",
  },
  {
    slug: "bucheon-sink",
    title: "부천 싱크대 수리 전문 | 리스토리",
    description: "부천 싱크대 상부장 처짐·문짝 교체. 당일 수리 가능.",
    heroTitle: "부천 싱크대 수리",
    heroSub: "상부장 처짐, 문짝 떨어짐 당일 해결",
    heroAccent: "교체 견적 받기 전에 사진부터 보내세요",
    targetArea: "부천시 전 지역",
    phone: "01000000000",
    kakaoUrl: "https://pf.kakao.com/_CHANGE_ME/chat",
  },
  {
    slug: "seoul-gangseo-furniture",
    title: "서울 강서구 가구 수리 전문 | 리스토리",
    description: "강서구 가구 출장 수리. 붙박이장·소파·싱크대 당일 방문.",
    heroTitle: "강서구 가구 수리",
    heroSub: "화곡·마곡·등촌·발산 당일 출장",
    heroAccent: "사진 보내면 3분 안에 답변드립니다",
    targetArea: "서울 강서구",
    phone: "01000000000",
    kakaoUrl: "https://pf.kakao.com/_CHANGE_ME/chat",
  },
];

export function getLandingBySlug(slug: string): LandingConfig | undefined {
  return landingPages.find((lp) => lp.slug === slug);
}
