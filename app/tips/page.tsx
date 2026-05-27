import type { Metadata } from "next";
import TipsPageContent from "./TipsPageContent";

export const metadata: Metadata = {
  title: "꿀팁 게시판",
  description:
    "싱크대 수리, 의자 가죽 교체, 소파 복원, 싱크대 리폼 등 가구 관리에 필요한 꿀팁 모음.",
  openGraph: {
    title: "꿀팁 게시판 | 리스토리",
    description: "가구 수리·관리 꿀팁 모음. 비용 비교, 자가진단, 관리법.",
    url: "https://restorystudio.co.kr/tips",
  },
  alternates: {
    canonical: "https://restorystudio.co.kr/tips",
  },
};

export default function TipsPage() {
  return <TipsPageContent />;
}
