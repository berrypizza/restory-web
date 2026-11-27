import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { cases, PARENT_CATEGORIES, SUB_CATEGORIES } from "@/lib/case-data";
import { buildTrackedContactPath } from "@/lib/attribution";
import { PhotoCtaCard } from "@/app/components/landing/premium/Blocks";
import { RiseLines, Scrub } from "@/app/components/landing/premium/Motion";
import { display } from "@/app/components/landing/premium/fonts";
import p from "@/app/components/landing/premium/premium.module.css";
import { browseCases, listHref, listQuery, pageSize, type CaseFilters, type CaseParams } from "./case-browser";
import CaseCard from "./CaseCard";
import CasesContact from "./CasesContact";
import { BrowseLink, CaseNavigation, CaseResults, CaseSearch } from "./CaseNavigation";
import s from "./cases.module.css";

const site = "https://www.restorystudio.co.kr";
const REQUEST_URL = "/request";
const PHONE = buildTrackedContactPath("phone", "cases_list");
export const metadata: Metadata = {
  title: "수리·리폼 작업 사례",
  description: "싱크대 수리와 리폼, 냉장고장 리폼, 가죽 교체, 소파 복원 현장을 지역·증상별로 찾고 실제 작업 전후 사진을 비교해 보세요.",
  alternates: { canonical: `${site}/cases` },
  openGraph: { title: "수리·리폼 작업 사례 | 리스토리 스튜디오", url: `${site}/cases`, type: "website" },
};

const featured = cases.find(item => item.id === "case-099");

function Pagination({ page, total, filters }: { page: number; total: number; filters: CaseFilters }) {
  if (total < 2) return null;
  const start = Math.max(1, Math.min(page - 1, total - 2));
  const numbers = [...new Set([1, start, start + 1, Math.min(start + 2, total), total])].sort((a, b) => a - b);
  const href = (p: number) => listHref(filters, p) + "#case-results";
  return (
    <nav className={s.pages} aria-label="사례 목록 페이지">
      {page > 1 ? <BrowseLink href={href(page - 1)} rel="prev">이전</BrowseLink> : <span className={s.disabled} aria-disabled="true">이전</span>}
      <div className={s.pageNumbers}>
        {numbers.map((n, i) => <span key={n}>
          {i > 0 && n - numbers[i - 1] > 1 && <span className={s.ellipsis} aria-hidden="true">…</span>}
          <BrowseLink href={href(n)} aria-label={`${n}페이지`} aria-current={n === page ? "page" : undefined}>{n}</BrowseLink>
        </span>)}
      </div>
      <span className={s.pageCount} aria-label={`전체 ${total}페이지 중 ${page}페이지`}><b>{page}</b> / {total}</span>
      {page < total ? <BrowseLink href={href(page + 1)} rel="next">다음</BrowseLink> : <span className={s.disabled} aria-disabled="true">다음</span>}
    </nav>
  );
}

export default async function CasesPage({ searchParams }: { searchParams: Promise<CaseParams> }) {
  const { filters, parent, page, totalPages, matches, items } = browseCases(await searchParams);
  const context = listQuery(filters, page);
  const showFeature = Boolean(featured && !context);
  const children = SUB_CATEGORIES[parent];
  const jsonLd = {
    "@context": "https://schema.org", "@type": "ItemList", name: "리스토리 작업 사례", numberOfItems: matches.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem", position: (page - 1) * pageSize + index + 1, name: item.title, url: `${site}/cases/${item.id}`, image: `${site}${item.afterImg}`,
    })),
  };
  return (
    <main className={`${p.page} ${s.page} ${display.variable}`} data-service-id="cases">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <CaseNavigation>
        {/* HERO — 실제 현장 사진 위 안개 · 흐린 빛 구체 · 텍스처 제목 */}
        <Scrub as="section" data-service-section="hero" data-premium-hero className={`${p.hero} ${p.heroCompact}`}>
          <div className={p.heroBg}>
            <Image src={featured?.afterImg ?? "/images/premium/text-fill-1.jpg"} alt="" fill priority className="object-cover" sizes="100vw" />
          </div>
          <span className={`${p.orb} ${p.orbA}`} aria-hidden="true" />
          <span className={`${p.orb} ${p.orbB}`} aria-hidden="true" />
          <span className={`${p.orb} ${p.orbC}`} aria-hidden="true" />
          <span className={p.grain} aria-hidden="true" />
          <div className={p.heroTrail} />
          <p className={p.heroGhost} aria-hidden="true">RE&apos;STORY CASES</p>
          <div className={`${p.wrap} ${p.heroInner}`}>
            <div className={p.heroSplit}>
              <div>
                <p className={`${p.heroEyebrow} ${p.heroFade}`}>Re&apos;Story · Real Cases</p>
                <RiseLines onLoad as="h1" className={p.heroTitle} lines={["수리·리폼 ", "작업 사례"]} />
                <div className={`${p.heroGlass} ${p.heroFade}`} style={{ animationDelay: "0.3s" }}>
                  <p className={p.heroSub}>우리 집과 비슷한 현장을 전후 사진으로 살펴보세요. 지역, 가구, 증상으로 찾을 수 있어요.</p>
                  <CaseSearch filters={filters} />
                </div>
              </div>
              {showFeature && featured && <Link href={`/cases/${featured.id}`} className={`${s.feature} ${p.heroFade}`} style={{ animationDelay: "0.45s" }} aria-label={`${featured.title} 사례 보기`}>
                <Image src={featured.afterImg} alt="문짝 교체 후의 마포구 주방" fill sizes="(max-width: 900px) 92vw, 480px" />
                <span className={s.featureBefore}><Image src={featured.beforeImg} alt="문짝 교체 전의 같은 주방" fill sizes="110px" /><span>작업 전</span></span>
                <span className={s.featureCaption}><span>작업 후</span><strong>{featured.title.split(",")[0]}</strong></span>
              </Link>}
            </div>
          </div>
        </Scrub>

        {/* 본문 — 뒤에 빛 구체가 흐르고 내용은 유리 카드 */}
        <Scrub className={p.glassZone}>
          <div className={p.ambient} aria-hidden="true">
            <div className={p.ambientSticky}>
              <span className={`${p.ambientOrb} ${p.ambientOrb1}`} />
              <span className={`${p.ambientOrb} ${p.ambientOrb2}`} />
              <span className={`${p.ambientOrb} ${p.ambientOrb3}`} />
              <span className={p.grain} />
            </div>
          </div>

          <section className={s.finder} aria-label="작업 분야 필터" id="case-finder">
            <div className={p.wrap}>
              <div className={p.glass}>
                <p className={p.kicker}>작업 분야</p>
                <h2 className="sr-only">작업 분야</h2>
                <nav className={s.categories} aria-label="작업 분야">
                  {PARENT_CATEGORIES.map(category => <BrowseLink key={category} href={listHref({ ...filters, category }) + "#case-finder"}
                    aria-current={parent === category ? "true" : undefined}>{category}</BrowseLink>)}
                </nav>
                {children && <nav className={s.subcategories} aria-label="세부 작업">
                  {[parent, ...children].map(category => <BrowseLink key={category} href={listHref({ ...filters, category }) + "#case-finder"}
                    aria-current={filters.category === category ? "true" : undefined}>{category === parent ? "분야 전체" : category}</BrowseLink>)}
                </nav>}
              </div>
            </div>
          </section>

          <CaseResults>
            <div className={p.wrap}>
              <div className={s.resultsHead}>
                <h2 id="case-results-title">{filters.query || filters.tag ? "검색 결과" : parent === "전체" ? "전체 사례" : filters.category} <span>{matches.length}건</span></h2>
                {items.length > 0 && <span>최신순</span>}
              </div>
              {(filters.query || filters.tag) && <div className={s.activeFilters}>
                {filters.query && <BrowseLink aria-label={`검색어 ${filters.query} 해제`} href={listHref({ ...filters, query: "" }) + "#case-finder"}>{filters.query} <span aria-hidden="true">×</span></BrowseLink>}
                {filters.tag && <BrowseLink aria-label={`태그 ${filters.tag} 해제`} href={listHref({ ...filters, tag: "" }) + "#case-finder"}>#{filters.tag} <span aria-hidden="true">×</span></BrowseLink>}
              </div>}
              {items.length ? <div className={s.grid}>{items.map(item => <CaseCard key={item.id} item={item} context={context} anchor />)}</div> :
                <div className={`${s.empty} ${p.glass}`}><h3>일치하는 사례가 없어요</h3><p>지역 이름이나 가구 종류로 다시 찾아보세요.</p><BrowseLink href="/cases#case-finder">전체 사례 보기</BrowseLink></div>}
              <Pagination page={page} total={totalPages} filters={filters} />
              {/* 캐릭터 #2 — 사진 상담 CTA */}
              <PhotoCtaCard title="비슷한 현장이 있나요?" sub="사진 2장이면 우리 집 수리 방법을 먼저 안내해 드려요."
                href={REQUEST_URL} label="사진으로 상담 접수" cta="cases_request_mid" />
            </div>
          </CaseResults>
        </Scrub>
      </CaseNavigation>
      <CasesContact requestHref={REQUEST_URL} phoneHref={PHONE} cta="cases" />
    </main>
  );
}
