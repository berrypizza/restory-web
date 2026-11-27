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
  YouTubeFacade,
  GlitchDiagram,
  VennShapes,
  Mascot,
  TitleCard,
  PhotoCtaCard,
  FaqList,
  RunCrew,
  BeforeAfterSlider,
} from "./premium/Blocks";
import { display } from "./premium/fonts";
import s from "./premium/premium.module.css";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const PHONE = buildTrackedContactPath("phone", "sangbujang");
// 사진 상담은 자체 접수 양식으로 (상부장 처짐 수리 항목이 미리 선택된 상태로 열림)
const REQUEST_URL = "/request?service=upper";
const PHOTO_CTA = "사진으로 수리 범위·비용 확인";
const SITE_URL = "https://www.restorystudio.co.kr";
type SangbujangCase = (typeof cases)[number];

const PRICE_EXAMPLES = [
  { condition: "일반적인 처짐", price: "25만 원" },
  { condition: "처짐·손상이 심한 경우", price: "30만 원" },
  { condition: "추락한 상부장 수리", price: "35만 원" },
];

const CASE_COMPARISONS: Record<string, { before: string; after: string; summary: string }> = {
  "case-128": {
    before: "왼쪽 장이 처지고 상단이 벌어진 상태",
    after: "보강·재설치 후 장 높이와 문짝 라인을 맞춘 상태",
    summary: "뒤쪽 시공목의 상태를 확인하고, 문제 부위를 보강해 다시 설치했습니다.",
  },
  "case-125": {
    before: "오른쪽 끝 상부장과 천장 사이에 생긴 틈",
    after: "재고정 후 벌어진 상단과 문짝 라인을 맞춘 상태",
    summary: "기존 장을 다시 사용할 수 있는지 확인한 뒤 고정 상태와 상단 라인을 정리했습니다.",
  },
};

const SCOPE_ITEMS = [
  {
    n: "01",
    title: "처짐 원인 확인",
    desc: "장을 내려 시공목, 벽 고정 상태, 장 몸통의 손상을 확인합니다. 문짝·경첩 문제와 장 전체의 처짐을 구분합니다.",
  },
  {
    n: "02",
    title: "필요한 부분 보강",
    desc: "상태에 따라 합판·각재·칼블럭·앙카 등을 사용해 지지부를 보강합니다. 사용 자재와 고정 방식은 현장마다 달라집니다.",
  },
  {
    n: "03",
    title: "재설치와 마무리",
    desc: "상부장을 다시 고정한 뒤 수평과 문짝 닫힘을 맞춥니다. 수리한 부분과 사용 시 살펴볼 부분을 함께 안내합니다.",
  },
];

const PHOTO_EXAMPLES = [
  { src: "/images/cases/case-128-before.jpg", title: "1. 전체 모습", desc: "주변 장과 높이를 비교할 수 있게 찍어주세요.", source: "인천 부평 · 시공 전", href: "/cases/case-128" },
  { src: "/images/cases/case-125-before.jpg", title: "2. 틈이 보이는 부분 · 가능할 때", desc: "벌어진 위치가 보이게 찍어주세요. 가까이 가기 어렵다면 전체 사진부터 보내주세요.", source: "서울 잠실 · 시공 전", href: "/cases/case-125" },
];

const FAQ_ITEMS = [
  {
    q: "상부장이 처졌는데 전체를 교체해야 하나요?",
    a: "꼭 전체를 교체해야 하는 것은 아닙니다.\n\n상부장 몸통의 파손이 심하지 않고 다시 힘을 받을 수 있는 상태라면, 기존 장을 내린 뒤 벽 고정 상태와 시공목을 확인하고 약해진 부분을 보강해 다시 설치할 수 있습니다.\n\n다만 판재가 넓게 터졌거나 물에 불어 강도가 떨어진 경우에는 기존 장을 살리기보다 새 상부장 제작이 필요할 수 있습니다. 사진으로 예상 범위를 먼저 확인하고, 정확한 상태는 현장에서 판단합니다.",
  },
  {
    q: "나사만 다시 박는 수리와 시공목 보강은 뭐가 다른가요?",
    a: "상부장이 처진 원인이 벽 뒤의 시공목이나 장 고정부 약화라면, 빠진 나사를 같은 자리에 다시 박는 것만으로는 충분한 고정력을 얻기 어려울 수 있습니다.\n\n리스토리 스튜디오는 상부장을 내려 실제 고정 상태를 확인하고, 필요한 경우 합판·각재·칼블럭·앙카 등을 사용해 힘을 받는 부분을 보강합니다.\n\n이후 상부장을 다시 설치하고 레이저로 수평과 문짝 닫힘 상태를 맞춥니다. 사용 자재와 고정 방식은 벽과 장의 구조에 따라 달라집니다.",
  },
  {
    q: "사진만 보내도 수리 가능 여부를 확인할 수 있나요?",
    a: "안전하게 찍을 수 있는 상부장 전체 사진부터 보내주세요. 가능하면 벌어지거나 처진 부분이 보이는 사진도 함께 보내주시면 예상 범위를 살피는 데 도움이 됩니다. 사진을 찍으려고 장을 움직이거나 무리하게 올라가지 마세요.\n\n사진과 함께 작업 지역, 문 걸림·틈 벌어짐·기울어짐 같은 현재 증상을 적어주세요.\n\n사진으로는 예상 범위를 먼저 안내합니다. 내부 파손 정도와 정확한 작업 범위는 현장 점검이나 상부장 분리 후 확인합니다.",
  },
  {
    q: "상부장 수리 비용과 작업 시간은 어떻게 되나요?",
    a: "상태별 비용 예시는 일반적인 처짐 25만 원, 처짐·손상이 심한 경우 30만 원, 추락한 상부장 수리 35만 원이며, 모두 부가세 별도입니다. 정액이나 최대 금액이 아닌 예시로, 상태와 파손 범위에 따라 달라질 수 있습니다. 필요한 작업과 최종 금액은 상담에서 확정하며, 확정한 금액은 이후 달라지지 않습니다.\n\n작업에는 상부장을 내린 뒤 고정 상태를 확인하고, 시공목과 약해진 부분을 보강한 후 재설치와 수평 조절을 진행하는 과정이 포함됩니다.\n\n일반적인 현장 작업 시간은 약 2시간으로, 상태와 작업 범위에 따라 달라질 수 있습니다. 방문일은 상담 후 조율합니다.",
  },
  {
    q: "상담 후 추가금이 생기거나, 수리가 불가능하면요?",
    a: "상담에서 확정한 수리 금액은 이후 달라지지 않습니다. 추락으로 파손된 부위에 추가 작업이 필요하다면, 그에 따른 추가금도 상담 시 미리 안내합니다.\n\n수리 불가로 판단된 경우에는 비용을 받지 않습니다.",
  },
  {
    q: "작업 전에 고객이 준비할 것은 무엇인가요?",
    a: "처짐이 심하거나 벽과의 틈이 벌어지는 상태라면 장을 당기거나 직접 분리하지 말고, 아래 공간의 사용을 피한 채 먼저 상담해주세요. 사진도 무리하게 올라가거나 장을 움직이지 않고 찍을 수 있는 위치에서 보내주세요.\n\n상부장 안의 물건을 비우거나 주변 물건을 옮기는 준비는 상태를 확인한 뒤 안내드립니다. 방문 전 준비 범위를 함께 확인해주세요.",
  },
  {
    q: "A/S 3년은 어떤 범위인가요?",
    a: "작업일 기준 3년 동안 리스토리 스튜디오가 보강하고 다시 고정한 시공 부위에 무상 A/S를 적용합니다.\n\n수리한 고정부위의 이탈이나 설치 상태, 수평 조절처럼 이번 시공과 직접 관련된 문제가 발생하면 사진을 먼저 확인한 뒤 필요한 조치를 안내합니다.\n\n외부 충격, 누수와 물먹음, 기존 상부장 판재의 추가 노후화, 고객 또는 다른 작업자가 임의로 분해·변경한 경우처럼 시공과 직접 관련이 없는 문제는 무상 A/S 범위에서 제외될 수 있습니다.",
  },
];

/* ─────────────────────────────────────────
   keyword → 지역·증상 파싱
───────────────────────────────────────── */
function parseKeyword(keyword: string): { region: string; symptom: string } {
  const kw = keyword.replace(/-/g, " ");
  const region = REGIONS.find((r) => kw.includes(r)) ?? "";
  const symptom = kw.includes("처짐")
    ? "처짐"
    : kw.includes("떨어짐")
      ? "떨어짐"
      : kw.includes("들뜸")
        ? "들뜸"
        : kw.includes("내려앉음")
          ? "내려앉음"
          : kw.includes("수리")
            ? "수리"
            : "처짐";
  return { region, symptom };
}

function RegionalCaseItemListJsonLd({ name, items }: { name: string; items: SangbujangCase[] }) {
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

/* 사진 접수 + 전화 버튼 한 줄 (하단 고정 버튼이 겹치지 않도록 data-upper-contact) */
function ContactButtons({ label = PHOTO_CTA, onBlue = false, cta }: { label?: string; onBlue?: boolean; cta: string }) {
  return (
    <div data-upper-contact className={s.btnRow}>
      <Link href={REQUEST_URL} className={onBlue ? s.btnOnBlue : s.btnPrimary} data-cta={cta}>
        <CameraIcon />
        {label}
      </Link>
      <a href={PHONE} className={onBlue ? s.btnGhost : s.btnDark}>
        <RollText text="전화 문의" />
        <Arrow />
      </a>
    </div>
  );
}

const latestSangbujangCases = cases
  .filter((item) => item.category === "상부장 처짐")
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default function SangbujangLanding({ keyword }: { keyword?: string }) {
  const { region, symptom } = keyword ? parseKeyword(keyword) : { region: "", symptom: "처짐" };
  const regionalCases = region ? latestSangbujangCases.filter((item) => item.region.includes(region)) : [];
  const regionalIds = new Set(regionalCases.map((item) => item.id));
  const featuredCases = region
    ? [
        ...regionalCases.slice(0, 3),
        ...latestSangbujangCases.filter((item) => !regionalIds.has(item.id)).slice(0, Math.max(0, 3 - regionalCases.length)),
      ]
    : latestSangbujangCases.slice(0, 3);

  // 기존 h1 문구를 줄 단위로 (줄마다 다른 텍스처가 채워짐)
  const heroTitle = region ? [`${region} 상부장 ${symptom}`, "다시 단단하게"] : ["처진 상부장,", "다시 단단하게"];

  return (
    <main data-service-id="sangbujang" data-service-keyword={keyword} className={`${s.page} ${display.variable}`}>
      <ServiceJsonLd
        name={region ? `${region} 싱크대 상부장 수리` : "싱크대 상부장 수리"}
        description="처진 상부장의 고정 상태를 확인하고 보강·재설치합니다. 상태별 비용 예시: 일반 처짐 25만 원, 심한 처짐·손상 30만 원, 추락 수리 35만 원. 모두 부가세 별도이며 상태와 파손 범위에 따라 달라질 수 있습니다. 상담에서 최종 금액을 확정하며 이후 금액 변경과 수리 불가 시 비용은 없습니다."
        url={`${SITE_URL}/repair/${keyword || "sangbujang"}`}
        includeAggregateRating={false}
      />
      <FAQJsonLd faqs={FAQ_ITEMS} />
      <RegionalCaseItemListJsonLd name={`${region ? `${region} 지역·` : ""}상부장 처짐 실제 수리 사례`} items={featuredCases} />

      {/* 1. HERO — 밝은 주방 사진 위 반투명 안개, 흐린 빛 구체, 텍스처가 채워진 대형 제목 */}
      <Scrub as="section" data-service-section="hero" data-premium-hero className={s.hero}>
        <div className={s.heroBg}>
          <Image src="/images/upper/hero-kitchen-studio.jpg" alt="" fill priority className="object-cover" sizes="100vw" />
        </div>
        <span className={`${s.orb} ${s.orbA}`} aria-hidden="true" />
        <span className={`${s.orb} ${s.orbB}`} aria-hidden="true" />
        <span className={`${s.orb} ${s.orbC}`} aria-hidden="true" />
        <span className={s.grain} aria-hidden="true" />
        <div className={s.heroTrail}>
          <LandingTrail field="repair" title="상부장 처짐 수리" />
        </div>
        <p className={s.heroGhost} aria-hidden="true">
          RE&apos;STORY UPPER CABINET
        </p>

        <div className={`${s.wrap} ${s.heroInner}`}>
          <p className={`${s.heroEyebrow} ${s.heroFade}`}>
            {region
              ? `${region} 싱크대 상부장 ${symptom}${symptom === "수리" ? "" : " 수리"}`
              : "리스토리 싱크대 상부장 처짐 수리"}
          </p>
          <RiseLines onLoad as="h1" className={s.heroTitle} lines={heroTitle} />
          {/* 실제 수리 전후 (부천 작동 상부장 추락, case-002) — 막대를 좌우로 끌어 비교 */}
          <div className={`${s.heroBa} ${s.heroFade}`} style={{ animationDelay: "0.2s" }}>
            <BeforeAfterSlider
              before="/images/cases/case-002-ba-before.jpg"
              after="/images/cases/case-002-ba-after.jpg"
              beforeAlt="부천 작동 상부장이 떨어진 주방"
              afterAlt="부천 작동 상부장을 다시 설치한 주방"
            />
          </div>

          <div className={`${s.heroGlass} ${s.heroFade}`} style={{ animationDelay: "0.35s" }}>
            <ContactButtons cta="upper_request_hero" />
          </div>
        </div>
        <div className={s.scrollCue} aria-hidden="true">
          SCROLL <span />
        </div>
      </Scrub>

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

        {/* 2. 비용 예시 */}
        <section data-service-section="budget" id="upper-price-examples" aria-labelledby="upper-price-heading" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <div className={s.stickyCol}>
              <TitleCard kicker="비용 예시 · 부가세 별도" title="Price" as="p" />
            </div>
            <div className={s.glass}>
              <h2 id="upper-price-heading" className={s.title}>
                상태별 수리 비용 예시
              </h2>
              <dl className={s.priceList}>
                {PRICE_EXAMPLES.map((item) => (
                  <div key={item.condition} className={s.priceRow}>
                    <dt>{item.condition}</dt>
                    <dd>{item.price}</dd>
                  </div>
                ))}
              </dl>
              <p className={s.body}>
                상태와 파손 범위에 따라 예시 금액과 달라질 수 있습니다. 필요한 작업과 최종 금액은 사진 상담으로 먼저 안내합니다.
              </p>
              <p className={s.strongNote}>
                상담에서 확정한 금액은 이후 변경하지 않습니다.
                <br />
                수리 불가로 판단되면 비용을 받지 않습니다.
              </p>
              <ContactButtons label="사진으로 우리 집 수리비 확인" cta="upper_request_price" />
            </div>
          </div>
        </section>

        <LandingSections sections={[["upper-cases", "시공 사례"], ["upper-cost", "비용·작업 범위"], ["upper-faq", "자주 묻는 질문"]]} />

        {/* 3. 사례 */}
        <section data-service-section="cases" id="upper-cases" className={s.section}>
          <div className={s.wrap}>
            <div className={s.split}>
              <TitleCard kicker="수리 전후" title="Before / After" />
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["다시 제자리를 찾은 상부장"]} />
                <p className={s.body}>
                  {region
                    ? regionalCases.length > 0
                      ? `${region} 지역에 공개된 실제 시공 사례 ${regionalCases.length}건 중 최근 작업을 먼저 보여드립니다. 다른 지역의 참고 사례는 별도로 표시했습니다.`
                      : `${region} 지역에 공개된 사례가 아직 없어, 다른 지역의 실제 수리 사례를 참고로 보여드립니다.`
                    : "처짐 위치와 원인은 현장마다 다릅니다. 실제 작업 전후 사진과 확인한 내용을 함께 살펴보세요."}
                </p>
              </div>
            </div>

            <div className={s.caseList}>
              {featuredCases.map((item, index) => {
                const cmp = CASE_COMPARISONS[item.id];
                return (
                  <InView key={item.id} threshold={0.15}>
                    <article className={`${s.glass} ${s.workGlass} ${s.fade}`}>
                      <Link href={`/cases/${item.id}`} className={s.work}>
                        <div className={s.pairImg}>
                          {[
                            { label: "수리 전", src: item.beforeImg, caption: cmp?.before },
                            { label: "수리 후", src: item.afterImg, caption: cmp?.after },
                          ].map((photo) => (
                            <figure key={photo.label}>
                              <div className={`${s.workImg} ${index === 0 ? s.workImgWide : ""}`}>
                                <Image
                                  src={photo.src}
                                  alt={`${item.title} ${photo.label}`}
                                  fill
                                  className="object-cover"
                                  style={index === 0 && item.id === "case-128" ? { transform: "scale(1.25)", transformOrigin: "45% 40%" } : undefined}
                                  sizes="(min-width: 768px) 480px, 50vw"
                                />
                                <span className={s.pairTag} data-after={photo.label === "수리 후" || undefined}>
                                  {photo.label}
                                </span>
                              </div>
                              {index === 0 && photo.caption && <figcaption className={s.pairCaption}>{photo.caption}</figcaption>}
                            </figure>
                          ))}
                        </div>
                        <div className={s.workMeta}>
                          {index === 0 && (
                            <p className={s.note}>
                              같은 현장의 실제 전후 사진입니다. 촬영 위치·각도는 서로 다릅니다.
                              {item.id === "case-128" && " 왼쪽 장이 잘 보이도록 확대했습니다."}
                            </p>
                          )}
                          <span className={s.tag}>
                            {item.region} · {item.date.replaceAll("-", ".")}
                            {region && !item.region.includes(region) && " · 다른 지역 참고 사례"}
                          </span>
                          <h3 className={s.workTitle}>{item.title}</h3>
                          <p className={s.workSummary} data-full>
                            {cmp?.summary ?? item.summary}
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
                );
              })}
            </div>
            <div className={s.afterCard}>
              <Link href={`/cases?cat=${encodeURIComponent("상부장 처짐")}`} className={s.arrowLink}>
                상부장 처짐 사례 전체 보기
                <Arrow />
              </Link>
            </div>
          </div>
        </section>

        {/* 거대한 회색 영문 */}
        <Scrub className={s.marquee} aria-hidden="true">
          <span className={s.marqueeLine}>Fix the hold,</span>
          <span className={s.marqueeLine}>keep the cabinet.</span>
        </Scrub>

        {/* 4. 수리 범위 — 캐릭터 #1(공감) + 글리치 다이어그램 */}
        <section data-service-section="scope" className={s.section}>
          <div className={s.wrap}>
            <div className={s.split}>
              <div className={s.stickyCol}>
                <TitleCard kicker="수리 범위" title="Repair Scope" />
                <Mascot
                  src="/images/upper/mascot-diagnose.png"
                  alt="처진 상부장을 손으로 받치며 뒤쪽 고정 상태를 살피는 리스토리 기사 캐릭터"
                  width={1168}
                  height={880}
                  className={s.mascotDiagnose}
                  bubble="뒤쪽 고정부터 볼게요"
                />
              </div>
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["겉의 틈부터,", "뒤쪽 고정까지"]} />
                <p className={s.body}>
                  틈만 가리는 것으로 끝내지 않고, 장이 힘을 받는 부분을 확인합니다. 벽과 장의 상태에 맞춰 보강 방법을 정합니다.
                </p>
                <div className={s.vennWrap}>
                  <GlitchDiagram
                    label="시공목, 벽 고정, 수평 조절이 함께 맞아야 상부장이 단단하게 고정됩니다"
                    shapes={<VennShapes top={["STUD", "시공목"]} left={["ANCHOR", "벽 고정"]} right={["LEVEL", "수평"]} core="Solid" />}
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
              <p className={s.rowTitle}>수리와 교체를 나누는 기준은 ‘기존 장의 상태’입니다.</p>
              <p className={s.body}>
                몸통이 다시 힘을 받을 수 있으면 보강 후 재설치를 검토합니다. 판재가 넓게 터졌거나 물에 불어 강도가 떨어졌다면 새 제작이 필요할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 5. 확정 금액과 A/S */}
        <section data-service-section="warranty" id="upper-cost" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <div className={s.stickyCol}>
              <TitleCard kicker="확정 금액과 A/S" title="Cost & Care" />
            </div>
            <div>
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["확정 금액과", "시공 후 A/S"]} />
                <p className={s.body}>
                  일반적인 현장 작업은 약 2시간입니다. 상태와 작업 범위에 따라 달라지며, 방문일은 상담 후 조율합니다.
                </p>
                <a href="#upper-price-examples" className={s.arrowLink}>
                  상태별 비용 예시 · 부가세 별도
                  <Arrow />
                </a>
              </div>
              <div className={`${s.glass} ${s.checkBox}`}>
                <h3>추락 파손 추가금은 미리 안내합니다</h3>
                <p className={s.body}>
                  추락한 상부장은 파손 부위에 따라 추가금이 있을 수 있습니다. 추가 작업과 금액은 상담 시 미리 안내하며, 상담 후 금액은 변경되지 않습니다.
                </p>
                <p className={s.strongNote}>수리 불가로 판단된 경우에는 비용을 받지 않습니다.</p>
              </div>
              <div className={`${s.glass} ${s.checkBox}`}>
                <h3>이번에 보강·재고정한 시공 부위, 3년 무상 A/S</h3>
                <p className={s.body}>
                  작업일 기준으로 적용합니다. 수리한 고정부의 이탈, 설치 상태, 수평 조절 등 이번 시공과 직접 관련된 문제를 확인합니다.
                </p>
                <p className={s.note}>
                  외부 충격·누수·물먹음·기존 판재의 추가 노후화·임의 분해나 변경처럼 시공과 직접 관련 없는 문제는 제외될 수 있습니다.
                </p>
                <div data-upper-contact>
                  <Link href={REQUEST_URL} className={s.arrowLink} data-cta="upper_request_as">
                    수리한 부위 사진으로 A/S 문의
                    <Arrow />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. 사진 가이드 — 캐릭터 #2 (행동 유도) */}
        <section data-service-section="photo_guide" id="upper-photo-guide" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <TitleCard kicker="사진 상담" title="Photo Guide" />
            <div className={s.glass}>
              <RiseLines className={s.title} lines={["사진은 이렇게 보내주세요"]} />
              <p className={s.body}>
                안전하게 찍을 수 있는 전체 사진부터 보내주세요. 가능하면 틈이 보이는 사진도 함께 보내주시면 상태를 살피는 데 도움이 됩니다.
              </p>
            </div>
          </div>
          <div className={s.wrap}>
            <div className={`${s.works} ${s.afterCard}`}>
              {PHOTO_EXAMPLES.map((photo) => (
                <figure key={photo.src} className={`${s.glass} ${s.workGlass}`}>
                  <div className={`${s.workImg} ${s.workImgWide}`}>
                    <Image src={photo.src} alt={`${photo.source} 사진으로 보여주는 ${photo.title} 촬영 예시`} fill sizes="(min-width: 768px) 480px, 100vw" className="object-cover" />
                  </div>
                  <figcaption className={s.workMeta}>
                    <h3 className={s.rowTitle}>{photo.title}</h3>
                    <p className={s.rowDesc}>{photo.desc}</p>
                    <Link href={photo.href} className={`${s.arrowLink} ${s.workMore}`}>
                      {photo.source} 사례 보기
                      <Arrow />
                    </Link>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className={`${s.note} ${s.afterCard}`}>서로 다른 실제 시공 전 사진을 촬영 구도 예시로 사용했습니다.</p>
            <div className={`${s.glass} ${s.afterCard}`}>
              <h3 className={s.rowTitle}>사진과 함께 작업 지역·증상을 적어주세요</h3>
              <p className={s.body}>예시: 인천 부평 / 왼쪽 장과 천장 사이에 틈이 있어요 / 어제 발견했어요.</p>
              <p className={s.note}>
                처짐이 심하다면 장을 당기거나 직접 분리하지 마세요. 아래 공간의 사용을 피하고, 올라가거나 장을 움직이지 않아도 찍을 수 있는 사진으로 먼저 상담해주세요.
              </p>
            </div>
            <div data-upper-contact>
              <PhotoCtaCard
                title="전체 사진 한 장이면 시작돼요"
                sub="안전하게 찍은 전체 사진과 작업 지역·증상만 보내주세요."
                href={REQUEST_URL}
                label={PHOTO_CTA}
                cta="upper_request_photo_guide"
              />
            </div>
            <p className={`${s.note} ${s.afterCard}`}>
              사진으로 예상 범위를 살핀 뒤 수리 금액·방문일을 상담합니다. 내부 파손과 정확한 작업 범위는 현장 점검 또는 장 분리 후 확인합니다.
            </p>
          </div>
        </section>

        {/* 7. 영상 */}
        <section data-service-section="video" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <div className={s.stickyCol}>
              <TitleCard kicker="현장 영상" title="On Site" />
            </div>
            <div className={s.glass}>
              <RiseLines className={s.title} lines={["실제 수리 과정을 확인하세요"]} />
              <p className={s.body}>
                상부장을 내리고 보강해 다시 설치하는 현장 영상입니다. 작업 방법은 각 현장의 상태에 따라 달라집니다.
              </p>
              <YouTubeFacade videoId="tDAtB2ClG08" title="리스토리 상부장 수리 시공 영상" label="상부장 실제 시공 영상 재생" />
            </div>
          </div>
        </section>

        {/* 8. FAQ */}
        <section data-service-section="faq" id="upper-faq" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <div className={s.stickyCol}>
              <TitleCard kicker="자주 묻는 질문" title="FAQ" as="p" />
            </div>
            <div>
              <h2 className={`${s.title} ${s.faqHeading}`}>상담 전에 궁금한 점</h2>
              <FaqList items={FAQ_ITEMS} idPrefix="upper-faq" />
              <div className={`${s.glass} ${s.afterCard}`}>
                <h3 className={s.rowTitle}>함께 불편한 싱크대 문제도 알려주세요</h3>
                <p className={s.body}>
                  하부장 밑판 물먹음, 문짝·경첩, 서랍 레일 문제도 사진을 미리 보내주세요. 같은 날 확인 가능한 범위와 별도 작업이 필요한 범위를 나눠 안내드립니다.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Scrub>

      {/* 9. CONTACT — 캐릭터 #3 (마무리) */}
      <Scrub as="section" data-service-section="contact" className={s.contact}>
        <Star className={s.contactStar} />
        <RunCrew />
        <div className={s.wrap} style={{ position: "relative" }}>
          <Link href={REQUEST_URL} className={s.contactBig} aria-label={PHOTO_CTA} data-cta="upper_request_contact_title">
            <RollText text="CONTACT" />
          </Link>
          <div className={s.split}>
            <p className={s.labelSmall} style={{ color: "rgba(255,255,255,0.7)" }}>
              {region ? `${region} 상부장 수리 상담` : "상부장 수리 상담"}
            </p>
            <div>
              <h2 className={s.contactTitle}>
                교체를 결정하기 전에,
                <br />
                살릴 수 있는 상태인지 확인하세요.
              </h2>
              <p className={s.contactSub}>
                전체 사진과 작업 지역부터 보내주세요. 수리 범위를 먼저 살피고, 금액과 방문일을 상담해 확정합니다.
              </p>
              <ContactButtons onBlue cta="upper_request_contact" />
              <div className={s.chips}>
                {["고정 보강", "현장 작업 약 2시간", "3년 무상 A/S", "수리 불가 시 비용 없음"].map((b) => (
                  <span key={b}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Scrub>

      <LandingIntake field="repair" service="upper" />
      <FloatingCTA compactMobile avoidOverlapSelector="[data-upper-contact]" label={PHOTO_CTA} kakaoUrl={REQUEST_URL} newTab={false} />
    </main>
  );
}
