import { Black_Han_Sans } from "next/font/google";
import styles from "./academy-essence.module.css";

const heavy = Black_Han_Sans({ weight: "400", display: "swap", preload: false });

const LAYERS = ["신념", "사명", "원칙"] as const;

/* Past the tools, we sink deeper — belief, mission, principles —
   until we reach the essence, lit like warm morning sun. */
export default function AcademyEssence() {
  return (
    <section className={styles.section} data-service-section="essence" aria-labelledby="essence-title">
      <div className={styles.shaft} aria-hidden="true" />

      <ol className={`${styles.layers} ${heavy.className}`} aria-label="더 깊이 내려가면">
        {LAYERS.map((word, i) => (
          <li key={word} className={styles.layer} style={{ ["--i" as string]: i }}>
            <span>{word}</span>
          </li>
        ))}
      </ol>

      <div className={styles.light}>
        <div className={styles.rays} aria-hidden="true" />
        <h2 id="essence-title" className={`${styles.essence} ${heavy.className}`}>
          <span>본질적</span>
          <span>사업</span>
        </h2>
        <div className={styles.statement}>
          <p className={styles.lead}>AI는 도구일 뿐, 핵심은</p>
          <p className={`${styles.pillars} ${heavy.className}`}>
            <span>신념</span><i aria-hidden="true">·</i><span>사명</span><i aria-hidden="true">·</i><span>원칙</span>
          </p>
          <p className={styles.note}>지속 가능하게 하는 힘</p>
          <p className={`${styles.result} ${heavy.className}`}>
            <span aria-hidden="true">→</span> 본질을 추구하는 사업
          </p>
        </div>
      </div>
    </section>
  );
}
