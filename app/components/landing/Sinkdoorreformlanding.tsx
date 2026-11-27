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

const PHONE = buildTrackedContactPath("phone", "sink_door");
// 사진 상담은 자체 접수 양식으로 (싱크대 문짝 교체 항목이 미리 선택된 상태로 열림)
const REQUEST_URL = "/request?service=doors";
const SINK_DOOR_VIDEO_ID = "tC4VLNFgvCE";
const REAL_VIDEO_ID = "sydwgU5o4DY";
const REVIEW_BADGE_IMAGE = "/images/door/before-after-review-badge.png";
const FILM_EDGE_IMAGE = "/images/door/film.png";
const PET_ZEROJOINT_EDGE_IMAGE = "/images/door/pet-zerojoint-edge.png";
const CHAT_CONSULT_EXAMPLE_IMAGE = "/images/door/chat-consult-example-safe.webp";
const VISIT_MEASUREMENT_IMAGE = "/images/door/visit-measurement.webp";
const REAL_SAMPLE_CHECK_IMAGE = "/images/door/real-sample-check.webp";
const CUSTOM_PRODUCTION_IMAGE = "/images/door/factory-direct.gif";
const FIELD_INSTALLATION_IMAGE = "/images/door/field-installation.webp";
const PHOTO_CTA = "사진 2장으로 예상 견적 받기";
const SITE_URL = "https://www.restorystudio.co.kr";

type SinkDoorCase = (typeof cases)[number];

const COLOR_SAMPLE_PREVIEWS = [
  { name: "포그 그레이", color: "#e4ddd3", image: "/images/door/preview-fog-gray.webp" },
  { name: "모노그레이", color: "#c6cbca", image: "/images/door/preview-mono-gray.webp" },
  { name: "백색 무광", color: "#fbfbf8", image: "/images/door/preview-white-matte.webp" },
  { name: "백색 유광", color: "#fbfbf8", image: "/images/door/preview-white-gloss.webp" },
  { name: "블랙", color: "#171717", image: "/images/door/preview-black.webp" },
  { name: "샌드 그레이", color: "#bdb4aa", image: "/images/door/preview-sand-gray.webp" },
  { name: "딥블루", color: "#1d3a46", image: "/images/door/preview-indigo-blue.webp" },
  { name: "진그레이 유광", color: "#3a3a3a", image: "/images/door/preview-dark-gray-gloss.webp" },
  { name: "진그레이 무광", color: "#3f3f3f", image: "/images/door/preview-dark-gray-matte.webp" },
  { name: "크림화이트", color: "#f0eee6", image: "/images/door/preview-cream-white.webp" },
  { name: "로지핑크", color: "#e8d7cf", image: "/images/door/preview-rosy-pink.webp" },
  { name: "LPM 샤이엔", color: "#d8bd92", image: "/images/door/preview-lpm-cheyenne.webp", swatchImage: "/images/door/lpm-swatch-cheyenne.webp" },
  { name: "LPM 내츄럴오크", color: "#cda44e", image: "/images/door/preview-lpm-natural-oak.webp", swatchImage: "/images/door/lpm-swatch-natural-oak.webp" },
  { name: "LPM 로얄오크", color: "#c58f45", image: "/images/door/preview-lpm-royal-oak.webp", swatchImage: "/images/door/lpm-swatch-royal-oak.webp" },
  { name: "LPM 리옹", color: "#9d6331", image: "/images/door/preview-lpm-lyon.webp", swatchImage: "/images/door/lpm-swatch-lyon.webp" },
];

const FAQ_ITEMS = [
  {
    q: "싱크대 문짝 교체 비용은 어떻게 계산되나요?",
    a: "싱크대 문짝 교체 비용은 교체할 문짝 개수와 자재 종류를 기준으로 계산합니다.\n\n문짝과 서랍 앞판은 개수 기준으로 확인하고, 걸레받이와 몰딩은 필요한 길이를 m 단위로 측정해 반영합니다.\n\n사진으로 예상 견적을 안내하고, 정확한 수량과 최종 금액은 방문 실측 후 확정합니다.",
  },
  {
    q: "싱크대 전체를 철거하지 않고 문짝만 교체할 수 있나요?",
    a: "싱크대 몸통이 물에 불지 않았고, 경첩을 고정하는 부분과 내부 판재를 계속 사용할 수 있다면 기존 몸통은 두고 문짝만 교체할 수 있습니다.\n\n몸통에 심한 물먹음이나 파손, 뒤틀림이 있다면 문짝만 교체하기 어려울 수 있어 방문 실측 때 상태를 함께 확인합니다.",
  },
  {
    q: "문짝만 바꿔도 주방 분위기가 달라지나요?",
    a: "주방에서 가장 넓게 보이는 부분이 문짝이기 때문에 색상과 광택을 바꾸면 전체 분위기도 크게 달라질 수 있습니다.\n\n다만 상판과 타일, 싱크대 몸통과 주방 배치는 그대로 유지됩니다. 전체 철거가 아니라 사용할 수 있는 구조는 살리고, 눈에 보이는 전면부를 바꾸는 방식입니다.",
  },
  {
    q: "기존 싱크대 색상과 비슷하게 제작할 수 있나요?",
    a: "색상 샘플을 확인한 뒤 기존 싱크대와 비슷한 계열로 선택하거나, 상부장과 하부장을 서로 다른 색으로 구성할 수 있습니다.\n\n오래 사용한 문짝은 변색되어 있을 수 있고 조명에 따라서도 색이 다르게 보이기 때문에, 기존 문짝과 정확히 동일한 색상으로 맞추기 어려운 경우도 있습니다.",
  },
  {
    q: "문짝 교체 시 경첩도 같이 교체하나요?",
    a: "기존 경첩을 전부 제거한 후 댐핑 원터치 경첩으로 무상 교체해드립니다.",
  },
  {
    q: "실측 후 제작과 설치까지 얼마나 걸리나요?",
    a: "사진을 먼저 확인한 뒤 현장을 방문해 문짝 규격을 실측합니다.\n\n실측일 기준으로 문짝 제작에는 영업일 3~5일 정도가 걸리며, 설치 당일 현장 작업은 일반적으로 약 2~3시간 정도 진행됩니다. 문짝 수량과 현장 구조에 따라 설치 시간은 달라질 수 있습니다.",
  },
  {
    q: "사진만 보내도 견적 확인이 가능한가요?",
    a: "문짝의 색상과 상태가 가까이 보이는 사진 1장, 주방 전체가 보이는 사진 1장과 함께 작업 지역과 교체를 원하는 범위를 보내주시면 예상 가능한 범위를 먼저 안내합니다.\n\n사진으로 문짝 수량과 대략적인 작업 범위를 확인할 수 있지만, 정확한 규격과 몸통 상태, 최종 금액은 방문 실측 후 확정합니다.",
  },
  {
    q: "A/S는 어떻게 진행되나요?",
    a: "시공 부위는 작업일 기준 3년 무상 A/S를 적용합니다.\n\n다만 외부 충격이나 물먹음, 기존 싱크대 몸통의 파손처럼 시공과 직접적인 관련이 없는 원인은 사진과 현장 상태를 확인한 뒤 A/S 적용 범위를 구분합니다.",
  },
];

const BUDGET_ITEMS = [
  { n: "01", title: "새로 제작할 부분", desc: "교체할 문짝과 서랍 앞판의 수량·규격·자재를 확인합니다." },
  { n: "02", title: "함께 교체할 부속", desc: "교체하는 문짝의 경첩은 무료로 교체합니다." },
  { n: "03", title: "그대로 사용할 부분", desc: "사용 가능한 상판·몸통·주방 배치는 유지합니다. 몸통 상태는 실측 때 확인합니다." },
];

const SCHEDULE_ITEMS = [
  { title: "사진 상담", time: "예상 견적 확인", text: "사진 2장과 지역·교체 범위로 먼저 상담합니다." },
  { title: "방문 실측·샘플 확인", time: "일정 협의", text: "규격과 몸통 상태, 실물 색상을 확인하고 최종 견적·설치 일정을 확정합니다." },
  { title: "맞춤 제작", time: "실측 후 영업일 3~5일", text: "측정한 규격으로 문짝과 서랍 앞판을 제작합니다." },
  { title: "현장 설치", time: "설치 당일 약 2~3시간", text: "새 문짝을 설치하고 경첩·간격·수평을 조절합니다." },
];

const PROCESS_PHOTOS = [
  {
    step: "02",
    title: "방문 실측",
    badge: "규격 확인",
    desc: "예상 견적을 확인한 뒤 방문 일정을 잡습니다. 현장에서 문짝과 서랍 앞판의 크기, 경첩 위치, 걸레받이·몰딩 길이를 정확하게 측정합니다.",
    note: "기존 싱크대 몸통을 그대로 사용할 수 있는지도 함께 확인합니다.",
    image: VISIT_MEASUREMENT_IMAGE,
    imageAlt: "현장에서 싱크대 문짝 교체 범위를 실측하는 모습",
    imageRatio: "4 / 3",
  },
  {
    step: "2-1",
    title: "실제 샘플 눈으로 확인",
    badge: "실물 확인",
    desc: "원하는 문짝의 색상과 마감 방식을 선택합니다. 백색 유광 하이그로시와 PET 제로조인트 무광 등 현장에 맞는 방향을 함께 봅니다.",
    note: "실측한 규격과 수량을 기준으로 최종 견적과 설치 일정을 확정합니다.",
    image: REAL_SAMPLE_CHECK_IMAGE,
    imageAlt: "실제 PET 문짝 색상 샘플",
    imageRatio: "16 / 9",
  },
  {
    step: "3",
    title: "맞춤 제작",
    badge: "영업일 3~5일",
    desc: "문짝과 서랍 앞판은 측정한 규격에 맞춰 하나씩 주문 제작합니다.",
    note: "실측일을 기준으로 제작에는 보통 영업일 3~5일 정도 소요됩니다.",
    image: CUSTOM_PRODUCTION_IMAGE,
    imageAlt: "PET 문짝 공장에서 맞춤 제작을 준비하는 모습",
    imageRatio: "16 / 9",
  },
  {
    step: "4",
    title: "현장 설치",
    badge: "약 2~3시간",
    desc: "기존 문짝을 철거하고 새 문짝을 설치합니다. 설치 후에는 경첩과 간격, 수평을 세밀하게 조절합니다.",
    note: "현장 설치는 주방 규모에 따라 보통 약 2~3시간 정도 소요됩니다.",
    image: FIELD_INSTALLATION_IMAGE,
    imageAlt: "현장에서 기존 싱크대 문짝을 철거하고 설치를 준비하는 모습",
    imageRatio: "4 / 3",
  },
];

const TRUST_ITEMS = [
  { n: "01", title: "3년 무상 재시공", desc: "문짝 들뜸, 경첩 문제 등 시공 후 3년간 무상으로 재시공해드립니다." },
  { n: "02", title: "경첩 무료 교체", desc: "교체하시는 문짝의 경첩은 리스토리에서 서비스로 무료 교체해드립니다." },
  { n: "03", title: "생산물 배상책임보험 가입", desc: "시공 중 예상치 못한 문제가 생겨도 보험으로 100% 보상됩니다." },
];

function parseKeyword(keyword: string): { region: string; type: string } {
  const kw = keyword.replace(/-/g, " ");
  const region = REGIONS.find((r) => kw.includes(r)) ?? "";
  const type = kw.includes("리폼") ? "리폼" : "교체";
  return { region, type };
}

function RegionalDoorCaseItemListJsonLd({ name, items }: { name: string; items: SinkDoorCase[] }) {
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

interface Props {
  keyword?: string;
  canonicalUrl?: string;
}

export default function SinkdoorReformLanding({ keyword, canonicalUrl }: Props) {
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
  const heroTitle = region
    ? [`${region} 싱크대`, `문짝 ${type}`]
    : ["싱크대 문짝", "교체만 해도", "새 주방 됩니다"];
  const serviceUrl =
    canonicalUrl ??
    (keyword ? `https://www.restorystudio.co.kr/kitchen/${keyword}` : "https://www.restorystudio.co.kr/kitchen/sink-door");

  const latestDoorCases = cases
    .filter((c) => c.category === "싱크대 리폼")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const regionalDoorCases = region ? latestDoorCases.filter((c) => c.region.includes(region)) : [];
  const regionalDoorCaseIds = new Set(regionalDoorCases.map((item) => item.id));
  const supplementalDoorCases =
    region && regionalDoorCases.length < 3
      ? latestDoorCases.filter((item) => !regionalDoorCaseIds.has(item.id)).slice(0, 3 - regionalDoorCases.length)
      : [];
  const regionCaseCount = regionalDoorCases.length;
  const featuredRegionalDoorCases = region
    ? [...regionalDoorCases.slice(0, 3), ...supplementalDoorCases]
    : latestDoorCases.filter((item) => /싱크대|씽크대|주방/.test(item.title)).slice(0, 3);
  const hasSupplementalDoorCases = supplementalDoorCases.length > 0;
  const reviewCases = latestDoorCases.filter((c) => c.review);
  const bandCase = featuredRegionalDoorCases[0] ?? latestDoorCases[0];

  const showReviews = () => {
    setActiveTab("reviews");
    window.setTimeout(() => {
      document.getElementById("restory-reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  return (
    <main data-service-id="sink-door" data-service-keyword={keyword} className={`${s.page} ${display.variable}`}>
      <ServiceJsonLd
        name={region ? `${region} 싱크대 문짝 교체·리폼` : "싱크대 문짝 교체·리폼"}
        description="싱크대 문짝만 교체해도 새 주방처럼. 전체 교체 비용의 1/5~. 당일 시공, 3년 무상 A/S, 경첩 무료 교체."
        url={serviceUrl}
      />
      <FAQJsonLd faqs={FAQ_ITEMS} />
      <RegionalDoorCaseItemListJsonLd
        name={
          !region
            ? "싱크대 문짝 교체 최신 실제 시공 사례"
            : hasSupplementalDoorCases
              ? `${region} 싱크대 문짝 교체 지역·최신 시공 사례`
              : `${region} 싱크대 문짝 교체 실제 시공 사례`
        }
        items={featuredRegionalDoorCases}
      />

      {/* 1. HERO — 밝은 주방 사진 위 반투명 안개, 흐린 빛 구체, 텍스처가 채워진 대형 제목 */}
      <Scrub as="section" data-service-section="hero" data-premium-hero id="sink-door-outcome" className={s.hero}>
        <div className={s.heroBg}>
          <Image src="/images/door/hero-kitchen-studio.jpg" alt="" fill priority className="object-cover" sizes="100vw" />
        </div>
        <span className={`${s.orb} ${s.orbA}`} aria-hidden="true" />
        <span className={`${s.orb} ${s.orbB}`} aria-hidden="true" />
        <span className={`${s.orb} ${s.orbC}`} aria-hidden="true" />
        <span className={s.grain} aria-hidden="true" />
        <div className={s.heroTrail}>
          <LandingTrail field="kitchen" title="싱크대 문짝 교체" />
        </div>
        <p className={s.heroGhost} aria-hidden="true">
          RE&apos;STORY SINK DOOR
        </p>

        <div className={`${s.wrap} ${s.heroInner}`}>
          <p className={`${s.heroEyebrow} ${s.heroFade}`}>
            {region ? `${region} 싱크대 문짝 ${type || "교체"}` : "Re'Story · Sink Door Renewal"}
          </p>
          <RiseLines onLoad as="h1" className={s.heroTitle} lines={heroTitle} />
          <p className={`${s.heroEn} ${s.heroFade}`} style={{ animationDelay: "0.25s" }}>
            New doors, same kitchen — a whole new mood.
          </p>

          <div className={`${s.heroGlass} ${s.heroFade}`} style={{ animationDelay: "0.35s" }} data-sink-door-contact>
            <p className={s.heroSub}>
              쓸 수 있는 상판과 몸통은 그대로, 문짝과 서랍 앞판을 바꿔 주방 분위기를 바꿉니다.
            </p>
            <div className={s.btnRow}>
              <Link href={REQUEST_URL} className={s.btnPrimary} data-cta="sink_door_request_hero">
                <CameraIcon />
                {PHOTO_CTA}
              </Link>
              <a href={PHONE} className={s.btnDark} data-cta="sink_door_video_phone">
                <RollText text="1688-2957 전화 문의" />
                <Arrow />
              </a>
            </div>
            <p className={s.heroHint}>
              기존 몸통을 계속 사용할 수 있는지 사진과 방문 실측으로 확인합니다. 문짝 가까이 1장 + 주방 전체 1장,
              지역·교체 범위를 보내주세요. 최종 금액은 방문 실측 후 확정합니다.
            </p>
            <dl className={s.heroFacts}>
              {[
                { n: "예산·범위", l: "문짝·서랍 앞판 수와 자재 기준" },
                { n: "맞춤 제작", l: "실측 후 보통 영업일 3~5일" },
                { n: "현장 설치", l: "설치 당일 보통 약 2~3시간" },
              ].map((f) => (
                <div key={f.n}>
                  <dt>{f.n}</dt>
                  <dd>{f.l}</dd>
                </div>
              ))}
            </dl>
            <p className={s.heroHint}>
              방문·설치 일정은 상담 후 확정하며, 설치 시간은 문짝 수량과 현장 구조에 따라 달라질 수 있습니다.
            </p>
          </div>
        </div>
        <div className={s.scrollCue} aria-hidden="true">
          SCROLL <span />
        </div>
      </Scrub>

      <nav aria-label="싱크대 문짝 교체 상세·리뷰" data-public-detail-tabs className={s.detailTabs}>
        <div className="mx-auto grid max-w-[720px] grid-cols-2 text-center">
          <button
            type="button"
            onClick={() => {
              setActiveTab("detail");
              window.setTimeout(() => {
                document.getElementById("sink-door-cases")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
          {/* 2. 실제 사례 */}
          {featuredRegionalDoorCases.length > 0 && (
            <section data-service-section="cases" id="sink-door-cases" className={s.section}>
              <div className={s.wrap}>
                <div className={s.split}>
                  <TitleCard kicker={region ? `${region} 실제 사례` : "실제 시공 사례"} title="Real Cases" />
                  <div className={s.glass}>
                    <h2 className={s.title}>
                      {region ? `${region} 싱크대 문짝 교체` : "싱크대 문짝 교체"}
                      <br />
                      실제 시공 사례
                    </h2>
                    <p className={s.body}>
                      문짝 교체·리폼도 현장마다 기존 몸통 상태, 문짝 수량, 마감 방식이 다릅니다.{" "}
                      {!region
                        ? "최근 실제 시공 사례에서 작업 전후와 현장별 선택 기준을 확인해보세요."
                        : hasSupplementalDoorCases
                          ? regionCaseCount > 0
                            ? `먼저 ${region} 지역 사례를 보여드리고, 부족한 부분은 최근 문짝 교체·리폼 사례로 함께 보강했습니다.`
                            : `${region} 지역 사례가 아직 부족해, 최근 문짝 교체·리폼 사례를 먼저 함께 보여드립니다.`
                          : `아래 사례들은 ${region} 지역에서 실제로 확인하고 시공한 작업입니다.`}
                    </p>
                  </div>
                </div>

                <div className={`${s.works} ${s.works3}`}>
                  {featuredRegionalDoorCases.map((item, idx) => {
                    const isSupplementalCase = region ? !item.region.includes(region) : false;
                    return (
                      <InView key={item.id} threshold={0.2}>
                        <Link
                          href={`/cases/${item.id}`}
                          className={`${s.work} ${s.glass} ${s.workGlass} ${s.fade}`}
                          style={{ transitionDelay: `${idx * 0.1}s` }}>
                          <div className={s.pairImg}>
                            {[
                              { src: item.beforeImg, label: "BEFORE" },
                              { src: item.afterImg, label: "AFTER" },
                            ].map((ph) => (
                              <div key={ph.label} className={s.workImg}>
                                <Image src={ph.src} alt={`${item.title} 작업 ${ph.label === "BEFORE" ? "전" : "후"}`} fill className="object-cover" sizes="(min-width: 768px) 200px, 45vw" />
                                <span className={s.pairTag} data-after={ph.label === "AFTER" || undefined}>{ph.label}</span>
                              </div>
                            ))}
                          </div>
                          <div className={s.workMeta}>
                            <span className={s.tag}>
                              {item.region} · {item.date.replaceAll("-", ".")}
                              {isSupplementalCase && " · 유사 최신 사례"}
                            </span>
                            <h3 className={s.workTitle}>{item.title}</h3>
                            <p className={s.workSummary}>{item.summary}</p>
                            <span className={`${s.arrowLink} ${s.workMore}`}>
                              <RollText text="READ MORE" />
                              <Arrow />
                            </span>
                          </div>
                        </Link>
                      </InView>
                    );
                  })}
                </div>
                <div className={s.afterCard}>
                  <Link href={`/cases?cat=${encodeURIComponent("싱크대 리폼")}`} className={s.arrowLink}>
                    <RollText text="ALL CASES" />
                    <Arrow />
                  </Link>
                </div>
                <details className={`${s.glass} ${s.moreDetails}`}>
                  <summary>실제 시공 영상 더 보기</summary>
                  <div className={s.moreBody}>
                    <YouTubeFacade videoId={REAL_VIDEO_ID} title="리스토리 싱크대 문짝 리폼 시공 영상" label="싱크대 문짝 리폼 시공 영상 재생" />
                  </div>
                </details>
              </div>
            </section>
          )}

          {/* 거대한 회색 영문 */}
          <Scrub className={s.marquee} aria-hidden="true">
            <span className={s.marqueeLine}>New doors, same kitchen,</span>
            <span className={s.marqueeLine}>a whole new mood.</span>
          </Scrub>

          {/* 3. 예산·범위 — 캐릭터 #1 (공감: 그대로 쓸 부분부터 확인) */}
          <section data-service-section="budget" id="sink-door-budget" className={s.section}>
            <div className={`${s.wrap} ${s.split}`}>
              <div className={s.stickyCol}>
                <TitleCard kicker="예산과 작업 범위" title="Budget & Scope" />
                <Mascot
                  src="/images/door/mascot-diagnose.png"
                  alt="처진 싱크대 문짝의 경첩을 살펴보는 리스토리 기사 캐릭터"
                  width={1168}
                  height={880}
                  className={s.mascotDiagnose}
                  bubble="그대로 쓸 수 있는 곳부터 볼게요"
                />
              </div>
              <div>
                <div className={s.glass}>
                  <RiseLines className={s.title} lines={["예산은 교체할 문짝과", "작업 범위부터 확인합니다"]} />
                  <InView>
                    <p className={`${s.body} ${s.fade}`}>
                      전체 길이보다 실제 교체할 문짝·서랍 앞판의 개수와 자재 종류가 기준입니다. 걸레받이와 몰딩은 필요한 길이를 m 단위로 확인합니다.
                    </p>
                  </InView>
                  <p className={s.badge}>전체 교체 대비 4~5배 절감</p>
                  <InView className={`${s.rows} ${s.rowsCompact}`} as="ol" threshold={0.1}>
                    {BUDGET_ITEMS.map((item) => (
                      <li key={item.n} className={`${s.row} ${s.fade}`}>
                        <span className={s.rowNum}>{item.n}</span>
                        <h3 className={s.rowTitle}>{item.title}</h3>
                        <p className={s.rowDesc}>{item.desc}</p>
                      </li>
                    ))}
                  </InView>
                  <p className={s.note}>
                    사진으로 교체 가능한 범위와 예상 견적을 먼저 확인하세요. 정확한 규격·몸통 상태와 최종 금액은 방문 실측 후 확정합니다.
                  </p>
                </div>
                <details className={`${s.glass} ${s.moreDetails}`}>
                  <summary>문짝·서랍 개수 확인 예시 보기</summary>
                  <div className={s.moreBody}>
                    <Image
                      src="/images/door/estimate-count-guide.webp"
                      alt="싱크대 문짝과 서랍 앞판 개수 세는 견적 산정 예시"
                      width={1400}
                      height={933}
                      unoptimized
                      className="h-auto w-full rounded-xl"
                      sizes="(max-width: 768px) 100vw, 720px"
                    />
                  </div>
                </details>
              </div>
            </div>
          </section>

          {/* 4. 일정 */}
          <section data-service-section="timeline" id="sink-door-timeline" className={s.section}>
            <div className={`${s.wrap} ${s.split}`}>
              <TitleCard kicker="제작 기간과 설치 시간" title="Schedule" />
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["제작 기간과 설치 시간을", "나눠서 확인하세요"]} />
                <InView>
                  <p className={`${s.body} ${s.fade}`}>사진 상담부터 설치까지, 단계마다 걸리는 시간을 따로 안내합니다.</p>
                </InView>
              </div>
            </div>
            <div className={s.wrap}>
              <div className={`${s.glass} ${s.rowsCard}`}>
                <InView className={s.rows} as="ol" threshold={0.1}>
                  {SCHEDULE_ITEMS.map((item, index) => (
                    <li key={item.title} className={`${s.row} ${s.fade}`}>
                      <span className={s.rowNum}>0{index + 1}</span>
                      <h3 className={s.rowTitle}>{item.title}</h3>
                      <p className={s.rowDesc}>{item.text}</p>
                      <span className={`${s.tag} ${s.rowAside}`}>{item.time}</span>
                    </li>
                  ))}
                </InView>
              </div>
              <p className={`${s.note} ${s.afterCard}`}>
                제작·설치 시간은 일반적인 기준이며, 문짝 수량과 현장 구조에 따라 달라질 수 있습니다. 제작 기간과 별도로 방문·설치 일정을 협의합니다.
              </p>
              <details className={`${s.glass} ${s.moreDetails}`}>
                <summary>실측부터 설치까지 공정 사진 보기</summary>
                <div className={s.moreBody}>
                  <div className={s.photoSteps}>
                    {PROCESS_PHOTOS.map((item) => (
                      <div key={item.step} className={s.photoStep}>
                        <div className={s.photoStepHead}>
                          <span className={s.rowNum}>{item.step}</span>
                          <span className={s.tag}>{item.badge}</span>
                        </div>
                        <h3 className={s.rowTitle}>{item.title}</h3>
                        <div className={s.photoStepImg} style={{ aspectRatio: item.imageRatio }}>
                          <Image src={item.image} alt={item.imageAlt} fill unoptimized sizes="(min-width: 768px) 520px, 100vw" className="object-cover" />
                        </div>
                        <p className={s.rowDesc}>{item.desc}</p>
                        <p className={s.note}>{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          </section>

          {/* 풀블리드 이미지 밴드 */}
          {bandCase && (
            <Scrub className={s.band}>
              <div className={s.bandFrame}>
                <Image src={bandCase.afterImg} alt="" fill className="object-cover" sizes="100vw" />
              </div>
              <div className={`${s.wrap} ${s.bandText}`}>
                <p className={s.bandTitle}>RENEW</p>
                <Link href={`/cases?cat=${encodeURIComponent("싱크대 리폼")}`} className={`${s.arrowLink} ${s.bandLink}`}>
                  <RollText text="ALL CASES" />
                  <Arrow />
                </Link>
              </div>
            </Scrub>
          )}

          {/* 5. 색상 */}
          <section data-service-section="colors" id="sink-door-colors" className={s.section}>
            <div className={`${s.wrap} ${s.split}`}>
              <div className={s.stickyCol}>
                <TitleCard kicker="색상 샘플" title="Color Samples" />
              </div>
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["취향에 맞는 색상으로", "골라보세요"]} />
                <p className={s.body}>
                  백색 · 크림화이트 · 포그 그레이 · 샌드 그레이 · 딥블루 · LPM 목무늬. 색상칩을 누르면 주방 적용 이미지를 먼저 볼 수 있고 방문 시 실물 샘플을 직접 확인하실 수 있습니다.
                </p>
                <div className={s.colorPreview}>
                  <Image
                    src={selectedColor.image}
                    alt={`${selectedColor.name} 싱크대 문짝 색상 적용 미리보기`}
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
                <p className={s.note}>
                  사진과 화면 색상은 실제 샘플과 다를 수 있어 출장 방문 시 실물을 보고 선택하실 수 있습니다. 색상은 방문 실측 때 실물로 확인합니다. 먼저 사진 2장과 지역·교체 범위를 보내 예상 견적을 확인하세요.
                </p>
                <div className={s.btnRow} data-sink-door-contact>
                  <Link href={REQUEST_URL} className={s.btnPrimary} data-cta="sink_door_request_colors">
                    <CameraIcon />
                    {PHOTO_CTA}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 6. 자재 — 글리치 다이어그램 (문짝·엣지·경첩이 함께 맞아야 새 주방) */}
          <section data-service-section="materials" id="sink-door-materials" className={s.section}>
            <div className={s.wrap}>
              <div className={s.split}>
                <div className={s.stickyCol}>
                  <TitleCard kicker="필름과 문짝 교체의 차이" title="Why Zero Joint" />
                </div>
                <div className={s.glass}>
                  <InkText lines={["색만 바꾸는 게 아니라,", "모서리까지 새로", "만드는 일입니다."]} />
                  <p className={s.body}>
                    필름 부착은 기존 문짝을 덮는 방식이고, 문짝 교체는 새 문짝을 맞춤 제작하는 방식입니다. 색상과 함께 기존 문짝 상태·엣지 마감도 확인하세요.
                  </p>
                  <div className={s.vennWrap}>
                    <GlitchDiagram
                      label="맞춤 문짝, 엣지 마감, 댐핑 경첩이 함께 맞아야 새 주방이 됩니다"
                      shapes={<VennShapes top={["DOOR", "맞춤 문짝"]} left={["EDGE", "엣지 마감"]} right={["HINGE", "댐핑 경첩"]} core="New" />}
                    />
                  </div>
                </div>
              </div>

              <details className={`${s.glass} ${s.moreDetails}`}>
                <summary>필름·PET 제로조인트와 엣지 마감 비교 보기</summary>
                <div className={s.moreBody}>
                  <p className={s.kicker}>가격만 보고 결정하지 마세요</p>
                  <h2 className={s.title}>필름 부착과 PET 제로조인트, 무엇이 다를까요?</h2>
                  <p className={s.body}>기존 문짝을 덮는 방식과 문짝 자체를 새로 만드는 방식의 차이입니다.</p>

                  <div className={s.compareRows}>
                    <div className={s.compareRow} data-tone="warn">
                      <div className={s.compareImg}>
                        <Image src={FILM_EDGE_IMAGE} alt="인테리어 필름 부착 마감" fill className="object-cover" quality={100} sizes="(min-width: 768px) 280px, calc(100vw - 80px)" />
                        <span className={s.compareBadge}>상태 나쁘면 비추천</span>
                      </div>
                      <div>
                        <p className={s.compareKicker}>주의 01 · 기존 문짝을 덮는 방식</p>
                        <h3 className={s.rowTitle}>필름 부착은 상태 영향을 받습니다</h3>
                        <p className={s.rowDesc}>
                          기존 문짝 위를 덮어 분위기를 바꾸는 방식입니다. 문짝이 이미 물먹었거나 들뜬 상태라면 기존 문제가 새 마감 위로 다시 드러날 수 있습니다.
                        </p>
                        <div className={s.chipRow}>
                          {["물먹음 영향", "들뜸 재발 가능", "기존 표면 상태 중요"].map((tag) => (
                            <span key={tag} className={s.tag}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className={s.compareRow}>
                      <div className={s.compareImg}>
                        <Image src={PET_ZEROJOINT_EDGE_IMAGE} alt="PET 제로조인트 문짝 마감" fill className="object-cover" quality={100} sizes="(min-width: 768px) 280px, calc(100vw - 80px)" />
                      </div>
                      <div>
                        <p className={s.compareKicker}>선택 02 · 문짝 자체를 새로 만드는 방식</p>
                        <h3 className={s.rowTitle}>PET 제로조인트 문짝 교체</h3>
                        <p className={s.rowDesc}>
                          기존 문짝을 철거한 뒤 새 문짝을 맞춤 제작하는 방식입니다. 표면 손상을 덮는 것이 아니라 교체하는 방식이라 마감과 내구성을 더 안정적으로 잡을 수 있습니다.
                        </p>
                        <div className={s.chipRow}>
                          {["새 문짝 맞춤 제작", "제로조인트 마감", "마감·내구성 안정"].map((tag) => (
                            <span key={tag} className={s.tag}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className={s.compareSummary}>
                    문짝이 이미 오래됐거나 물먹음·들뜸이 있다면 겉만 덮기보다 새 문짝으로 교체하는 편이 더 안정적입니다.
                  </p>

                  <div className={s.checkPoint}>
                    <p className={s.kicker}>Check Point</p>
                    <h3 className={s.title}>리스토리를 선택해야 하는 이유는 차고 넘칩니다!</h3>
                    <p className={s.rowTitle}>현존하는 최고의 엣지 기술</p>
                    <p className={s.rowDesc}>
                      처음엔 색상만 보여도, 오래 쓰면 모서리 접착선과 물먹음 차이가 먼저 보입니다. 문짝은 엣지까지 봐야 합니다.
                    </p>
                    <Image
                      src="/images/door/pet-difference.png"
                      alt="PET 제로조인트와 핫멜트 엣지 마감 비교"
                      width={1122}
                      height={1402}
                      className={s.checkImg}
                      sizes="(min-width: 768px) 600px, calc(100vw - 80px)"
                    />
                    <p className={s.compareKicker} data-tone="warn">시간이 지나고 나서 보이는 차이</p>
                    <p className={s.title}>신경 안 쓰면 가장 먼저 후회하는 부분, 엣지 마감입니다</p>
                    <p className={s.rowDesc}>
                      문짝 모서리로 물이 스며들면 시간이 지나 들뜸과 물먹음이 생길 수 있습니다. 그래서 처음 선택할 때 색상만큼 엣지 마감 방식도 같이 봐야 합니다.
                    </p>
                    <Image
                      src="/images/door/edge-water-damage.jpg"
                      alt="시간이 지나 물먹음이 생긴 싱크대 문짝 엣지 마감"
                      width={1632}
                      height={2184}
                      className={s.checkImg}
                      sizes="(min-width: 768px) 680px, calc(100vw - 80px)"
                    />
                    <p className={s.compareKicker} data-tone="warn">Check Point</p>
                    <p className={s.rowTitle}>물에 약해질 수 있는 핫멜트 접합</p>
                    <p className={s.rowDesc}>
                      핫멜트 방식의 접합 방식은 물에 지속적으로 노출될 때 불어 터질 수 있어, 주방처럼 물을 자주 쓰는 공간에서는 엣지 마감을 함께 확인해야 합니다.
                    </p>
                  </div>
                </div>
              </details>
            </div>
          </section>

          {/* 7. 사진 상담 — 캐릭터 #2 (행동 유도) */}
          <section data-service-section="photo_guide" id="sink-door-photos" className={s.section}>
            <div className={`${s.wrap} ${s.split}`}>
              <TitleCard kicker="사진 상담" title="Photo Consult" />
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["사진 2장으로", "우리 집 교체 범위부터 확인하세요"]} />
                <ul className={s.checkList}>
                  <li>① 문짝의 색상·상태가 보이는 가까운 사진 1장</li>
                  <li>② 상부장부터 하부장까지 주방 전체 사진 1장</li>
                  <li>함께 알려주세요: 작업 지역·교체를 원하는 범위</li>
                </ul>
                <p className={s.note}>
                  사진으로 교체 가능한 범위와 예상 견적을 안내합니다. 정확한 규격·몸통 상태와 최종 금액은 방문 실측 후 확정합니다.
                </p>
              </div>
            </div>
            <div className={s.wrap}>
              <div data-sink-door-contact>
                <PhotoCtaCard
                  title="사진 2장이면 시작돼요"
                  sub="문짝 가까이 1장 + 주방 전체 1장, 지역·교체 범위만 보내주세요."
                  href={REQUEST_URL}
                  label={PHOTO_CTA}
                  cta="sink_door_request_photo_guide"
                />
              </div>
              <div className={`${s.works} ${s.afterCard}`}>
                <div className={`${s.glass} ${s.workGlass}`}>
                  <div className={s.workMeta}>
                    <h3 className={s.rowTitle}>사진 ② · 주방 전체 촬영 예시</h3>
                    <p className={s.rowDesc}>문짝 가까이 사진과 별도로, 상부장부터 하부장까지 전체 모습도 담아주세요.</p>
                  </div>
                  <Image
                    src="/images/door/send-photo-guide.png"
                    alt="문짝이 모두 보이게 정면에서 찍어주세요"
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
                    <p className={s.rowDesc}>준비한 사진 2장을 보내주시면 교체 가능한 범위와 예상 견적을 안내해 드립니다.</p>
                    <div className={s.chipRow}>
                      {["문짝 가까이 사진 1장", "주방 전체가 보이는 사진 1장", "지역·교체를 원하는 범위"].map((t) => (
                        <span key={t} className={s.tag}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 8. 신뢰 */}
          <section data-service-section="warranty" id="sink-door-trust" className={s.section}>
            <div className={`${s.wrap} ${s.split}`}>
              <div className={s.stickyCol}>
                <TitleCard kicker="보증과 보험" title="Trust" />
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

          {/* 9. 영상 */}
          <section data-service-section="video" className={s.section}>
            <div className={s.wrap}>
              <div className={s.videoHead}>
                <TitleCard kicker="문짝 교체 영상" title="Movie" />
              </div>
              <div className={`${s.glass} ${s.videoCard}`}>
                <YouTubeFacade videoId={SINK_DOOR_VIDEO_ID} title="리스토리 싱크대 문짝 교체 영상" label="싱크대 문짝 교체 영상 재생" />
              </div>
            </div>
          </section>

          {/* 10. FAQ */}
          <section data-service-section="faq" id="sink-door-faq" className={s.section}>
            <div className={`${s.wrap} ${s.split}`}>
              <div className={s.stickyCol}>
                <TitleCard kicker="자주 묻는 질문" title="FAQ" />
              </div>
              <FaqList items={FAQ_ITEMS} idPrefix="sink-door-faq" />
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
                <p className={s.body}>문짝 교체 전후가 어떻게 달라졌는지 실제 사례 사진으로 확인해보세요.</p>
                <div className={s.ratingRow}>
                  <p className={s.ratingScore}>4.9</p>
                  <div>
                    <p className={s.ratingStars}>★★★★★</p>
                    <p className={s.note}>비포 애프터 리뷰 · 고객 리뷰와 실제 시공 사진 기준</p>
                  </div>
                </div>
              </div>
            </div>
            <p className={`${s.kicker} ${s.afterCard}`}>BEFORE AFTER · 실제 시공 사례 사진</p>
            <div className={s.works}>
              {reviewCases.map((item) => (
                <Link key={item.id} href={`/cases/${item.id}`} className={`${s.work} ${s.glass} ${s.workGlass}`}>
                  <div className={s.pairImg}>
                    {[
                      { label: "BEFORE", src: item.beforeImg },
                      { label: "AFTER", src: item.afterImg },
                    ].map((photo) => (
                      <div key={photo.label} className={s.workImg}>
                        <Image src={photo.src} alt={`${item.title} ${photo.label}`} fill className="object-cover" sizes="(min-width: 768px) 280px, calc(50vw - 32px)" />
                        <span className={s.pairTag} data-after={photo.label === "AFTER" || undefined}>{photo.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className={s.workMeta}>
                    <p className={s.ratingStars}>★★★★★ <span className={s.note}>{item.date.replaceAll("-", ".")}</span></p>
                    <h3 className={s.workTitle}>{item.review?.author ?? item.title}</h3>
                    <p className={s.note}>{item.region}</p>
                    <p className={s.workSummary} data-full>{item.review?.content ?? item.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Scrub>

      {/* 11. CONTACT — 캐릭터 #3 (마무리) */}
      {activeTab === "detail" && (
        <Scrub as="section" data-service-section="contact" className={s.contact}>
          <Star className={s.contactStar} />
          <div className={s.contactMascot}>
            <Image src="/images/premium/mascot-wave.png" alt="공구함을 들고 손을 흔드는 리스토리 기사 캐릭터" width={880} height={1168} sizes="(min-width: 900px) 360px, 150px" />
          </div>
          <div className={s.wrap} style={{ position: "relative" }}>
            <Link href={REQUEST_URL} className={s.contactBig} aria-label={PHOTO_CTA} data-cta="sink_door_request_contact_title">
              <RollText text="CONTACT" />
            </Link>
            <div className={s.split}>
              <p className={s.labelSmall} style={{ color: "rgba(255,255,255,0.7)" }}>지금 바로 시작하세요</p>
              <div>
                <h2 className={s.contactTitle} style={{ whiteSpace: "pre-line" }}>
                  {region ? `${region} 문짝 교체\n사진 2장으로 먼저 상담하세요` : "사진 2장으로\n우리 집 예상 견적부터"}
                </h2>
                <p className={s.contactSub}>
                  문짝 가까이 1장 + 주방 전체 1장, 지역·교체 범위를 보내주세요. 예상 견적을 먼저 안내하고 최종 금액은 방문 실측 후 확정합니다.
                </p>
                <div className={s.btnRow} data-sink-door-contact>
                  <Link href={REQUEST_URL} className={s.btnOnBlue} data-cta="sink_door_request_contact">
                    <CameraIcon />
                    {PHOTO_CTA}
                  </Link>
                  <a href={PHONE} className={s.btnGhost}>
                    <RollText text="1688-2957" />
                  </a>
                </div>
                <div className={s.chips}>
                  {["교체 비용의 1/5~", "경첩 무료 교체", "다양한 색상", "3년 무상 A/S"].map((b) => (
                    <span key={b}>{b}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Scrub>
      )}

      <LandingIntake field="kitchen" service="doors" />
      <FloatingCTA
        onReviewClick={showReviews}
        compactMobile
        avoidOverlapSelector="[data-sink-door-contact]"
        label={PHOTO_CTA}
        kakaoUrl={REQUEST_URL}
        newTab={false}
      />
    </main>
  );
}
