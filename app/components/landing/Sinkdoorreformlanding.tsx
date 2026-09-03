"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/app/components/FadeIn";
import FloatingCTA from "@/app/components/landing/shared/FloatingCTA";
import { ServiceJsonLd } from "@/app/components/JsonLd";
import { buildTrackedContactPath } from "@/lib/attribution";
import { cases } from "@/lib/case-data";
import { REGIONS } from "@/lib/seo-regions";

const PHONE = buildTrackedContactPath("phone", "sink_door");
const KAKAO_URL = buildTrackedContactPath("kakao", "sink_door");
const SINK_DOOR_VIDEO_ID = "tC4VLNFgvCE";
const REAL_VIDEO_ID = "sydwgU5o4DY";
const MAIN_IMAGE = "/images/door/sink-door-main.png";
const REVIEW_BADGE_IMAGE = "/images/door/before-after-review-badge.png";
const FILM_EDGE_IMAGE = "/images/door/onedraw-door-edge.png";
const PET_ZEROJOINT_EDGE_IMAGE = "/images/door/pet-zerojoint-edge.png";
const CHAT_CONSULT_EXAMPLE_IMAGE =
  "/images/door/chat-consult-example-safe.webp";
const VISIT_MEASUREMENT_IMAGE = "/images/door/visit-measurement.webp";
const REAL_SAMPLE_CHECK_IMAGE = "/images/door/real-sample-check.webp";
const CUSTOM_PRODUCTION_IMAGE = "/images/door/factory-direct.gif";
const FIELD_INSTALLATION_IMAGE = "/images/door/field-installation.webp";

const COLOR_SAMPLE_PREVIEWS = [
  {
    name: "로지핑크",
    color: "#e8d7cf",
    image: "/images/door/preview-rosy-pink.webp",
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
    name: "인디고블루",
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
    name: "포그 그레이",
    color: "#e4ddd3",
    image: "/images/door/preview-fog-gray.webp",
  },
];

const FAQ_ITEMS = [
  {
    q: "싱크대 문짝 교체 비용은 어떻게 계산되나요?",
    a: "싱크대 문짝 교체 비용은 교체할 문짝 개수와 자재 종류를 기준으로 계산합니다.\n\n문짝과 서랍 앞판은 개수 기준으로 확인하고, 걸레받이와 몰딩은 필요한 길이를 m 단위로 측정해 반영합니다.\n\n정확한 수량과 최종 금액은 사진 확인 또는 방문 실측 후 확정합니다.",
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

function CaseStrip({ region }: { region?: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allCases = cases
    .filter((c) => c.category === "싱크대 리폼")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const matched = region
    ? allCases.filter((c) => c.region.includes(region))
    : [];
  const rest = allCases.filter((c) => !matched.includes(c));
  const CASE_ITEMS = [...matched, ...rest].slice(0, 6);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 12
      : 0;
    if (cardWidth > 0) setActiveIdx(Math.round(el.scrollLeft / cardWidth));
  };

  const scrollTo = (i: number) => {
    const el = scrollRef.current;
    if (!el || !el.firstElementChild) return;
    el.scrollTo({
      left: i * ((el.firstElementChild as HTMLElement).offsetWidth + 12),
      behavior: "smooth",
    });
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[15px] font-bold text-neutral-900">실제 시공 사례</p>
        <Link
          href="/cases?cat=싱크대 리폼"
          className="text-[12px] font-bold"
          style={{ color: "#1a5cff", textDecoration: "none" }}>
          전체 보기 →
        </Link>
      </div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}>
        {CASE_ITEMS.map((item) => (
          <div
            key={item.id}
            style={{
              scrollSnapAlign: "start",
              flexShrink: 0,
              width: "72%",
              maxWidth: 300,
            }}>
            <Link
              href={`/cases/${item.id}`}
              draggable={false}
              className="block overflow-hidden rounded-2xl"
              style={{ border: "1px solid #e5e7eb", textDecoration: "none" }}>
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <Image
                  src={item.afterImg}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="72vw"
                  draggable={false}
                />
                <div
                  className="absolute top-2 left-2 rounded-full px-2.5 py-0.5 text-[10px] font-black text-white"
                  style={{ background: "#1a5cff" }}>
                  AFTER
                </div>
                {item.price && (
                  <div
                    className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
                    style={{
                      background: "rgba(255,255,255,0.94)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.16)",
                      backdropFilter: "blur(8px)",
                    }}>
                    <span className="text-[10px] font-bold" style={{ color: "#6b7684" }}>
                      작업 비용
                    </span>
                    <span className="h-3 w-px" style={{ background: "#e5e8eb" }} />
                    <span className="text-[20px] font-black leading-none" style={{ color: "#3182f6" }}>
                      {item.price}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-white">
                <p className="text-[13px] font-extrabold text-neutral-900 truncate">
                  {item.title}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {item.region}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 mt-4">
        {CASE_ITEMS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className="rounded-full transition-all"
            style={{
              width: i === activeIdx ? 20 : 6,
              height: 6,
              background: i === activeIdx ? "#1a5cff" : "#d1d5db",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function YouTubeFacade({ videoId }: { videoId: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className="relative aspect-video overflow-hidden rounded-2xl cursor-pointer"
      style={{ background: "#000" }}
      onClick={() => setLoaded(true)}>
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
              style={{ background: "rgba(255,0,0,0.92)" }}>
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

function YouTubeAutoplayHero({ videoId }: { videoId: string }) {
  return (
    <div
      className="relative overflow-hidden bg-black"
      style={{ aspectRatio: "16 / 9" }}>
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
        title="리스토리 싱크대 문짝 교체 영상"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

interface Props {
  keyword?: string;
}

export default function SinkdoorReformLanding({ keyword }: Props) {
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
    : "문짝만 바꿔도\n새 주방됩니다";
  const heroSub = region
    ? `${region} 당일 시공 가능 · 전체 교체 비용의 1/5~`
    : "싱크대 전체 교체 없이, 문짝만 바꾸면 됩니다";
  const heroBadge = region
    ? `${region} 당일 시공 · 교체 비용의 1/5~`
    : "교체 비용의 1/5~";

  const regionCaseCount = region
    ? cases.filter(
        (c) => c.category === "싱크대 리폼" && c.region.includes(region),
      ).length
    : 0;
  const reviewCases = cases
    .filter((c) => c.category === "싱크대 리폼" && c.title.includes("문짝"))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    ;

  return (
    <main
      className="bg-white"
      style={{
        fontFamily:
          "'Wanted Sans Variable','Wanted Sans',-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif",
      }}>
      <ServiceJsonLd
        name={
          region ? `${region} 싱크대 문짝 교체·리폼` : "싱크대 문짝 교체·리폼"
        }
        description="싱크대 문짝만 교체해도 새 주방처럼. 전체 교체 비용의 1/5~. 당일 시공, 3년 무상 A/S, 경첩 무료 교체."
        url={
          keyword
            ? `https://www.restorystudio.co.kr/kitchen/${keyword}`
            : "https://www.restorystudio.co.kr/kitchen/sink-door"
        }
      />

      {/* 1. HERO VIDEO */}
      <section className="bg-white px-0 pb-8 pt-0 md:pb-12">
        <div className="mx-auto max-w-[900px]">
          <YouTubeAutoplayHero videoId={SINK_DOOR_VIDEO_ID} />
          <div className="px-5 pt-5 md:px-0">
            <FadeIn>
              <p className="mb-2 text-[13px] font-black text-[#1a5cff]">
                {region
                  ? `${region} 싱크대 문짝 교체`
                  : "싱크대 문짝 교체"}
              </p>
              <h1 className="text-[24px] font-black leading-tight text-neutral-950 md:text-[34px]">
                {heroTitle}
              </h1>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-neutral-500 md:text-[17px]">
                {heroSub}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href={KAKAO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="sink_door_video_kakao"
                  className="flex min-h-[54px] items-center justify-center rounded-xl bg-[#FEE500] px-5 text-[15px] font-black text-[#1a1a1a]"
                  style={{ textDecoration: "none" }}>
                  카카오로 사진 보내기
                </a>
                <a
                  href={PHONE}
                  data-cta="sink_door_video_phone"
                  className="flex min-h-[54px] items-center justify-center rounded-xl px-5 text-[15px] font-black text-white"
                  style={{
                    background: "#1a5cff",
                    textDecoration: "none",
                  }}>
                  1688-2957 전화 문의
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <nav className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 px-4 backdrop-blur">
        <div className="mx-auto grid max-w-[720px] grid-cols-2 text-center">
          <button
            type="button"
            onClick={() => setActiveTab("detail")}
            className={`py-4 text-[15px] ${
              activeTab === "detail"
                ? "rounded-t-lg border-2 border-b-0 border-[#1a5cff] font-black text-[#1a5cff]"
                : "border-0 font-bold text-neutral-500"
            }`}>
            서비스 상세
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`py-4 text-[15px] ${
              activeTab === "reviews"
                ? "rounded-t-lg border-2 border-b-0 border-[#1a5cff] font-black text-[#1a5cff]"
                : "border-0 font-bold text-neutral-500"
            }`}>
            리뷰
          </button>
        </div>
      </nav>

      <div className={activeTab === "detail" ? "block" : "hidden"}>

      {/* 2. MAIN IMAGE INTRO */}
      <section
        id="service-detail"
        className="scroll-mt-20 border-b border-neutral-200 bg-white px-4 py-14 md:py-18">
        <div className="mx-auto max-w-[720px] text-center">
          <FadeIn>
            <p className="mb-3 text-[15px] font-black leading-[1.45] text-[#1a5cff] md:text-[17px]">
              왜 주방이 먼저 눈에 들어올까요?
            </p>
            <h2
              className="mb-6 font-black leading-[1.24] text-neutral-950"
              style={{ fontSize: "clamp(1.75rem, 6vw, 2.65rem)" }}>
              주방 전체를 바꾸지 않아도,
              <br />
              변화는 가장 크게
            </h2>
            <p className="mx-auto mb-8 max-w-[520px] text-[16px] font-medium leading-[1.9] text-neutral-500 md:text-[18px]">
              낡은 문짝은 멀쩡한 주방까지 오래돼 보이게 합니다.
              <br />
              전체 철거 없이 문짝만 바꿔, 비용은 줄이고 변화는 크게.
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <div className="relative mt-7 overflow-hidden rounded-lg bg-neutral-100">
              <Image
                src={MAIN_IMAGE}
                alt="화이트 싱크대 문짝 교체 후 주방"
                width={1834}
                height={850}
                className="h-auto w-full object-cover"
                priority
                sizes="(min-width: 768px) 720px, 100vw"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <section
        className="hidden"
        style={{ background: "#0a1628", minHeight: "100svh" }}>
        <div className="absolute inset-0 md:hidden">
          <Image
            src="/images/door/door-hero.png"
            alt=""
            fill
            className="object-cover"
            style={{ opacity: 0.55 }}
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 25%, #0a1628 100%)",
            }}
          />
        </div>
        <div
          className="relative z-10 mx-auto max-w-7xl flex flex-col md:flex-row"
          style={{ minHeight: "100svh" }}>
          <div className="flex-1 flex flex-col justify-end pb-10 pt-20 px-6 md:flex-none md:w-[54%] md:justify-center md:px-16 md:py-24 md:flex-shrink-0">
            <FadeIn>
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-5"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}>
                <Image
                  src="/images/logo.png"
                  alt="리스토리"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span className="text-[12px] font-bold text-white/70">
                  {region
                    ? `${region} 싱크대 문짝 교체 전문`
                    : "싱크대 문짝 교체 전문"}
                </span>
              </div>
              <h1
                className="font-black text-white leading-[1.15] mb-3 whitespace-pre-line"
                style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}>
                {heroTitle}
              </h1>
              <p
                className="font-medium text-white/60 mb-4"
                style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)" }}>
                {heroSub}
              </p>
              <div
                className="inline-flex items-baseline gap-2 rounded-2xl px-4 py-2.5 mb-8"
                style={{
                  background: "rgba(26,92,255,0.25)",
                  border: "1px solid rgba(26,92,255,0.4)",
                }}>
                <span className="text-[22px] font-black text-white">
                  {heroBadge}
                </span>
                <span className="text-[13px] font-medium text-white/50">
                  제로 조인트 마감
                </span>
              </div>
              <div className="flex flex-col gap-3 md:flex-row">
                <a
                  href={KAKAO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-2xl font-black text-[16px]"
                  style={{
                    background: "#FEE500",
                    color: "#1a1a1a",
                    padding: "18px 28px",
                  }}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
                  </svg>
                  카카오로 사진 보내기
                </a>
                <a
                  href={PHONE}
                  className="flex items-center justify-center gap-2 rounded-2xl font-bold text-white text-[15px]"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    padding: "14px 24px",
                  }}>
                  📞 전화 문의
                </a>
              </div>
              <div className="mt-8 flex items-center gap-6">
                {[
                  { n: "1,000건+", l: "연간 시공" },
                  { n: "4.9★", l: "고객 평점" },
                  { n: "3년", l: "무상 A/S" },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-[15px] font-black text-white">{s.n}</p>
                    <p className="text-[11px] text-white/40">{s.l}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
          <div className="hidden md:block md:w-[46%] relative flex-shrink-0">
            <Image
              src="/images/hero-door.webp"
              alt="리스토리 싱크대 문짝 리폼"
              fill
              className="object-cover"
              style={{ opacity: 0.75 }}
              priority
              sizes="46vw"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, #0a1628 0%, transparent 40%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, #0a1628 0%, transparent 20%)",
              }}
            />
          </div>
        </div>
      </section>

      {/* ★ 지역 배너 */}
      {region && (
        <section className="px-5 py-4" style={{ background: "#1a5cff" }}>
          <div className="mx-auto max-w-lg text-center">
            <p className="text-[14px] font-black text-white">
              📍 {region} 지역 당일 시공 가능 · 사진 한 장으로 무료 견적
            </p>
          </div>
        </section>
      )}

      {/* ★ 지역 설명 블록 (케이스 수 포함) */}
      {region && (
        <section className="px-5 py-10" style={{ background: "#ffffff" }}>
          <div className="mx-auto max-w-lg">
            <h2
              className="text-[20px] font-black mb-3"
              style={{ color: "#111827" }}>
              {region} 싱크대 문짝 교체·리폼
            </h2>
            <p className="text-[14px] leading-[1.8] text-neutral-600">
              {region} 지역 싱크대 문짝 교체·리폼은 리스토리가 당일 시공으로
              해결합니다. 문짝만 바꿔도 새 주방처럼 바뀌고, 전체 교체 비용의 1/5
              수준으로 가능합니다.
              {regionCaseCount > 0 && (
                <>
                  {" "}
                  {region} 지역 시공 완료{" "}
                  <strong className="text-neutral-900">
                    {regionCaseCount}건
                  </strong>
                  .
                </>
              )}{" "}
              사진 한 장 보내주시면 {region} 출장 가능 여부와 비용을 바로
              안내드립니다.
            </p>
          </div>
        </section>
      )}

      {/* 2. PROOF */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#f8f9fb" }}>
        <div className="mx-auto max-w-lg">
          <FadeIn>
            <div className="mb-8 text-center">
              <p className="mb-4 text-[20px] font-black leading-[1.45] text-neutral-500 md:text-[24px]">
                오래돼 보이는 주방,
                <br />
                전체를 바꿔야 할까요?
              </p>
              <h2
                className="mb-6 font-black leading-[1.22] text-neutral-950"
                style={{ fontSize: "clamp(2rem, 7vw, 3.15rem)" }}>
                전체가 아니라,
                <br />
                <span
                  className="px-1"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(31,102,255,0.24) 38%, transparent 38%)",
                  }}>
                  문짝만
                </span>{" "}
                바꾸세요.
              </h2>
              <p className="text-[16px] font-medium leading-[1.9] text-neutral-500 md:text-[18px]">
                상판과 몸통이 멀쩡하다면
                <br />
                쓸 수 있는 주방까지 전부 바꿀 필요는 없습니다.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={80}>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                {
                  img: "/images/door/before-after-8.png",
                  label: "BEFORE",
                  dark: true,
                },
                {
                  img: "/images/door/before-after-7.png",
                  label: "AFTER",
                  dark: false,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-2xl"
                  style={{ aspectRatio: "3/4" }}>
                  <Image
                    src={item.img}
                    alt={item.label}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 px-3 py-2.5"
                    style={{
                      background: item.dark
                        ? "linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
                        : "linear-gradient(to top, rgba(26,92,255,0.7), transparent)",
                    }}>
                    <span className="text-[13px] font-black text-white tracking-widest">
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="rounded-2xl px-5 py-4 text-center"
              style={{ background: "#1a5cff" }}>
              <p className="text-[15px] font-black text-white">
                같은 싱크대입니다
              </p>
              <p className="text-[12px] text-white/60 mt-0.5">
                문짝만 교체했습니다
              </p>
            </div>
            <div
              className="mx-[-20px] mt-12 overflow-hidden bg-[#e7edf6] text-left md:mx-0 md:rounded-2xl"
              style={{ border: "1px solid #d4deea" }}>
              <div className="h-2 bg-[#1a5cff]" />
              <div className="px-5 py-10 md:px-10 md:py-12">
                <p className="mb-4 text-center text-[13px] font-black tracking-[0.28em] text-[#1a5cff] md:text-[15px]">
                  WHY RESTORY
                </p>
                <h2
                  className="mb-8 text-center font-black leading-[1.18] text-neutral-950"
                  style={{ fontSize: "clamp(2rem, 7vw, 3.4rem)" }}>
                  주방 전체를 바꾸면
                  <br />
                  오히려 손해인 경우
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      title: "전체 리모델링의 비용과 공사 기간이 부담될 때",
                      desc: "주방은 바꾸고 싶지만 큰 비용과 긴 공사까지 감수하고 싶지 않을 때.",
                    },
                    {
                      title: "세입자지만 낡은 주방을 참고 살기 싫을 때",
                      desc: "집주인과 협의 후, 큰 공사 없이 앞으로 지낼 공간을 바꾸고 싶을 때.",
                    },
                    {
                      title: "명절·집들이를 앞두고 주방이 신경 쓰일 때",
                      desc: "손님이 오기 전, 가장 눈에 띄는 주방부터 깔끔하게 정돈하고 싶을 때.",
                    },
                    {
                      title: "매매·임대를 내놨는데 반응이 아쉬울 때",
                      desc: "전체 공사 없이 집의 첫인상을 빠르게 개선하고 싶을 때.",
                    },
                  ].map((item, index) => (
                    <div
                      key={item.title}
                      className="flex gap-4 rounded-lg px-4 py-5 md:gap-6 md:px-6"
                      style={{
                        background: "#fff",
                        border: "1px solid rgba(26,92,255,0.12)",
                        boxShadow: "0 8px 22px rgba(15,23,42,0.04)",
                      }}>
                      <div className="w-[58px] flex-shrink-0 md:w-[74px]">
                        <p
                          className="inline-block px-1 text-[42px] font-black leading-none text-neutral-950 md:text-[56px]"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(26,92,255,0.16) 42%, transparent 42%)",
                          }}>
                          {String(index + 1).padStart(2, "0")}
                        </p>
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-[18px] font-black leading-[1.35] text-neutral-950 md:text-[22px]">
                          {item.title}
                        </p>
                        <p className="mt-2 text-[14px] font-medium leading-[1.65] text-neutral-500 md:text-[17px]">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="mb-3 text-[14px] font-black text-[#1a5cff] md:text-[16px]">
                가격부터 말씀드리면
              </p>
              <h2
                className="mb-5 font-black leading-[1.28] text-neutral-950"
                style={{ fontSize: "clamp(1.65rem, 5.8vw, 2.45rem)" }}>
                주방 인테리어,
                <br />
                수백만원은 써야 한다고
                <br />
                생각 하셨나요?
              </h2>
              <p className="mb-8 text-[16px] font-medium leading-[1.9] text-neutral-500 md:text-[18px]">
                전체를 바꾸면 그렇습니다.
                <br />
                <strong className="font-black text-neutral-800">
                  도어만
                </strong>{" "}
                바꾸면 비용도 달라집니다.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={150}>
            <div
              className="mt-5 grid grid-cols-2 overflow-hidden rounded-lg"
              style={{ border: "1px solid #cfd8e3" }}>
              <div
                className="p-4 text-center md:p-5"
                style={{ background: "#f8f9fb" }}>
                <p className="mb-2 text-[13px] font-black text-neutral-500">
                  주방 전체 인테리어
                </p>
                <p
                  className="text-[18px] font-black line-through md:text-[22px]"
                  style={{ color: "#8b949e" }}>
                  300만~500만원
                </p>
              </div>
              <div
                className="p-4 text-center md:p-5"
                style={{ background: "#eef4ff", borderLeft: "1px solid #c7d7ff" }}>
                <p className="mb-1 text-[13px] font-black text-neutral-900">
                  도어 교체
                </p>
                <p className="mb-1 text-[11px] font-semibold text-neutral-500">
                  25~35평 기준
                </p>
                <p
                  className="text-[20px] font-black md:text-[24px]"
                  style={{ color: "#1a5cff" }}>
                  55만~84만원
                </p>
              </div>
            </div>
            <p className="mt-5 text-center text-[14px] font-medium leading-[1.8] text-neutral-500 md:text-[16px]">
              평수가 아니라{" "}
              <strong className="font-black text-neutral-900">
                교체할 도어 개수로 계산합니다.
              </strong>
              <br />
              도어 크기와 자재에 따라{" "}
              <strong className="font-black text-neutral-900">
                1짝 단가가 달라집니다.
              </strong>
            </p>
            <div
              className="mt-7 rounded-lg bg-white p-2 shadow-[0_8px_28px_rgba(15,23,42,0.08)]"
              style={{ border: "1px solid #d9e0e8" }}>
              <div className="flex items-center justify-between px-2 pb-2 pt-1">
                <p className="text-[13px] font-black text-neutral-700">
                  우리 집
                </p>
                <p className="text-[13px] font-black text-neutral-700">
                  예상 견적
                </p>
              </div>
              {[
                {
                  home: "8평 원룸",
                  type: "一자형 주방",
                  parts: "도어·서랍 6짝 + 걸레받이 1개",
                  note: "소형 주방 기준",
                  price: "42만원",
                  width: "21%",
                  shape: "line",
                },
                {
                  home: "15평 빌라",
                  type: "一자형 주방",
                  parts: "도어·서랍 8짝 + 걸레받이 1개",
                  note: "기본 주방 기준",
                  price: "55만원",
                  width: "27%",
                  shape: "line",
                },
                {
                  home: "25평 아파트",
                  type: "ㄱ자형 주방",
                  parts: "도어·서랍 12짝 + 걸레받이 2개",
                  note: "표준 주방 기준",
                  price: "84만원",
                  width: "41%",
                  shape: "l",
                },
                {
                  home: "35평 아파트",
                  type: "ㄷ자형 주방",
                  parts: "도어·서랍 16짝 + 걸레받이 2개",
                  note: "대형 주방 기준",
                  price: "110만원",
                  width: "54%",
                  shape: "u",
                },
                {
                  home: "50평 아파트",
                  type: "ㄷ자형 주방",
                  parts: "도어·서랍 22짝 + 걸레받이 3개",
                  note: "대형 주방 기준",
                  price: "152만원",
                  width: "74%",
                  shape: "u",
                },
              ].map((row) => (
                <div
                  key={row.home}
                  className="relative mb-1.5 overflow-hidden rounded-lg px-3 py-4 last:mb-0 md:px-4"
                  style={{ border: "1px solid rgba(26,92,255,0.18)" }}>
                  <div
                    className="absolute inset-y-0 left-0"
                    style={{
                      width: row.width,
                      background:
                        "linear-gradient(90deg, rgba(26,92,255,0.12), rgba(26,92,255,0.06))",
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-lg shadow-[inset_0_0_18px_rgba(26,92,255,0.08)]" />
                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-[18px] font-black leading-tight text-neutral-950">
                          {row.home}
                        </p>
                        <svg
                          width="28"
                          height="22"
                          viewBox="0 0 28 22"
                          fill="none"
                          aria-hidden="true"
                          className="flex-shrink-0 text-neutral-500">
                          {row.shape === "line" && (
                            <>
                              <rect
                                x="2"
                                y="4"
                                width="20"
                                height="6"
                                stroke="currentColor"
                                strokeWidth="1.4"
                              />
                              <rect
                                x="2"
                                y="12"
                                width="20"
                                height="6"
                                stroke="currentColor"
                                strokeWidth="1.4"
                              />
                              <path d="M9 4v14M16 4v14" stroke="currentColor" />
                            </>
                          )}
                          {row.shape === "l" && (
                            <>
                              <rect
                                x="3"
                                y="3"
                                width="17"
                                height="6"
                                stroke="currentColor"
                                strokeWidth="1.4"
                              />
                              <rect
                                x="3"
                                y="3"
                                width="6"
                                height="17"
                                stroke="currentColor"
                                strokeWidth="1.4"
                              />
                              <path d="M12 3v6M3 12h6" stroke="currentColor" />
                            </>
                          )}
                          {row.shape === "u" && (
                            <>
                              <path
                                d="M4 3h16v5h-11v9h-5z"
                                stroke="currentColor"
                                strokeWidth="1.4"
                              />
                              <path
                                d="M20 3h4v17h-8v-5h4z"
                                stroke="currentColor"
                                strokeWidth="1.4"
                              />
                              <path d="M12 3v5M20 10h4" stroke="currentColor" />
                            </>
                          )}
                        </svg>
                      </div>
                      <p className="mt-1 text-[13px] font-semibold text-neutral-600">
                        {row.type}
                      </p>
                      <p className="mt-1 text-[12px] font-semibold text-neutral-600">
                        {row.parts}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-neutral-400">
                        {row.note}
                      </p>
                    </div>
                    <p className="flex-shrink-0 text-[25px] font-black text-[#1a5cff] md:text-[28px]">
                      {row.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-[12px] leading-[1.7] text-neutral-400">
              실제 금액은 현장 실측, 색상, 자재 등급, 옵션에 따라 달라질 수
              있습니다.
            </p>
          </FadeIn>
          <FadeIn delay={170}>
            <div className="mt-12 text-center">
              <p className="mb-6 text-[18px] font-black leading-[1.55] text-neutral-500 md:text-[22px]">
                오래된 견적 방식,
                <br />
                아직도 1자 단위로 계산하시나요?
              </p>
              <h2
                className="mb-8 font-black leading-[1.28] text-neutral-950"
                style={{ fontSize: "clamp(2.2rem, 7vw, 3.45rem)" }}>
                전체 길이가 아니라,
                <br />
                <span
                  className="px-1"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(26,92,255,0.18) 34%, transparent 34%)",
                  }}>
                  실제 교체할 문짝만
                </span>{" "}
                세어주세요.
              </h2>
              <div className="mx-auto mb-8 max-w-[560px] space-y-3 text-left text-[15px] font-medium leading-[1.9] text-neutral-500 md:text-[17px]">
                <p>
                  예전에는 싱크대 전체 길이를{" "}
                  <strong className="font-black text-neutral-800">
                    1자(약 30cm) 단위
                  </strong>
                  로 나누어 견적을 내는 방식이 많았습니다.
                </p>
                <p>
                  하지만 문짝 교체는 전체 길이보다{" "}
                  <strong className="font-black text-neutral-800">
                    실제로 교체할 문짝과 서랍 앞판의 개수
                  </strong>
                  가 더 중요합니다.
                </p>
                <p>
                  리스토리는 문짝과 서랍 앞판을 하나씩 확인해{" "}
                  <strong className="font-black text-neutral-800">
                    필요한 부분만 정확하게 계산합니다.
                  </strong>
                </p>
                <p>
                  교체하지 않는 부분까지 비용에 포함하지 않아,{" "}
                  <strong className="font-black text-neutral-800">
                    견적은 더 투명하고 부담은 줄어듭니다.
                  </strong>
                </p>
                <p className="text-[13px] text-neutral-400 md:text-[15px]">
                  ※ 걸레받이와 몰딩은 길이에 따라{" "}
                  <strong className="font-black text-neutral-600">
                    m당 측정
                  </strong>
                  합니다.
                </p>
              </div>
              <div
                className="overflow-hidden rounded-2xl"
                style={{ border: "1px solid #e5e7eb" }}>
                <Image
                  src="/images/door/estimate-count-guide.webp"
                  alt="싱크대 문짝과 서랍 앞판 개수 세는 견적 산정 예시"
                  width={1400}
                  height={933}
                  unoptimized
                  className="h-auto w-full"
                  sizes="(max-width: 768px) 100vw, 512px"
                />
              </div>
            </div>
          </FadeIn>
          {/* ★ PET 직거래 섹션 — 문짝 개수 산정 안내 바로 아래 */}
          <FadeIn delay={220}>
            <div className="mt-4 bg-white px-5 py-12 text-center md:px-10 md:py-16">
              <p className="mb-4 text-[22px] font-black leading-[1.25] text-neutral-900 md:text-[30px]">
                왜 이 가격이 가능할까요?
              </p>
              <h3 className="mb-10 text-[38px] font-black leading-[1.08] text-[#1a5cff] md:text-[56px]">
                공장가 그대로,
                <br />
                소비자가 됩니다
              </h3>
              <div className="mx-auto max-w-[420px] text-left">
                <div>
                  <div className="mx-auto mb-6 flex h-10 max-w-[220px] items-center justify-center rounded-full bg-[#1a5cff] px-6 text-[14px] font-black text-white">
                    리스토리 직거래
                  </div>
                  <div
                    className="relative mb-5 overflow-hidden rounded-lg bg-neutral-100"
                    style={{ aspectRatio: "16/9" }}>
                    <Image
                      src="/images/door/factory-direct.gif"
                      alt="리스토리 PET 문짝 공장 직거래"
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(min-width: 768px) 300px, 100vw"
                    />
                  </div>
                  <ul className="space-y-2 text-[14px] font-medium leading-[1.65] text-neutral-700">
                    <li>
                      - PET 문짝 공장에서{" "}
                      <strong className="font-black text-[#1a5cff]">
                        직접 매입
                      </strong>
                    </li>
                    <li>
                      - 필요한 문짝만 제작해{" "}
                      <strong className="font-black text-[#1a5cff]">
                        교체 비용 감소
                      </strong>
                    </li>
                    <li>- 소재와 수량을 확인한 뒤 견적 안내</li>
                  </ul>
                </div>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={170}>
            <div className="mt-12 text-center">
              <p className="mb-3 text-[14px] font-black text-[#1a5cff] md:text-[16px]">
                가격만 보고 결정하지 마세요
              </p>
              <h2
                className="mb-6 font-black leading-[1.24] text-neutral-950"
                style={{ fontSize: "clamp(1.8rem, 6vw, 2.75rem)" }}>
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
                  style={{ borderLeft: "5px solid #ef4444" }}>
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
                      기존 문짝 위를 덮어 분위기를 바꾸는 방식입니다.
                      문짝이 이미 물먹었거나 들뜬 상태라면 기존 문제가
                      새 마감 위로 다시 드러날 수 있습니다.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {["물먹음 영향", "들뜸 재발 가능", "기존 표면 상태 중요"].map(
                        (tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white px-3 py-1.5 text-[12px] font-black text-[#b91c1c]">
                            {tag}
                          </span>
                        ),
                      )}
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
                  style={{ borderLeft: "5px solid #1a5cff" }}>
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
                      방식이라 마감과 내구성을 더 안정적으로 잡을 수 있습니다.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {["새 문짝 맞춤 제작", "제로조인트 마감", "마감·내구성 안정"].map(
                        (tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white px-3 py-1.5 text-[12px] font-black text-[#1a5cff]">
                            {tag}
                          </span>
                        ),
                      )}
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
          </FadeIn>
          <FadeIn delay={180}>
            <div className="mt-4 bg-white px-5 py-11 text-center md:px-10 md:py-14">
              <p className="mb-5 text-[13px] font-black text-[#1a5cff] md:text-[15px]">
                왜 오래 써도 차이가 날까요?
              </p>
              <h3 className="mb-8 text-[32px] font-black leading-[1.12] text-neutral-950 md:text-[44px]">
                틈새가 적을수록,
                <br />
                물에 강한 문짝이 됩니다
              </h3>
              <p className="mb-9 text-[16px] font-medium leading-[1.9] text-neutral-500 md:text-[18px]">
                제로조인트는 모서리 틈새를 줄여 물이 스며드는 길을 줄입니다.
                <br />
                24시간 물 접촉 테스트에서도 엣지 벌어짐과 물불림 걱정을
                <br className="hidden md:block" />
                낮추는 방식으로 제작합니다.
              </p>
              <div className="mx-auto w-full max-w-[520px]">
                <div
                  className="relative overflow-hidden rounded-lg bg-white"
                  style={{ aspectRatio: "1160/1352" }}>
                  <Image
                    src="/images/door/zerojoint-hotmelt-comparison.png"
                    alt="PET 제로조인트와 핫멜트 엣지 마감 비교"
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 520px, 100vw"
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. COLORS */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#fff" }}>
        <div className="mx-auto max-w-lg">
          <FadeIn>
            <p className="text-[12px] font-bold tracking-widest text-[#1a5cff] mb-2">
              COLOR SAMPLES
            </p>
            <h2
              className="font-black leading-[1.2] mb-2"
              style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
              취향에 맞는 색상으로
              <br />
              골라보세요
            </h2>
            <p className="text-[14px] text-neutral-500 mb-6">
              백색 · 크림화이트 · 포그 그레이 · 샌드 그레이 · 인디고블루.
              <br />
              색상칩을 누르면 주방 적용 이미지를 먼저 볼 수 있고
              <br />
              방문 시 실물 샘플을 직접 확인하실 수 있습니다.
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <div
              className="overflow-hidden rounded-2xl"
              style={{ border: "1px solid #e5e7eb" }}>
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
              style={{ background: "#f8f9fb", border: "1px solid #e5e7eb" }}>
              <div className="grid grid-cols-3 gap-x-2.5 gap-y-4 sm:grid-cols-5">
                {COLOR_SAMPLE_PREVIEWS.map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => setSelectedColorName(sample.name)}
                    className="text-center"
                    aria-pressed={selectedColorName === sample.name}>
                    <div
                      className="h-10 rounded-md"
                      style={{
                        background: sample.color,
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
          <FadeIn delay={160}>
            <a
              href={KAKAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-2xl text-[15px] font-black"
              style={{
                background: "#FEE500",
                color: "#1a1a1a",
                padding: "16px 24px",
              }}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
              </svg>
              샘플 보러 출장 방문 예약하기
            </a>
          </FadeIn>
        </div>
      </section>

      </div>

      {/* 4. REVIEWS */}
      <section
        id="restory-reviews"
        className={`scroll-mt-20 border-t border-neutral-200 px-4 py-4 md:py-6 ${
          activeTab === "reviews" ? "block" : "hidden"
        }`}
        style={{ background: "#fff" }}>
        <div className="mx-auto max-w-[720px]">
          <div
            className="mb-8 px-4 pb-2 pt-4 text-center md:px-8 md:pt-6">
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
              style={{ fontSize: "clamp(2.25rem, 7.2vw, 3.8rem)" }}>
              <span
                className="px-1 text-[#1a5cff]"
                style={{
                  background:
                    "linear-gradient(to top, rgba(26,92,255,0.14) 34%, transparent 34%)",
                }}>
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
            style={{ background: "#f8f9fb" }}>
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
                실제 시공 사진 기준
              </p>
            </div>
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
                  }}>
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
                    {item.title}
                  </p>
                  <p className="mb-3 text-[12px] font-semibold text-neutral-400">
                    {item.region}
                    {item.price ? ` · ${item.price}` : ""}
                  </p>
                  <div className="mb-4 grid grid-cols-2 gap-2 md:gap-3">
                      {[
                        { label: "BEFORE", src: item.beforeImg },
                        { label: "AFTER", src: item.afterImg },
                      ].map((photo) => (
                        <div
                          key={photo.label}
                          className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100">
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
                            }}>
                            {photo.label}
                          </span>
                        </div>
                      ))}
                  </div>
                  <p className="text-[14px] leading-[1.75] text-neutral-600">
                    {item.summary}
                  </p>
                </Link>
            ))}
          </div>

          <div className="hidden grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                img: "/images/door/review-1.png",
                keyword: "비용 1/5",
                unit: "싱크대 문짝 리폼",
                area: "서울 마포구",
                name: "정** 고객님",
                quote:
                  "전체 교체하면 300만원인데 문짝만 해서 60만원에 끝났어요. 20년 된 아파트인데 새 주방 같아요.",
              },
              {
                img: "/images/door/review-3.png",
                keyword: "주방이 환해졌어요",
                unit: "싱크대 문짝 리폼",
                area: "경기 수원시",
                name: "한** 고객님",
                quote:
                  "색상도 원하는 걸로 골랐는데 기존 싱크대랑 완벽하게 맞아요. 시공 시간도 짧고 대만족입니다.",
              },
            ].map((r, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div
                  className="overflow-hidden rounded-2xl h-full"
                  style={{ border: "1px solid #e5e7eb" }}>
                  <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                    <Image
                      src={r.img}
                      alt={r.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                    <div
                      className="absolute inset-0 flex flex-col justify-end p-4"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)",
                      }}>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[11px] font-semibold text-white/60">
                            {r.unit}
                          </p>
                          <p
                            className="font-black text-white leading-none"
                            style={{
                              fontSize: "clamp(1.1rem, 3.5vw, 1.5rem)",
                            }}>
                            {r.keyword}
                          </p>
                        </div>
                        <span
                          className="rounded-full px-3 py-1.5 text-[11px] font-black"
                          style={{ background: "#eef4ff", color: "#1a5cff" }}>
                          당일 완료
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[12px] text-neutral-400 mb-2">
                      {r.name} · {r.area}
                    </p>
                    <p className="text-[14px] leading-[1.7] text-neutral-700">
                      <span
                        style={{
                          color: "#1a5cff",
                          fontWeight: 900,
                          fontSize: 16,
                        }}>
                        "
                      </span>
                      {r.quote}
                      <span
                        style={{
                          color: "#1a5cff",
                          fontWeight: 900,
                          fontSize: 16,
                        }}>
                        "
                      </span>
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <div className={activeTab === "detail" ? "block" : "hidden"}>

      {/* 5. HOW */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#f8f9fb" }}>
        <div className="mx-auto max-w-[720px]">
          <FadeIn>
            <p className="text-[12px] font-bold tracking-widest text-[#1a5cff] mb-2">
              HOW IT WORKS
            </p>
            <h2
              className="font-black leading-[1.18] mb-4"
              style={{ fontSize: "clamp(1.9rem, 6vw, 3rem)" }}>
              직접 세어도,
              <br />
              사진으로 상담받아도
              <br />
              문짝 교체는 어렵지 않습니다
            </h2>
            <p className="mb-10 max-w-[620px] text-[14px] font-medium leading-[1.85] text-neutral-500 md:text-[17px]">
              문짝 개수를 직접 확인하거나, 주방 사진 2장만 보내주세요.
              <br className="hidden md:block" />
              예상 견적부터 실측·제작·설치까지 리스토리가 순서대로
              안내합니다.
            </p>
          </FadeIn>
          <div className="space-y-4">
            <FadeIn delay={60}>
              <div
                className="rounded-2xl bg-white p-5 md:p-6"
                style={{ border: "1px solid #dbe6ff" }}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a5cff] text-[14px] font-black text-white">
                    01
                  </span>
                  <div>
                    <p className="text-[11px] font-black tracking-[0.22em] text-[#1a5cff]">
                      STEP 01
                    </p>
                    <h3 className="text-[20px] font-black leading-tight text-neutral-950 md:text-[24px]">
                      상담으로 예상 견적 확인하기
                    </h3>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-[#f8f9fb] p-4">
                    <div className="mb-4 flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          className="flex h-12 flex-1 items-center justify-center rounded-md bg-white text-[11px] font-black text-[#1a5cff]"
                          style={{ border: "1px solid #dbe6ff" }}>
                          {n}
                        </span>
                      ))}
                    </div>
                    <p className="mb-2 text-[16px] font-black text-neutral-950">
                      직접 확인
                    </p>
                    <p className="text-[13px] font-medium leading-[1.75] text-neutral-600">
                      상부장·하부장 문짝과 서랍 앞판을 각각 세어 예상 금액을
                      확인할 수 있습니다.
                    </p>
                    <p className="mt-3 rounded-lg bg-white px-3 py-2 text-[12px] font-bold leading-[1.65] text-neutral-500">
                      걸레받이와 몰딩은 개수가 아닌 길이에 따라 m당
                      측정합니다.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#eef4ff] p-4">
                    <div
                      className="relative mb-4 overflow-hidden rounded-lg bg-white shadow-sm"
                      style={{ aspectRatio: "347 / 406" }}>
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
                      아래 사진 2장을 보내주시면 교체 가능한 범위와 예상
                      견적을 안내해 드립니다.
                    </p>
                    <div className="mt-3 space-y-1.5 text-[12px] font-bold text-[#1a5cff]">
                      <p>문짝이 잘 보이는 사진 1장</p>
                      <p>주방 전체가 보이는 사진 1장</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {[
              {
                step: "02",
                title: "방문 실측",
                badge: "규격 확인",
                desc:
                  "예상 견적을 확인한 뒤 방문 일정을 잡습니다. 현장에서 문짝과 서랍 앞판의 크기, 경첩 위치, 걸레받이·몰딩 길이를 정확하게 측정합니다.",
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
                desc:
                  "원하는 문짝의 색상과 마감 방식을 선택합니다. 백색 유광 하이그로시와 PET 제로조인트 무광 등 현장에 맞는 방향을 함께 봅니다.",
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
                desc:
                  "문짝과 서랍 앞판은 측정한 규격에 맞춰 하나씩 주문 제작합니다.",
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
                desc:
                  "기존 문짝을 철거하고 새 문짝을 설치합니다. 설치 후에는 경첩과 간격, 수평을 세밀하게 조절합니다.",
                note: "현장 설치는 주방 규모에 따라 보통 약 2~3시간 정도 소요됩니다.",
                bars: ["w-12", "w-12", "w-12"],
                image: FIELD_INSTALLATION_IMAGE,
                imageAlt: "현장에서 기존 싱크대 문짝을 철거하고 설치를 준비하는 모습",
                imageRatio: "4 / 3",
              },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={120 + i * 60}>
                <div
                  className="grid gap-4 rounded-2xl bg-white p-5 md:grid-cols-[92px_1fr]"
                  style={{ border: "1px solid #e5e7eb" }}>
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
                        style={{ aspectRatio: item.imageRatio ?? "4 / 3" }}>
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
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={200}>
            <a
              href={KAKAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2.5 rounded-2xl text-[15px] font-black"
              style={{
                background: "#FEE500",
                color: "#1a1a1a",
                padding: "18px 24px",
              }}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
              </svg>
              사진 2장 보내고 예상 견적 받기
            </a>
          </FadeIn>
        </div>
      </section>

      {/* 6. TRUST */}
      <section className="px-5 py-14 md:py-20" style={{ background: "#fff" }}>
        <div className="mx-auto max-w-lg">
          <FadeIn>
            <p className="text-[12px] font-bold tracking-widest text-[#1a5cff] mb-2">
              TRUST
            </p>
            <h2
              className="font-black leading-[1.2] mb-8"
              style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
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
                  }}>
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
                  style={{ border: "1px solid #e5e7eb" }}>
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

      {/* 7. VIDEO */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#0a1628" }}>
        <div className="mx-auto max-w-lg">
          <FadeIn>
            <p
              className="text-[12px] font-bold tracking-widest mb-2"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              REAL VIDEO
            </p>
            <h2
              className="font-black text-white mb-6"
              style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)" }}>
              실제 시공 영상
            </h2>
          </FadeIn>
          <FadeIn delay={80}>
            <YouTubeFacade videoId={REAL_VIDEO_ID} />
          </FadeIn>
        </div>
      </section>

      {/* 8. FAQ */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#f8f9fb" }}>
        <div className="mx-auto max-w-lg">
          <FadeIn>
            <p className="text-[12px] font-bold tracking-widest text-[#1a5cff] mb-2">
              FAQ
            </p>
            <h2
              className="font-black leading-[1.2] mb-8"
              style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
              자주 묻는 질문
            </h2>
          </FadeIn>
          <div className="flex flex-col gap-2">
            {FAQ_ITEMS.map((f, i) => (
              <FadeIn key={i} delay={i * 50}>
                <div
                  className="overflow-hidden rounded-2xl bg-white"
                  style={{ border: "1px solid #e5e7eb" }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}>
                    <span className="pr-4 text-[14px] font-bold text-neutral-900 md:text-[15px]">
                      {f.q}
                    </span>
                    <span
                      className="flex-shrink-0 text-[14px] font-bold transition-transform duration-200"
                      style={{
                        color: "#1a5cff",
                        transform: openFaq === i ? "rotate(180deg)" : "none",
                      }}>
                      ▾
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: openFaq === i ? 620 : 0 }}>
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
      <section
        className="px-5 py-16 md:py-24"
        style={{ background: "#0a1628" }}>
        <div className="mx-auto max-w-lg text-center">
          <FadeIn>
            <p
              className="text-[13px] font-bold tracking-widest mb-4"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              지금 바로 시작하세요
            </p>
            <h2
              className="font-black text-white leading-[1.2] mb-3 whitespace-pre-line"
              style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)" }}>
              {region
                ? `${region} 문짝 교체\n사진 한 장이면 충분합니다`
                : "싱크대 사진 한 장이면\n충분합니다"}
            </h2>
            <p
              className="text-[14px] mb-8"
              style={{ color: "rgba(255,255,255,0.4)" }}>
              교체 가능 여부를 먼저 확인해드립니다
            </p>
            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <a
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 rounded-2xl text-[16px] font-black"
                style={{
                  background: "#FEE500",
                  color: "#1a1a1a",
                  padding: "20px 24px",
                }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor">
                  <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
                </svg>
                카카오로 사진 보내기
              </a>
              <a
                href={PHONE}
                className="flex items-center justify-center gap-2 rounded-2xl text-[15px] font-bold text-white"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: "16px 24px",
                }}>
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
                  style={{ color: "rgba(255,255,255,0.3)" }}>
                  {i > 0 && (
                    <span
                      className="mr-4"
                      style={{ color: "rgba(255,255,255,0.1)" }}>
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

      <FloatingCTA />
    </main>
  );
}
