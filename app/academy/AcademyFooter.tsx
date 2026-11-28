import Link from "next/link";
import { display } from "@/app/components/landing/premium/fonts";
import styles from "./academy-footer.module.css";

/* Premium footer (restory-premium-landing look): off-white, giant display wordmark,
   business details on a frosted glass card. */
export default function AcademyFooter() {
  return (
    <footer className={`${styles.footer} ${display.variable}`}>
      <div className={styles.wrap}>
        <div className={styles.top}>
          <a className={styles.brand} href="#main" aria-label="기술로 살아남기 맨 위로">
            <span className={styles.mark}>기살<span>.</span></span>
            <span className={styles.name}>기술로<br />살아남기</span>
          </a>
          <p className={styles.tagline}>기술부터 사업까지, 행복하게 사업하는 법.</p>
          <Link className={styles.home} href="/">리스토리 스튜디오 <span aria-hidden="true">↗</span></Link>
        </div>

        <div className={styles.card} role="group" aria-label="운영 사업자 정보">
          <p className={styles.cardTitle}>BUSINESS INFO</p>
          <dl className={styles.info}>
            <div><dt>상호</dt><dd>리스토리 스튜디오</dd></div>
            <div><dt>대표자</dt><dd>고현호</dd></div>
            <div><dt>사업자등록번호</dt><dd>692-55-00721</dd></div>
            <div><dt>연락처</dt><dd><a href="tel:1688-2957">1688-2957</a></dd></div>
            <div className={styles.wide}><dt>사업장 주소</dt><dd>인천광역시 서구 염곡로498번안길 5-13. 302호(가정동)</dd></div>
          </dl>
        </div>

        <p className={styles.giant} aria-hidden="true">GISAL.</p>
        <p className={styles.copy}>© 2026 GISAL. All rights reserved.</p>
      </div>
    </footer>
  );
}
