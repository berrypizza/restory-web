// app/cases/page.tsx

import { Suspense } from "react";
import type { Metadata } from "next";
import CasesPageContent from "./CasesPageContent";
import { cases } from "@/lib/case-data";

// ✅ 서버 컴포넌트에서 Metadata 생성 — "use client"와 분리
export const metadata: Metadata = {
  title: "작업 사례 | 리스토리 스튜디오",
  description:
    "싱크대 수리·리폼, 가죽 리폼, 소파 복원 실제 작업 사례 모음. 강남·인천·경기 당일 출장 가능. 사진 한 장으로 견적 확인.",
  alternates: {
    canonical: "https://www.restorystudio.co.kr/cases",
  },
  openGraph: {
    title: "작업 사례 | 리스토리 스튜디오",
    description:
      "싱크대 수리·리폼, 가죽 리폼, 소파 복원 실제 작업 사례 모음. 사진 한 장으로 견적 확인.",
    url: "https://www.restorystudio.co.kr/cases",
    type: "website",
  },
};

export default function CasesPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "리스토리 작업사례",
    description:
      "싱크대 수리, 상부장 처짐 수리, 가죽 리폼, 소파 복원, 의자 천갈이 작업사례 모음",
    itemListElement: cases.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.restorystudio.co.kr/cases/${item.id}`,
      name: item.title,
      image: `https://www.restorystudio.co.kr${item.afterImg}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd),
        }}
      />

      <Suspense fallback={null}>
        <CasesPageContent />
      </Suspense>
    </>
  );
}
