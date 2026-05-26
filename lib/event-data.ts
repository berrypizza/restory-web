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
    title: "국가 유공자 최대 50만원 할인 이벤트",
    summary:
      "국가 유공자에 해당하시는 고객님께 10% 할인 최대 50만원 할인 혜택을 드립니다.",
    description:
      "나라를 위해 수고해주신 국가 유공자분들께 감사의 마음을 전합니다. 해당 이벤트는 국가 유공자에 해당하시는 고객님께 싱크대 수리, 리폼, 가죽 교체 등 모든 서비스에 대해 10% 할인 혜택을 드리는 이벤트입니다. 최대 할인 금액은 50만원으로, 많은 분들이 혜택을 받으실 수 있도록 준비했습니다.",
    thumbnail: "/images/events/event-001-thumb.jpg",
    detailImg: "/images/events/event-001-detail.jpg",
    startDate: "2026-05-01",
    endDate: "2027-04-30",
    tags: ["국가 유공자", "할인"],
  },
  {
    id: "event-002",
    status: "종료",
    title: "국가 유공자 10% 할인 이벤트",
    summary:
      "국가 유공자에 해당하시는 고객님께 10% 할인 최대 50만원 할인 혜택을 드립니다.",
    description:
      "국가를 위해 헌신해주신 국가유공자분들께 감사의 마음을 담아 특별 할인 혜택을 준비했습니다. 국가유공자 고객님께서는 싱크대 수리·리폼, 가죽 교체 등 모든 서비스 이용 시 10% 할인 혜택을 받으실 수 있습니다. 보다 많은 분들께 혜택을 드리고자 최대 할인 금액은 50만 원까지 적용됩니다. 이번 이벤트를 통해 국가유공자분들의 생활에 작은 도움이 되길 바라며, 앞으로도 다양한 혜택과 서비스를 제공하기 위해 노력하겠습니다.",
    thumbnail: "/images/events/event-002-thumb.jpg",
    detailImg: "/images/events/event-002-detail.jpg",
    startDate: "2025-05-01",
    endDate: "2026-04-30",
    tags: ["국가 유공자", "할인"],
  },
  {
    id: "event-003",
    status: "종료",
    title: "국가유공자 감사 할인 이벤트",
    summary:
      "국가유공자 고객님께 전 서비스 10% 할인 혜택을 제공해드립니다. (최대 50만원 할인)",
    description:
      "대한민국을 위해 헌신해주신 국가유공자분들께 감사의 마음을 전하고자 특별 할인 이벤트를 마련했습니다. 싱크대 수리 및 리폼, 소파 가죽 교체, 붙박이장 보수 등 모든 서비스를 대상으로 10% 할인 혜택을 제공해드립니다. 최대 50만 원까지 할인 적용 가능하며, 보다 많은 고객님들께 실질적인 도움이 될 수 있도록 준비했습니다. 앞으로도 고객님의 생활 공간을 더욱 오래, 더욱 가치 있게 사용할 수 있도록 정직한 서비스와 합리적인 혜택으로 보답하겠습니다.",
    thumbnail: "/images/events/event-003-thumb.jpg",
    detailImg: "/images/events/event-003-detail.jpg",
    startDate: "2024-05-01",
    endDate: "2025-04-30",
    tags: ["국가유공자", "감사이벤트", "할인혜택"],
  },
];
