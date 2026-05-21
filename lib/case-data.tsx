export type CaseCategory =
  | "전체"
  | "싱크대 수리"
  | "싱크대 리폼"
  | "가죽 리폼"
  | "소파 복원";

export interface CaseItem {
  id: string;
  category: CaseCategory;
  title: string;
  region: string;
  summary: string;
  beforeImg: string;
  afterImg: string;
  blogUrl: string;
  date: string;
  tags: string[];
}

export const CASE_CATEGORIES: CaseCategory[] = [
  "전체",
  "싱크대 수리",
  "싱크대 리폼",
  "가죽 리폼",
  "소파 복원",
];

export const cases: CaseItem[] = [
  {
    id: "case-001",
    category: "싱크대 수리",
    title: "인천 서구 상부장 처짐 수리",
    region: "인천 서구",
    summary:
      "상부장 경첩이 빠져서 문짝이 처진 상태. 경첩 교체 + 프레임 보강으로 당일 완료.",
    beforeImg: "/images/cases/case-001-before.jpg",
    afterImg: "/images/cases/case-001-after.jpg",
    blogUrl: "https://blog.naver.com/sofaresq",
    date: "2026-05-10",
    tags: ["상부장", "경첩", "당일수리"],
  },
  {
    id: "case-002",
    category: "싱크대 수리",
    title: "서울 구로구 하부장 서랍레일 교체",
    region: "서울 구로구",
    summary: "서랍이 안 닫히는 증상. 레일 부식으로 3단 서랍레일 전체 교체.",
    beforeImg: "/images/cases/case-002-before.jpg",
    afterImg: "/images/cases/case-002-after.jpg",
    blogUrl: "https://blog.naver.com/sofaresq",
    date: "2026-05-08",
    tags: ["하부장", "서랍레일", "부식"],
  },
  {
    id: "case-003",
    category: "싱크대 리폼",
    title: "경기 부천시 주방 문짝 전체 교체",
    region: "경기 부천시",
    summary:
      "20년 된 주방 문짝 색상 변색. 본체는 그대로 두고 문짝만 42장 교체.",
    beforeImg: "/images/cases/case-003-before.jpg",
    afterImg: "/images/cases/case-003-after.jpg",
    blogUrl: "https://blog.naver.com/sofaresq",
    date: "2026-05-05",
    tags: ["문짝교체", "변색", "리폼"],
  },
  {
    id: "case-004",
    category: "싱크대 리폼",
    title: "서울 강서구 싱크대 상판 + 문짝 리폼",
    region: "서울 강서구",
    summary:
      "상판 스크래치 심하고 문짝 들뜸. 상판 교체 + 문짝 리폼으로 새 주방 느낌.",
    beforeImg: "/images/cases/case-004-before.jpg",
    afterImg: "/images/cases/case-004-after.jpg",
    blogUrl: "https://blog.naver.com/sofaresq",
    date: "2026-04-28",
    tags: ["상판", "스크래치", "리폼"],
  },
  {
    id: "case-005",
    category: "가죽 리폼",
    title: "강남 레스토랑 의자 30개 천갈이",
    region: "서울 강남구",
    summary: "가죽 벗겨진 레스토랑 의자 30개. 영업 중 작업으로 하루 만에 완료.",
    beforeImg: "/images/cases/case-005-before.jpg",
    afterImg: "/images/cases/case-005-after.jpg",
    blogUrl: "https://blog.naver.com/sofaresq",
    date: "2026-04-25",
    tags: ["레스토랑", "천갈이", "대량"],
  },
  {
    id: "case-006",
    category: "가죽 리폼",
    title: "카페 소파 부스석 가죽 교체",
    region: "경기 일산",
    summary: "10년 된 카페 부스석 가죽 갈라짐. 인조가죽으로 전체 교체.",
    beforeImg: "/images/cases/case-006-before.jpg",
    afterImg: "/images/cases/case-006-after.jpg",
    blogUrl: "https://blog.naver.com/sofaresq",
    date: "2026-04-20",
    tags: ["카페", "부스석", "인조가죽"],
  },
  {
    id: "case-007",
    category: "소파 복원",
    title: "인천 송도 3인 소파 꺼짐 복원",
    region: "인천 송도",
    summary:
      "소파 쿠션 꺼짐이 심해서 앉으면 바닥 느낌. 내부 스프링 + 고밀도 폼 보강.",
    beforeImg: "/images/cases/case-007-before.jpg",
    afterImg: "/images/cases/case-007-after.jpg",
    blogUrl: "https://blog.naver.com/sofaresq",
    date: "2026-04-15",
    tags: ["쿠션꺼짐", "스프링", "폼보강"],
  },
  {
    id: "case-008",
    category: "소파 복원",
    title: "서울 마포구 가죽소파 염색 + 복원",
    region: "서울 마포구",
    summary: "천연가죽 소파 색 바램 + 표면 갈라짐. 클리닝 후 재염색으로 복원.",
    beforeImg: "/images/cases/case-008-before.jpg",
    afterImg: "/images/cases/case-008-after.jpg",
    blogUrl: "https://blog.naver.com/sofaresq",
    date: "2026-04-10",
    tags: ["가죽소파", "염색", "클리닝"],
  },
];
