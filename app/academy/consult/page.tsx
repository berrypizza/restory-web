import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import Link from "next/link";
import ConsultationEntry from "./ConsultationEntry";
import styles from "./consult.module.css";

export const metadata: Metadata = {
  title: { absolute: "1:1 코칭 신청 | 기살 × Restory" },
  description: "기술로 살아남기 1:1 코칭(2시간). 사업체 진단과 마케팅 진단, 코칭 시 강의·자료를 무료로 제공합니다.",
  alternates: { canonical: "https://www.restorystudio.co.kr/academy/consult" },
  robots: { index: false, follow: true },
};
export const viewport: Viewport = { themeColor: "#0a2c9e" };
export default function ConsultationPage() {
  return <div className={styles.page}>
    <header className={styles.header}><div className={styles.brand}><Link href="/academy" aria-label="기살 과정 소개">기살<span>.</span></Link><span className={styles.cross}>×</span><Link href="/" className={styles.restory}>Restory</Link></div><Link href="/academy" className={styles.backLink}>과정 소개로 돌아가기 ↗</Link></header>
    <Suspense fallback={<main className={styles.layout}><div className={styles.formSection}><h1>1:1 코칭 신청</h1><p role="status">코칭 안내를 불러오는 중입니다.</p></div></main>}>
      <ConsultationEntry />
    </Suspense>
    <footer className={styles.footer}>기술부터 사업까지, 행복하게 사업하는 법.<span>© GISAL × RESTORY</span></footer>
  </div>;
}
