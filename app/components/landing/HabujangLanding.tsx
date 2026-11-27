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
  RunCrew,
} from "./premium/Blocks";
import { display } from "./premium/fonts";
import s from "./premium/premium.module.css";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const PHONE = buildTrackedContactPath("phone", "habujang");
// 사진 상담은 자체 접수 양식으로 (하부장 밑판 교체 항목이 미리 선택된 상태로 열림)
const REQUEST_URL = "/request?service=lower";
const PHOTO_CTA = "사진으로 교체 범위·견적 확인";
const SITE_URL = "https://www.restorystudio.co.kr";
type HabujangCase = (typeof cases)[number];

const FAQ_ITEMS = [
  {
    q: "밑판만 교체할 수 있는 상태는 어떤 경우인가요?",
    a: "장 몸통과 옆판을 사용할 수 있고 손상이 밑판에 집중되어 있다면, 손상된 밑판만 교체하는 방법을 검토할 수 있습니다.\n\n옆판이나 지지부까지 물에 불었거나 배관 주변 손상이 넓다면 추가 보강 또는 장 교체가 필요할 수 있습니다. 사진으로 예상 범위를 먼저 살피고, 정확한 상태는 현장에서 확인합니다.",
  },
  {
    q: "하부장 밑판 교체 비용은 얼마인가요?",
    a: "하부장은 현장마다 상태가 달라 상담 후 개별 견적을 안내합니다. 정해진 단일 가격이나 일괄 가격 범위로 안내하지 않습니다.\n\n밑판 크기와 손상 범위, 배관·지지대 구조, 옆판과 몸통의 상태를 함께 확인합니다. 하부장 내부 전체 사진과 손상 부위 사진, 작업 지역을 보내주세요. 적용 자재와 작업 범위, 금액 및 부가세·출장비 등 포함 항목은 상담에서 확인해주세요.",
  },
  {
    q: "물이 새고 있는데 밑판만 바꾸면 되나요?",
    a: "밑판 교체와 누수 원인 수리는 서로 다른 작업입니다. 물이 계속 닿는 상태라면 새 밑판도 다시 손상될 수 있으므로, 물이 새는 원인과 처리 여부를 함께 확인해야 합니다.\n\n현재 물이 새는지, 누수 수리를 이미 받았는지 상담할 때 알려주세요. 배관 수리가 필요한 경우 밑판 교체와 별도로 작업 범위와 순서를 확인합니다.",
  },
  {
    q: "작업 시간과 방문 일정은 어떻게 되나요?",
    a: "일반적인 밑판 교체 현장 작업은 약 1~2시간입니다. 손상 범위와 배관 구조, 추가 작업 여부에 따라 달라질 수 있습니다.\n\n약 1~2시간은 방문을 기다리는 시간이 아닌 현장 작업 시간입니다. 방문 가능한 날짜와 작업 후 수납장을 사용할 시점은 상담과 현장 안내를 통해 확인해주세요.",
  },
  {
    q: "사진은 어떻게 보내면 되나요?",
    a: "문을 연 상태의 하부장 내부 전체 사진 1장과, 부풀거나 부스러진 밑판을 가까이 찍은 사진 1장을 보내주세요. 배관과 옆판도 보이면 예상 범위를 살피는 데 도움이 됩니다.\n\n작업 지역, 현재 누수 여부, 밑판 크기를 알고 있다면 함께 알려주세요. 정확한 치수를 모르더라도 보이는 상태부터 상담할 수 있습니다.",
  },
  {
    q: "3년 무상 A/S는 어떤 조건인가요?",
    a: "밑판 교체 시공에 대해 3년 무상 A/S를 안내합니다. 재파손이나 들뜸이 생기면 시공 부위 사진과 증상을 보내주세요.\n\n현재 누수 여부와 손상 원인에 따라 확인할 내용이 달라집니다. 적용 부위, 누수로 다시 손상된 경우 등 세부 조건은 상담 시 확인해주세요. 모든 원인의 손상을 무조건 무상 재시공한다는 의미는 아닙니다.",
  },
  {
    q: "상부장이나 경첩도 함께 수리할 수 있나요?",
    a: "상부장 처짐, 문짝·경첩, 서랍 레일 등 함께 불편한 부분도 사진을 보내주세요. 같은 방문에서 작업할 수 있는지, 별도 작업이 필요한지와 비용을 상담합니다.\n\n방문 전에는 안내받은 범위에 맞춰 하부장 안의 수납물을 옮기고 작업 공간을 준비해주세요.",
  },
];

const SCOPE_ITEMS = [
  { n: "01", title: "손상 범위 확인", desc: "밑판의 물먹음·부풀음과 옆판·지지부 상태를 살핍니다. 현재 누수가 있는지도 함께 확인합니다." },
  { n: "02", title: "철거와 새 밑판 설치", desc: "손상된 밑판을 제거하고 배관·지지대 구조에 맞춰 새 밑판을 설치합니다. 자재와 작업 방법은 현장에 맞춰 안내합니다." },
  { n: "03", title: "마감과 현장 정리", desc: "설치 상태와 마감을 확인하고 작업 공간을 정리합니다. 수납장을 다시 사용할 때 확인할 사항도 안내합니다." },
];

const CONSULT_ITEMS = [
  { n: "01", title: "밑판만 교체 가능한지", desc: "장 몸통을 살릴 수 있는지, 옆판이나 배관 주변도 확인해야 하는지 예상 범위를 짚어드립니다." },
  { n: "02", title: "우리 집 상태에 맞는 견적", desc: "크기와 손상 상태, 필요한 자재·작업을 보고 비용을 상담합니다. 일괄 가격 대신 현장별로 안내합니다." },
  { n: "03", title: "방문 가능한 일정", desc: "작업 지역과 현재 누수 여부를 보고 방문 가능 일정과 준비할 내용을 안내합니다." },
];

const PHOTO_STEPS = [
  { n: "1", title: "문을 연 하부장 전체", desc: "밑판, 옆판, 배관 위치가 함께 보이게 찍어주세요." },
  { n: "2", title: "부풀거나 부스러진 부분", desc: "가까이 찍은 사진으로 손상 위치와 범위를 보여주세요." },
  { n: "3", title: "작업 지역과 누수 여부", desc: "지금 물이 새는지, 누수 수리를 받았는지도 알려주세요." },
];

function parseKeyword(keyword: string): { region: string; symptom: string } {
  const kw = keyword.replace(/-/g, " ");
  const region = REGIONS.find((r) => kw.includes(r)) ?? "";
  const symptom = kw.includes("물먹음") ? "물먹음" : kw.includes("썩음") ? "썩음" : kw.includes("곰팡이") ? "곰팡이" : kw.includes("밑판") ? "밑판 교체" : "수리";
  return { region, symptom };
}

function RegionalCaseItemListJsonLd({ name, items }: { name: string; items: HabujangCase[] }) {
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

/* 사진 접수 + 전화 버튼 한 줄 (하단 고정 버튼이 겹치지 않도록 data-lower-contact) */
function ContactButtons({ onBlue = false, cta }: { onBlue?: boolean; cta: string }) {
  return (
    <div data-lower-contact className={s.btnRow}>
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

const latestHabujangCases = cases
  .filter((item) => item.category === "하부장 밑판 교체")
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default function HabujangLanding({ keyword }: { keyword?: string }) {
  const { region, symptom } = keyword ? parseKeyword(keyword) : { region: "", symptom: "" };
  const regionalCases = region ? latestHabujangCases.filter((item) => item.region.includes(region)) : [];
  const featuredCases = [...regionalCases, ...latestHabujangCases.filter((item) => !regionalCases.includes(item))].slice(0, 3);

  // 기존 h1 문구를 줄 단위로 (줄마다 다른 텍스처가 채워짐)
  const heroTitle = region ? [`${region} 하부장,`, "수납 공간을 다시"] : ["물 먹은 밑판,", "다시 쓰는 수납장"];

  return (
    <main data-service-id="habujang" data-service-keyword={keyword} className={`${s.page} ${display.variable}`}>
      <ServiceJsonLd
        name={region ? `${region} 싱크대 하부장 밑판 교체` : "싱크대 하부장 밑판 교체"}
        description="기존 장의 상태를 확인해 손상된 하부장 밑판을 교체합니다. 비용은 현장별 상담 견적으로 안내하며, 사진으로 교체 가능 범위·견적·방문 일정을 확인합니다."
        url={`${SITE_URL}/repair/${keyword || "habujang"}`}
        includeAggregateRating={false}
      />
      <FAQJsonLd faqs={FAQ_ITEMS} />
      <RegionalCaseItemListJsonLd name={region ? `${region} 하부장 밑판 교체 참고 사례` : "하부장 밑판 교체 실제 사례"} items={featuredCases} />

      {/* 1. HERO — 밝은 주방 사진 위 반투명 안개, 흐린 빛 구체, 텍스처가 채워진 대형 제목 */}
      <Scrub as="section" data-service-section="hero" data-premium-hero className={s.hero}>
        <div className={s.heroBg}>
          <Image src="/images/habujang/hero-kitchen-studio.jpg" alt="" fill priority className="object-cover" sizes="100vw" />
        </div>
        <span className={`${s.orb} ${s.orbA}`} aria-hidden="true" />
        <span className={`${s.orb} ${s.orbB}`} aria-hidden="true" />
        <span className={`${s.orb} ${s.orbC}`} aria-hidden="true" />
        <span className={s.grain} aria-hidden="true" />
        <div className={s.heroTrail}>
          <LandingTrail field="repair" title="하부장 밑판 교체" />
        </div>
        <p className={s.heroGhost} aria-hidden="true">
          RE&apos;STORY LOWER CABINET
        </p>

        <div className={`${s.wrap} ${s.heroInner}`}>
          <p className={`${s.heroEyebrow} ${s.heroFade}`}>
            {region ? `${region} 하부장 ${symptom}` : "리스토리 하부장 밑판 교체"}
          </p>
          <RiseLines onLoad as="h1" className={s.heroTitle} lines={heroTitle} />
          <p className={`${s.heroEn} ${s.heroFade}`} style={{ animationDelay: "0.25s" }}>
            Keep the cabinet, renew the floor.
          </p>

          <div className={`${s.heroGlass} ${s.heroFade}`} style={{ animationDelay: "0.35s" }}>
            <p className={s.heroSub}>장 몸통을 살릴 수 있다면, 손상된 밑판만 교체해 마감합니다.</p>
            <ContactButtons cta="lower_request_hero" />
            <p className={s.heroHint}>내부 전체 + 손상 부위 사진 + 작업 지역을 보내주세요. 사진으로 교체 범위 · 견적 · 방문일을 확인합니다.</p>
            <dl className={s.heroFacts}>
              {[
                { n: "상담 견적", l: "현장별 수리비 · 크기·손상별 안내" },
                { n: "약 1~2시간", l: "일반 현장 작업 · 범위에 따라 상이" },
                { n: "3년 무상", l: "시공 A/S · 적용 조건 확인" },
              ].map((f) => (
                <div key={f.n}>
                  <dt>{f.n}</dt>
                  <dd>{f.l}</dd>
                </div>
              ))}
            </dl>
            <p className={s.heroHint}>
              손상 밑판 철거·새 밑판 설치·마감·정리. 사진으로 교체 가능 범위부터 확인합니다. 누수·몸통 손상이 있다면 별도 작업도 확인합니다.
            </p>
            <a href="#lower-cost" className={s.arrowLink}>
              견적 기준·A/S 안내 자세히 보기
              <Arrow />
            </a>
          </div>
        </div>
        <div className={s.scrollCue} aria-hidden="true">
          SCROLL <span />
        </div>
      </Scrub>

      <LandingSections sections={[["lower-cases", "시공 사례"], ["lower-cost", "견적 기준"], ["lower-faq", "자주 묻는 질문"]]} />

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

        {/* 2. 사례 */}
        <section data-service-section="cases" id="lower-cases" className={s.section}>
          <div className={s.wrap}>
            <div className={s.split}>
              <TitleCard kicker="수리 전후" title="Before / After" />
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["다시 사용할 수 있게 된", "수납 공간"]} />
                <p className={s.body}>
                  {region
                    ? regionalCases.length > 0
                      ? `${region} 지역에 공개된 실제 시공 사례 ${regionalCases.length}건 중 최근 작업을 먼저 보여드립니다. 다른 지역의 참고 사례는 별도로 표시했습니다.`
                      : `${region} 지역에 공개된 사례가 아직 없어, 다른 지역의 실제 수리 사례를 참고로 보여드립니다.`
                    : "밑판의 손상 범위와 장 구조는 현장마다 다릅니다. 실제 작업 전후 사진과 확인한 내용을 함께 살펴보세요."}
                </p>
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
              <Link href={`/cases?cat=${encodeURIComponent("하부장 밑판 교체")}`} className={s.arrowLink}>
                하부장 밑판 교체 사례 전체 보기
                <Arrow />
              </Link>
            </div>
          </div>
        </section>

        {/* 거대한 회색 영문 */}
        <Scrub className={s.marquee} aria-hidden="true">
          <span className={s.marqueeLine}>Keep the cabinet,</span>
          <span className={s.marqueeLine}>renew the floor.</span>
        </Scrub>

        {/* 3. 수리 범위 — 캐릭터 #1(공감) + 글리치 다이어그램 */}
        <section data-service-section="scope" className={s.section}>
          <div className={s.wrap}>
            <div className={s.split}>
              <div className={s.stickyCol}>
                <TitleCard kicker="수리 범위" title="Repair Scope" />
                <Mascot
                  src="/images/habujang/mascot-diagnose.png"
                  alt="열린 하부장 안의 부푼 밑판을 손전등으로 살피는 리스토리 기사 캐릭터"
                  width={1168}
                  height={880}
                  className={s.mascotDiagnose}
                  bubble="밑판 상태부터 살펴볼게요"
                />
              </div>
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["살릴 장은 남기고,", "손상된 밑판부터 교체합니다"]} />
                <p className={s.body}>
                  겉을 덮기 전에 밑판과 장 몸통의 상태를 살핍니다. 배관과 지지대 위치에 맞춰 새 밑판을 설치하고 수납 공간을 마감합니다.
                </p>
                <div className={s.vennWrap}>
                  <GlitchDiagram
                    label="밑판, 배관, 옆판 상태를 함께 확인해야 수납장을 다시 쓸 수 있습니다"
                    shapes={<VennShapes top={["PANEL", "밑판"]} left={["PIPE", "배관"]} right={["SIDE", "옆판"]} core="Reuse" />}
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
              <p className={s.rowTitle}>밑판 교체와 누수 원인 수리는 다릅니다.</p>
              <p className={s.body}>
                물이 계속 닿으면 새 밑판도 다시 손상될 수 있습니다. 누수 처리 여부와 장 몸통의 손상을 함께 확인해 작업 범위와 순서를 정합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 4. 견적 기준과 A/S */}
        <section data-service-section="budget" id="lower-cost" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <div className={s.stickyCol}>
              <TitleCard kicker="견적 기준과 A/S" title="Cost & Care" />
            </div>
            <div>
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["하부장은 상태가 달라,", "견적도 상담으로 정합니다"]} />
                <dl className={s.priceList} data-cols="2">
                  <div className={s.priceRow}>
                    <dt>하부장 밑판 교체 비용</dt>
                    <dd>현장별 상담 견적</dd>
                    <dd className={s.priceDesc}>밑판 크기·손상 범위·배관 구조를 확인해 안내합니다. 사진으로 예상 범위를 살피고, 현장에서 내부 상태를 확인합니다.</dd>
                  </div>
                  <div className={s.priceRow}>
                    <dt>일반적인 현장 작업 시간</dt>
                    <dd>약 1~2시간</dd>
                    <dd className={s.priceDesc}>범위와 구조, 추가 작업에 따라 달라집니다. 방문 가능한 날짜는 작업 지역과 함께 상담합니다.</dd>
                  </div>
                </dl>
              </div>
              <div className={`${s.glass} ${s.checkBox}`}>
                <h3>견적에서 확인할 기본 작업</h3>
                <ul>
                  <li>손상 밑판 철거와 내부 상태 확인</li>
                  <li>새 밑판 자재·설치·마감</li>
                  <li>작업 공간 정리</li>
                </ul>
              </div>
              <div className={`${s.glass} ${s.checkBox}`}>
                <h3>별도 범위를 확인할 부분</h3>
                <p className={s.body}>
                  배관 누수 수리, 옆판·몸통 보강, 다른 장의 손상은 밑판 교체와 함께 범위를 확인해야 합니다. 부가세·출장비 등 비용에 포함되는 항목도 상담에서 확인해주세요.
                </p>
              </div>
              <div className={`${s.glass} ${s.checkBox}`}>
                <h3>3년 무상 A/S 안내</h3>
                <p className={s.body}>
                  교체한 밑판의 재파손·들뜸 등 문제가 생기면 사진과 증상을 보내주세요. 적용 부위와 누수로 다시 손상된 경우 등 세부 조건은 상담 시 확인합니다.
                </p>
                <div data-lower-contact>
                  <Link href={REQUEST_URL} className={s.arrowLink} data-cta="lower_request_as">
                    밑판 사진으로 견적·A/S 조건 확인
                    <Arrow />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. 사진 상담 — 캐릭터 #2 (행동 유도) */}
        <section data-service-section="photo_guide" id="lower-consult" className={s.section}>
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
              <p className={s.note}>
                사진에서는 보이는 상태를 먼저 확인합니다. 가려진 내부 손상과 정확한 교체 범위는 현장 확인이 필요할 수 있습니다.
              </p>
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
              <p className={s.note}>정확한 치수를 몰라도 괜찮습니다. 보이는 상태부터 보내주세요.</p>
            </div>
            <div data-lower-contact>
              <PhotoCtaCard
                title="사진 두 장이면 시작돼요"
                sub="문을 연 하부장 전체 + 손상 부위 가까이, 작업 지역만 보내주세요."
                href={REQUEST_URL}
                label={PHOTO_CTA}
                cta="lower_request_photo_guide"
              />
            </div>
            <p className={`${s.note} ${s.afterCard}`}>사진 상담 → 작업 범위·견적·방문일 안내 → 현장 확인 → 밑판 교체·마감</p>
          </div>
        </section>

        {/* 6. FAQ */}
        <section data-service-section="faq" id="lower-faq" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <div className={s.stickyCol}>
              <TitleCard kicker="자주 묻는 질문" title="FAQ" as="p" />
            </div>
            <div>
              <h2 className={`${s.title} ${s.faqHeading}`}>상담 전에 궁금한 점</h2>
              <FaqList items={FAQ_ITEMS} idPrefix="lower-faq" />
            </div>
          </div>
        </section>
      </Scrub>

      {/* 7. CONTACT — 캐릭터 #3 (마무리) */}
      <Scrub as="section" data-service-section="contact" className={s.contact}>
        <Star className={s.contactStar} />
        <RunCrew />
        <div className={s.wrap} style={{ position: "relative" }}>
          <Link href={REQUEST_URL} className={s.contactBig} aria-label={PHOTO_CTA} data-cta="lower_request_contact_title">
            <RollText text="CONTACT" />
          </Link>
          <div className={s.split}>
            <p className={s.labelSmall} style={{ color: "rgba(255,255,255,0.7)" }}>
              하부장 밑판 교체 상담
            </p>
            <div>
              <h2 className={s.contactTitle}>
                전체 교체를 결정하기 전에,
                <br />
                밑판만 교체할 수 있는지 확인하세요.
              </h2>
              <p className={s.contactSub}>
                내부 전체와 손상 부위 사진, 작업 지역을 보내주세요. 우리 집 상태에 맞는 교체 범위와 견적, 방문 일정을 안내합니다.
              </p>
              <ContactButtons onBlue cta="lower_request_contact" />
              <div className={s.chips}>
                {["현장별 상담 견적", "현장 작업 약 1~2시간", "3년 무상 A/S"].map((b) => (
                  <span key={b}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Scrub>

      <LandingIntake field="repair" service="lower" />
      <FloatingCTA compactMobile avoidOverlapSelector="[data-lower-contact]" label={PHOTO_CTA} kakaoUrl={REQUEST_URL} newTab={false} />
    </main>
  );
}
