"use client";

import { LandingTrail, LandingIntake } from "./shared/LandingNavigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/app/components/FadeIn";
import FloatingCTA from "@/app/components/landing/shared/FloatingCTA";
import { FAQJsonLd, ServiceJsonLd } from "@/app/components/JsonLd";
import { buildTrackedContactPath } from "@/lib/attribution";
import { cases } from "@/lib/case-data";
import { REGIONS } from "@/lib/seo-regions";

const PHONE = buildTrackedContactPath("phone", "sink_door");
const KAKAO_URL = buildTrackedContactPath("kakao", "sink_door");
const SINK_DOOR_VIDEO_ID = "tC4VLNFgvCE";
const REAL_VIDEO_ID = "sydwgU5o4DY";
const REVIEW_BADGE_IMAGE = "/images/door/before-after-review-badge.png";
const FILM_EDGE_IMAGE = "/images/door/film.png";
const PET_ZEROJOINT_EDGE_IMAGE = "/images/door/pet-zerojoint-edge.png";
const CHAT_CONSULT_EXAMPLE_IMAGE =
  "/images/door/chat-consult-example-safe.webp";
const VISIT_MEASUREMENT_IMAGE = "/images/door/visit-measurement.webp";
const REAL_SAMPLE_CHECK_IMAGE = "/images/door/real-sample-check.webp";
const CUSTOM_PRODUCTION_IMAGE = "/images/door/factory-direct.gif";
const FIELD_INSTALLATION_IMAGE = "/images/door/field-installation.webp";
const PHOTO_CTA = "사진 2장으로 예상 견적 받기";
const SITE_URL = "https://www.restorystudio.co.kr";

type SinkDoorCase = (typeof cases)[number];

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

function parseKeyword(keyword: string): { region: string; type: string } {
  const kw = keyword.replace(/-/g, " ");
  const region = REGIONS.find((r) => kw.includes(r)) ?? "";
  const type = kw.includes("리폼") ? "리폼" : "교체";
  return { region, type };
}

function YouTubeFacade({ videoId }: { videoId: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className="relative aspect-video overflow-hidden rounded-2xl cursor-pointer"
      style={{ background: "#000" }}
      onClick={() => setLoaded(true)}
    >
      {loaded ? (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="리스토리 싱크대 문짝 리폼 시공 영상"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt="시공 영상 썸네일"
            className="h-full w-full object-cover"
            style={{ opacity: 0.75 }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "rgba(255,0,0,0.92)" }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  marginLeft: 4,
                  borderTop: "11px solid transparent",
                  borderBottom: "11px solid transparent",
                  borderLeft: "18px solid white",
                }}
              />
            </div>
            <p className="text-[13px] font-bold text-white/80">
              탭해서 실제 시공 영상 보기
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function YouTubeHeroPlayer({ videoId }: { videoId: string }) {
  return (
    <div
      className="relative overflow-hidden bg-black"
      style={{ aspectRatio: "16 / 9" }}
    >
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0&modestbranding=1`}
        title="리스토리 싱크대 문짝 교체 영상"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

function RegionalDoorCaseItemListJsonLd({
  name,
  items,
}: {
  name: string;
  items: SinkDoorCase[];
}) {
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface Props {
  keyword?: string;
  canonicalUrl?: string;
}

export default function SinkdoorReformLanding({
  keyword,
  canonicalUrl,
}: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"detail" | "reviews">("detail");
  const [selectedColorName, setSelectedColorName] = useState(
    COLOR_SAMPLE_PREVIEWS[0].name,
  );
  const selectedColor =
    COLOR_SAMPLE_PREVIEWS.find((sample) => sample.name === selectedColorName) ??
    COLOR_SAMPLE_PREVIEWS[0];

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

  const { region, type } = keyword
    ? parseKeyword(keyword)
    : { region: "", type: "" };

  const heroTitle = region
    ? `${region} 싱크대 문짝 ${type}`
    : "싱크대 문짝 교체만 해도\n새 주방 됩니다";
  const serviceUrl =
    canonicalUrl ??
    (keyword
      ? `https://www.restorystudio.co.kr/kitchen/${keyword}`
      : "https://www.restorystudio.co.kr/kitchen/sink-door");

  const latestDoorCases = cases
    .filter((c) => c.category === "싱크대 리폼")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const regionalDoorCases = region
    ? latestDoorCases.filter((c) => c.region.includes(region))
    : [];
  const regionalDoorCaseIds = new Set(regionalDoorCases.map((item) => item.id));
  const supplementalDoorCases =
    region && regionalDoorCases.length < 3
      ? latestDoorCases
          .filter((item) => !regionalDoorCaseIds.has(item.id))
          .slice(0, 3 - regionalDoorCases.length)
      : [];
  const regionCaseCount = regionalDoorCases.length;
  const featuredRegionalDoorCases = region
    ? [...regionalDoorCases.slice(0, 3), ...supplementalDoorCases]
    : latestDoorCases
        .filter((item) => /싱크대|씽크대|주방/.test(item.title))
        .slice(0, 3);
  const hasSupplementalDoorCases = supplementalDoorCases.length > 0;
  const reviewCases = latestDoorCases.filter((c) => c.review);
  const showReviews = () => {
    setActiveTab("reviews");
    window.setTimeout(() => {
      document
        .getElementById("restory-reviews")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  return (
    <main data-service-id="sink-door" data-service-keyword={keyword}
      className="bg-white"
      style={{
        fontFamily:
          "'Wanted Sans Variable','Wanted Sans',-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif",
      }}
    >
      <ServiceJsonLd
        name={
          region ? `${region} 싱크대 문짝 교체·리폼` : "싱크대 문짝 교체·리폼"
        }
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

      {/* Desired outcome and a clear first step */}
      <LandingTrail field="kitchen" title="싱크대 문짝 교체" />
      <section data-service-section="hero" id="sink-door-outcome" className="bg-white px-5 py-8 md:py-12">
        <div className="mx-auto grid max-w-[1100px] items-center gap-7 md:grid-cols-2 md:gap-10">
          <div>
            <p className="mb-3 text-[13px] font-black text-[#1a5cff]">
              {region ? `${region} 싱크대 문짝 교체` : "싱크대 문짝 교체"}
            </p>
            <h1 className="whitespace-pre-line break-keep text-[28px] font-black leading-[1.25] text-neutral-950 md:text-[38px]">
              {heroTitle}
            </h1>
            <p className="mt-4 break-keep text-[15px] font-medium leading-[1.8] text-neutral-600 md:text-[17px]">
              쓸 수 있는 상판과 몸통은 그대로, 문짝과 서랍 앞판을 바꿔 주방
              분위기를 바꿉니다.
            </p>
            <p className="mt-2 text-[13px] leading-[1.7] text-neutral-500">
              기존 몸통을 계속 사용할 수 있는지 사진과 방문 실측으로 확인합니다.
            </p>
            <div
              data-sink-door-contact
              className="mt-5 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="sink_door_video_kakao"
                className="flex min-h-[54px] items-center justify-center rounded-xl bg-[#FEE500] px-4 text-[14px] font-black text-[#1a1a1a]"
              >
                {PHOTO_CTA}
              </a>
              <a
                href={PHONE}
                data-cta="sink_door_video_phone"
                className="flex min-h-[54px] items-center justify-center rounded-xl bg-[#1a5cff] px-4 text-[14px] font-black text-white"
              >
                1688-2957 전화 문의
              </a>
            </div>
            <p className="mt-3 text-[12px] leading-[1.7] text-neutral-500">
              문짝 가까이 1장 + 주방 전체 1장, 지역·교체 범위를 보내주세요.
              사진으로 예상 견적을 안내하고, 최종 금액은 방문 실측 후
              확정합니다.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl bg-black">
            <YouTubeHeroPlayer videoId={SINK_DOOR_VIDEO_ID} />
          </div>
        </div>
        <div className="mx-auto mt-7 grid max-w-[1100px] gap-3 rounded-2xl border border-[#dbe6ff] bg-[#f5f8ff] p-4 sm:grid-cols-3 md:p-5">
          {[
            { title: "예산·범위", text: "문짝·서랍 앞판 수와 자재 기준" },
            { title: "맞춤 제작", text: "실측 후 보통 영업일 3~5일" },
            { title: "현장 설치", text: "설치 당일 보통 약 2~3시간" },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-baseline justify-between gap-3 sm:block"
            >
              <p className="shrink-0 text-[13px] font-black text-[#1a5cff]">
                {item.title}
              </p>
              <p className="text-right text-[13px] leading-[1.7] text-neutral-600 sm:mt-1 sm:text-left">
                {item.text}
              </p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-2 max-w-[1100px] text-[12px] text-neutral-500">
          방문·설치 일정은 상담 후 확정하며, 설치 시간은 문짝 수량과 현장 구조에
          따라 달라질 수 있습니다.
        </p>
      </section>

      <nav aria-label="싱크대 문짝 교체 상세·리뷰" data-public-detail-tabs>
        <div className="mx-auto grid max-w-[720px] grid-cols-2 text-center">
          <button
            type="button"
            onClick={() => {
              setActiveTab("detail");
              window.setTimeout(() => {
                document
                  .getElementById("sink-door-cases")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 0);
            }}
            aria-pressed={activeTab === "detail"}

          >
            서비스 상세
          </button>
          <button
            type="button"
            onClick={showReviews}
            aria-pressed={activeTab === "reviews"}

          >
            <span className="inline-flex items-center justify-center gap-1.5">
              <span>리뷰</span>
              </span>
          </button>
        </div>
      </nav>

      <div className={activeTab === "detail" ? "block" : "hidden"}>
        {featuredRegionalDoorCases.length > 0 && (
          <section data-service-section="cases"
            id="sink-door-cases"
            className="scroll-mt-32 px-5 py-12"
            style={{ background: "#f8f9fb" }}
          >
            <div className="mx-auto max-w-[1100px]">
              <FadeIn>
                <p className="mb-2 text-[12px] font-bold tracking-widest text-[#1a5cff]">
                  {region ? `${region} REAL CASES` : "REAL CASES"}
                </p>
                <h2
                  className="mb-3 font-black leading-[1.2] text-neutral-950"
                  style={{ fontSize: "clamp(1.55rem, 5vw, 2.3rem)" }}
                >
                  {region ? `${region} 싱크대 문짝 교체` : "싱크대 문짝 교체"}
                  <br />
                  실제 시공 사례
                </h2>
                <p className="mb-7 text-[14px] font-medium leading-[1.8] text-neutral-500">
                  문짝 교체·리폼도 현장마다 기존 몸통 상태, 문짝 수량, 마감
                  방식이 다릅니다.{" "}
                  {!region
                    ? "최근 실제 시공 사례에서 작업 전후와 현장별 선택 기준을 확인해보세요."
                    : hasSupplementalDoorCases
                      ? regionCaseCount > 0
                        ? `먼저 ${region} 지역 사례를 보여드리고, 부족한 부분은 최근 문짝 교체·리폼 사례로 함께 보강했습니다.`
                        : `${region} 지역 사례가 아직 부족해, 최근 문짝 교체·리폼 사례를 먼저 함께 보여드립니다.`
                      : `아래 사례들은 ${region} 지역에서 실제로 확인하고 시공한 작업입니다.`}
                </p>
              </FadeIn>

              <div className="grid gap-4 md:grid-cols-3">
                {featuredRegionalDoorCases.map((item, index) => {
                  const isSupplementalCase = region
                    ? !item.region.includes(region)
                    : false;

                  return (
                    <FadeIn key={item.id} delay={index * 70} className="h-full">
                      <Link
                        href={`/cases/${item.id}`}
                        className="block h-full overflow-hidden rounded-2xl bg-white"
                        style={{
                          border: "1px solid #e5e7eb",
                          textDecoration: "none",
                        }}
                      >
                        <div className="grid grid-cols-2 gap-px bg-neutral-200">
                          <div className="relative aspect-[4/3] bg-neutral-100">
                            <Image
                              src={item.beforeImg}
                              alt={`${item.title} 작업 전`}
                              fill
                              className="object-cover"
                              sizes="(min-width: 768px) 260px, 50vw"
                            />
                            <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-black text-white">
                              BEFORE
                            </span>
                          </div>
                          <div className="relative aspect-[4/3] bg-neutral-100">
                            <Image
                              src={item.afterImg}
                              alt={`${item.title} 작업 후`}
                              fill
                              className="object-cover"
                              sizes="(min-width: 768px) 260px, 50vw"
                            />
                            <span className="absolute left-2 top-2 rounded-full bg-[#1a5cff] px-2 py-1 text-[10px] font-black text-white">
                              AFTER
                            </span>
                          </div>
                        </div>
                        <div className="p-5">
                          <p className="mb-2 flex flex-wrap items-center gap-2 text-[12px] font-black text-[#1a5cff]">
                            <span>
                              {item.region} · {item.date.replaceAll("-", ".")}
                            </span>
                            {isSupplementalCase && (
                              <span className="rounded-full bg-neutral-100 px-2 py-1 text-[10px] font-black text-neutral-500">
                                유사 최신 사례
                              </span>
                            )}
                          </p>
                          <h3 className="mb-3 text-[17px] font-black leading-[1.35] text-neutral-950">
                            {item.title}
                          </h3>
                          <p className="line-clamp-3 text-[13px] font-medium leading-[1.75] text-neutral-500">
                            {item.summary}
                          </p>
                          <p className="mt-4 text-[13px] font-black text-neutral-900">
                            사례 자세히 보기 →
                          </p>
                        </div>
                      </Link>
                    </FadeIn>
                  );
                })}
              </div>
              <Link
                href={`/cases?cat=${encodeURIComponent("싱크대 리폼")}`}
                className="mt-6 inline-block text-[13px] font-bold text-[#1a5cff]"
              >
                싱크대 리폼 사례 전체 보기 →
              </Link>
              <details className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
                <summary className="cursor-pointer text-[14px] font-black text-[#1a5cff]">
                  실제 시공 영상 더 보기
                </summary>
                <div className="mt-4 mx-auto max-w-[720px]">
                  <YouTubeFacade videoId={REAL_VIDEO_ID} />
                </div>
              </details>
            </div>
          </section>
        )}

        {/* Budget and scope: keep confirmed terms, without publishing new prices */}
        <section data-service-section="budget"
          id="sink-door-budget"
          className="px-5 py-12 md:py-16"
          style={{ background: "#fff" }}
        >
          <div className="mx-auto max-w-[720px]">
            <FadeIn>
              <p className="mb-3 text-[12px] font-bold tracking-widest text-[#1a5cff]">
                BUDGET & SCOPE
              </p>
              <h2 className="break-keep text-[28px] font-black leading-[1.3] text-neutral-950 md:text-[36px]">
                예산은 교체할 문짝과
                <br />
                작업 범위부터 확인합니다
              </h2>
              <p className="mt-4 text-[15px] leading-[1.8] text-neutral-600">
                전체 길이보다 실제 교체할 문짝·서랍 앞판의 개수와 자재 종류가
                기준입니다. 걸레받이와 몰딩은 필요한 길이를 m 단위로 확인합니다.
              </p>
              <p className="mt-3 inline-block rounded-full bg-[#eef4ff] px-4 py-2 text-[13px] font-black text-[#1a5cff]">
                전체 교체 대비 4~5배 절감
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    title: "새로 제작할 부분",
                    text: "교체할 문짝과 서랍 앞판의 수량·규격·자재를 확인합니다.",
                  },
                  {
                    title: "함께 교체할 부속",
                    text: "교체하는 문짝의 경첩은 무료로 교체합니다.",
                  },
                  {
                    title: "그대로 사용할 부분",
                    text: "사용 가능한 상판·몸통·주방 배치는 유지합니다. 몸통 상태는 실측 때 확인합니다.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-neutral-200 bg-[#f8f9fb] p-5"
                  >
                    <h3 className="text-[15px] font-black text-neutral-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-[1.75] text-neutral-600">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-5 rounded-xl bg-[#eef4ff] p-4 text-[14px] leading-[1.8] text-neutral-600">
                사진으로 교체 가능한 범위와 예상 견적을 먼저 확인하세요. 정확한
                규격·몸통 상태와 최종 금액은 방문 실측 후 확정합니다.
              </p>
            </FadeIn>
            <details className="mt-5 rounded-2xl border border-neutral-200 p-5">
              <summary className="cursor-pointer text-[14px] font-black text-[#1a5cff]">
                문짝·서랍 개수 확인 예시 보기
              </summary>
              <Image
                src="/images/door/estimate-count-guide.webp"
                alt="싱크대 문짝과 서랍 앞판 개수 세는 견적 산정 예시"
                width={1400}
                height={933}
                unoptimized
                className="mt-4 h-auto w-full rounded-xl"
                sizes="(max-width: 768px) 100vw, 720px"
              />
            </details>
          </div>
        </section>

        {/* Time to completion */}
        <section data-service-section="timeline"
          id="sink-door-timeline"
          className="bg-[#f8f9fb] px-5 py-12 md:py-16"
        >
          <div className="mx-auto max-w-[720px]">
            <FadeIn>
              <p className="mb-3 text-[12px] font-bold tracking-widest text-[#1a5cff]">
                SCHEDULE
              </p>
              <h2 className="break-keep text-[28px] font-black leading-[1.3] text-neutral-950 md:text-[36px]">
                제작 기간과 설치 시간을
                <br />
                나눠서 확인하세요
              </h2>
              <ol className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    title: "사진 상담",
                    time: "예상 견적 확인",
                    text: "사진 2장과 지역·교체 범위로 먼저 상담합니다.",
                  },
                  {
                    title: "방문 실측·샘플 확인",
                    time: "일정 협의",
                    text: "규격과 몸통 상태, 실물 색상을 확인하고 최종 견적·설치 일정을 확정합니다.",
                  },
                  {
                    title: "맞춤 제작",
                    time: "실측 후 영업일 3~5일",
                    text: "측정한 규격으로 문짝과 서랍 앞판을 제작합니다.",
                  },
                  {
                    title: "현장 설치",
                    time: "설치 당일 약 2~3시간",
                    text: "새 문짝을 설치하고 경첩·간격·수평을 조절합니다.",
                  },
                ].map((item, index) => (
                  <li
                    key={item.title}
                    className="rounded-2xl border border-neutral-200 bg-white p-5"
                  >
                    <p className="text-[12px] font-black text-[#1a5cff]">
                      0{index + 1} · {item.time}
                    </p>
                    <h3 className="mt-2 text-[17px] font-black text-neutral-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-[1.75] text-neutral-600">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-[12px] leading-[1.7] text-neutral-500">
                제작·설치 시간은 일반적인 기준이며, 문짝 수량과 현장 구조에 따라
                달라질 수 있습니다. 제작 기간과 별도로 방문·설치 일정을
                협의합니다.
              </p>
            </FadeIn>
            <details className="mt-5 rounded-2xl border border-neutral-200 bg-white p-5">
              <summary className="cursor-pointer text-[14px] font-black text-[#1a5cff]">
                실측부터 설치까지 공정 사진 보기
              </summary>
              <div className="mt-5 space-y-4">
                {[
                  {
                    step: "02",
                    title: "방문 실측",
                    badge: "규격 확인",
                    desc: "예상 견적을 확인한 뒤 방문 일정을 잡습니다. 현장에서 문짝과 서랍 앞판의 크기, 경첩 위치, 걸레받이·몰딩 길이를 정확하게 측정합니다.",
                    note: "기존 싱크대 몸통을 그대로 사용할 수 있는지도 함께 확인합니다.",
                    bars: ["w-10", "w-16", "w-20"],
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
                    bars: ["#fbfbf8", "#1d3a46", "#f0eee6"],
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
                    bars: ["w-20", "w-14", "w-24"],
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
                    bars: ["w-12", "w-12", "w-12"],
                    image: FIELD_INSTALLATION_IMAGE,
                    imageAlt:
                      "현장에서 기존 싱크대 문짝을 철거하고 설치를 준비하는 모습",
                    imageRatio: "4 / 3",
                  },
                ].map((item) => (
                  <div key={item.step}>
                    <div
                      className="grid gap-4 rounded-2xl bg-white p-5 md:grid-cols-[92px_1fr]"
                      style={{ border: "1px solid #e5e7eb" }}
                    >
                      <div className="flex items-center gap-3 md:block">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-950 text-[14px] font-black text-white md:mb-3">
                          {item.step}
                        </span>
                        <span className="rounded-full bg-[#eef4ff] px-3 py-1.5 text-[11px] font-black text-[#1a5cff]">
                          {item.badge}
                        </span>
                      </div>
                      <div>
                        <h3 className="mb-3 text-[20px] font-black leading-tight text-neutral-950 md:text-[24px]">
                          {item.title}
                        </h3>
                        {item.image ? (
                          <div
                            className="relative mb-4 overflow-hidden rounded-xl bg-neutral-100"
                            style={{ aspectRatio: item.imageRatio ?? "4 / 3" }}
                          >
                            <Image
                              src={item.image}
                              alt={item.imageAlt ?? ""}
                              fill
                              unoptimized
                              sizes="(min-width: 768px) 520px, 100vw"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="mb-4 flex h-14 items-center gap-2 rounded-xl bg-[#f8f9fb] px-4">
                            {item.bars.map((bar, index) => (
                              <span
                                key={`${item.step}-${index}`}
                                className={`h-7 rounded-md ${
                                  bar.startsWith("#") ? "w-10" : bar
                                }`}
                                style={{
                                  background: bar.startsWith("#")
                                    ? bar
                                    : index === 1
                                      ? "#1a5cff"
                                      : "#dbe6ff",
                                  border: "1px solid rgba(15,23,42,0.08)",
                                }}
                              />
                            ))}
                          </div>
                        )}
                        <p className="text-[14px] font-medium leading-[1.75] text-neutral-600">
                          {item.desc}
                        </p>
                        <p className="mt-2 text-[13px] font-medium leading-[1.7] text-neutral-400">
                          {item.note}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </section>

        {/* 3. COLORS */}
        <section data-service-section="colors"
          id="sink-door-colors"
          className="px-5 py-14 md:py-20"
          style={{ background: "#fff" }}
        >
          <div className="mx-auto max-w-lg">
            <FadeIn>
              <p className="text-[12px] font-bold tracking-widest text-[#1a5cff] mb-2">
                COLOR SAMPLES
              </p>
              <h2
                className="font-black leading-[1.2] mb-2"
                style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}
              >
                취향에 맞는 색상으로
                <br />
                골라보세요
              </h2>
              <p className="text-[14px] text-neutral-500 mb-6">
                백색 · 크림화이트 · 포그 그레이 · 샌드 그레이 · 딥블루 · LPM
                목무늬.
                <br />
                색상칩을 누르면 주방 적용 이미지를 먼저 볼 수 있고
                <br />
                방문 시 실물 샘플을 직접 확인하실 수 있습니다.
              </p>
            </FadeIn>
            <FadeIn delay={80}>
              <div
                className="overflow-hidden rounded-2xl"
                style={{ border: "1px solid #e5e7eb" }}
              >
                <Image
                  src={selectedColor.image}
                  alt={`${selectedColor.name} 싱크대 문짝 색상 적용 미리보기`}
                  width={1084}
                  height={1451}
                  unoptimized
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 512px"
                />
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div
                className="mt-4 rounded-2xl p-4"
                style={{ background: "#f8f9fb", border: "1px solid #e5e7eb" }}
              >
                <div className="grid grid-cols-3 gap-x-2.5 gap-y-4 sm:grid-cols-5">
                  {COLOR_SAMPLE_PREVIEWS.map((sample) => (
                    <button
                      key={sample.name}
                      type="button"
                      onClick={() => setSelectedColorName(sample.name)}
                      className="text-center"
                      aria-pressed={selectedColorName === sample.name}
                    >
                      <div
                        className="h-10 rounded-md"
                        style={{
                          background: sample.swatchImage
                            ? `${sample.color} url(${sample.swatchImage}) center / cover`
                            : sample.color,
                          border:
                            selectedColorName === sample.name
                              ? "2px solid #1a5cff"
                              : "1px solid rgba(15,23,42,0.12)",
                          boxShadow:
                            selectedColorName === sample.name
                              ? "0 0 0 3px rgba(26,92,255,0.14)"
                              : "none",
                        }}
                      />
                      <p className="mt-1.5 break-keep text-[12px] font-medium leading-[1.35] text-neutral-600">
                        {sample.name}
                      </p>
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-[12px] leading-[1.65] text-neutral-500">
                  사진과 화면 색상은 실제 샘플과 다를 수 있어 출장 방문 시
                  실물을 보고 선택하실 수 있습니다.
                </p>
              </div>
            </FadeIn>
            <p className="mt-5 text-[13px] leading-[1.7] text-neutral-500">
              색상은 방문 실측 때 실물로 확인합니다. 먼저 사진 2장과 지역·교체
              범위를 보내 예상 견적을 확인하세요.
            </p>
            <FadeIn delay={160}>
              <a
                data-sink-door-contact
                data-cta="sink_door_colors_kakao"
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-2xl text-[15px] font-black"
                style={{
                  background: "#FEE500",
                  color: "#1a1a1a",
                  padding: "16px 24px",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
                </svg>
                {PHOTO_CTA}
              </a>
            </FadeIn>
          </div>
        </section>

        <section data-service-section="materials"
          id="sink-door-materials"
          className="bg-white px-5 pb-12 md:pb-16"
        >
          <div className="mx-auto max-w-lg">
            <p className="text-[14px] leading-[1.8] text-neutral-600">
              필름 부착은 기존 문짝을 덮는 방식이고, 문짝 교체는 새 문짝을 맞춤
              제작하는 방식입니다. 색상과 함께 기존 문짝 상태·엣지 마감도
              확인하세요.
            </p>
            <details className="mt-4 rounded-2xl border border-[#dbe6ff] bg-[#f8f9fb] p-4">
              <summary className="cursor-pointer text-[14px] font-black text-[#1a5cff]">
                필름·PET 제로조인트와 엣지 마감 비교 보기
              </summary>
              <div>
                <div className="mt-12 text-center">
                  <p className="mb-3 text-[14px] font-black text-[#1a5cff] md:text-[16px]">
                    가격만 보고 결정하지 마세요
                  </p>
                  <h2
                    className="mb-6 font-black leading-[1.24] text-neutral-950"
                    style={{ fontSize: "clamp(1.8rem, 6vw, 2.75rem)" }}
                  >
                    필름 부착과
                    <br />
                    PET 제로조인트,
                    <br />
                    무엇이 다를까요?
                  </h2>
                  <p className="mb-7 text-[15px] font-medium leading-[1.85] text-neutral-500 md:text-[18px]">
                    기존 문짝을 덮는 방식과 문짝 자체를 새로 만드는 방식의
                    차이입니다.
                  </p>
                  <div className="overflow-hidden rounded-2xl text-left shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
                    <div
                      className="grid gap-6 bg-[#fff4f1] px-5 py-8 md:grid-cols-[1fr_240px] md:items-center md:px-8 md:py-10"
                      style={{ borderLeft: "5px solid #ef4444" }}
                    >
                      <div>
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#ef4444] px-3 py-1 text-[12px] font-black text-white">
                            주의 01
                          </span>
                          <span className="text-[12px] font-black text-[#b91c1c]">
                            기존 문짝을 덮는 방식
                          </span>
                        </div>
                        <h3 className="mb-4 text-[26px] font-black leading-[1.22] text-neutral-950 md:text-[34px]">
                          필름 부착은
                          <br />
                          상태 영향을 받습니다
                        </h3>
                        <p className="text-[15px] font-medium leading-[1.85] text-[#7f1d1d] md:text-[17px]">
                          기존 문짝 위를 덮어 분위기를 바꾸는 방식입니다. 문짝이
                          이미 물먹었거나 들뜬 상태라면 기존 문제가 새 마감 위로
                          다시 드러날 수 있습니다.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {[
                            "물먹음 영향",
                            "들뜸 재발 가능",
                            "기존 표면 상태 중요",
                          ].map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white px-3 py-1.5 text-[12px] font-black text-[#b91c1c]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 shadow-[0_14px_34px_rgba(15,23,42,0.12)] md:aspect-[4/5]">
                        <Image
                          src={FILM_EDGE_IMAGE}
                          alt="인테리어 필름 부착 마감"
                          fill
                          className="object-cover"
                          quality={100}
                          sizes="(min-width: 768px) 360px, calc(100vw - 40px)"
                        />
                        <div className="absolute inset-0 bg-[#7f1d1d]/12" />
                        <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-[12px] font-black text-[#b91c1c] shadow">
                          상태 나쁘면 비추천
                        </div>
                      </div>
                    </div>
                    <div
                      className="grid gap-6 bg-[#eef4ff] px-5 py-8 md:grid-cols-[240px_1fr] md:items-center md:px-8 md:py-10"
                      style={{ borderLeft: "5px solid #1a5cff" }}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 shadow-[0_14px_34px_rgba(26,92,255,0.12)] md:aspect-[4/5]">
                        <Image
                          src={PET_ZEROJOINT_EDGE_IMAGE}
                          alt="PET 제로조인트 문짝 마감"
                          fill
                          className="object-cover"
                          quality={100}
                          sizes="(min-width: 768px) 360px, calc(100vw - 40px)"
                        />
                      </div>
                      <div>
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#1a5cff] px-3 py-1 text-[12px] font-black text-white">
                            선택 02
                          </span>
                          <span className="text-[12px] font-black text-[#1a5cff]">
                            문짝 자체를 새로 만드는 방식
                          </span>
                        </div>
                        <h3 className="mb-4 text-[26px] font-black leading-[1.22] text-neutral-950 md:text-[34px]">
                          PET 제로조인트
                          <br />
                          문짝 교체
                        </h3>
                        <p className="text-[15px] font-medium leading-[1.85] text-neutral-600 md:text-[17px]">
                          기존 문짝을 철거한 뒤 새 문짝을 맞춤 제작하는
                          방식입니다. 표면 손상을 덮는 것이 아니라 교체하는
                          방식이라 마감과 내구성을 더 안정적으로 잡을 수
                          있습니다.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {[
                            "새 문짝 맞춤 제작",
                            "제로조인트 마감",
                            "마감·내구성 안정",
                          ].map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white px-3 py-1.5 text-[12px] font-black text-[#1a5cff]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white px-5 py-5 text-left text-[15px] font-black leading-[1.8] text-neutral-950 md:px-8 md:text-[18px]">
                      문짝이 이미 오래됐거나 물먹음·들뜸이 있다면
                      <br />
                      겉만 덮기보다 새 문짝으로 교체하는 편이 더 안정적입니다.
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="relative left-1/2 mt-4 w-[calc(100vw-40px)] max-w-[760px] -translate-x-1/2 overflow-hidden rounded-[28px] bg-white shadow-[0_18px_48px_rgba(31,102,255,0.10)] ring-1 ring-[#d8e8ff]">
                  <div className="px-6 py-8 text-left md:px-9 md:py-10">
                    <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-9">
                      <div>
                        <p className="mb-4 font-serif text-[13px] italic leading-none text-[#1f66ff]">
                          Check Point
                        </p>
                        <h3 className="text-[31px] font-black leading-[1.18] text-neutral-950 md:text-[36px]">
                          리스토리를
                          <br />
                          선택해야 하는 이유는
                          <br />
                          차고 넘칩니다!
                        </h3>
                      </div>
                      <div className="self-end">
                        <div className="mb-2 flex items-center gap-3">
                          <span className="text-[12px] font-black text-[#1f66ff]">
                            Check Point
                          </span>
                          <span className="h-px flex-1 bg-[#1f66ff]/55" />
                          <span className="h-2 w-2 rounded-full bg-[#1f66ff]" />
                        </div>
                        <p className="text-[17px] font-black leading-snug text-neutral-950 md:text-[19px]">
                          현존하는 최고의 엣지 기술
                        </p>
                        <p className="mt-2 text-[13px] font-medium leading-[1.7] text-neutral-600 md:text-[14px]">
                          처음엔 색상만 보여도, 오래 쓰면 모서리 접착선과 물먹음
                          차이가 먼저 보입니다. 문짝은 엣지까지 봐야 합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative bg-[#f4f9ff] px-4 pt-4 md:px-10 md:pt-8">
                    <Image
                      src="/images/door/pet-difference.png"
                      alt="PET 제로조인트와 핫멜트 엣지 마감 비교"
                      width={1122}
                      height={1402}
                      className="mx-auto h-auto w-full max-w-[600px] rounded-[18px]"
                      sizes="(min-width: 768px) 600px, calc(100vw - 72px)"
                    />
                  </div>
                  <div className="border-y border-[#d8e8ff] bg-[#f7fbff] px-5 py-6 md:px-10 md:py-8">
                    <div className="text-left">
                      <p className="mb-3 text-[13px] font-black text-[#e32e40] md:text-[14px]">
                        시간이 지나고 나서 보이는 차이
                      </p>
                      <p className="text-[24px] font-black leading-[1.25] text-neutral-950 md:text-[32px]">
                        신경 안 쓰면
                        <br />
                        가장 먼저{" "}
                        <span className="bg-gradient-to-t from-[#ffe16a] from-[48%] to-transparent to-[48%] px-1">
                          후회하는 부분,
                        </span>
                        <br />
                        엣지 마감입니다
                      </p>
                      <p className="mt-4 text-[14px] font-medium leading-[1.75] text-neutral-600 md:text-[16px]">
                        문짝 모서리로 물이 스며들면 시간이 지나 들뜸과 물먹음이
                        생길 수 있습니다. 그래서 처음 선택할 때 색상만큼 엣지
                        마감 방식도 같이 봐야 합니다.
                      </p>
                    </div>
                    <div className="mt-5 overflow-hidden rounded-[18px] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.10)]">
                      <Image
                        src="/images/door/edge-water-damage.jpg"
                        alt="시간이 지나 물먹음이 생긴 싱크대 문짝 엣지 마감"
                        width={1632}
                        height={2184}
                        className="h-auto w-full"
                        sizes="(min-width: 768px) 680px, calc(100vw - 72px)"
                      />
                    </div>
                  </div>
                  <div className="px-6 py-8 text-left md:px-9 md:py-10">
                    <div className="grid gap-7 md:grid-cols-2 md:gap-8">
                      <div className="relative pr-4 md:pr-12">
                        <div className="mb-2 flex items-center gap-3">
                          <span className="text-[12px] font-black text-[#e32e40]">
                            Check Point
                          </span>
                          <span className="h-px flex-1 bg-[#e32e40]/55" />
                          <span className="h-2 w-2 rounded-full bg-[#e32e40]" />
                        </div>
                        <p className="text-[17px] font-black leading-snug text-neutral-950 md:text-[19px]">
                          물에 약해질 수 있는 핫멜트 접합
                        </p>
                        <p className="mt-2 text-[13px] font-medium leading-[1.7] text-neutral-600 md:text-[14px]">
                          핫멜트 방식의 접합 방식은 물에 지속적으로 노출될 때
                          불어 터질 수 있어, 주방처럼 물을 자주 쓰는 공간에서는
                          엣지 마감을 함께 확인해야 합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </section>

        {/* Photo consultation */}
        <section data-service-section="photo_guide"
          id="sink-door-photos"
          className="bg-[#f8f9fb] px-5 py-12 md:py-16"
        >
          <div className="mx-auto max-w-[720px]">
            <p className="mb-3 text-[12px] font-bold tracking-widest text-[#1a5cff]">
              PHOTO CONSULTATION
            </p>
            <h2 className="break-keep text-[28px] font-black leading-[1.3] text-neutral-950 md:text-[36px]">
              사진 2장으로
              <br />
              우리 집 교체 범위부터 확인하세요
            </h2>
            <div className="my-6 rounded-2xl border border-[#dbe6ff] bg-white p-5">
              <ul className="space-y-2 text-[14px] font-bold text-neutral-800">
                <li>① 문짝의 색상·상태가 보이는 가까운 사진 1장</li>
                <li>② 상부장부터 하부장까지 주방 전체 사진 1장</li>
                <li>함께 알려주세요: 작업 지역·교체를 원하는 범위</li>
              </ul>
              <p className="mt-4 text-[13px] leading-[1.75] text-neutral-500">
                사진으로 교체 가능한 범위와 예상 견적을 안내합니다. 정확한
                규격·몸통 상태와 최종 금액은 방문 실측 후 확정합니다.
              </p>
              <a
                data-sink-door-contact
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="sink_door_photo_guide_kakao"
                className="mt-5 flex min-h-[54px] items-center justify-center rounded-xl bg-[#FEE500] px-3 text-[15px] font-black text-neutral-950"
              >
                {PHOTO_CTA}
              </a>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="overflow-hidden rounded-xl bg-white">
                <div className="px-4 pt-5">
                  <h3 className="text-[15px] font-black text-[#1a5cff]">
                    사진 ② · 주방 전체 촬영 예시
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.7] text-neutral-600">
                    문짝 가까이 사진과 별도로, 상부장부터 하부장까지 전체 모습도
                    담아주세요.
                  </p>
                </div>
                <Image
                  src="/images/door/send-photo-guide.png"
                  alt="문짝이 모두 보이게 정면에서 찍어주세요"
                  width={1122}
                  height={1402}
                  className="h-auto w-full object-contain"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>

              <div className="rounded-xl bg-[#eef4ff] p-4">
                <div
                  className="relative mb-4 overflow-hidden rounded-lg bg-white shadow-sm"
                  style={{ aspectRatio: "347 / 406" }}
                >
                  <Image
                    src={CHAT_CONSULT_EXAMPLE_IMAGE}
                    alt="개인정보를 블러 처리한 사진 상담 예시"
                    fill
                    unoptimized
                    sizes="(min-width: 768px) 310px, 100vw"
                    className="object-cover"
                  />
                </div>
                <p className="mb-2 text-[16px] font-black text-neutral-950">
                  사진으로 무료 상담
                </p>
                <p className="text-[13px] font-medium leading-[1.75] text-neutral-600">
                  준비한 사진 2장을 보내주시면 교체 가능한 범위와 예상 견적을
                  안내해 드립니다.
                </p>
                <div className="mt-3 space-y-1.5 text-[12px] font-bold text-[#1a5cff]">
                  <p>문짝 가까이 사진 1장</p>
                  <p>주방 전체가 보이는 사진 1장</p>
                  <p>지역·교체를 원하는 범위</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. TRUST */}
        <section data-service-section="warranty"
          id="sink-door-trust"
          className="px-5 py-14 md:py-20"
          style={{ background: "#fff" }}
        >
          <div className="mx-auto max-w-lg">
            <FadeIn>
              <p className="text-[12px] font-bold tracking-widest text-[#1a5cff] mb-2">
                TRUST
              </p>
              <h2
                className="font-black leading-[1.2] mb-8"
                style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}
              >
                걱정하시는 거<br />다 알고 있어요
              </h2>
            </FadeIn>
            <div className="flex flex-col gap-3 mb-8">
              {[
                {
                  icon: "🛡",
                  title: "3년 무상 재시공",
                  desc: "문짝 들뜸, 경첩 문제 등 시공 후 3년간 무상으로 재시공해드립니다.",
                },
                {
                  icon: "🔩",
                  title: "경첩 무료 교체",
                  desc: "교체하시는 문짝의 경첩은 리스토리에서 서비스로 무료 교체해드립니다.",
                },
                {
                  icon: "📋",
                  title: "생산물 배상책임보험 가입",
                  desc: "시공 중 예상치 못한 문제가 생겨도 보험으로 100% 보상됩니다.",
                },
              ].map((t, i) => (
                <FadeIn key={i} delay={i * 60}>
                  <div
                    className="flex gap-4 rounded-2xl p-5"
                    style={{
                      background: "#f8f9fb",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <span className="text-[24px] flex-shrink-0">{t.icon}</span>
                    <div>
                      <p className="text-[15px] font-black text-neutral-900 mb-1">
                        {t.title}
                      </p>
                      <p className="text-[13px] leading-[1.6] text-neutral-500">
                        {t.desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={200}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { src: "/images/cert-5.png", alt: "생산물배상책임보험증서" },
                  { src: "/images/cert-4.png", alt: "리스토리 A/S 보증서" },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl"
                    style={{ border: "1px solid #e5e7eb" }}
                  >
                    <div className="aspect-[3/4] bg-neutral-50 p-3">
                      <Image
                        src={c.src}
                        alt={c.alt}
                        width={300}
                        height={400}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <p className="text-center py-3 text-[12px] font-bold text-neutral-500 bg-neutral-50">
                      {c.alt}
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 8. FAQ */}
        <section data-service-section="faq"
          id="sink-door-faq"
          className="px-5 py-14 md:py-20"
          style={{ background: "#f8f9fb" }}
        >
          <div className="mx-auto max-w-lg">
            <FadeIn>
              <p className="text-[12px] font-bold tracking-widest text-[#1a5cff] mb-2">
                FAQ
              </p>
              <h2
                className="font-black leading-[1.2] mb-8"
                style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}
              >
                자주 묻는 질문
              </h2>
            </FadeIn>
            <div className="flex flex-col gap-2">
              {FAQ_ITEMS.map((f, i) => (
                <FadeIn key={i} delay={i * 50}>
                  <div
                    className="overflow-hidden rounded-2xl bg-white"
                    style={{ border: "1px solid #e5e7eb" }}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      <span className="pr-4 text-[14px] font-bold text-neutral-900 md:text-[15px]">
                        {f.q}
                      </span>
                      <span
                        className="flex-shrink-0 text-[14px] font-bold transition-transform duration-200"
                        style={{
                          color: "#1a5cff",
                          transform: openFaq === i ? "rotate(180deg)" : "none",
                        }}
                      >
                        ▾
                      </span>
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{ maxHeight: openFaq === i ? 620 : 0 }}
                    >
                      <p className="whitespace-pre-line px-5 pb-4 pt-1 text-[13px] leading-[1.75] text-neutral-500 border-t border-neutral-100">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* 9. FINAL CTA */}
        <section data-service-section="contact"
          className="px-5 py-16 md:py-24"
          style={{ background: "#0a1628" }}
        >
          <div className="mx-auto max-w-lg text-center">
            <FadeIn>
              <p
                className="text-[13px] font-bold tracking-widest mb-4"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                지금 바로 시작하세요
              </p>
              <h2
                className="font-black text-white leading-[1.2] mb-3 whitespace-pre-line"
                style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)" }}
              >
                {region
                  ? `${region} 문짝 교체\n사진 2장으로 먼저 상담하세요`
                  : "사진 2장으로\n우리 집 예상 견적부터"}
              </h2>
              <p
                className="text-[14px] mb-8"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                문짝 가까이 1장 + 주방 전체 1장, 지역·교체 범위를 보내주세요.
                예상 견적을 먼저 안내하고 최종 금액은 방문 실측 후 확정합니다.
              </p>
              <div
                data-sink-door-contact
                className="flex flex-col gap-3 max-w-sm mx-auto"
              >
                <a
                  href={KAKAO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-2xl text-[16px] font-black"
                  style={{
                    background: "#FEE500",
                    color: "#1a1a1a",
                    padding: "20px 24px",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
                  </svg>
                  {PHOTO_CTA}
                </a>
                <a
                  href={PHONE}
                  className="flex items-center justify-center gap-2 rounded-2xl text-[15px] font-bold text-white"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    padding: "16px 24px",
                  }}
                >
                  📞 1688-2957
                </a>
              </div>
              <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
                {[
                  "교체 비용의 1/5~",
                  "경첩 무료 교체",
                  "다양한 색상",
                  "3년 무상 A/S",
                ].map((b, i) => (
                  <span
                    key={i}
                    className="text-[12px] font-semibold"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {i > 0 && (
                      <span
                        className="mr-4"
                        style={{ color: "rgba(255,255,255,0.1)" }}
                      >
                        ·
                      </span>
                    )}
                    {b}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      </div>

      {/* 4. REVIEWS */}
      <section data-service-section="reviews"
        id="restory-reviews"
        className={`scroll-mt-32 border-t border-neutral-200 px-4 py-4 md:py-6 ${
          activeTab === "reviews" ? "block" : "hidden"
        }`}
        style={{ background: "#fff" }}
      >
        <div className="mx-auto max-w-[720px]">
          <div className="mb-8 px-4 pb-2 pt-4 text-center md:px-8 md:pt-6">
            <Image
              src={REVIEW_BADGE_IMAGE}
              alt="압도적 만족"
              width={220}
              height={280}
              className="mx-auto mb-5 h-[108px] w-auto object-contain md:h-[136px]"
              sizes="160px"
            />
            <p className="mb-3 text-[17px] font-semibold leading-[1.55] text-neutral-600 md:text-[22px]">
              사진으로 먼저 확인하는
            </p>
            <h2
              className="font-black leading-[1.18] text-neutral-950"
              style={{ fontSize: "clamp(2.25rem, 7.2vw, 3.8rem)" }}
            >
              <span
                className="px-1 text-[#1a5cff]"
                style={{
                  background:
                    "linear-gradient(to top, rgba(26,92,255,0.14) 34%, transparent 34%)",
                }}
              >
                비포·애프터
              </span>
              <br />
              리얼 후기
            </h2>
            <p className="mt-5 text-[14px] font-medium leading-[1.85] text-neutral-500 md:text-[17px]">
              문짝 교체 전후가 어떻게 달라졌는지
              <br />
              실제 사례 사진으로 확인해보세요.
            </p>
          </div>
          <div
            className="mb-5 flex items-center gap-5 rounded-2xl px-5 py-5 md:px-7"
            style={{ background: "#f8f9fb" }}
          >
            <div>
              <p className="text-[34px] font-black leading-none text-neutral-950">
                4.9
              </p>
              <p className="mt-2 text-[17px] font-black leading-none text-[#fbbc04]">
                ★★★★★
              </p>
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-neutral-500">
                비포 애프터 리뷰
              </p>
              <p className="mt-1 text-[12px] font-semibold text-neutral-500">
                고객 리뷰와 실제 시공 사진 기준
              </p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-[12px] font-black tracking-[0.18em] text-[#1a5cff]">
              BEFORE AFTER
            </p>
            <h3 className="mt-1 text-[22px] font-black leading-tight text-neutral-950 md:text-[28px]">
              실제 시공 사례 사진
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {reviewCases.map((item) => (
              <Link
                key={item.id}
                href={`/cases/${item.id}`}
                className="block h-full rounded-2xl bg-white p-4 md:p-5"
                style={{
                  border: "1px solid #e5e7eb",
                  textDecoration: "none",
                }}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[16px] font-black leading-none text-[#fbbc04]">
                      ★★★★★
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-[12px] text-neutral-400">
                    {item.date.replaceAll("-", ".")}
                  </span>
                </div>
                <p className="mb-2 text-[15px] font-black leading-snug text-neutral-950">
                  {item.review?.author ?? item.title}
                </p>
                <p className="mb-3 text-[12px] font-semibold text-neutral-400">
                  {item.region}
                </p>
                <p className="mb-4 text-[14px] leading-[1.75] text-neutral-600">
                  {item.review?.content ?? item.summary}
                </p>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  {[
                    { label: "BEFORE", src: item.beforeImg },
                    { label: "AFTER", src: item.afterImg },
                  ].map((photo) => (
                    <div
                      key={photo.label}
                      className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100"
                    >
                      <Image
                        src={photo.src}
                        alt={`${item.title} ${photo.label}`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 340px, calc(50vw - 32px)"
                      />
                      <span
                        className="absolute bottom-2 left-2 rounded-md px-2 py-1 text-[10px] font-black text-white"
                        style={{
                          background:
                            photo.label === "AFTER"
                              ? "#1a5cff"
                              : "rgba(0,0,0,0.62)",
                        }}
                      >
                        {photo.label}
                      </span>
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <LandingIntake field="kitchen" service="doors" />
      <FloatingCTA
        onReviewClick={showReviews}
        compactMobile
        avoidOverlapSelector="[data-sink-door-contact]"
        label={PHOTO_CTA}
      />
    </main>
  );
}
