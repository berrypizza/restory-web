export type BusinessLineId = "repair" | "leather" | "kitchen";

export interface ServicePageConfig {
  line: BusinessLineId;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  hero: string;
  painPoints: string[];
  process: string[];
  ctaLabel?: string;
}

export interface BusinessLineConfig {
  id: BusinessLineId;
  href: string;
  title: string;
  subtitle: string;
  hero: string;
  description: string;
  services: ServicePageConfig[];
}

const repairServices: ServicePageConfig[] = [
  { line: "repair", slug: "sangbujang", title: "싱크대 상부장 처짐", shortTitle: "상부장 처짐", description: "기울어진 상부장, 벽 고정 상태와 내부 파손을 먼저 봅니다.", hero: "상부장이 내려앉았다면\n무게보다 고정 구조를 먼저 봐야 합니다.", painPoints: ["문이 틀어져 닫히지 않음", "상부장이 앞으로 기울어짐", "벽 고정 부위가 벌어짐"], process: ["사진으로 처짐 위치 확인", "벽·시공목·장 내부 상태 점검", "수평 조정 후 재고정"] },
  { line: "repair", slug: "habujang", title: "하부장 밑판교체", shortTitle: "하부장 밑판", description: "물먹은 밑판, 들뜬 바닥판을 상태에 맞게 교체합니다.", hero: "하부장 밑판은\n덮는 것보다 썩은 부분 확인이 먼저입니다.", painPoints: ["싱크대 아래가 물러짐", "냄새와 곰팡이 발생", "바닥판이 내려앉음"], process: ["누수 흔적 확인", "손상 부위 절단·철거", "새 판재 맞춤 고정"] },
  { line: "repair", slug: "sliding-door", title: "붙박이장 슬라이딩도어", shortTitle: "슬라이딩도어", description: "잘 안 밀리는 붙박이장 문은 바퀴, 레일, 문틀 상태를 함께 봅니다.", hero: "문이 무거워진 게 아니라\n바퀴가 깨졌을 수 있습니다.", painPoints: ["문이 한쪽으로 기울어짐", "밀 때 소리가 남", "문이 레일에서 빠짐"], process: ["도어 탈거", "바퀴·레일 상태 확인", "부품 교체 후 높이 조정"] },
  { line: "repair", slug: "door-fall", title: "문짝 떨어짐", shortTitle: "문짝 떨어짐", description: "헐거워진 구멍을 정리하고 목다보와 본드로 다시 잡습니다.", hero: "문짝이 떨어졌다면\n피스만 다시 박는 건 오래가지 않습니다.", painPoints: ["경첩 피스가 헛돎", "합판 구멍이 커짐", "문이 아래로 처짐"], process: ["헐거운 구멍 정리", "목다보와 특수 본드 고정", "평탄화 후 경첩 재고정"] },
  { line: "repair", slug: "hinge", title: "경첩 교체", shortTitle: "경첩 교체", description: "경첩 파손, 녹, 틀어짐을 보고 같은 규격으로 맞춥니다.", hero: "경첩은 비슷해 보여도\n규격이 다르면 문이 틀어집니다.", painPoints: ["문이 덜 닫힘", "경첩이 녹슬거나 깨짐", "문 간격이 맞지 않음"], process: ["기존 경첩 규격 확인", "고정 구멍 상태 점검", "교체 후 간격 조정"] },
  { line: "repair", slug: "drawer-rail", title: "서랍 레일 교체", shortTitle: "서랍 레일", description: "빠지고 걸리는 서랍은 레일 수평과 피스 고정 상태가 핵심입니다.", hero: "서랍이 빠지는 문제는\n레일만 바꿔도 끝나지 않을 때가 있습니다.", painPoints: ["서랍이 끝까지 안 닫힘", "레일 볼이 빠짐", "한쪽으로 기울어짐"], process: ["서랍 탈거", "레일 규격 확인", "수평 맞춰 재고정"] },
  { line: "repair", slug: "sofa-sag", title: "소파 꺼짐", shortTitle: "소파 꺼짐", description: "밴드, 스펀지, 목대 상태를 확인해 앉는 균형을 되돌립니다.", hero: "소파가 꺼졌다면\n겉가죽보다 안쪽 구조를 봐야 합니다.", painPoints: ["앉으면 몸이 한쪽으로 쏠림", "가운데가 푹 꺼짐", "오래 앉으면 허리가 불편함"], process: ["하부 개방", "밴드·폼·프레임 확인", "필요 부위 보강"] },
  { line: "repair", slug: "sofa-frame", title: "소파 목대·스프링", shortTitle: "목대·스프링", description: "뚝 소리, 꺼짐, 흔들림은 목대와 스프링을 함께 봅니다.", hero: "소파에서 소리가 난다면\n안쪽 목대가 버티지 못하는 신호일 수 있습니다.", painPoints: ["앉을 때 소리가 남", "한쪽이 주저앉음", "프레임이 흔들림"], process: ["하부 원단 개방", "목대·스프링 상태 확인", "파손 부위 보강"] },
  { line: "repair", slug: "bed-frame", title: "침대 프레임", shortTitle: "침대 프레임", description: "흔들리는 침대 프레임은 연결 부위와 지지대를 같이 봅니다.", hero: "침대가 흔들릴 때\n나사만 조이면 다시 풀릴 수 있습니다.", painPoints: ["프레임이 삐걱거림", "중앙 지지대가 내려앉음", "연결 부위가 벌어짐"], process: ["프레임 분해 확인", "연결 부위 보강", "수평과 지지력 확인"] },
  { line: "repair", slug: "table-leg", title: "식탁 다리", shortTitle: "식탁 다리", description: "흔들리는 식탁 다리는 상판 연결부와 다리 고정 상태를 확인합니다.", hero: "식탁 다리가 흔들리면\n다리보다 상판 고정부가 문제일 수 있습니다.", painPoints: ["식탁이 좌우로 흔들림", "다리 피스가 헛돎", "상판 연결부가 벌어짐"], process: ["흔들림 방향 확인", "피스 구멍 보강", "다리 재고정"] },
];

const leatherServices: ServicePageConfig[] = [
  { line: "leather", slug: "dining-chair", title: "식탁의자 천갈이", shortTitle: "식탁의자", description: "오염·찢김·쿠션 꺼짐까지 보고 원단과 내장재를 맞춥니다.", hero: "의자 천만 바꾸는 게 아니라\n앉는 느낌까지 같이 봅니다.", painPoints: ["좌판 가죽이 벗겨짐", "스펀지가 납작해짐", "색이 공간과 맞지 않음"], process: ["기존 원단 제거", "쿠션 상태 확인", "새 원단 고정 마감"] },
  { line: "leather", slug: "restaurant-chair", title: "식당 일반의자", shortTitle: "식당 일반의자", description: "매장 회전율이 높은 의자는 마감 강도와 관리 편의성을 같이 봅니다.", hero: "식당 의자는 예쁜 것보다\n매일 닦아도 버티는지가 먼저입니다.", painPoints: ["좌석이 갈라짐", "여러 개를 한 번에 바꿔야 함", "영업 중 작업 시간이 부담됨"], process: ["수량과 상태 확인", "원단 선택", "순차 작업"] },
  { line: "leather", slug: "restaurant-sofa", title: "식당 붙박이소파", shortTitle: "붙박이소파", description: "붙박이 좌석은 현장 구조, 분리 가능 여부, 동선을 먼저 확인합니다.", hero: "붙박이소파는\n뜯기 전에 구조부터 봐야 합니다.", painPoints: ["좌석이 길게 찢어짐", "등받이까지 오염됨", "매장 분위기가 낡아 보임"], process: ["현장 치수 확인", "분리 가능 구조 확인", "좌석·등받이 순서 작업"] },
  { line: "leather", slug: "office-chair", title: "사무용 의자", shortTitle: "사무용 의자", description: "사무용 의자는 좌판 크기, 등판 구조, 사용 빈도에 맞춰 진행합니다.", hero: "사무용 의자는\n버리기 전 좌판만 살릴 수 있는지 봅니다.", painPoints: ["좌판 표면이 벗겨짐", "여러 개가 동시에 낡음", "교체 수량이 부담됨"], process: ["의자 구조 확인", "좌판·등판 분리", "원단 교체 후 조립"] },
  { line: "leather", slug: "custom", title: "기타 가죽", shortTitle: "기타 가죽", description: "정형화되지 않은 가죽 작업은 사진으로 가능 여부를 먼저 판단합니다.", hero: "애매한 가죽 작업은\n사진 판단이 먼저입니다.", painPoints: ["어디에 물어봐야 할지 모름", "부분 작업이 가능한지 궁금함", "원단 매칭이 걱정됨"], process: ["사진 확인", "작업 가능 범위 안내", "현장 또는 입고 방식 선택"] },
];

const kitchenServices: ServicePageConfig[] = [
  { line: "kitchen", slug: "fridge-cabinet", title: "냉장고장 리폼", shortTitle: "냉장고장", description: "냉장고 크기 변경, 키친핏 설치 전 장 구조를 맞춥니다.", hero: "냉장고를 바꾸기 전\n장이 먼저 맞아야 합니다.", painPoints: ["새 냉장고가 안 들어감", "상부 수납장이 걸림", "좌우 폭이 맞지 않음"], process: ["냉장고 규격 확인", "기존 장 치수 확인", "절단·보강·마감"] },
  { line: "kitchen", slug: "sink-door", title: "싱크대 문짝 리폼", shortTitle: "싱크대 문짝", description: "주방 분위기를 크게 바꾸는 문짝 교체형 리폼입니다.", hero: "주방 전체를 바꾸지 않아도\n문짝만으로 분위기는 달라집니다.", painPoints: ["문 색이 오래되어 보임", "필름이 들뜸", "전체 공사는 부담됨"], process: ["문짝 수량·규격 확인", "색상과 소재 선택", "제작 후 교체"] },
  { line: "kitchen", slug: "rocheong", title: "로청장 리폼", shortTitle: "로청장", description: "로봇청소기 자리를 만들기 위해 하부장 구조를 조정합니다.", hero: "로봇청소기가 들어갈 자리는\n처음부터 없던 집이 많습니다.", painPoints: ["로봇청소기 둘 곳이 없음", "하부장 문이 걸림", "충전 위치가 애매함"], process: ["설치 위치 확인", "하부장 구조 확인", "개구부 제작·마감"] },
];

export const businessLines: BusinessLineConfig[] = [
  { id: "repair", href: "/repair", title: "가구수리", subtitle: "고장난 가구를 버리기 전 보는 라인", hero: "문짝, 레일, 상부장, 소파 꺼짐까지\n생활 불편을 먼저 줄입니다.", description: "현장 사진으로 원인을 먼저 보고, 필요한 범위만 안내합니다.", services: repairServices },
  { id: "leather", href: "/leather", title: "가죽 리폼", subtitle: "의자와 소파 좌석을 다시 쓰는 라인", hero: "찢어지고 낡은 좌석을\n공간에 맞게 다시 잡습니다.", description: "식당, 사무실, 가정용 의자까지 수량과 사용 환경에 맞춰 봅니다.", services: leatherServices },
  { id: "kitchen", href: "/kitchen", title: "주방 리폼", subtitle: "냉장고장·싱크대 문짝·로청장 라인", hero: "주방 전체 공사 전\n필요한 부분만 먼저 바꿉니다.", description: "냉장고장, 싱크대 문짝, 로봇청소기장처럼 전환율 높은 항목을 분리합니다.", services: kitchenServices },
];

export const allServices = businessLines.flatMap((line) => line.services);

export function getBusinessLine(id: BusinessLineId) {
  return businessLines.find((line) => line.id === id);
}

export function getService(line: BusinessLineId, slug: string) {
  return allServices.find((service) => service.line === line && service.slug === slug);
}
