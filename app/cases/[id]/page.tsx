import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildTrackedContactPath } from "@/lib/attribution";
import { cases } from "@/lib/case-data";
import { sanitizePublicCaseText } from "@/lib/public-case-text";
import FloatingCTA from "@/app/components/landing/shared/FloatingCTA";
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
  return (
    <main className={s.page} data-service-id="cases" data-service-keyword={item.id}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className={s.shell}>
        <nav className={s.crumb} aria-label="사례 탐색">
          <Suspense fallback={<Link href="/cases">작업 사례 목록</Link>}><BackToCases id={item.id} /></Suspense>
          <span aria-hidden="true">/</span><Link href={categoryHref(item.category)}>{item.category}</Link>
        </nav>
        <header className={s.detailHeader} data-service-section="hero">
          <h1>{item.title}</h1>
          <div className={s.detailMeta}>{region && <span>{region}</span>}<time dateTime={caseDate(item.date)}>{formatCaseDate(item.date)}</time></div>
        </header>
        <div className={s.readingGrid}>
          <CasePhotos photos={{ title: item.title, before: item.beforeImg, after: item.afterImg }} />
          <div className={s.storyColumn}>
            <section data-service-section="process" className={s.story}>
              <h2>작업 기록</h2>
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
          <aside className={s.consult} data-case-consult data-service-section="contact" aria-labelledby="consult-title">
            <h2 id="consult-title">우리 집도 수리할 수 있을까요?</h2>
            <p>가구 전체와 손상 부위 사진을 보내주시면 수리 방법을 안내해 드려요.</p>
            <div className={s.contactLinks} data-service-section="inline_contact">
              <a href={kakao} target="_blank" rel="noopener noreferrer">카카오톡으로 사진 상담</a>
              <a href={phone}>전화 상담 <span>1688-2957</span></a>
            </div>
          </aside>
        </div>
        <RelatedCases similar={similar.length ? similar.map(entry => <CaseCard key={entry.id} item={entry} />) : null}
          other={other.length ? other.map(entry => <CaseCard key={entry.id} item={entry} />) : null} />
      </div>
      <div className={s.mobileContact}><FloatingCTA compactMobile avoidOverlapSelector="[data-case-consult]" label="카카오톡으로 사진 상담" /></div>
    </main>
  );
}
