import { ACADEMY_OFFER as offer } from "@/lib/academy/offer";
import { EnrollButton } from "./EnrollmentDialog";
import FieldVideo from "./FieldVideo";
import pageStyles from "./gisal.module.css";
import styles from "./academy-intro-video.module.css";

export default function AcademyIntroVideo() {
  return (
    <section id="academy-intro-video" className={styles.section} aria-labelledby="academy-intro-title">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <span className={styles.eyebrow}>대표가 직접 설명하는 기살 · 약 12분</span>
          <h2 id="academy-intro-title">기술을 배운 다음,<br /><span>고객은 어떻게 만나나요?</span></h2>
          <p>기술·고객·선택받을 이유·운영이 어떻게 연결되는지,<br />사업 교육과 현장 실습을 함께 다루는 이유를 소개합니다.</p>
        </header>

        <FieldVideo
          videoId="4VhMLfsfHks"
          videoTitle="집수리·가구수리 창업, 기술만 배우면 일이 들어올까? | 기살 교육"
          playLabel="교육 방향 영상 보기 · 약 12분"
        />

        <div className={styles.guide}>
          <h3>교육은 같고, 초기 구축 방식이 다릅니다.</h3>
          <div className={styles.plans}>
            <article>
              <h4>기본 과정 <strong>{offer.basicPrice}만 원</strong></h4>
              <p>사업·현장 교육을 받고, 사이트와 채널의 제작·운영 방법을 배우며 <strong>직접 구축합니다.</strong></p>
            </article>
            <article>
              <h4>{offer.setupName} <strong>총 {offer.setupPrice}만 원</strong></h4>
              <p>기본 교육을 모두 포함합니다. <strong>기살이 초기 구축을 맡고, 수강생은 직접 운영법을 익힙니다.</strong></p>
            </article>
          </div>
          <p className={styles.planNote}>두 과정 모두 내 사업의 방향을 정하고, 배운 내용을 직접 실행하는 과정입니다. 셋업이 지속적인 운영 대행이나 특정 매출을 보장하지는 않습니다.</p>

          <dl className={styles.conditions} aria-label="현장 실습과 수료 후 추가 교육 조건">
            <div>
              <dt>현장 실습</dt>
              <dd>관찰 → 판단 → 강사 지도 아래 직접 실습 → 피드백.<br />{offer.additionalFieldEducation}</dd>
            </div>
            <div>
              <dt>수료 후 추가 기술 교육</dt>
              <dd>{offer.followUp}</dd>
            </div>
          </dl>

          <div className={styles.consult}>
            <p>지금의 경험과 창업 고민을 듣고,<br />내 상황에 어떤 과정이 맞는지 함께 살펴봅니다.</p>
            <EnrollButton
              location="video"
              label="내 상황에 맞는 과정 상담하기"
              className={`${pageStyles.button} ${pageStyles["button-green"]}`}
            />
            <p className={styles.consultNote}>온라인 1:1 진단은 무료이며,<br />신청만으로 수강 등록이나 결제가 확정되지 않습니다.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
