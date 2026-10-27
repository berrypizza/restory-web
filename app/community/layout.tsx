import type { Metadata } from "next";
import { CommunityProvider } from "./CommunityProvider";
import "./community.css";

export const metadata: Metadata = {
  title: "커뮤니티",
  description:
    "수리 질문부터 작업 경험, 가구 관리와 현장 기술 정보까지. 고객과 기술자가 함께 더 좋은 선택을 찾아가는 리스토리 커뮤니티입니다.",
  alternates: { canonical: "/community" },
  openGraph: {
    title: "함께 고치고, 함께 배우는 이야기 | 리스토리 커뮤니티",
    description: "고객과 기술자가 나누는 수리 질문, 작업 이야기, 기술 정보.",
    url: "/community",
  },
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CommunityProvider>
      <div className="community">{children}</div>
    </CommunityProvider>
  );
}
