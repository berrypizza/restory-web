export type EventStatus = "진행중" | "종료";

export interface EventItem {
  id: string;
  status: EventStatus;
  title: string;
  summary: string;
  description: string;
  thumbnail: string;
  detailImg: string;
  startDate: string;
  endDate: string;
  tags: string[];
  blogUrl?: string;
}

export const EVENT_FILTERS: EventStatus[] = ["진행중", "종료"];

/** 오늘 날짜 기준 자동 상태 판별 */
export function getEventStatus(endDate: string): EventStatus {
  return new Date(endDate) >= new Date(new Date().toDateString())
    ? "진행중"
    : "종료";
}

export const events: EventItem[] = [
  {
    id: "event-001",
    status: "진행중",
    title: "여름맞이 싱크대 리폼 10% 할인",
    summary: "주방을 새것처럼! 문짝 교체 시 10% 할인 혜택을 드립니다.",
    description:
      "무더운 여름, 주방을 새롭게 바꿔보세요. 싱크대 문짝 리폼 서비스를 10% 할인된 가격으로 만나보실 수 있습니다. 사진 한 장만 보내주시면 무료 견적을 바로 안내해 드립니다.",
    thumbnail: "/images/events/event-001-thumb.jpg",
    detailImg: "/images/events/event-001-detail.jpg",
    startDate: "2026-05-01",
    endDate: "2026-07-31",
    tags: ["싱크대 리폼", "할인", "여름 이벤트"],
  },
  {
    id: "event-002",
    status: "진행중",
    title: "소파 복원 무료 출장 점검 이벤트",
    summary: "소파 상태가 궁금하세요? 무료로 방문 점검해 드립니다.",
    description:
      "소파 꺼짐, 가죽 갈라짐 등 소파 상태가 걱정되시나요? 전문가가 직접 방문하여 무료로 점검하고 최적의 복원 방법을 안내해 드립니다. 서울·경기·인천 전 지역 가능합니다.",
    thumbnail: "/images/events/event-002-thumb.jpg",
    detailImg: "/images/events/event-002-detail.jpg",
    startDate: "2026-05-15",
    endDate: "2026-06-30",
    tags: ["소파 복원", "무료 출장", "점검"],
  },
  {
    id: "event-003",
    status: "진행중",
    title: "가죽 리폼 2+1 이벤트",
    summary: "의자 2개 리폼 시 1개 추가 무료!",
    description:
      "식당, 카페, 사무실 의자 가죽 리폼을 계획 중이시라면 지금이 기회입니다. 의자 2개 리폼 주문 시 1개를 추가로 무료 리폼해 드립니다. 대량 주문도 환영합니다.",
    thumbnail: "/images/events/event-003-thumb.jpg",
    detailImg: "/images/events/event-003-detail.jpg",
    startDate: "2026-04-01",
    endDate: "2026-06-15",
    tags: ["가죽 리폼", "2+1", "의자"],
  },
  {
    id: "event-004",
    status: "종료",
    title: "봄맞이 주방 리폼 할인전",
    summary: "봄을 맞아 주방 문짝 리폼 15% 특별 할인!",
    description:
      "봄맞이 대청소와 함께 주방도 새롭게! 싱크대 문짝 전체 교체 시 15% 할인 혜택을 드렸습니다. 많은 분들이 참여해 주셨습니다.",
    thumbnail: "/images/events/event-004-thumb.jpg",
    detailImg: "/images/events/event-004-detail.jpg",
    startDate: "2026-03-01",
    endDate: "2026-04-30",
    tags: ["싱크대 리폼", "봄 할인", "주방"],
  },
  {
    id: "event-005",
    status: "종료",
    title: "신규 고객 첫 수리 20% 할인",
    summary: "리스토리를 처음 이용하시는 고객님께 20% 할인!",
    description:
      "리스토리 서비스를 처음 이용하시는 고객님께 모든 수리 서비스 20% 할인 혜택을 드렸습니다. 감사합니다.",
    thumbnail: "/images/events/event-005-thumb.jpg",
    detailImg: "/images/events/event-005-detail.jpg",
    startDate: "2026-01-01",
    endDate: "2026-02-28",
    tags: ["신규 고객", "할인", "첫 수리"],
  },
];
