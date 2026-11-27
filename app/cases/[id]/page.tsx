import { findService } from "@/lib/consultation-services";
import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildTrackedContactPath } from "@/lib/attribution";
import { cases } from "@/lib/case-data";
import { sanitizePublicCaseText } from "@/lib/public-case-text";
import FloatingCTA from "@/app/components/landing/shared/FloatingCTA";
import Image from "next/image";
import { Arrow, CameraIcon } from "@/app/components/landing/premium/Blocks";
import { RiseLines, RollText, Scrub, SmoothScroll } from "@/app/components/landing/premium/Motion";
import { display } from "@/app/components/landing/premium/fonts";
import p from "@/app/components/landing/premium/premium.module.css";
import CasesContact from "../CasesContact";
import { caseDate, categoryHref, formatCaseDate, listHref, publicRegion, relatedTo } from "../case-browser";
import CaseCard from "../CaseCard";
import BackToCases from "./BackToCases";
import CasePhotos from "./CasePhotos";
import CaseStory from "./CaseStory";
import RelatedCases from "./Relatedcases";
import s from "../cases.module.css";

const site = "https://www.restorystudio.co.kr";
const kakao = buildTrackedContactPath("kakao", "case_detail");
const phone = buildTrackedContactPath("phone", "case_detail");
type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return cases.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = cases.find(entry => entry.id === id);
  if (!item) return {};
  const url = `${site}/cases/${item.id}`;
  const image = `${site}${item.afterImg}`;
  const description = sanitizePublicCaseText(item.summary);
  return {
    title: item.title, description, alternates: { canonical: url },
    openGraph: { title: item.title, description, url, type: "article", images: [{ url: image, alt: `${item.title} 작업 후` }] },
    twitter: { card: "summary_large_image", title: item.title, description, images: [image] },
  };
}

export default async function CaseDetailPage({ params }: Props) {
  const { id } = await params;
  const item = cases.find(entry => entry.id === id);
  if (!item) notFound();
  const summary = sanitizePublicCaseText(item.summary);
  const content = sanitizePublicCaseText(item.content ?? "");
  const review = item.review && sanitizePublicCaseText(item.review.content);
  const region = publicRegion(item);
  const tags = [...new Set(item.tags.map(tag => tag.trim()).filter(Boolean))];
  const { similar, other } = relatedTo(item);
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Article", headline: item.title, description: summary,
    datePublished: caseDate(item.date), dateModified: caseDate(item.date), image: [site + item.beforeImg, site + item.afterImg],
    keywords: tags.join(", "), articleSection: item.parentCategory,
    about: { "@type": "Service", name: item.parentCategory, serviceType: item.category, areaServed: region ? { "@type": "Place", name: region } : undefined },
    author: { "@type": "LocalBusiness", name: "리스토리 스튜디오", url: site, telephone: "1688-2957",
      address: { "@type": "PostalAddress", addressLocality: region || undefined, addressCountry: "KR" } },
    publisher: { "@type": "Organization", name: "리스토리 스튜디오", url: site, logo: { "@type": "ImageObject", url: site + "/images/logo-cc.png" } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${site}/cases/${item.id}` },
  };
  const intakeService = findService(item.category) ?? findService(item.title);
  const requestHref = intakeService ? "/request?service=" + intakeService : "/request";
  return (
    <main className={`${p.page} ${s.page} ${display.variable}`} data-service-id="cases" data-service-keyword={item.id}>
      <SmoothScroll />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* HERO — 이 현장의 작업 후 사진 위 안개 · 빛 구체 · 텍스처 제목 */}
      <Scrub as="section" data-service-section="hero" data-premium-hero className={`${p.hero} ${p.heroCompact}`}>
        <div className={p.heroBg}>
          <Image src={item.afterImg} alt="" fill priority className="object-cover" sizes="100vw" />
        </div>
        <span className={`${p.orb} ${p.orbA}`} aria-hidden="true" />
        <span className={`${p.orb} ${p.orbB}`} aria-hidden="true" />
        <span className={`${p.orb} ${p.orbC}`} aria-hidden="true" />
        <span className={p.grain} aria-hidden="true" />
        <div className={p.heroTrail} />
        <p className={p.heroGhost} aria-hidden="true">RE&apos;STORY CASE</p>
        <div className={`${p.wrap} ${p.heroInner}`}>
          <nav className={`${s.crumb} ${p.heroCrumb} ${p.heroFade}`} aria-label="사례 탐색">
            <Suspense fallback={<Link href="/cases">작업 사례 목록</Link>}><BackToCases id={item.id} /></Suspense>
            <span aria-hidden="true">/</span><Link href={categoryHref(item.category)}>{item.category}</Link>
          </nav>
          <p className={`${p.heroEyebrow} ${p.heroFade}`}>{item.parentCategory} · {item.category}</p>
          <RiseLines onLoad as="h1" className={`${p.heroTitle} ${p.heroTitleSm}`} lines={[item.title]} />
          <div className={`${s.detailMeta} ${p.heroFade}`} style={{ animationDelay: "0.2s" }}>{region && <span>{region}</span>}<time dateTime={caseDate(item.date)}>{formatCaseDate(item.date)}</time></div>
          <div className={`${p.heroGlass} ${p.heroFade}`} style={{ animationDelay: "0.3s" }}>
            <p className={p.heroSub}>비슷한 상태라면 사진 2장으로 수리 방법을 먼저 안내해 드려요.</p>
            <div className={p.btnRow}>
              <Link href={requestHref} className={p.btnPrimary} data-cta="case_detail_request_hero"><CameraIcon />사진으로 상담 접수</Link>
              <a href={phone} className={p.btnDark}><RollText text="1688-2957 전화 문의" /><Arrow /></a>
            </div>
          </div>
        </div>
      </Scrub>

      <Scrub className={p.glassZone}>
        <div className={p.ambient} aria-hidden="true">
          <div className={p.ambientSticky}>
            <span className={`${p.ambientOrb} ${p.ambientOrb1}`} />
            <span className={`${p.ambientOrb} ${p.ambientOrb2}`} />
            <span className={`${p.ambientOrb} ${p.ambientOrb3}`} />
            <span className={p.grain} />
          </div>
        </div>
        <div className={`${p.wrap} ${s.detailBody}`}>
          <div className={s.readingGrid}>
            <div className={`${p.glass} ${s.photosCard}`}>
              <CasePhotos photos={{ title: item.title, before: item.beforeImg, after: item.afterImg }} />
            </div>
            <div className={`${s.storyColumn} ${p.glass}`}>
              <section data-service-section="process" className={s.story}>
                <p className={p.kicker}>작업 기록</p>
                <h2 className="sr-only">작업 기록</h2>
                {summary && <p className={s.summary}>{summary}</p>}
                {content && content !== summary && <CaseStory content={content} />}
              </section>
              {review && <section className={s.review}>
                <h2>고객 후기</h2><blockquote><p>{review}</p><footer>{item.review!.author}</footer></blockquote>
              </section>}
              {tags.length > 0 && <nav className={s.tags} aria-label="관련 태그">
                {tags.map(tag => <Link key={tag} href={listHref({ category: "전체", query: "", tag })}>#{tag}</Link>)}
              </nav>}
              <div className={s.sources}>
                {item.blogUrl && <a href={item.blogUrl} target="_blank" rel="noopener noreferrer">네이버 블로그에서 작업 과정 보기</a>}
                <a href="https://cafe.naver.com/f-e/cafes/22748193/menus/85?viewType=L" target="_blank" rel="noopener noreferrer">카페에 질문 남기기</a>
              </div>
            </div>
            {/* 캐릭터 #2 — 사진 상담 카드 */}
            <aside className={`${s.consult} ${p.glass}`} data-case-consult data-service-section="contact" aria-labelledby="consult-title">
              <div className={s.consultMascot}>
                <Image src="/images/premium/mascot-phone.png" alt="가구 사진이 담긴 휴대폰을 들고 엄지를 든 리스토리 기사 캐릭터" width={880} height={1168} sizes="120px" />
              </div>
              <h2 id="consult-title">우리 집도 수리할 수 있을까요?</h2>
              <p>가구 전체와 손상 부위 사진을 보내주시면 수리 방법을 안내해 드려요.</p>
              <div className={s.contactLinks} data-service-section="inline_contact">
                <Link href={requestHref} data-cta="case_detail_request_aside">사진으로 상담 접수</Link>
                <a href={kakao} target="_blank" rel="noopener noreferrer">카카오톡으로 사진 상담</a>
                <a href={phone}>전화 상담 <span>1688-2957</span></a>
              </div>
            </aside>
          </div>
          <RelatedCases similar={similar.length ? similar.map(entry => <CaseCard key={entry.id} item={entry} />) : null}
            other={other.length ? other.map(entry => <CaseCard key={entry.id} item={entry} />) : null} />
        </div>
      </Scrub>
      <CasesContact requestHref={requestHref} phoneHref={phone} cta="case_detail" />
      <div className={s.mobileContact}><FloatingCTA compactMobile avoidOverlapSelector="[data-case-consult]" label="사진으로 상담 접수" kakaoUrl={requestHref} newTab={false} /></div>
    </main>
  );
}
