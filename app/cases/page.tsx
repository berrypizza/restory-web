// app/cases/page.tsx

import { Suspense } from "react";
import type { Metadata } from "next";
import CasesPageContent from "./CasesPageContent";

// ✅ 서버 컴포넌트에서 Metadata 생성 — "use client"와 분리
export const metadata: Metadata = {
  title: "작업 사례 | 리스토리 스튜디오",
  description:
    "싱크대 수리·리폼, 가죽 리폼, 소파 복원 실제 작업 사례 모음. 강남·인천·경기 당일 출장 가능. 사진 한 장으로 견적 확인.",
  alternates: {
    canonical: "https://restorystudio.co.kr/cases",
  },
  openGraph: {
    title: "작업 사례 | 리스토리 스튜디오",
    description:
      "싱크대 수리·리폼, 가죽 리폼, 소파 복원 실제 작업 사례 모음. 사진 한 장으로 견적 확인.",
    url: "https://restorystudio.co.kr/cases",
    type: "website",
  },
};

export default function CasesPage() {
  return (
    <Suspense fallback={null}>
      <CasesPageContent />
    </Suspense>
  );
}
