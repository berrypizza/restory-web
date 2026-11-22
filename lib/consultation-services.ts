import type { ProductOption } from "@/app/admin/lib/products";

export const INTAKE_LABEL = "빠른 상담 접수";

type ServiceGuide = {
  label: string;
  matches: RegExp;
  overview: string;
  cost: string;
  photos: string;
  intakeItem: ProductOption | null;
};

export const services = {
  doors: {
    label: "싱크대 문짝 교체",
    matches: /싱크대(?:의)?(?:문짝|도어)|(?:상부장|하부장)(?:의)?문짝|문짝(?:만)?교체|도어만교체/,
    overview: "싱크대 몸통이 튼튼하면 문짝과 서랍 앞판만 바꿀 수 있어요.",
    cost: "문짝과 서랍 앞판의 개수, 고른 자재에 따라 비용이 달라요. 최종 금액은 방문 실측 후 정해요.",
    photos: "주방 전체가 보이게 한 장, 바꿀 문짝이 잘 보이게 한 장을 찍어 주세요.",
    intakeItem: "싱크대 문짝 교체",
  },
  upper: {
    label: "상부장 처짐 수리",
    matches: /상부장.*(?:처[짐지져졌진]|추락|떨어|내려|흔들|기울|보강|고정|수리)|(?:처진|떨어진)상부장/,
    overview: "상부장이 처졌다면 사용을 멈추고 장 아래에서 떨어져 주세요. 고정 부위를 보고 보강할 수 있는지 살펴봐요.",
    cost: "일반 처짐은 25만 원, 심한 처짐·손상은 30만 원, 추락 수리는 35만 원이 예시예요. 모두 부가세 별도이고 최종 금액은 상태를 보고 정해요.",
    photos: "상부장 아래는 피해서, 안전한 거리에서 장 전체와 기울어진 부분이 보이게 찍어 주세요.",
    intakeItem: "싱크대 상부장 처짐 수리",
  },
  leather: {
    label: "가죽 수선 상담",
    matches: /(?:소파|쇼파).*(?:천갈이|가죽)|누박가죽|가죽복원|염색|클리닝/,
    overview: "가죽은 소재와 손상 부위를 보고 수선이 가능한지 먼저 확인해요.",
    cost: "가죽은 변색이나 벗겨짐 정도에 따라 가능한 작업이 달라요. 수선 범위를 확인한 뒤 예상 비용을 안내해요.",
    photos: "가구 전체를 한 장, 가죽의 결이나 벗겨진 부분을 가까이 한 장 찍어 주세요.",
    intakeItem: null,
  },
  sofa: {
    label: "소파 꺼짐 수리",
    matches: /(?:소파|쇼파).*(?:꺼[짐졌진져지]|쿠션|스펀지|밴드|스프링|복원)|꺼진(?:소파|쇼파)|^(?:소파|쇼파)(?:수리|요|예요)?$/,
    overview: "꺼진 자리는 내부 밴드나 스펀지를 보강해 다시 쓸 수 있는지 살펴봐요.",
    cost: "소파 수리비는 꺼진 좌석 수와 안쪽에서 보강할 부위에 따라 달라요.",
    photos: "소파 전체를 한 장 찍고, 꺼진 자리와 옆자리를 함께 찍어 높이 차이를 보여 주세요.",
    intakeItem: "소파 수리",
  },
  chairs: {
    label: "의자 천갈이",
    matches: /의자.*(?:천갈이|가죽|시트|방석)|(?:가죽|식탁)의자.*(?:벗겨|찢어)/,
    overview: "의자 틀이 튼튼하면 낡은 방석이나 등받이의 가죽만 바꿀 수 있어요.",
    cost: "의자 천갈이 비용은 수량과 가죽을 바꿀 부분에 따라 달라요.",
    photos: "의자 전체를 한 장, 가죽이 닳거나 찢어진 부분을 가까이 한 장 찍어 주세요.",
    intakeItem: null,
  },
  lower: {
    label: "하부장 밑판 교체",
    matches: /하부장.*(?:밑판|바닥)|싱크대밑판/,
    overview: "물이 밴 밑판은 옆판과 받침대 상태를 보고 교체할 수 있는 범위를 정해요.",
    cost: "하부장 밑판은 크기와 물에 불어난 범위, 배관 위치에 따라 견적이 달라요.",
    photos: "하부장 문을 열고 안쪽 전체를 한 장, 물에 불어난 부분을 한 장 찍어 주세요.",
    intakeItem: null,
  },
  counter: {
    label: "싱크대 상판 크랙 수리",
    matches: /(?:싱크대|주방)?상판.*(?:크랙|균열|갈라|깨[짐졌]|금이)|(?:갈라진|깨진)싱크대상판/,
    overview: "갈라진 상판은 재질과 균열 위치를 보고 부분 보수가 가능한지 살펴봐요.",
    cost: "상판 크랙 수리 안내 범위는 30~50만 원(부가세 별도)이에요. 균열 깊이와 보강 범위를 확인한 뒤 최종 금액을 안내해요.",
    photos: "상판 전체가 보이게 한 장, 갈라진 선을 가까이 한 장 찍어 주세요.",
    intakeItem: null,
  },
} satisfies Record<string, ServiceGuide>;

export type Service = keyof typeof services;

export function isService(value: unknown): value is Service {
  return typeof value === "string" && Object.hasOwn(services, value);
}

export function intakeItemFor(key: Service) {
  return services[key].intakeItem ?? services[key].label;
}

export function findService(text: string): Service | null {
  for (const key of Object.keys(services) as Service[]) {
    if (services[key].matches.test(text)) return key;
  }
  return null;
}
