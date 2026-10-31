import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/app/components/JsonLd";
import { withLandingSeo } from "@/lib/landing-seo";
import AcademySidebar from "./AcademySidebar";
import FounderJourney from "./FounderJourney";
import FieldVideo from "./FieldVideo";
import styles from "./academy.module.css";

const PAGE_URL = "https://www.restorystudio.co.kr/academy";
const description = "기술에서 사업으로. 리스토리 고관호 대표가 겪은 4년의 시행착오를 바탕으로, 기술 창업과 나를 알리는 마케팅·스토리텔링·브랜딩을 함께 준비하는 교육입니다.";

export const metadata: Metadata = withLandingSeo({
  title: { absolute: "기술로 살아남기 · 과정소개 | 리스토리 스튜디오" },
  description,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "기술로 살아남기 | 리스토리 스튜디오",
    description,
    url: PAGE_URL,
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/images/philosophy/representative-kitchen-field.png", width: 1536, height: 1152, alt: "리스토리 기술로 살아남기" }],
  },
});

export default function AcademyPage() {
  return (
    <main className={styles.page}>
      <WebPageJsonLd name="기술로 살아남기 · 과정소개" description={description} url={PAGE_URL} image="/images/philosophy/representative-kitchen-field.png" />
      <BreadcrumbJsonLd items={[{ name: "홈", url: "https://www.restorystudio.co.kr" }, { name: "기술로 살아남기", url: PAGE_URL }]} />
      <div className={styles.columns}>
        <div className={styles.content}>
          <section className={styles.hero} aria-labelledby="academy-title">
            <Image src="/images/philosophy/representative-kitchen-field.png" alt="주방에서 작업 상태를 설명하는 리스토리 대표" fill priority sizes="(max-width: 900px) 100vw, 760px" className={styles.heroImage} />
            <div className={styles.heroShade} />
            <div className={styles.heroText}>
              <p className={styles.heroLabel}>기술로 살아남기 · 과정소개</p>
              <h1 id="academy-title">기술에서<br /><em>사업으로.</em></h1>
              <p>기술을 배우고, 나를 알리는 일까지.<br />제가 겪은 4년의 시행착오를 담았습니다.</p>
              <a href="#course-story" className={styles.heroLink}>이 교육을 시작하는 이유 <span aria-hidden="true">↓</span></a>
            </div>
            <span className={styles.heroSignature}>RESTORY STUDIO</span>
          </section>

          <section id="course-story" className={styles.section}>
            <p className={styles.eyebrow}>01 / 기술 창업을 생각하고 있다면</p>
            <h2>AI 시대에 직장 생활은 불안한데…<br />내 사업을 해볼 수는 없을까?</h2>
            <div className={styles.prose}>
              <p>이런 생각으로 기술 창업 교육을 알아보고 계신가요?</p>
              <p>잠깐만 시간을 내어 읽어보세요. 기술을 배우고 사업을 시작하기 전에, 제가 먼저 겪었던 이야기를 전하고 싶습니다.</p>
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.eyebrow}>02 / 기술을 배운 뒤, 제가 놓쳤던 것</p>
            <h2>기술은 좋은데,<br />나를 알리는 기술이 없다.</h2>
            <div className={styles.prose}>
              <p>집수리, 가구 수리, 에어컨 청소, 방충망 교체. 좋은 기술을 알려주는 교육들이 있습니다. 실제로 좋은 기술입니다.</p>
              <p>다시 한번 열정을 가지고 도전합니다. 과정을 마치고 나면 이런 마음이 들 수 있습니다.</p>
            </div>
            <blockquote className={styles.quote}>나도 이제 세상에 나가서,<br />기술로 사업하고 싶다!</blockquote>
            <div className={styles.prose}>
              <p>좋은 기술은 사업의 중요한 바탕입니다. 그런데 제가 부딪힌 어려움은 기술만의 문제가 아니었습니다.</p>
              <p>제 기술을 필요로 하는 사람들에게, 제가 누구이고 무엇을 하는지 알리는 방법이 없었습니다.</p>
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.eyebrow}>03 / 요리 실력과 손님이 찾아오는 일</p>
            <h2>요리를 잘해도,<br />손님이 가게를 모른다면 어떨까요?</h2>
            <div className={styles.prose}>
              <p>뛰어난 호텔 주방장이 자기 음식점을 차렸다고 생각해 보겠습니다. 경력도, 실력도, 관리 능력도 갖췄습니다. 음식의 맛도 좋습니다.</p>
              <p>그런데 아무도 그 가게를 모른다면 어떨까요? 요리 실력과 함께 손님이 가게를 발견하고 찾아오는 과정도 필요합니다.</p>
              <p>가게를 찾을 때 네이버 플레이스나 인스타그램을 살펴보듯, 기술업에서도 고객이 나를 발견하고 믿을 수 있어야 합니다.</p>
              <p>좋은 기술을 가지고 있어도 나를 알리는 방법이 없다면, 손님을 기다리는 시간은 길어질 수 있습니다.</p>
            </div>
            <p className={styles.lead}>저 역시 그런 시간을 겪었습니다.</p>
          </section>

          <section className={styles.section}>
            <p className={styles.eyebrow}>04 / 그런 이야기를 하는 저는 누구냐고요?</p>
            <h2>안녕하세요.<br />기술업에 종사하는 고관호입니다.</h2>
            <p className={styles.bodyText}>저는 친동생과 함께 리스토리에서 수리·리폼 일을 하고 있습니다. 지금의 일을 하기까지 여러 사업에 도전하고, 실패하고, 다시 시작했습니다.</p>
            <FieldVideo />
            <Link href="/academy/operator" className={styles.textLink}>운영자 소개 보기 <span aria-hidden="true">→</span></Link>
          </section>

          <FounderJourney startNumber={5} />

          <section className={styles.section}>
            <p className={styles.eyebrow}>09 / 이 교육을 시작하는 이유</p>
            <h2>제가 겪은 시행착오를,<br />덜 겪었으면 좋겠습니다.</h2>
            <div className={styles.prose}>
              <p>월급만을 기다리는 생활을 넘어, 스스로 돈을 벌 수 있는 사람이 되고 싶다는 마음. 저도 그 마음으로 여러 번 도전했습니다.</p>
              <p>기술업에 들어오는 것도, 다른 길을 선택하는 것도 각자의 선택입니다. 다만 시작하기로 했다면, 제가 겪었던 시행착오를 조금이라도 덜 겪었으면 좋겠습니다.</p>
              <p>힘들게 돌아온 4년의 경험을 바탕으로, 기술을 익히는 일과 나를 알리는 일, 그리고 사업으로 이어가는 이야기를 담은 교육을 준비했습니다.</p>
            </div>
            <blockquote className={styles.quote}>기술에서 사업으로.<br />나를 알리는 기술까지.</blockquote>
            <p className={styles.finePrint}>세부 커리큘럼·개강 일정·교육 방식·수강료는 확정 후 안내합니다.</p>
          </section>

          <section className={styles.operatorTeaser}>
            <div>
              <p className={styles.eyebrow}>과정을 준비하는 사람</p>
              <h2>4년의 시행착오를,<br />다음 시작을 위한 이야기로.</h2>
              <p>리스토리 대표 고관호의<br />실패와 전환을 소개합니다.</p>
              <Link href="/academy/operator" className={styles.textLink}>운영자 소개 <span aria-hidden="true">→</span></Link>
            </div>
            <Image src="/images/bro.webp" alt="리스토리 대표 고관호" width={1024} height={1024} sizes="(max-width: 600px) 160px, 240px" />
          </section>
        </div>
        <AcademySidebar />
      </div>
    </main>
  );
}
