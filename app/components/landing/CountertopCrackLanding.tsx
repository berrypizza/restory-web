"use client";

import { LandingTrail, LandingIntake, LandingSections } from "./shared/LandingNavigation";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import FloatingCTA from "@/app/components/landing/shared/FloatingCTA";
import { ServiceJsonLd, FAQJsonLd } from "@/app/components/JsonLd";
import { buildTrackedContactPath } from "@/lib/attribution";
import { cases } from "@/lib/case-data";
import { REGIONS } from "@/lib/seo-regions";
import { Scrub, InView, RiseLines, RollText } from "./premium/Motion";
import {
  Arrow,
  CameraIcon,
  Star,
  GlitchDiagram,
  VennShapes,
  Mascot,
  TitleCard,
  PhotoCtaCard,
  FaqList,
} from "./premium/Blocks";
import { display } from "./premium/fonts";
import s from "./premium/premium.module.css";

const PHONE = buildTrackedContactPath("phone", "countertop_crack");
// 사진 상담은 자체 접수 양식으로 (상판 크랙 수리 항목이 미리 선택된 상태로 열림)
const REQUEST_URL = "/request?service=counter";
const PHOTO_CTA = "사진으로 수리 범위·견적 확인";
const SITE_URL = "https://www.restorystudio.co.kr";
type CrackCase = (typeof cases)[number];

const FAQ_ITEMS = [
  {
    q: "갈라진 상판은 전체를 교체해야 하나요?",
    a: "크랙이 생겼다고 모두 전체 교체가 필요한 것은 아닙니다. 재질과 균열 위치·깊이, 하부 지지 상태를 확인해 기존 상판을 보수할 수 있는지 먼저 살핍니다.\n\n균열이 여러 방향으로 넓게 퍼졌거나 상판이 처지고 하부 손상이 큰 경우에는 보강이나 교체를 함께 검토해야 합니다. 사진으로 예상 범위를 안내하고, 가려진 내부 상태는 현장에서 확인합니다.",
  },
  {
    q: "상판 크랙 수리 비용은 어떻게 정해지나요?",
    a: "상판 크랙 수리 비용은 30~50만 원 범위로 안내하며, 부가세는 별도입니다. 상판 재질, 크랙 길이와 깊이, 싱크볼·이음부·모서리 등 파손 위치, 하부 보강 필요 여부에 따라 상담이 필요합니다.\n\n상판 전체와 크랙 가까운 사진, 작업 지역을 보내주세요. 최종 금액과 필요한 작업 범위는 상태를 보고 상담 후 안내합니다. 출장비 포함 여부와 수리 불가 시 비용 등 세부 조건도 상담에서 확인해주세요.",
  },
  {
    q: "수리 후 흔적이 전혀 남지 않나요?",
    a: "크랙 수리는 기존 상판을 다시 사용할 수 있도록 정리하고 마감하는 작업입니다. 새 상판으로 바꾸는 것과 같지는 않습니다.\n\n상판의 색상·무늬·입자, 균열 깊이와 빛이 비치는 방향에 따라 보수선이나 색상 차이가 남을 수 있습니다. 수리 가능 여부와 함께 예상되는 마감 범위를 먼저 안내드립니다.",
  },
  {
    q: "사진은 어떻게 보내면 되나요?",
    a: "상판 전체가 보이는 사진 1장과 크랙이 가까이 보이는 사진 1장을 보내주세요. 싱크볼·이음부·모서리 중 어느 위치인지 알 수 있게 찍으면 도움이 됩니다.\n\n작업 지역과 균열이 생긴 시점, 현재 물이 새는지 또는 상판이 처졌는지도 함께 알려주세요. 재질 이름이나 정확한 치수를 몰라도 보이는 상태부터 상담할 수 있습니다. 사진으로 확인하기 어려운 깊이와 하부 지지 상태는 현장 점검이 필요할 수 있습니다.",
  },
  {
    q: "작업 시간과 수리 후 사용 시점은 어떻게 되나요?",
    a: "작업 시간은 상판 재질과 손상 범위, 보강·마감 방식에 따라 달라집니다. 방문 가능한 일정과 예상 작업 시간을 상담에서 안내합니다.\n\n작업이 끝나는 시점과 물 사용이나 하중을 가해도 되는 시점은 다를 수 있습니다. 수리한 상판을 언제부터 사용할 수 있는지와 관리 방법은 작업 방법에 맞춰 안내받아주세요.",
  },
  {
    q: "3년 무상 A/S는 어떤 범위인가요?",
    a: "상판 크랙 수리 시공 부위는 작업일 기준 3년 무상 A/S를 안내합니다. 문제가 생기면 수리한 부위 사진과 증상을 보내주세요.\n\n정확한 적용 부위와 조건, 기존 하부 지지 문제나 새로운 충격 등으로 다시 손상된 경우의 처리 기준은 상담에서 확인해주세요. 재질과 색상에 따라 남을 수 있는 보수 흔적도 작업 전에 함께 안내합니다.",
  },
  {
    q: "물이 닿거나 하부장이 처져 있다면 함께 수리하나요?",
    a: "상판 크랙과 누수, 하부장 처짐은 필요한 작업이 다를 수 있습니다. 표면의 틈만 보고 작업 범위를 정하지 않고, 현재 물이 새는지와 상판을 받치는 상태를 함께 확인합니다.\n\n배관 수리나 하부장 보강 등 별도 작업이 필요하다면 상판 보수와 구분해 범위·비용·작업 순서를 상담합니다. 함께 불편한 부분도 사진으로 알려주세요.",
  },
];

const SCOPE_ITEMS = [
  { n: "01", title: "수리 가능 범위 확인", desc: "상판 재질, 균열의 길이·깊이, 싱크볼과의 위치, 하부 지지 상태를 살펴봅니다." },
  { n: "02", title: "크랙 정리와 보강", desc: "수리 가능한 부위를 정리하고 필요한 보강 범위를 정합니다. 하부장이나 배관 작업이 필요하면 별도로 안내합니다." },
  { n: "03", title: "표면 마감과 사용 안내", desc: "재질과 색상에 맞는 범위로 마감합니다. 남을 수 있는 보수 흔적과 작업 후 사용 시점을 안내합니다." },
];

const CONSULT_ITEMS = [
  { n: "01", title: "수리 가능 범위와 마감", desc: "기존 상판을 보수할 수 있는지, 보강·교체 판단이 필요한지와 예상되는 보수 흔적을 안내합니다." },
  { n: "02", title: "우리 집 상태에 맞는 견적", desc: "재질과 손상, 필요한 작업을 보고 비용을 상담합니다. 포함 항목과 추가 확인이 필요한 부분도 짚어드립니다." },
  { n: "03", title: "방문 일정과 사용 시점", desc: "작업 지역과 상태를 확인해 일정을 상담하고, 작업 시간과 수리 후 사용 시점을 안내합니다." },
];

const PHOTO_STEPS = [
  { n: "1", title: "상판 전체 사진", desc: "싱크볼·이음부·모서리 중 어디가 갈라졌는지 보이게 찍어주세요." },
  { n: "2", title: "크랙 가까운 사진", desc: "갈라진 선과 벌어진 부분을 보여주세요. 옆면도 보이면 도움이 됩니다." },
  { n: "3", title: "작업 지역과 현재 상태", desc: "균열을 발견한 시점, 누수나 처짐 여부, 이전 보수 여부를 알려주세요." },
];

function parseKeyword(keyword: string): { region: string; symptom: string } {
  const kw = keyword.replace(/-/g, " ");
  const region = REGIONS.find((r) => kw.includes(r)) ?? "";
  const symptom = kw.includes("갈라짐") ? "갈라짐" : kw.includes("깨짐") ? "깨짐" : kw.includes("크랙") ? "크랙" : "수리";
  return { region, symptom };
}

function RegionalCaseItemListJsonLd({ name, items }: { name: string; items: CrackCase[] }) {
  if (items.length === 0) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/cases/${item.id}`,
      item: {
        "@type": "Article",
        headline: item.title,
        description: item.summary,
        image: `${SITE_URL}${item.afterImg}`,
        url: `${SITE_URL}/cases/${item.id}`,
        datePublished: item.date,
        author: { "@type": "Organization", name: "리스토리 스튜디오" },
      },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/* 사진 접수 + 전화 버튼 한 줄 (하단 고정 버튼이 겹치지 않도록 data-crack-contact) */
function ContactButtons({ onBlue = false, cta }: { onBlue?: boolean; cta: string }) {
  return (
    <div data-crack-contact className={s.btnRow}>
      <Link href={REQUEST_URL} className={onBlue ? s.btnOnBlue : s.btnPrimary} data-cta={cta}>
        <CameraIcon />
        {PHOTO_CTA}
      </Link>
      <a href={PHONE} className={onBlue ? s.btnGhost : s.btnDark}>
        <RollText text="전화 문의" />
        <Arrow />
      </a>
    </div>
  );
}

const latestCrackCases = cases
  .filter((item) => item.category === "상판 크랙")
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default function CountertopCrackLanding({ keyword }: { keyword?: string }) {
  const { region, symptom } = keyword ? parseKeyword(keyword) : { region: "", symptom: "크랙" };
  const regionalCases = region ? latestCrackCases.filter((item) => item.region.includes(region)) : [];
  const regionalIds = new Set(regionalCases.map((item) => item.id));
  const featuredCases = [...regionalCases, ...latestCrackCases.filter((item) => !regionalIds.has(item.id))].slice(0, 3);

  // 기존 h1 문구를 줄 단위로 (줄마다 다른 텍스처가 채워짐)
  const heroTitle = region ? [`${region} 상판 ${symptom},`, "다시 쓰는 주방"] : ["갈라진 상판,", "다시 쓰는 주방"];

  return (
    <main data-service-id="sink-top-crack" data-service-keyword={keyword} className={`${s.page} ${display.variable}`}>
      <ServiceJsonLd
        name={region ? `${region} 싱크대 상판 크랙 수리` : "싱크대 상판 크랙 수리"}
        description="보수 가능한 상판의 크랙을 정리하고 마감합니다. 비용 범위는 30~50만 원이며 부가세 별도입니다. 최종 금액은 상태를 보고 상담 후 안내합니다. 예상 마감과 방문 일정, 시공 부위 3년 무상 A/S 적용 조건도 확인하세요."
        url={`${SITE_URL}/repair/${keyword || "sink-top-crack"}`}
        includeAggregateRating={false}
      />
      <FAQJsonLd faqs={FAQ_ITEMS} />
      <RegionalCaseItemListJsonLd name={`${region ? `${region} 지역·` : ""}상판 크랙 수리 전후 사례`} items={featuredCases} />

      {/* 1. HERO — 밝은 주방 사진 위 반투명 안개, 흐린 빛 구체, 텍스처가 채워진 대형 제목 */}
      <Scrub as="section" data-service-section="hero" data-premium-hero className={s.hero}>
        <div className={s.heroBg}>
          <Image src="/images/sink-top-crack/hero-kitchen-studio.jpg" alt="" fill priority className="object-cover" sizes="100vw" />
        </div>
        <span className={`${s.orb} ${s.orbA}`} aria-hidden="true" />
        <span className={`${s.orb} ${s.orbB}`} aria-hidden="true" />
        <span className={`${s.orb} ${s.orbC}`} aria-hidden="true" />
        <span className={s.grain} aria-hidden="true" />
        <div className={s.heroTrail}>
          <LandingTrail field="repair" title="상판 크랙 수리" />
        </div>
        <p className={s.heroGhost} aria-hidden="true">
          RE&apos;STORY COUNTERTOP
        </p>

        <div className={`${s.wrap} ${s.heroInner}`}>
          <p className={`${s.heroEyebrow} ${s.heroFade}`}>
            {region ? `${region} 싱크대 상판 ${symptom}${symptom === "수리" ? "" : " 수리"}` : "리스토리 싱크대 상판 크랙 수리"}
          </p>
          <RiseLines onLoad as="h1" className={s.heroTitle} lines={heroTitle} />
          <p className={`${s.heroEn} ${s.heroFade}`} style={{ animationDelay: "0.25s" }}>
            Mend the line, keep the counter.
          </p>

          <div className={`${s.heroGlass} ${s.heroFade}`} style={{ animationDelay: "0.35s" }}>
            <p className={s.heroSub}>보수 가능한 상판은 크랙을 정리하고, 다시 사용할 수 있도록 마감합니다.</p>
            <ContactButtons cta="crack_request_hero" />
            <p className={s.heroHint}>전체 사진 + 크랙 가까운 사진 + 작업 지역을 보내주세요. 사진으로 수리 범위 · 견적 · 방문일을 확인합니다.</p>
            <dl className={s.heroFacts}>
              {[
                { n: "부분 보수", l: "살릴 수 있는 상판 · 상태별 범위 안내" },
                { n: "상담 견적", l: "현장별 수리비 · 재질·손상별 안내" },
                { n: "3년 무상", l: "시공 부위 A/S · 적용 조건 확인" },
              ].map((f) => (
                <div key={f.n}>
                  <dt>{f.n}</dt>
                  <dd>{f.l}</dd>
                </div>
              ))}
            </dl>
            <p className={s.heroHint}>크랙 정리·필요 부위 보강·표면 마감. 색상과 빛에 따라 보수 흔적이 남을 수 있습니다.</p>
            <div className={s.chipRow}>
              <a href="#crack-cases" className={s.arrowLink}>
                수리 전후 사진과 과정 보기
                <Arrow />
              </a>
              <a href="#crack-cost" className={s.arrowLink}>
                비용 범위·견적 기준 보기
                <Arrow />
              </a>
              <Link href="/cases/case-111" className={s.arrowLink}>
                청라 상판 크랙 수리 후 · 작업 과정 보기
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
        <div className={s.scrollCue} aria-hidden="true">
          SCROLL <span />
        </div>
      </Scrub>

      <LandingSections sections={[["crack-cases", "수리 전후"], ["crack-cost", "견적 기준"], ["crack-faq", "자주 묻는 질문"]]} />

      {/* ── 이하 본문: 뒤에 흐린 빛 구체가 떠다니고, 내용은 반투명 유리 카드 위에 ── */}
      <Scrub className={s.glassZone}>
        <div className={s.ambient} aria-hidden="true">
          <div className={s.ambientSticky}>
            <span className={`${s.ambientOrb} ${s.ambientOrb1}`} />
            <span className={`${s.ambientOrb} ${s.ambientOrb2}`} />
            <span className={`${s.ambientOrb} ${s.ambientOrb3}`} />
            <span className={s.grain} />
          </div>
        </div>

        {/* 2. 비용 범위 */}
        <section data-service-section="budget" id="crack-cost" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <div className={s.stickyCol}>
              <TitleCard kicker="비용 범위 · 부가세 별도" title="Price" as="p" />
            </div>
            <div className={s.glass}>
              <h2 className={s.title}>상판 크랙 수리 비용 범위</h2>
              <dl className={s.priceList} data-cols="1">
                <div className={s.priceRow}>
                  <dt>상판 크랙 수리</dt>
                  <dd>30~50만 원</dd>
                  <dd className={s.priceDesc}>부가세 별도 · 최종 금액은 상담 후 안내</dd>
                </div>
              </dl>
              <p className={s.body}>
                재질과 크랙의 길이·깊이·위치, 보강 필요 여부에 따라 상담이 필요합니다. 전체 사진과 크랙 가까운 사진, 작업 지역을 보내주시면 필요한 작업과 견적을 안내합니다.
              </p>
              <a href="#crack-details" className={s.arrowLink}>
                작업 범위·A/S 적용 조건 보기
                <Arrow />
              </a>
            </div>
          </div>
        </section>

        {/* 3. 사례 */}
        <section data-service-section="cases" id="crack-cases" className={s.section}>
          <div className={s.wrap}>
            <div className={s.split}>
              <TitleCard kicker="수리 전후" title="Before / After" />
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["갈라진 라인을 정리한", "수리 전후"]} />
                <p className={s.body}>
                  {region
                    ? regionalCases.length > 0
                      ? `${region} 지역에 공개된 실제 시공 사례 ${regionalCases.length}건을 먼저 보여드립니다. 다른 지역의 참고 사례는 별도로 표시했습니다.`
                      : `${region} 지역에 공개된 사례가 아직 없어, 다른 지역의 실제 수리 사례를 참고로 보여드립니다.`
                    : "싱크볼 옆 균열과 이음부 크랙을 수리한 사례입니다. 작업 전후 사진과 확인한 범위를 함께 살펴보세요."}
                </p>
                <p className={s.note}>사진은 해당 현장의 결과입니다. 재질·색상·균열 깊이에 따라 보수선과 색상 차이가 남을 수 있습니다.</p>
              </div>
            </div>
            <div className={s.caseList}>
              {featuredCases.map((item) => (
                <InView key={item.id} threshold={0.15}>
                  <article className={`${s.glass} ${s.workGlass} ${s.fade}`}>
                    <Link href={`/cases/${item.id}`} className={s.work}>
                      <div className={s.pairImg}>
                        {[
                          { label: "수리 전", src: item.beforeImg },
                          { label: "수리 후", src: item.afterImg },
                        ].map((photo) => (
                          <div key={photo.label} className={s.workImg}>
                            <Image src={photo.src} alt={`${item.title} ${photo.label}`} fill className="object-cover" sizes="(min-width: 768px) 480px, 50vw" />
                            <span className={s.pairTag} data-after={photo.label === "수리 후" || undefined}>
                              {photo.label}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className={s.workMeta}>
                        <span className={s.tag}>
                          {item.region} · {item.date.replaceAll("-", ".")}
                          {region && !item.region.includes(region) && " · 다른 지역 참고 사례"}
                        </span>
                        <h3 className={s.workTitle}>{item.title}</h3>
                        <p className={s.workSummary} data-full>
                          {item.summary}
                        </p>
                        <span className={`${s.arrowLink} ${s.workMore}`}>
                          원인과 수리 과정 보기
                          <Arrow />
                        </span>
                      </div>
                    </Link>
                    {item.review && (
                      <blockquote className={s.reviewQuote}>
                        <p className={s.note}>이 사례에 등록된 고객 후기 · {item.review.author}</p>
                        <p>“{item.review.content}”</p>
                      </blockquote>
                    )}
                  </article>
                </InView>
              ))}
            </div>
            <div className={s.afterCard}>
              <Link href={`/cases?cat=${encodeURIComponent("상판 크랙")}`} className={s.arrowLink}>
                상판 크랙 사례 전체 보기
                <Arrow />
              </Link>
            </div>
          </div>
        </section>

        {/* 거대한 회색 영문 */}
        <Scrub className={s.marquee} aria-hidden="true">
          <span className={s.marqueeLine}>Mend the line,</span>
          <span className={s.marqueeLine}>keep the counter.</span>
        </Scrub>

        {/* 4. 수리 범위 — 캐릭터 #1(공감) + 글리치 다이어그램 */}
        <section data-service-section="scope" className={s.section}>
          <div className={s.wrap}>
            <div className={s.split}>
              <div className={s.stickyCol}>
                <TitleCard kicker="수리 범위" title="Repair Scope" />
                <Mascot
                  src="/images/sink-top-crack/mascot-diagnose.png"
                  alt="돋보기로 싱크볼 옆 상판 크랙을 살피는 리스토리 기사 캐릭터"
                  width={1168}
                  height={880}
                  className={s.mascotDiagnose}
                  bubble="갈라진 위치부터 볼게요"
                />
              </div>
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["크랙의 위치부터,", "상판을 받치는 상태까지"]} />
                <p className={s.body}>
                  표면의 선만 보고 수리를 결정하지 않습니다. 상판을 다시 사용할 수 있는지와 어느 정도까지 마감할 수 있는지를 함께 확인합니다.
                </p>
                <div className={s.vennWrap}>
                  <GlitchDiagram
                    label="재질, 균열 위치와 깊이, 하부 지지 상태를 함께 봐야 상판을 다시 쓸 수 있습니다"
                    shapes={<VennShapes top={["MATERIAL", "재질"]} left={["CRACK", "균열"]} right={["SUPPORT", "하부 지지"]} core="Reuse" />}
                  />
                </div>
              </div>
            </div>
            <div className={`${s.glass} ${s.rowsCard}`}>
              <InView className={s.rows} as="ol" threshold={0.1}>
                {SCOPE_ITEMS.map((item) => (
                  <li key={item.n} className={`${s.row} ${s.fade}`}>
                    <span className={s.rowNum}>{item.n}</span>
                    <h3 className={s.rowTitle}>{item.title}</h3>
                    <p className={s.rowDesc}>{item.desc}</p>
                  </li>
                ))}
              </InView>
            </div>
            <div className={`${s.glass} ${s.afterCard}`}>
              <p className={s.rowTitle}>보수로 정리할 수 있는 범위부터 확인합니다.</p>
              <p className={s.body}>
                균열이 넓게 퍼졌거나 상판이 처지고 하부 손상이 크다면 보강이나 교체를 함께 검토해야 합니다. 수리 가능 여부와 예상 마감을 먼저 듣고 결정하세요.
              </p>
            </div>
          </div>
        </section>

        {/* 5. 비용·A/S 상세 */}
        <section data-service-section="warranty" id="crack-details" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <div className={s.stickyCol}>
              <TitleCard kicker="견적 기준과 A/S" title="Cost & Care" />
            </div>
            <div>
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["우리 집 상판 상태에 맞춰,", "작업 범위와 견적을 안내합니다"]} />
                <dl className={s.priceList} data-cols="2">
                  <div className={s.priceRow}>
                    <dt>상판 크랙 수리 비용</dt>
                    <dd>30~50만 원</dd>
                    <dd className={s.priceDesc}>
                      부가세 별도 · 상담 필요. 최종 금액은 재질과 크랙 길이·깊이·위치, 하부 보강 필요 여부를 보고 상담 후 안내합니다. 가려진 내부 상태는 현장에서 확인합니다.
                    </dd>
                  </div>
                  <div className={s.priceRow}>
                    <dt>방문 일정과 작업 시간</dt>
                    <dd className={s.priceValueSm}>작업 방법에 맞춰 안내</dd>
                    <dd className={s.priceDesc}>
                      예상 작업 시간과 수리 후 물 사용·하중을 가해도 되는 시점을 함께 확인하세요. 작업 지역과 상태를 보고 방문 일정을 상담합니다.
                    </dd>
                  </div>
                </dl>
              </div>
              <div className={`${s.glass} ${s.checkBox}`}>
                <h3>견적에서 확인할 작업</h3>
                <ul>
                  <li>크랙 부위 정리와 필요한 보강</li>
                  <li>표면 마감과 남을 수 있는 보수 흔적</li>
                  <li>하부 지지·누수 등 별도 작업 여부</li>
                </ul>
              </div>
              <div className={`${s.glass} ${s.checkBox}`}>
                <h3>작업 범위와 비용을 함께 확인하세요</h3>
                <p className={s.body}>
                  안내 비용은 부가세 별도입니다. 출장비 포함 여부와 수리 불가 시 비용 등 세부 조건, 별도 작업이 필요한 부분은 상담에서 함께 확인합니다.
                </p>
              </div>
              <div className={`${s.glass} ${s.checkBox}`}>
                <h3>시공 부위 3년 무상 A/S 안내</h3>
                <p className={s.body}>
                  작업일 기준으로 안내합니다. 수리한 부위 사진과 증상을 보내주세요. 정확한 적용 범위와 재손상 원인에 따른 처리 조건은 상담 시 확인합니다.
                </p>
                <div data-crack-contact>
                  <Link href={REQUEST_URL} className={s.arrowLink} data-cta="crack_request_as">
                    상판 사진으로 견적·A/S 조건 확인
                    <Arrow />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. 사진 상담 — 캐릭터 #2 (행동 유도) */}
        <section data-service-section="photo_guide" id="crack-consult" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <TitleCard kicker="사진 상담" title="Photo Consult" />
            <div className={s.glass}>
              <RiseLines className={s.title} lines={["사진을 보내면,", "세 가지를 안내합니다"]} />
              <InView className={`${s.rows} ${s.rowsCompact}`} as="ol" threshold={0.1}>
                {CONSULT_ITEMS.map((item) => (
                  <li key={item.n} className={`${s.row} ${s.fade}`}>
                    <span className={s.rowNum}>{item.n}</span>
                    <h3 className={s.rowTitle}>{item.title}</h3>
                    <p className={s.rowDesc}>{item.desc}</p>
                  </li>
                ))}
              </InView>
            </div>
          </div>
          <div className={s.wrap}>
            <div className={`${s.glass} ${s.afterCard}`}>
              <h3 className={s.title}>사진 두 장과 작업 지역을 보내주세요</h3>
              <ol className={`${s.rows} ${s.rowsCompact}`}>
                {PHOTO_STEPS.map((step) => (
                  <li key={step.n} className={s.row}>
                    <span className={s.rowNum}>{step.n}</span>
                    <h4 className={s.rowTitle}>{step.title}</h4>
                    <p className={s.rowDesc}>{step.desc}</p>
                  </li>
                ))}
              </ol>
              <p className={s.note}>
                재질 이름이나 정확한 치수를 몰라도 괜찮습니다. 보이는 상태부터 보내주세요. 균열 깊이와 하부 지지 상태는 현장 확인이 필요할 수 있습니다.
              </p>
            </div>
            <div data-crack-contact>
              <PhotoCtaCard
                title="사진 두 장이면 시작돼요"
                sub="상판 전체 + 크랙 가까이, 작업 지역만 보내주세요."
                href={REQUEST_URL}
                label={PHOTO_CTA}
                cta="crack_request_photo_guide"
              />
            </div>
            <p className={`${s.note} ${s.afterCard}`}>사진 상담 → 범위·예상 마감·견적·일정 안내 → 현장 확인 → 크랙 보수·마감</p>
          </div>
        </section>

        {/* 7. FAQ */}
        <section data-service-section="faq" id="crack-faq" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <div className={s.stickyCol}>
              <TitleCard kicker="자주 묻는 질문" title="FAQ" as="p" />
            </div>
            <div>
              <h2 className={`${s.title} ${s.faqHeading}`}>상담 전에 궁금한 점</h2>
              <FaqList items={FAQ_ITEMS} idPrefix="crack-faq" />
            </div>
          </div>
        </section>
      </Scrub>

      {/* 8. CONTACT — 캐릭터 #3 (마무리) */}
      <Scrub as="section" data-service-section="contact" className={s.contact}>
        <Star className={s.contactStar} />
        <div className={s.contactMascot}>
          <Image src="/images/premium/mascot-wave.png" alt="공구함을 들고 손을 흔드는 리스토리 기사 캐릭터" width={880} height={1168} sizes="(min-width: 900px) 360px, 150px" />
        </div>
        <div className={s.wrap} style={{ position: "relative" }}>
          <Link href={REQUEST_URL} className={s.contactBig} aria-label={PHOTO_CTA} data-cta="crack_request_contact_title">
            <RollText text="CONTACT" />
          </Link>
          <div className={s.split}>
            <p className={s.labelSmall} style={{ color: "rgba(255,255,255,0.7)" }}>
              싱크대 상판 크랙 수리 상담
            </p>
            <div>
              <h2 className={s.contactTitle}>
                전체 교체를 결정하기 전에,
                <br />
                지금 상판을 살릴 수 있는지 확인하세요.
              </h2>
              <p className={s.contactSub}>
                상판 전체와 크랙 가까운 사진, 작업 지역을 보내주세요. 수리 범위와 예상 마감, 견적·방문 일정을 안내합니다.
              </p>
              <ContactButtons onBlue cta="crack_request_contact" />
              <div className={s.chips}>
                {["30~50만 원 · 부가세 별도", "부분 보수", "3년 무상 A/S"].map((b) => (
                  <span key={b}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Scrub>

      <LandingIntake field="repair" service="counter" />
      <FloatingCTA
        compactMobile
        avoidOverlapSelector="[data-crack-contact]"
        label="사진으로 상판 수리 범위·견적 확인"
        kakaoUrl={REQUEST_URL}
        newTab={false}
      />
    </main>
  );
}
