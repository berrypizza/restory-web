import Image from "next/image";
import styles from "./academy.module.css";

const learnedWork = [
  "로봇청소기장 리폼", "냉장고장 리폼", "경첩 수리", "슬라이딩 도어 수리",
  "소파 수리", "쿠션 꺼짐 복원", "부직포 교체", "붙박이 의자 천갈이",
  "상부장 처짐 수리", "PB 파손 복구", "싱크대 밑판 교체", "싱크대 문짝 교체",
  "인테리어 필름 리폼", "의자 흔들림 수리",
];

export default function FounderJourney({ startNumber = 1 }: { startNumber?: number }) {
  const chapter = (offset: number) => String(startNumber + offset).padStart(2, "0");

  return (
    <>
      <section className={styles.section}>
        <p className={styles.eyebrow}>{chapter(0)} / 사업에서 도망쳤던 시간</p>
        <h2>저는 돈을<br />정말 벌고 싶었습니다.</h2>
        <div className={styles.prose}>
          <p>돈 때문에 가정이 흔들리는 모습을 보고 싶지 않았습니다. 가난은 제 대에서 끝났으면 좋겠다는 마음으로, 미대를 다니며 영어 강사도 하고 여러 사업에 뛰어들었습니다.</p>
          <p>블레이저 의류 쇼핑몰, 과일 스마트스토어, 중국 구매대행, 유럽 구매대행, 공동구매 사업까지. 그 시절 유행하던 사업을 이것저것 해봤습니다. 고액 강의도 많이 들었습니다.</p>
          <p>대부분 실패했습니다.</p>
          <p>실패가 이어지면서 이런 생각에 도달했습니다.</p>
        </div>
        <blockquote className={styles.quote}>막노동이라도 해서,<br />저축이나 하자.</blockquote>
        <div className={styles.prose}>
          <p>저는 결국 사업에서 도망쳤습니다.</p>
          <p>20대 중반, 한샘의 가구 시공 일을 시작했습니다. 오전 5시에 출근하고 오후 8시에 퇴근하는 생활을 반복했습니다.</p>
          <p>컴퓨터 앞에 앉아 있는 생활에 익숙했던 저에게 몸을 쓰는 일은 정말 힘들었습니다. 일하다가 힘들어서 몰래 울었던 건 처음이었습니다. 저도 그런 제 모습에 놀랐습니다.</p>
        </div>
        <figure className={styles.fieldFigure}>
          <Image src="/images/philosophy/hanssem-truck.png" alt="가구 시공 기사로 일하던 시절의 고관호 대표" width={1240} height={660} sizes="(max-width: 900px) 100vw, 760px" />
          <figcaption>한샘 시공 기사로 일하던 시절</figcaption>
        </figure>
      </section>

      <section className={styles.section}>
        <p className={styles.eyebrow}>{chapter(1)} / 새로운 시작</p>
        <h2>내 기술로,<br />사업을 해보고 싶었습니다.</h2>
        <div className={styles.prose}>
          <p>그러다 기술업에 종사하는 분들의 영상을 봤습니다. 저도 제 기술로 제 일을 만들어 가고 싶다는 생각이 들었습니다.</p>
          <p>그 마음으로 회사를 나와 수리·리폼 일을 시작했습니다.</p>
          <p>하지만 일이 없었습니다. 기술을 가지고 시작했는데, 고객은 제가 누구인지 몰랐습니다.</p>
          <p>앞선 사업의 실패로 대출 상환금 등을 포함한 월 고정 지출은 300만 원에 육박했습니다. 매달 지출을 감당해야 한다는 압박이 컸습니다.</p>
        </div>
        <blockquote className={styles.quote}>취업해서 착실히<br />돈이나 벌걸.</blockquote>
        <p className={styles.bodyText}>도망치고 싶다는 생각을 하루에도 몇 번씩 했습니다.</p>
      </section>

      <section className={styles.section}>
        <p className={styles.eyebrow}>{chapter(2)} / 지금까지 기술업을 이어온 이유</p>
        <h2>나를 알리는 기술이<br />필요했습니다.</h2>
        <div className={styles.prose}>
          <p>그동안 실패했던 사업들을 돌아봤습니다. 그 안에서도 제가 잘했던 건 마케팅, 스토리텔링, 브랜딩이었습니다.</p>
          <p>다시 한번 몰입해 보기로 했습니다.</p>
          <p>블로그, 당근, 숨고, 인스타그램, 유튜브. 닥치는 대로 공부하고 적용했습니다. 공부하고 적용하고, 다시 공부하고 적용했습니다.</p>
          <p>그 과정을 지나며 느꼈습니다. 좋은 기술을 갖는 것과 함께, 세상에 제가 누구인지 알리는 일이 중요하다는 것을요.</p>
          <p>지금은 당시의 월 고정 지출 300만 원을 떠올려도 예전처럼 막막하지 않을 만큼 제 사업이 달라졌습니다. 고정 지출 자체도 줄였습니다.</p>
        </div>
        <p className={styles.finePrint}>제가 직접 겪은 사업 경험입니다. 같은 방법이 모든 사람에게 같은 결과를 주지는 않습니다.</p>
      </section>

      <section className={styles.section}>
        <p className={styles.eyebrow}>{chapter(3)} / 기술 사업을 하며 후회하는 부분</p>
        <h2>할 수 있는 일은 늘었는데,<br />매출은 비슷했습니다.</h2>
        <div className={styles.prose}>
          <p>매출이 나오지 않을 때마다 저는 다른 기술을 찾았습니다.</p>
        </div>
        <blockquote className={styles.quote}>저 기술도 배워볼까?<br />돈이 될 것 같은데?</blockquote>
        <p className={styles.bodyText}>그렇게 할 수 있는 일은 계속 쌓여 갔습니다.</p>
        <ul className={styles.skillList} aria-label="직접 배우고 해온 수리·리폼 작업">
          {learnedWork.map((work) => <li key={work}>{work}</li>)}
        </ul>
        <div className={styles.prose}>
          <p>하지만 할 수 있는 일이 많아지는 만큼 매출이 늘지는 않았습니다. 제 일을 알리는 방법은 그대로였기 때문입니다.</p>
          <p>지금 돌아보면, 하나라도 제대로 하면서 나를 알리는 데 집중했다면 더 빠르게 성장할 수 있지 않았을까 생각합니다.</p>
        </div>
      </section>
    </>
  );
}
