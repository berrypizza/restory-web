import Link from "next/link";
import styles from "./academy.module.css";

export default function AcademySidebar() {
  return (
    <aside className={styles.sidebar} aria-label="교육 과정 안내">
      <div className={styles.summary}>
        <p className={styles.eyebrow}>리스토리 기술 교육</p>
        <h2>기술로 살아남기</h2>
        <p className={styles.summaryIntro}>
          수리와 리폼을 통해 배우는 기술,
          <br />현장에서 오래 일하기 위한 기준.
        </p>
        <div className={styles.status}>
          <span className={styles.statusDot} aria-hidden="true" />과정 준비 중
        </div>
        <dl className={styles.facts}>
          <div><dt>교육 주제</dt><dd>가구·싱크대 수리·리폼</dd></div>
          <div><dt>개강 일정</dt><dd>추후 안내</dd></div>
          <div><dt>교육 방식·수강료</dt><dd>추후 안내</dd></div>
        </dl>
        <a
          href="https://pf.kakao.com/_hQExjX/chat"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.primaryButton}>
          과정 문의하기 <span aria-hidden="true">↗</span>
        </a>
        <p className={styles.buttonNote}>리스토리 카카오톡 채널로 연결됩니다.</p>
      </div>
      <Link href="/philosophy" className={styles.relatedLink}>
        <span><small>어떤 마음으로 일하는지</small>리스토리의 사업 철학</span>
        <span aria-hidden="true">↗</span>
      </Link>
    </aside>
  );
}
