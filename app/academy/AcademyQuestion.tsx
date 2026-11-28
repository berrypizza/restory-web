import { Black_Han_Sans, Montserrat } from "next/font/google";
import DustCloud from "./DustCloud";
import styles from "./academy-question.module.css";

const display = Montserrat({ subsets: ["latin"], weight: "800", style: "italic", display: "swap" });
const heavy = Black_Han_Sans({ weight: "400", display: "swap", preload: false });

/* "Will you still be standing in five years?" — dust cloud + fiery italic headline */
export default function AcademyQuestion() {
  return (
    <section id="five-years" className={styles.section} data-service-section="five_year_question" aria-labelledby="five-year-title">
      <DustCloud className={styles.dust} />
      <div className={styles.inner}>
        <h2 id="five-year-title" className={`${styles.title} ${heavy.className}`}>
          <span>5년 후에도</span>
          <span>지속 가능하실 수 있다고</span>
          <span>확신하세요?</span>
        </h2>
        <p className={`${styles.en} ${display.className}`} aria-hidden="true">
          FIVE YEARS FROM NOW, WILL YOU STILL BE STANDING?
        </p>
      </div>
    </section>
  );
}
