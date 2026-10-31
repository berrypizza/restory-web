import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/app/components/JsonLd";
import { withLandingSeo } from "@/lib/landing-seo";
import AcademySidebar from "../AcademySidebar";
import FounderJourney from "../FounderJourney";
import FieldVideo from "../FieldVideo";
import styles from "../academy.module.css";

const PAGE_URL = "https://www.restorystudio.co.kr/academy/operator";
const description = "여러 사업의 실패, 한샘 시공 현장, 친동생과 시작한 수리·리폼, 그리고 마케팅. 리스토리 고관호 대표가 겪은 4년의 시행착오와 기술로 살아남기를 준비하는 이유를 소개합니다.";

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
              <h1>다시 시작한 현장,<br /><em>기술에서 사업으로.</em></h1>
              <p className={styles.profileName}>고관호 <span>리스토리 대표</span></p>
              <p className={styles.profileDescription}>여러 번의 실패와 다시 시작한 현장.<br />저의 4년을 이야기합니다.</p>
            </div>
            <Image src="/images/bro.webp" alt="리스토리 대표 고관호" width={1024} height={1024} priority sizes="(max-width: 600px) 260px, 400px" className={styles.portrait} />
          </section>

          <section className={styles.section}>
            <p className={styles.eyebrow}>01 / 운영자 고관호</p>
            <h2>친동생과 함께,<br />수리·리폼 일을 하고 있습니다.</h2>
            <div className={styles.prose}>
              <p>안녕하세요. 리스토리 대표 고관호입니다. 친동생과 함께 가구와 싱크대를 수리하고 리폼합니다.</p>
              <p>처음부터 이 일을 해온 것은 아닙니다. 돈을 벌고 싶어서 여러 사업에 뛰어들었고, 실패를 겪었습니다. 현장에서 기술을 익힌 뒤에도 제 일을 알리는 방법을 다시 배워야 했습니다.</p>
              <p>기술로 살아남기는 그 4년의 시행착오에서 시작했습니다.</p>
            </div>
            <FieldVideo />
          </section>

          <FounderJourney startNumber={2} />

          <section className={styles.closing}>
            <p className={styles.eyebrow}>기술로 살아남기</p>
            <h2>제가 돌아온 길이,<br />다음 시작에 도움이 되기를.</h2>
            <p className={styles.bodyText}>기술을 계속 배우기만 하던 시간에서, 나를 알리고 사업을 이어가는 시간으로. 그 경험을 나누려 합니다.</p>
            <Link href="/academy" className={styles.primaryButton}>과정소개 보기 <span aria-hidden="true">→</span></Link>
          </section>
        </div>
        <AcademySidebar />
      </div>
    </main>
  );
}
