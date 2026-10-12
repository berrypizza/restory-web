import type { Metadata } from "next";
import { withLandingSeo } from "@/lib/landing-seo";
import EventsPageContent from "./EventsPageContent";

export const metadata: Metadata = withLandingSeo({
  title: "이벤트 · 진행 중인 혜택과 지난 행사",
  description: "리스토리의 진행 중인 이벤트와 지난 행사를 확인하세요. 행사별 대상, 혜택, 적용 기간을 안내합니다.",
  alternates: { canonical: "/events" },
});

export default function EventsPage() {
  return <EventsPageContent />;
}
