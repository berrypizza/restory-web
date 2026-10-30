import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/app/components/JsonLd";
import { withLandingSeo } from "@/lib/landing-seo";
import AcademySidebar from "../AcademySidebar";
import styles from "../academy.module.css";

const PAGE_URL = "https://www.restorystudio.co.kr/academy/operator";
const description = "기술로 살아남기를 준비하는 리스토리 대표 고관호의 소개. 현장에서 시작한 경험과 솔직한 소통, 고객의 더 좋은 선택을 돕는 기준을 전합니다.";

export const metadata: Metadata = withLandingSeo({
  title: { absolute: "운영자 소개 · 기술로 살아남기 | 리스토리 스튜디오" },
  description,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "운영자 소개 · 기술로 살아남기",
    description,
    url: PAGE_URL,
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/images/bro.webp", width: 1024, height: 1024, alt: "리스토리 대표 고관호" }],
  },
});

const principles = [
  { title: "확인하고 이야기합니다.", body: "사진과 현장에서 확인한 내용을 바탕으로 설명합니다. 모르는 원인을 아는 것처럼 단정하지 않습니다." },
  { title: "선택할 수 있게 설명합니다.", body: "가능한 일과 어려운 일, 필요한 작업과 필요하지 않은 작업을 나눠 고객이 이해하도록 돕습니다." },
  { title: "작은 마감도 살펴봅니다.", body: "작업이 끝난 뒤 고객이 매일 사용하는 순간까지 생각합니다. 작은 일을 대하는 태도가 신뢰로 이어진다고 믿습니다." },
];

export default function AcademyOperatorPage() {
  return (
    <main className={styles.page}>
      <WebPageJsonLd name="운영자 소개 · 기술로 살아남기" description={description} url={PAGE_URL} image="/images/bro.webp" />
      <BreadcrumbJsonLd items={[{ name: "홈", url: "https://www.restorystudio.co.kr" }, { name: "기술로 살아남기", url: "https://www.restorystudio.co.kr/academy" }, { name: "운영자 소개", url: PAGE_URL }]} />
      <div className={styles.columns}>
        <div className={styles.content}>
          <section className={styles.profileHero}>
            <div className={styles.profileText}>
              <p className={styles.eyebrow}>기술로 살아남기 · 운영자 소개</p>
              <h1>현장에서 시작해,<br /><em>신뢰를 쌓는 일.</em></h1>
              <p className={styles.profileName}>고관호 <span>리스토리 대표</span></p>
              <p className={styles.profileDescription}>작은 마감 하나에도 정성을 넣고,<br />고객에게 솔직하게 설명하는 사람.</p>
            </div>
            <Image src="/images/bro.webp" alt="리스토리 대표 고관호" width={1024} height={1024} priority sizes="(max-width: 600px) 260px, 400px" className={styles.portrait} />
          </section>

          <section className={styles.section}>
            <p className={styles.eyebrow}>01 / 시작의 이야기</p>
            <h2>기술을 쓰는 사람에게는<br />자기만의 기준이 필요합니다.</h2>
            <div className={styles.prose}>
              <p>안녕하세요. 리스토리 대표 고관호입니다. 저는 국내 대형 가구 회사의 시공자로 일하며 현장을 가까이에서 배웠습니다.</p>
              <p>고객에게는 자재도, 작업 방식도, 견적의 이유도 낯설 수 있습니다. 그래서 먼저 설명하고, 고객이 이해한 다음에 선택할 수 있도록 돕는 방향을 택했습니다.</p>
              <p>기술로 살아남기에도 이 기준을 담으려 합니다. 어떻게 고치는지와 함께, 왜 그 방법을 선택하는지 설명할 수 있는 기술자를 생각합니다.</p>
            </div>
            <blockquote className={styles.quote}>고객이 모르면,<br />알려준 다음에 소통하자.</blockquote>
            <Link href="/philosophy" className={styles.textLink}>사업 철학에서 이야기 이어 보기 <span aria-hidden="true">↗</span></Link>
          </section>

          <section className={styles.section}>
            <p className={styles.eyebrow}>02 / 함께 나누고 싶은 기준</p>
            <h2>손의 기술과 함께,<br />일을 대하는 태도까지.</h2>
            <div className={styles.directionList}>
              {principles.map((principle, index) => (
                <div key={principle.title} className={styles.direction}>
                  <span className={styles.directionNumber}>0{index + 1}</span>
                  <div><h3>{principle.title}</h3><p>{principle.body}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.closing}>
            <p className={styles.eyebrow}>기술로 살아남기</p>
            <h2>어떤 과정을 준비하는지<br />살펴보세요.</h2>
            <Link href="/academy" className={styles.primaryButton}>과정소개 보기 <span aria-hidden="true">→</span></Link>
          </section>
        </div>
        <AcademySidebar />
      </div>
    </main>
  );
}
