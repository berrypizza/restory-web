// ─── 타입 ───
export type BusinessLineId = "repair" | "leather" | "kitchen" | "sofa";

export interface ServicePageConfig {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  hero: string;
  painPoints: string[];
  process: string[];
}

export interface BusinessLineConfig {
  id: BusinessLineId;
  title: string;
  subtitle: string;
  href: string;
  description: string;
  hero: string;
  services: ServicePageConfig[];
}

// ─── 데이터 ───
export const businessLines: BusinessLineConfig[] = [
  {
    id: "repair",
    title: "싱크대 수리",
    subtitle: "싱크대 상/하부장 · 수전 교체 · 문짝 떨어짐",
    href: "/repair",
    description:
      "싱크대 상하부장, 양념장 레일 등\n가구 전반의 출장 수리를 합니다.",
    hero: "교체하기 전에\n한 번만 더 물어보세요.",
    services: [
      {
        slug: "sangbujang",
        title: "싱크대 상부장 처짐 수리",
        shortTitle: "상부장 처짐",
        description:
          "상부장이 처지거나 벽에서 떨어진 경우, 보강 후 재고정합니다.",
        hero: "싱크대 상부장,\n떨어지기 전에 잡습니다.",
        painPoints: [
          "위에서 떨어질까봐 불안하다",
          "나사가 빠져서 흔들린다",
          "교체하면 수십만원이라고 했다",
        ],
        process: [
          "사진으로 처짐 정도 확인",
          "벽체 상태 · 하중 진단",
          "보강 후 재고정",
        ],
      },
      {
        slug: "habujang",
        title: "하부장 밑판 교체",
        shortTitle: "하부장 밑판",
        description: "하부장 밑판이 물에 불거나 파손된 경우 교체합니다.",
        hero: "물 먹은 밑판,\n그대로 두면 곰팡이까지.",
        painPoints: [
          "밑판이 물에 불었다",
          "냄새가 올라온다",
          "전체 교체하라고 했다",
        ],
        process: ["사진으로 손상 범위 확인", "밑판 사이즈 측정", "현장 교체"],
      },
      {
        slug: "door-fall",
        title: "문짝 떨어짐 수리",
        shortTitle: "문짝 떨어짐",
        description: "싱크대·붙박이장 문짝이 떨어지거나 경첩이 파손된 경우.",
        hero: "문짝 하나 떨어지면\n주방 전체가 불편합니다.",
        painPoints: [
          "문이 덜렁거린다",
          "경첩이 빠졌다",
          "문짝이 아예 떨어졌다",
        ],
        process: ["사진으로 경첩 상태 확인", "부품 준비", "현장 교체·재고정"],
      },
      {
        slug: "hinge",
        title: "경첩 교체",
        shortTitle: "경첩 교체",
        description: "경첩이 헐거워지거나 파손된 경우 교체합니다.",
        hero: "경첩 하나로\n문이 살아납니다.",
        painPoints: [
          "문이 안 닫힌다",
          "경첩에서 소리가 난다",
          "나사 구멍이 커졌다",
        ],
        process: ["사진으로 경첩 타입 확인", "호환 경첩 준비", "현장 교체"],
      },
      {
        slug: "drawer-rail",
        title: "서랍 레일 교체",
        shortTitle: "서랍 레일",
        description:
          "서랍이 안 들어가거나 뻑뻑한 경우 볼레일·철레일을 교체합니다.",
        hero: "서랍이 안 들어가면\n안 쓰게 됩니다.",
        painPoints: ["서랍이 뻑뻑하다", "레일이 휘었다", "서랍이 빠진다"],
        process: ["사진으로 레일 타입 확인", "호환 레일 준비", "현장 교체"],
      },
      {
        slug: "sofa-sag",
        title: "소파 꺼짐 수리",
        shortTitle: "소파 꺼짐",
        description: "소파 쿠션이 꺼지거나 주저앉은 경우 내부 보강합니다.",
        hero: "새 소파 사기 전에\n한 번만 물어보세요.",
        painPoints: [
          "한쪽만 꺼진다",
          "앉으면 바닥이 느껴진다",
          "새 소파가 수백만원이다",
        ],
        process: [
          "사진으로 꺼짐 정도 확인",
          "내부 구조 진단",
          "스프링·밴드 보강",
        ],
      },
      {
        slug: "sofa-frame",
        title: "소파 목대·스프링 수리",
        shortTitle: "소파 목대",
        description: "소파 내부 목대가 부서지거나 스프링이 파손된 경우.",
        hero: "겉은 멀쩡한데\n앉으면 삐걱거립니다.",
        painPoints: [
          "앉을 때 소리가 난다",
          "프레임이 부서진 것 같다",
          "수리가 되는지 모르겠다",
        ],
        process: [
          "사진으로 외관 확인",
          "현장에서 내부 진단",
          "목대·스프링 보강",
        ],
      },
      {
        slug: "bed-frame",
        title: "침대 프레임 수리",
        shortTitle: "침대 프레임",
        description: "침대 프레임이 부서지거나 삐걱거리는 경우.",
        hero: "매일 자는 침대,\n흔들리면 안 됩니다.",
        painPoints: [
          "누울 때마다 소리가 난다",
          "프레임이 갈라졌다",
          "교체하면 비싸다",
        ],
        process: ["사진으로 파손 부위 확인", "보강 방법 안내", "현장 수리"],
      },
      {
        slug: "table-leg",
        title: "식탁 다리 수리",
        shortTitle: "식탁 다리",
        description: "식탁 다리가 흔들리거나 부러진 경우.",
        hero: "식탁이 흔들리면\n밥맛도 흔들립니다.",
        painPoints: [
          "다리가 흔들린다",
          "다리가 부러졌다",
          "받침대로 버티고 있다",
        ],
        process: ["사진으로 파손 상태 확인", "보강 방법 안내", "현장 수리"],
      },
    ],
  },

  {
    id: "kitchen",
    title: "싱크대 리폼",
    subtitle: "냉장고장 · 싱크대 문짝 · 로청장",
    href: "/kitchen",
    description: "주방 가구의 외관(문짝·패널)을\n교체해 새것처럼 바꿉니다.",
    hero: "주방 전체를 바꾸지 않아도\n새것처럼 보입니다.",
    services: [
      {
        slug: "sink-door",
        title: "싱크대 문짝 리폼",
        shortTitle: "싱크대 문짝 리폼",
        description: "싱크대 문짝만 교체해 새것처럼.",
        hero: "싱크대 전체 교체?\n문짝만 바꾸면 됩니다.",
        painPoints: [
          "문짝이 들떴다",
          "색이 바랬다",
          "전체 교체는 수백만원이다",
        ],
        process: ["사진으로 문짝 상태 확인", "재질·색상 선택", "현장 교체"],
      },
      {
        slug: "fridge-cabinet",
        title: "냉장고장 리폼",
        shortTitle: "냉장고장",
        description: "냉장고장 문짝·패널 교체.",
        hero: "냉장고장 문짝만 바꿔도\n주방이 달라집니다.",
        painPoints: [
          "문짝이 낡았다",
          "색이 변했다",
          "전체 리모델링은 부담된다",
        ],
        process: ["사진으로 상태 확인", "문짝 재질·색상 선택", "현장 교체"],
      },

      {
        slug: "rocheong",
        title: "로청장 리폼",
        shortTitle: "로청장",
        description: "로청장 문짝·패널 교체.",
        hero: "로청장도\n문짝만 바꿀 수 있습니다.",
        painPoints: [
          "문짝이 낡았다",
          "전체 교체 견적이 너무 비싸다",
          "부분 교체가 가능한지 모르겠다",
        ],
        process: ["사진으로 상태 확인", "재질·색상 선택", "현장 교체"],
      },
    ],
  },
  {
    id: "leather",
    title: "가죽 리폼",
    subtitle: "식탁의자 · 식당의자 · 붙박이소파 · 사무용",
    href: "/leather",
    description:
      "의자 가죽이 찢어지거나 벗겨진 경우\n인조가죽 교체(천갈이)를 합니다.",
    hero: "버리지 마세요.\n가죽만 바꾸면 됩니다.",
    services: [
      {
        slug: "restaurant-chair",
        title: "의자 가죽 천갈이 리폼",
        shortTitle: "의자 가죽 천갈이 리폼",
        description: "식당·카페·공항·관공서 의자 대량 천갈이.",
        hero: "식당 의자 20개,\n하루면 끝납니다.",
        painPoints: [
          "의자가 다 찢어졌다",
          "전부 새로 사면 수백만원이다",
          "영업 중 작업이 가능한가",
        ],
        process: [
          "사진으로 수량·상태 확인",
          "단가 안내",
          "일정 잡고 현장 작업",
        ],
      },

      {
        slug: "custom",
        title: "기타 가죽 천갈이 리폼",
        shortTitle: "기타 가죽 천갈이 리폼",
        description: "기타 가죽 교체가 필요한 가구.",
        hero: "가죽이 씌워진 가구라면\n한 번 물어보세요.",
        painPoints: [
          "이런 것도 되는지 모르겠다",
          "어디에 맡겨야 할지 모르겠다",
          "비용이 궁금하다",
        ],
        process: ["사진으로 상태 확인", "가능 여부 안내", "현장 작업"],
      },
    ],
  },
  {
    id: "sofa",
    title: "소파 리폼",
    subtitle: "소파",
    href: "/sofa",
    description:
      "소파가 꺼진 경우\n새로 살 필요 없이 내부 보강으로 해결합니다.",
    hero: "버리지 마세요.\n5배는 아낍니다.",
    services: [
      {
        slug: "sofa-sag",
        title: "소파 꺼짐 복원",
        shortTitle: "소파 꺼짐 복원",
        description: "소파가 꺼진 경우 내부 보강으로 해결합니다.",
        hero: "버리지 마세요.\n5배는 아픕니다.",
        painPoints: [
          "의자가 다 찢어졌다",
          "전부 새로 사면 수백만원이다",
          "영업 중 작업이 가능한가",
        ],
        process: [
          "사진으로 수량·상태 확인",
          "단가 안내",
          "일정 잡고 현장 작업",
        ],
      },
    ],
  },
];

// ─── 헬퍼 ───
export function getBusinessLine(
  id: BusinessLineId,
): BusinessLineConfig | undefined {
  return businessLines.find((l) => l.id === id);
}

export function getService(
  lineId: BusinessLineId,
  slug: string,
): ServicePageConfig | undefined {
  return getBusinessLine(lineId)?.services.find((s) => s.slug === slug);
}

export function getAllSlugs(lineId: BusinessLineId): string[] {
  return getBusinessLine(lineId)?.services.map((s) => s.slug) ?? [];
}
