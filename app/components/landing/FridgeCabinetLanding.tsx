"use client";

import { LandingTrail, LandingIntake } from "./shared/LandingNavigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FloatingCTA from "@/app/components/landing/shared/FloatingCTA";
import { FAQJsonLd, ServiceJsonLd } from "@/app/components/JsonLd";
import { buildTrackedContactPath } from "@/lib/attribution";
import { cases } from "@/lib/case-data";
import { REGIONS } from "@/lib/seo-regions";
import { Scrub, InView, InkText, RiseLines, RollText } from "./premium/Motion";
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
} from "./premium/Blocks";
import { display } from "./premium/fonts";
import s from "./premium/premium.module.css";

const PHONE = buildTrackedContactPath("phone", "fridge_cabinet");
// 사진 상담은 자체 접수 양식으로 (냉장고장 리폼 항목이 미리 선택된 상태로 열림)
const REQUEST_URL = `/request?item=${encodeURIComponent("냉장고장 리폼")}`;
const PHOTO_CTA = "사진 2장으로 예상 견적 받기";
const REAL_VIDEO_ID = "sydwgU5o4DY";
const MAIN_IMAGE = "/images/fridge-cabinet/refmain.png";
const REVIEW_BADGE_IMAGE = "/images/door/before-after-review-badge.png";
const CHAT_CONSULT_EXAMPLE_IMAGE = "/images/door/chat-consult-example-safe.webp";
const VISIT_MEASUREMENT_IMAGE = "/images/door/visit-measurement.webp";
const REAL_SAMPLE_CHECK_IMAGE = "/images/door/real-sample-check.webp";
const CUSTOM_PRODUCTION_IMAGE = "/images/door/factory-direct.gif";
const FIELD_INSTALLATION_IMAGE = "/images/door/field-installation.webp";

const WHY_ITEMS = [
  { n: "01", title: "주방 전체 공사까지는 부담스러울 때", desc: "상판과 몸통은 쓸 수 있지만, 냉장고장 전면만 오래돼 보일 때." },
  { n: "02", title: "냉장고장 색상만 따로 튀어 보일 때", desc: "싱크대 문짝과 냉장고장 톤이 맞지 않아 주방이 어수선해 보일 때." },
  { n: "03", title: "빌트인 느낌으로 정돈하고 싶을 때", desc: "냉장고 주변 수납장과 패널을 맞춰 한 덩어리처럼 보이게 하고 싶을 때." },
  { n: "04", title: "사용 가능한 구조는 그대로 살리고 싶을 때", desc: "멀쩡한 몸통은 두고 눈에 보이는 문짝·패널 중심으로 바꾸고 싶을 때." },
];

const PROCESS_STEPS = [
  {
    step: "02",
    title: "방문 실측",
    badge: "규격 확인",
    desc: "예상 범위를 확인한 뒤 방문 일정을 잡습니다. 현장에서 냉장고장 문짝·패널 크기, 경첩 위치, 몰딩과 마감 범위를 정확하게 측정합니다.",
    note: "기존 냉장고장 몸통을 그대로 사용할 수 있는지도 함께 확인합니다.",
    image: VISIT_MEASUREMENT_IMAGE,
    imageAlt: "현장에서 냉장고장 리폼 범위를 실측하는 모습",
    imageRatio: "4 / 3",
  },
  {
    step: "2-1",
    title: "실제 샘플 눈으로 확인",
    badge: "실물 확인",
    desc: "원하는 냉장고장 색상과 마감 방식을 선택합니다. 기존 싱크대와 맞출지, 냉장고장만 포인트로 둘지 현장에 맞는 방향을 함께 봅니다.",
    note: "실측한 규격과 수량을 기준으로 최종 견적과 설치 일정을 확정합니다.",
    image: REAL_SAMPLE_CHECK_IMAGE,
    imageAlt: "실제 PET 문짝 색상 샘플",
    imageRatio: "16 / 9",
  },
  {
    step: "3",
    title: "맞춤 제작",
    badge: "영업일 3~5일",
    desc: "문짝·패널은 측정한 규격에 맞춰 하나씩 주문 제작합니다.",
    note: "실측일을 기준으로 제작에는 보통 영업일 3~5일 정도 소요됩니다.",
    image: CUSTOM_PRODUCTION_IMAGE,
    imageAlt: "PET 문짝 공장에서 맞춤 제작을 준비하는 모습",
    imageRatio: "16 / 9",
  },
  {
    step: "4",
    title: "현장시공",
    badge: "약 2~3시간",
    desc: "기존 문짝·패널을 철거하고 새 자재를 설치합니다. 설치 후에는 경첩과 간격, 수평을 세밀하게 조절합니다.",
    note: "현장시공 시간은 냉장고장 구성과 시공 범위에 따라 달라질 수 있습니다.",
    image: FIELD_INSTALLATION_IMAGE,
    imageAlt: "현장에서 기존 냉장고장 문짝을 철거하고 설치를 준비하는 모습",
    imageRatio: "4 / 3",
  },
];

const TRUST_ITEMS = [
  { n: "01", title: "3년 무상 재시공", desc: "시공 부위의 들뜸, 경첩 문제 등은 기준에 따라 3년간 무상으로 확인해드립니다." },
  { n: "02", title: "경첩·간격 확인", desc: "냉장고장 문짝 교체 범위는 경첩 상태와 문 간격을 함께 확인합니다." },
  { n: "03", title: "생산물 배상책임보험 가입", desc: "시공 중 예상치 못한 문제가 생기면 가입 보험 기준에 따라 처리 범위를 확인합니다." },
];

const COLOR_SAMPLE_PREVIEWS = [
  {
    name: "포그 그레이",
    color: "#e4ddd3",
    image: "/images/door/preview-fog-gray.webp",
  },
  {
    name: "모노그레이",
    color: "#c6cbca",
    image: "/images/door/preview-mono-gray.webp",
  },
  {
    name: "백색 무광",
    color: "#fbfbf8",
    image: "/images/door/preview-white-matte.webp",
  },
  {
    name: "백색 유광",
    color: "#fbfbf8",
    image: "/images/door/preview-white-gloss.webp",
  },
  {
    name: "블랙",
    color: "#171717",
    image: "/images/door/preview-black.webp",
  },
  {
    name: "샌드 그레이",
    color: "#bdb4aa",
    image: "/images/door/preview-sand-gray.webp",
  },
  {
    name: "딥블루",
    color: "#1d3a46",
    image: "/images/door/preview-indigo-blue.webp",
  },
  {
    name: "진그레이 유광",
    color: "#3a3a3a",
    image: "/images/door/preview-dark-gray-gloss.webp",
  },
  {
    name: "진그레이 무광",
    color: "#3f3f3f",
    image: "/images/door/preview-dark-gray-matte.webp",
  },
  {
    name: "크림화이트",
    color: "#f0eee6",
    image: "/images/door/preview-cream-white.webp",
  },
  {
    name: "로지핑크",
    color: "#e8d7cf",
    image: "/images/door/preview-rosy-pink.webp",
  },
  {
    name: "LPM 샤이엔",
    color: "#d8bd92",
    image: "/images/door/preview-lpm-cheyenne.webp",
    swatchImage: "/images/door/lpm-swatch-cheyenne.webp",
  },
  {
    name: "LPM 내츄럴오크",
    color: "#cda44e",
    image: "/images/door/preview-lpm-natural-oak.webp",
    swatchImage: "/images/door/lpm-swatch-natural-oak.webp",
  },
  {
    name: "LPM 로얄오크",
    color: "#c58f45",
    image: "/images/door/preview-lpm-royal-oak.webp",
    swatchImage: "/images/door/lpm-swatch-royal-oak.webp",
  },
  {
    name: "LPM 리옹",
    color: "#9d6331",
    image: "/images/door/preview-lpm-lyon.webp",
    swatchImage: "/images/door/lpm-swatch-lyon.webp",
  },
];

const FAQ_ITEMS = [
  {
    q: "냉장고장 리폼 비용은 어떻게 계산되나요?",
    a: "냉장고장 리폼 비용은 교체할 문짝·패널 개수와 자재 종류를 기준으로 계산합니다.\n\n키큰장, 냉장고장 옆판, 상부 수납장, 몰딩처럼 함께 바꿀 범위를 사진으로 먼저 확인합니다.\n\n정확한 수량과 최종 금액은 방문 실측 후 확정합니다.",
  },
  {
    q: "냉장고장을 전체 철거하지 않고 리폼할 수 있나요?",
    a: "냉장고장 몸통과 고정 상태가 괜찮다면 기존 구조는 살리고 문짝·패널만 바꿀 수 있습니다.\n\n몸통에 심한 물먹음, 뒤틀림, 고정 불량이 있다면 리폼 범위가 달라질 수 있어 실측 때 상태를 함께 확인합니다.",
  },
  {
    q: "냉장고장만 바꿔도 주방 분위기가 달라지나요?",
    a: "냉장고장은 주방에서 큰 면으로 보이는 경우가 많아 색상과 마감을 바꾸면 전체 인상이 달라질 수 있습니다.\n\n다만 주방 배치와 사용할 수 있는 구조는 그대로 살리고, 눈에 보이는 전면부를 정돈하는 방식입니다.",
  },
  {
    q: "기존 주방 색상과 비슷하게 제작할 수 있나요?",
    a: "색상 샘플을 확인한 뒤 기존 주방과 비슷한 계열로 맞추거나, 냉장고장만 포인트 색상으로 구성할 수 있습니다.\n\n오래 사용한 문짝은 변색되어 있을 수 있고 조명에 따라서도 색이 다르게 보이기 때문에, 기존 색상과 완전히 동일하게 맞추기 어려운 경우도 있습니다.",
  },
  {
    q: "경첩이나 문 간격도 같이 봐주시나요?",
    a: "문짝 교체가 필요한 범위는 경첩 상태와 문 간격을 함께 확인합니다.\n\n기존 경첩을 그대로 쓰기 어려운 경우에는 현장 상태에 맞춰 교체 또는 조정 범위를 안내합니다.",
  },
  {
    q: "실측 후 제작과 설치까지 얼마나 걸리나요?",
    a: "사진을 먼저 확인한 뒤 현장을 방문해 냉장고장 문짝·패널 규격을 실측합니다.\n\n실측일 기준으로 제작에는 보통 영업일 3~5일 정도가 걸리며, 설치 시간은 문짝 수량과 현장 구조에 따라 달라질 수 있습니다.",
  },
  {
    q: "사진만 보내도 견적 확인이 가능한가요?",
    a: "냉장고장 정면이 보이는 사진 1장, 주방 전체 배치가 보이는 사진 1장과 함께 작업 지역과 원하는 범위를 보내주시면 먼저 가능 여부를 안내합니다.\n\n사진으로 대략적인 작업 범위를 확인할 수 있지만, 정확한 규격과 몸통 상태, 최종 금액은 방문 실측 후 확정합니다.",
  },
  {
    q: "A/S는 어떻게 진행되나요?",
    a: "시공 부위는 작업일 기준 3년 무상 A/S를 적용합니다.\n\n다만 외부 충격이나 물먹음, 기존 냉장고장 몸통의 파손처럼 시공과 직접적인 관련이 없는 원인은 사진과 현장 상태를 확인한 뒤 A/S 적용 범위를 구분합니다.",
  },
];

function parseKeyword(keyword: string): { region: string; type: string } {
  const kw = keyword.replace(/-/g, " ");
  const region = REGIONS.find((r) => kw.includes(r)) ?? "";
  const type = kw.includes("패널") ? "패널 리폼" : "리폼";
  return { region, type };
}

/* 사진 접수 + 전화 버튼 한 줄 (하단 고정 버튼이 겹치지 않도록 data-fridge-contact) */
function ContactButtons({ onBlue = false, cta, phoneCta }: { onBlue?: boolean; cta: string; phoneCta?: string }) {
  return (
    <div data-fridge-contact className={s.btnRow}>
      <Link href={REQUEST_URL} className={onBlue ? s.btnOnBlue : s.btnPrimary} data-cta={cta}>
        <CameraIcon />
        {PHOTO_CTA}
      </Link>
      <a href={PHONE} className={onBlue ? s.btnGhost : s.btnDark} data-cta={phoneCta}>
        <RollText text="1688-2957 전화 문의" />
        <Arrow />
      </a>
    </div>
  );
}

interface Props {
  keyword?: string;
  canonicalUrl?: string;
}

export default function FridgeCabinetLanding({ keyword, canonicalUrl }: Props) {
  const [activeTab, setActiveTab] = useState<"detail" | "reviews">("detail");
  const [selectedColorName, setSelectedColorName] = useState(COLOR_SAMPLE_PREVIEWS[0].name);
  const selectedColor =
    COLOR_SAMPLE_PREVIEWS.find((sample) => sample.name === selectedColorName) ?? COLOR_SAMPLE_PREVIEWS[0];

  useEffect(() => {
    const preloadTimer = window.setTimeout(() => {
      COLOR_SAMPLE_PREVIEWS.forEach((sample) => {
        const img = new window.Image();
        img.decoding = "async";
        img.src = sample.image;
      });
    }, 0);
    return () => window.clearTimeout(preloadTimer);
  }, []);

  const { region, type } = keyword ? parseKeyword(keyword) : { region: "", type: "" };

  // 기존 h1 문구를 줄 단위로 (줄마다 다른 텍스처가 채워짐)
  const heroTitle = region ? [`${region} 냉장고장`, type] : ["냉장고장", "리폼만 해도", "주방이 정돈됩니다"];
  const heroSub = region
    ? `${region} 냉장고장 문짝·패널 교체 가능 여부를 먼저 확인합니다`
    : "주방 전체 공사 없이, 냉장고장 문짝·패널부터 확인합니다";
  const serviceUrl =
    canonicalUrl ??
    (keyword
      ? `https://www.restorystudio.co.kr/kitchen/${keyword}`
      : "https://www.restorystudio.co.kr/kitchen/fridge-cabinet");

  const fridgeCases = cases
    .filter((c) => c.category === "냉장고장 리폼")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const regionCaseCount = region ? fridgeCases.filter((c) => c.region.includes(region)).length : 0;
  const reviewCases = fridgeCases.slice(0, 8);

  const showReviews = () => {
    setActiveTab("reviews");
    window.setTimeout(() => {
      document.getElementById("restory-reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  return (
    <main data-service-id="fridge-cabinet" data-service-keyword={keyword} className={`${s.page} ${display.variable}`}>
      <ServiceJsonLd
        name={region ? `${region} 냉장고장 리폼` : "냉장고장 리폼"}
        description="냉장고장 문짝·패널 리폼으로 주방 중심을 정돈합니다. 전체 공사 전 사진으로 가능 여부를 먼저 확인합니다."
        url={serviceUrl}
      />
      <FAQJsonLd faqs={FAQ_ITEMS} />

      {/* 1. HERO — 밝은 냉장고장 사진 위 반투명 안개, 흐린 빛 구체, 텍스처가 채워진 대형 제목 */}
      <Scrub as="section" data-service-section="hero" data-premium-hero className={s.hero}>
        <div className={s.heroBg}>
          <Image src={MAIN_IMAGE} alt="" fill priority className="object-cover" sizes="100vw" />
        </div>
        <span className={`${s.orb} ${s.orbA}`} aria-hidden="true" />
        <span className={`${s.orb} ${s.orbB}`} aria-hidden="true" />
        <span className={`${s.orb} ${s.orbC}`} aria-hidden="true" />
        <span className={s.grain} aria-hidden="true" />
        <div className={s.heroTrail}>
          <LandingTrail field="kitchen" title="냉장고장 리폼" />
        </div>
        <p className={s.heroGhost} aria-hidden="true">
          RE&apos;STORY FRIDGE CABINET
        </p>

        <div className={`${s.wrap} ${s.heroInner}`}>
          <p className={`${s.heroEyebrow} ${s.heroFade}`}>
            {region ? `${region} 사진 상담 가능` : "리스토리스튜디오 · 냉장고장 리폼 · 맞춤가구 제작"}
          </p>
          <RiseLines onLoad as="h1" className={s.heroTitle} lines={heroTitle} />
          <p className={`${s.heroEn} ${s.heroFade}`} style={{ animationDelay: "0.25s" }}>
            Fit the fridge, tidy the kitchen.
          </p>

          <div className={`${s.heroGlass} ${s.heroFade}`} style={{ animationDelay: "0.35s" }}>
            <p className={s.heroSub}>{heroSub}</p>
            <ContactButtons cta="fridge_cabinet_request_hero" phoneCta="fridge_cabinet_hero_phone" />
            <p className={s.heroHint}>
              냉장고장 정면 1장 + 주방 전체 1장, 작업 지역과 원하는 범위를 보내주세요. 정확한 규격과 최종 금액은 방문 실측 후 확정합니다.
            </p>
            <dl className={s.heroFacts}>
              {[
                { n: "문짝·패널", l: "교체 개수와 자재 기준 견적" },
                { n: "맞춤 제작", l: "실측 후 보통 영업일 3~5일" },
                { n: "3년 무상", l: "시공 부위 A/S" },
              ].map((f) => (
                <div key={f.n}>
                  <dt>{f.n}</dt>
                  <dd>{f.l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className={s.scrollCue} aria-hidden="true">
          SCROLL <span />
        </div>
      </Scrub>

      <nav aria-label="냉장고장 리폼 상세·리뷰" data-public-detail-tabs className={s.detailTabs}>
        <div className="mx-auto grid max-w-[720px] grid-cols-2 text-center">
          <button
            type="button"
            onClick={() => {
              setActiveTab("detail");
              window.setTimeout(() => {
                document.getElementById("service-detail")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 0);
            }}
            aria-pressed={activeTab === "detail"}>
            서비스 상세
          </button>
          <button type="button" onClick={showReviews} aria-pressed={activeTab === "reviews"}>
            리뷰
          </button>
        </div>
      </nav>

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

        <div className={activeTab === "detail" ? "block" : "hidden"}>
          {/* 2. 소개 */}
          <section data-service-section="service_overview" id="service-detail" className={s.section}>
            <div className={`${s.wrap} ${s.split}`}>
              <TitleCard kicker="냉장고만 바꾸면 끝일까요?" title="Fit the Fridge" />
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["냉장고에 맞는 장으로", "바꿔드립니다"]} />
                <p className={s.body}>기존 주방 전체를 뜯기 전에 냉장고 규격과 색상에 맞춰 문짝·패널부터 확인합니다.</p>
                <div className={s.colorPreview}>
                  <Image
                    src={MAIN_IMAGE}
                    alt="화이트 냉장고장 리폼 후 주방"
                    width={1254}
                    height={1254}
                    className="h-auto w-full"
                    sizes="(min-width: 768px) 640px, 100vw"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ★ 지역 배너 + 설명 (케이스 수 포함) */}
          {region && (
            <>
              <div className={s.regionBand}>{region} 지역 냉장고장 리폼 · 사진으로 가능 여부 확인</div>
              <section data-service-section="regional_intro" className={s.regionIntro}>
                <div className={`${s.wrap} ${s.split}`}>
                  <TitleCard as="p" kicker={`${region} 지역`} title="Area" />
                  <div className={s.glass}>
                    <h2 className={s.title}>{region} 냉장고장 리폼</h2>
                    <p className={s.body}>
                      {region} 지역 냉장고장 리폼은 기존 구조를 살릴 수 있는지 먼저 확인한 뒤 문짝·패널 교체 범위를 정합니다. 냉장고장만 정돈해도 주방 중심부의 인상이 달라질 수 있습니다.
                      {regionCaseCount > 0 && (
                        <>
                          {" "}
                          {region} 지역 시공 완료 <strong style={{ color: "var(--ink)" }}>{regionCaseCount}건</strong>.
                        </>
                      )}{" "}
                      사진 한 장 보내주시면 {region} 출장 가능 여부와 확인해야 할 범위를 먼저 안내드립니다.
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* 3. 증거 — 전후 · 이런 경우(캐릭터 #1) · 공장 맞춤 제작 · 엣지 마감(글리치) */}
          <section data-service-section="cases" className={s.section}>
            <div className={s.wrap}>
              <div className={s.split}>
                <TitleCard kicker="냉장고를 사셨는데 장이 맞지 않으신가요?" title="Before / After" />
                <div className={s.glass}>
                  <RiseLines className={s.title} lines={["냉장고 규격에 맞게", "장을 다시 맞춰드립니다."]} />
                  <p className={s.body}>기존 주방 전체를 뜯기 전에 냉장고장 문짝·패널 리폼 가능 여부를 먼저 확인합니다.</p>
                  <InView className={s.sameSofa}>
                    <strong className={s.fade}>같은 주방입니다.</strong>
                    <span className={s.fade} style={{ transitionDelay: "0.1s" }}>
                      냉장고장 문짝·패널만 바꿨습니다
                    </span>
                  </InView>
                </div>
              </div>
              <InView className={s.compare} threshold={0.15}>
                <div className={`${s.clip} ${s.compareItem}`}>
                  <Image src="/images/fridge-cabinet/refbefore.png" alt="냉장고장 리폼 전" fill className="object-cover" sizes="(min-width: 1200px) 580px, 50vw" />
                  <span className={s.compareTag}>BEFORE</span>
                </div>
                <div className={`${s.clip} ${s.compareItem}`}>
                  <Image src="/images/fridge-cabinet/refafterer.png" alt="냉장고장 리폼 후" fill className="object-cover" sizes="(min-width: 1200px) 580px, 50vw" />
                  <span className={s.compareTag} data-after>
                    AFTER
                  </span>
                </div>
              </InView>

              <div className={`${s.split} ${s.afterCard}`}>
                <div className={s.stickyCol}>
                  <TitleCard kicker="WHY RESTORY" title="When It Helps" as="p" />
                  <Mascot
                    src="/images/door/mascot-diagnose.png"
                    alt="냉장고장 문짝의 경첩과 간격을 살펴보는 리스토리 기사 캐릭터"
                    width={1168}
                    height={880}
                    className={s.mascotDiagnose}
                    bubble="살릴 몸통부터 볼게요"
                  />
                </div>
                <div className={s.glass}>
                  <RiseLines className={s.title} lines={["냉장고장만 바꿔도", "먼저 좋아지는 경우"]} />
                  <InView className={`${s.rows} ${s.rowsCompact}`} as="ol" threshold={0.1}>
                    {WHY_ITEMS.map((item) => (
                      <li key={item.n} className={`${s.row} ${s.fade}`}>
                        <span className={s.rowNum}>{item.n}</span>
                        <h3 className={s.rowTitle}>{item.title}</h3>
                        <p className={s.rowDesc}>{item.desc}</p>
                      </li>
                    ))}
                  </InView>
                </div>
              </div>

              <div className={`${s.glass} ${s.afterCard}`}>
                <p className={s.kicker}>가격부터 말씀드리면</p>
                <RiseLines className={s.title} lines={["냉장고장 리폼,", "전체 주방 공사까지 생각하셨나요?"]} />
                <p className={s.body}>
                  전부 바꾸면 부담이 커집니다. <strong style={{ color: "var(--ink)" }}>큰 면부터</strong> 확인하면 선택지도 달라집니다.
                </p>
                <p className={s.badge}>전체 교체 대비 4~5배 절감</p>
              </div>

              <div className={`${s.glass} ${s.workGlass} ${s.afterCard}`}>
                <div className={`${s.workImg} ${s.workImgWide}`}>
                  <Image src={CUSTOM_PRODUCTION_IMAGE} alt="리스토리 PET 문짝 공장 직거래" fill unoptimized className="object-cover" sizes="(min-width: 1200px) 1100px, 100vw" />
                </div>
                <div className={s.factoryBody}>
                  <div>
                    <p className={s.kicker}>왜 이 가격이 가능할까요?</p>
                    <h3 className={s.title}>공장 맞춤 제작! 필요한 부분만 바꿉니다</h3>
                    <p className={s.note}>리스토리 직거래</p>
                    <ul className={s.checkList}>
                      <li>PET 문짝 공장에서 주문제작</li>
                      <li>필요한 문짝·패널만 제작해 교체 비용 감소</li>
                    </ul>
                  </div>
                  <div className={s.vennWrap}>
                    <GlitchDiagram
                      label="맞춤 문짝, 엣지 마감, 냉장고 규격이 함께 맞아야 정돈된 냉장고장이 됩니다"
                      shapes={<VennShapes top={["DOOR", "맞춤 문짝"]} left={["EDGE", "엣지 마감"]} right={["SIZE", "냉장고 규격"]} core="Fit" />}
                    />
                  </div>
                </div>
              </div>

              <details className={`${s.glass} ${s.moreDetails}`}>
                <summary>엣지 마감 차이 자세히 보기</summary>
                <div className={s.moreBody}>
                  <div className={s.checkPoint}>
                    <p className={s.kicker}>Check Point</p>
                    <h3 className={s.title}>리스토리를 선택해야 하는 이유는 차고 넘칩니다!</h3>
                    <p className={s.rowTitle}>큰 면일수록 엣지 마감이 중요합니다</p>
                    <p className={s.rowDesc}>
                      냉장고장은 세로로 긴 면이 크게 보입니다. 처음엔 색상만 보여도 오래 쓰면 모서리 접착선과 물먹음 차이가 먼저 보일 수 있어 엣지까지 확인해야 합니다.
                    </p>
                    <Image
                      src="/images/door/pet-difference.png"
                      alt="PET 제로조인트와 핫멜트 엣지 마감 비교"
                      width={1122}
                      height={1402}
                      className={s.checkImg}
                      sizes="(min-width: 768px) 600px, calc(100vw - 80px)"
                    />
                    <p className={s.compareKicker} data-tone="warn">
                      시간이 지나고 나서 보이는 차이
                    </p>
                    <p className={s.title}>신경 안 쓰면 가장 먼저 후회하는 부분, 엣지 마감입니다</p>
                    <p className={s.rowDesc}>
                      문짝 모서리로 물이 스며들면 시간이 지나 들뜸과 물먹음이 생길 수 있습니다. 그래서 처음 선택할 때 색상만큼 엣지 마감 방식도 같이 봐야 합니다.
                    </p>
                    <Image
                      src="/images/door/edge-water-damage.jpg"
                      alt="시간이 지나 물먹음이 생긴 냉장고장 문짝 엣지 마감"
                      width={1632}
                      height={2184}
                      className={s.checkImg}
                      sizes="(min-width: 768px) 680px, calc(100vw - 80px)"
                    />
                    <p className={s.compareKicker} data-tone="warn">
                      Check Point
                    </p>
                    <p className={s.rowTitle}>물에 약해질 수 있는 핫멜트 접합</p>
                    <p className={s.rowDesc}>
                      핫멜트 방식의 접합 방식은 물에 지속적으로 노출될 때 불어 터질 수 있어, 주방처럼 물을 자주 쓰는 공간에서는 엣지 마감을 함께 확인해야 합니다.
                    </p>
                  </div>
                </div>
              </details>
            </div>
          </section>

          {/* 거대한 회색 영문 */}
          <Scrub className={s.marquee} aria-hidden="true">
            <span className={s.marqueeLine}>Fit the fridge,</span>
            <span className={s.marqueeLine}>tidy the kitchen.</span>
          </Scrub>

          {/* 4. 색상 */}
          <section data-service-section="colors" className={s.section}>
            <div className={`${s.wrap} ${s.split}`}>
              <div className={s.stickyCol}>
                <TitleCard kicker="COLOR SAMPLES" title="Color Samples" />
              </div>
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["취향에 맞는 색상으로", "골라보세요"]} />
                <p className={s.body}>
                  백색 · 크림화이트 · 포그 그레이 · 샌드 그레이 · 딥블루 · LPM 목무늬. 색상칩을 누르면 주방 적용 이미지를 먼저 볼 수 있고 방문 시 실물 샘플을 직접 확인하실 수 있습니다.
                </p>
                <div className={s.colorPreview}>
                  <Image
                    src={selectedColor.image}
                    alt={`${selectedColor.name} 냉장고장 문짝 색상 적용 미리보기`}
                    width={1084}
                    height={1451}
                    unoptimized
                    className="h-auto w-full"
                    sizes="(max-width: 768px) 100vw, 640px"
                  />
                </div>
                <div className={s.swatches}>
                  {COLOR_SAMPLE_PREVIEWS.map((sample) => (
                    <button
                      key={sample.name}
                      type="button"
                      onClick={() => setSelectedColorName(sample.name)}
                      aria-pressed={selectedColorName === sample.name}
                      className={s.swatch}>
                      <span
                        className={s.swatchChip}
                        style={{
                          background: sample.swatchImage ? `${sample.color} url(${sample.swatchImage}) center / cover` : sample.color,
                        }}
                      />
                      <span>{sample.name}</span>
                    </button>
                  ))}
                </div>
                <p className={s.note}>사진과 화면 색상은 실제 샘플과 다를 수 있어 출장 방문 시 실물을 보고 선택하실 수 있습니다.</p>
                <div className={s.btnRow} data-fridge-contact>
                  <Link href={REQUEST_URL} className={s.btnPrimary} data-cta="fridge_cabinet_request_colors">
                    <CameraIcon />
                    샘플 보러 출장 방문 예약하기
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 5. 진행 방법 — 캐릭터 #2 (행동 유도) */}
          <section data-service-section="process" className={s.section}>
            <div className={`${s.wrap} ${s.split}`}>
              <TitleCard kicker="HOW IT WORKS" title="Process" />
              <div className={s.glass}>
                <InkText lines={["그래서", "진행 방법은??"]} />
                <p className={s.kicker}>STEP 01 · 상담으로 예상 견적 확인하기</p>
                <p className={s.body}>아래 사진 2장을 보내주시면 냉장고장 리폼 가능 범위와 확인할 부분을 안내해 드립니다.</p>
                <ul className={s.checkList}>
                  <li>냉장고장이 잘 보이는 사진 1장</li>
                  <li>주방 전체가 보이는 사진 1장</li>
                </ul>
              </div>
            </div>
            <div className={s.wrap}>
              <div data-fridge-contact>
                <PhotoCtaCard
                  title="사진 2장이면 시작돼요"
                  sub="냉장고장 정면 1장 + 주방 전체 1장, 작업 지역과 원하는 범위만 보내주세요."
                  href={REQUEST_URL}
                  label={PHOTO_CTA}
                  cta="fridge_cabinet_request_process"
                />
              </div>
              <div className={`${s.works} ${s.afterCard}`}>
                <div className={`${s.glass} ${s.workGlass}`}>
                  <div className={s.workMeta}>
                    <h3 className={s.rowTitle}>사진 촬영 예시</h3>
                    <p className={s.rowDesc}>냉장고장이 모두 보이게 정면에서 찍어주세요.</p>
                  </div>
                  <Image
                    src="/images/door/send-photo-guide.png"
                    alt="냉장고장이 모두 보이게 정면에서 찍어주세요"
                    width={1122}
                    height={1402}
                    className={s.guideImg}
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <div className={`${s.glass} ${s.workGlass}`}>
                  <div className={s.guideChat}>
                    <Image src={CHAT_CONSULT_EXAMPLE_IMAGE} alt="개인정보를 블러 처리한 사진 상담 예시" fill unoptimized sizes="(min-width: 768px) 310px, 100vw" className="object-cover" />
                  </div>
                  <div className={s.workMeta}>
                    <h3 className={s.rowTitle}>사진으로 무료 상담</h3>
                    <p className={s.rowDesc}>준비한 사진 2장을 보내주시면 냉장고장 리폼 가능 범위와 확인할 부분을 안내해 드립니다.</p>
                  </div>
                </div>
              </div>
              <div className={`${s.glass} ${s.rowsCard} ${s.afterCard}`}>
                <InView className={s.rows} as="ol" threshold={0.1}>
                  {PROCESS_STEPS.map((item) => (
                    <li key={item.step} className={`${s.row} ${s.fade}`}>
                      <span className={s.rowNum}>{item.step}</span>
                      <h3 className={s.rowTitle}>{item.title}</h3>
                      <p className={s.rowDesc}>
                        {item.desc} {item.note}
                      </p>
                      <span className={`${s.tag} ${s.rowAside}`}>{item.badge}</span>
                    </li>
                  ))}
                </InView>
              </div>
              <details className={`${s.glass} ${s.moreDetails}`}>
                <summary>실측부터 설치까지 공정 사진 보기</summary>
                <div className={s.moreBody}>
                  <div className={s.photoSteps}>
                    {PROCESS_STEPS.map((item) => (
                      <div key={item.step} className={s.photoStep}>
                        <div className={s.photoStepHead}>
                          <span className={s.rowNum}>{item.step}</span>
                          <span className={s.tag}>{item.badge}</span>
                        </div>
                        <h3 className={s.rowTitle}>{item.title}</h3>
                        <div className={s.photoStepImg} style={{ aspectRatio: item.imageRatio }}>
                          <Image src={item.image} alt={item.imageAlt} fill unoptimized sizes="(min-width: 768px) 520px, 100vw" className="object-cover" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          </section>

          {/* 6. 신뢰 */}
          <section data-service-section="warranty" className={s.section}>
            <div className={`${s.wrap} ${s.split}`}>
              <div className={s.stickyCol}>
                <TitleCard kicker="TRUST" title="Trust" />
              </div>
              <div>
                <div className={s.glass}>
                  <RiseLines className={s.title} lines={["걱정하시는 거", "다 알고 있어요"]} />
                  <InView className={`${s.rows} ${s.rowsCompact}`} as="ol" threshold={0.1}>
                    {TRUST_ITEMS.map((t) => (
                      <li key={t.n} className={`${s.row} ${s.fade}`}>
                        <span className={s.rowNum}>{t.n}</span>
                        <h3 className={s.rowTitle}>{t.title}</h3>
                        <p className={s.rowDesc}>{t.desc}</p>
                      </li>
                    ))}
                  </InView>
                </div>
                <div className={`${s.compare} ${s.afterCard}`}>
                  {[
                    { src: "/images/cert-5.png", alt: "생산물배상책임보험증서" },
                    { src: "/images/cert-4.png", alt: "리스토리 A/S 보증서" },
                  ].map((c) => (
                    <div key={c.src} className={`${s.glass} ${s.certCard}`}>
                      <Image src={c.src} alt={c.alt} width={300} height={400} className={s.certImg} />
                      <p>{c.alt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 7. 영상 */}
          <section data-service-section="video" className={s.section}>
            <div className={s.wrap}>
              <div className={s.videoHead}>
                <TitleCard kicker="실제 시공 영상" title="Movie" />
              </div>
              <div className={`${s.glass} ${s.videoCard}`}>
                <YouTubeFacade videoId={REAL_VIDEO_ID} title="리스토리 냉장고장 리폼 시공 영상" label="냉장고장 리폼 시공 영상 재생" />
              </div>
            </div>
          </section>

          {/* 8. FAQ */}
          <section data-service-section="faq" className={s.section}>
            <div className={`${s.wrap} ${s.split}`}>
              <div className={s.stickyCol}>
                <TitleCard kicker="자주 묻는 질문" title="FAQ" as="p" />
              </div>
              <div>
                <h2 className={`${s.title} ${s.faqHeading}`}>자주 묻는 질문</h2>
                <FaqList items={FAQ_ITEMS} idPrefix="fridge-faq" />
              </div>
            </div>
          </section>
        </div>

        {/* 리뷰 탭 */}
        <section
          data-service-section="reviews"
          id="restory-reviews"
          className={`${s.section} ${activeTab === "reviews" ? "block" : "hidden"}`}>
          <div className={s.wrap}>
            <div className={s.split}>
              <div className={s.stickyCol}>
                <TitleCard kicker="사진으로 먼저 확인하는" title="Reviews" as="p" />
              </div>
              <div className={s.glass}>
                <Image src={REVIEW_BADGE_IMAGE} alt="압도적 만족" width={220} height={280} className={s.reviewBadge} sizes="160px" />
                <h2 className={s.title}>
                  비포·애프터
                  <br />
                  리얼 후기
                </h2>
                <p className={s.body}>냉장고장·주방 리폼 전후가 어떻게 달라졌는지 실제 사례 사진으로 확인해보세요.</p>
                <div className={s.ratingRow}>
                  <p className={s.ratingScore}>4.9</p>
                  <div>
                    <p className={s.ratingStars}>★★★★★</p>
                    <p className={s.note}>냉장고장 리폼 참고 리뷰 · 냉장고장 문짝·패널 리폼 사례 기준</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${s.works} ${s.afterCard}`}>
              {reviewCases.map((item) => (
                <Link key={item.id} href={`/cases/${item.id}`} className={`${s.work} ${s.glass} ${s.workGlass}`}>
                  <div className={s.pairImg}>
                    {[
                      { label: "BEFORE", src: item.beforeImg },
                      { label: "AFTER", src: item.afterImg },
                    ].map((photo) => (
                      <div key={photo.label} className={s.workImg}>
                        <Image src={photo.src} alt={`${item.title} ${photo.label}`} fill className="object-cover" sizes="(min-width: 768px) 280px, calc(50vw - 32px)" />
                        <span className={s.pairTag} data-after={photo.label === "AFTER" || undefined}>
                          {photo.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className={s.workMeta}>
                    <p className={s.ratingStars}>
                      ★★★★★ <span className={s.note}>{item.date.replaceAll("-", ".")}</span>
                    </p>
                    <h3 className={s.workTitle}>{item.title}</h3>
                    <p className={s.note}>{item.region}</p>
                    <p className={s.workSummary} data-full>
                      {item.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Scrub>

      {/* 9. CONTACT — 캐릭터 #3 (마무리) */}
      {activeTab === "detail" && (
        <Scrub as="section" data-service-section="contact" className={s.contact}>
          <Star className={s.contactStar} />
          <div className={s.contactMascot}>
            <Image src="/images/premium/mascot-wave.png" alt="공구함을 들고 손을 흔드는 리스토리 기사 캐릭터" width={880} height={1168} sizes="(min-width: 900px) 360px, 150px" />
          </div>
          <div className={s.wrap} style={{ position: "relative" }}>
            <Link href={REQUEST_URL} className={s.contactBig} aria-label={PHOTO_CTA} data-cta="fridge_cabinet_request_contact_title">
              <RollText text="CONTACT" />
            </Link>
            <div className={s.split}>
              <p className={s.labelSmall} style={{ color: "rgba(255,255,255,0.7)" }}>
                지금 바로 시작하세요
              </p>
              <div>
                <h2 className={s.contactTitle} style={{ whiteSpace: "pre-line" }}>
                  {region ? `${region} 냉장고장 리폼\n사진 한 장이면 충분합니다` : "냉장고장 사진 한 장이면\n충분합니다"}
                </h2>
                <p className={s.contactSub}>리폼 가능 여부를 먼저 확인해드립니다</p>
                <ContactButtons onBlue cta="fridge_cabinet_request_contact" />
                <div className={s.chips}>
                  {["사진 먼저 확인", "경첩·간격 확인", "색상 샘플 확인", "3년 무상 A/S"].map((b) => (
                    <span key={b}>{b}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Scrub>
      )}

      <LandingIntake field="kitchen" item="냉장고장 리폼" />
      <FloatingCTA
        onReviewClick={showReviews}
        compactMobile
        avoidOverlapSelector="[data-fridge-contact]"
        label={PHOTO_CTA}
        kakaoUrl={REQUEST_URL}
        newTab={false}
      />
    </main>
  );
}
