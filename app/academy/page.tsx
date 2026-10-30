import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/app/components/JsonLd";
import { withLandingSeo } from "@/lib/landing-seo";
import AcademySidebar from "./AcademySidebar";
import styles from "./academy.module.css";

const PAGE_URL = "https://www.restorystudio.co.kr/academy";
const description = "리스토리의 기술 교육, 기술로 살아남기. 가구·싱크대 수리와 리폼, 현장의 판단과 고객에게 설명하는 기준을 함께 준비합니다. 과정 개설 준비 중입니다.";

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

const directions = [
  { title: "상태를 보는 눈", body: "사진과 현장에서 확인해야 할 부분을 나누고, 무엇이 문제인지 살펴봅니다." },
  { title: "원인을 짚는 습관", body: "겉으로 드러난 증상과 실제 원인을 구분하고, 모르는 부분은 확인합니다." },
  { title: "방법을 고르는 기준", body: "살릴 수 있는 부분과 교체가 필요한 부분을 나누고, 자재와 작업 범위를 생각합니다." },
  { title: "고객에게 설명하는 힘", body: "왜 이 작업이 필요한지, 어떤 선택지가 있는지 이해하기 쉬운 말로 전합니다." },
];

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
              <h1 id="academy-title">고치는 기술,<br /><em>살아가는 힘.</em></h1>
              <p>손으로 익히는 수리·리폼.<br />현장에서 쌓는 판단과 신뢰.</p>
              <a href="#learning-direction" className={styles.heroLink}>어떤 과정을 준비하나요? <span aria-hidden="true">↓</span></a>
            </div>
            <span className={styles.heroSignature}>RESTORY STUDIO</span>
          </section>

          <section id="learning-direction" className={styles.section}>
            <p className={styles.eyebrow}>01 / 과정이 향하는 방향</p>
            <h2>기술을 익히고,<br />선택의 이유를 설명하는 사람으로.</h2>
            <p className={styles.lead}>수리는 손에서 시작하지만, 신뢰는 설명에서 쌓입니다.</p>
            <p className={styles.bodyText}>기술로 살아남기는 리스토리가 준비하는 수리·리폼 교육입니다. 작업 방법과 함께, 상태를 살피고 원인을 확인하며 고객이 이해할 수 있도록 설명하는 과정을 담으려 합니다.</p>
            <div className={styles.directionList}>
              {directions.map((direction, index) => (
                <div key={direction.title} className={styles.direction}>
                  <span className={styles.directionNumber}>0{index + 1}</span>
                  <div><h3>{direction.title}</h3><p>{direction.body}</p></div>
                </div>
              ))}
            </div>
            <p className={styles.finePrint}>위 내용은 준비 중인 교육 방향입니다. 세부 커리큘럼과 일정은 확정 후 안내합니다.</p>
          </section>

          <section className={styles.section}>
            <p className={styles.eyebrow}>02 / 우리가 다루는 현장</p>
            <h2>교체하기 전에,<br />살릴 수 있는지 살펴봅니다.</h2>
            <p className={styles.bodyText}>싱크대와 가구의 상태를 살피는 일부터, 필요한 범위의 수리와 리폼까지. 리스토리가 현장에서 어떤 문제를 만나고 어떻게 선택을 설명하는지 작업 사례에서 먼저 확인해 보세요.</p>
            <figure className={styles.fieldFigure}>
              <Image src="/images/philosophy/representative-kitchen-field.png" alt="싱크대 상태를 확인하고 설명하는 현장" width={1536} height={1152} sizes="(max-width: 900px) 100vw, 760px" />
              <figcaption>리스토리의 주방 현장 · 상태를 보고, 선택지를 설명하는 일</figcaption>
            </figure>
            <Link href="/cases" className={styles.textLink}>리스토리 작업 사례 보기 <span aria-hidden="true">↗</span></Link>
          </section>

          <section className={styles.operatorTeaser}>
            <div>
              <p className={styles.eyebrow}>과정을 준비하는 사람</p>
              <h2>현장에서 배운 것들을,<br />다음 기술자에게.</h2>
              <p>리스토리 대표 고관호의 이야기와<br />일을 대하는 기준을 소개합니다.</p>
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
