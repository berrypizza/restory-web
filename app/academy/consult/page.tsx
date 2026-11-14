import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import Link from "next/link";
import ConsultationEntry from "./ConsultationEntry";
import styles from "./consult.module.css";

export const metadata: Metadata = {
  title: { absolute: "1:1 무료 진단 신청 | 기살 × Restory" },
  description: "기술 창업을 고민하는 지금, 기살과 나의 상황부터 함께 살펴보세요. 온라인 무료 진단 또는 오프라인 상담을 신청할 수 있습니다.",
  alternates: { canonical: "https://www.restorystudio.co.kr/academy/consult" },
  robots: { index: false, follow: true },
};
export const viewport: Viewport = { themeColor: "#0b0e0c" };
export default function ConsultationPage() {
  return <div className={styles.page}>
    <header className={styles.header}><div className={styles.brand}><Link href="/academy" aria-label="기살 과정 소개">기살<span>.</span></Link><span className={styles.cross}>×</span><Link href="/" className={styles.restory}>Restory</Link></div><Link href="/academy" className={styles.backLink}>과정 소개로 돌아가기 ↗</Link></header>
    <Suspense fallback={<main className={styles.layout}><div className={styles.formSection}><h1>1:1 창업 진단 신청</h1><p role="status">상담 안내를 불러오는 중입니다.</p></div></main>}>
      <ConsultationEntry />
    </Suspense>
    <footer className={styles.footer}>기술부터 사업까지, 행복하게 사업하는 법.<span>© GISAL × RESTORY</span></footer>
  </div>;
}
