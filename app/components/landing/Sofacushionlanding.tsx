"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/app/components/FadeIn";
import FloatingCTA from "@/app/components/landing/shared/FloatingCTA";
import { ServiceJsonLd, FAQJsonLd } from "@/app/components/JsonLd";
import { buildTrackedContactPath } from "@/lib/attribution";
import { cases } from "@/lib/case-data";
import { REGIONS } from "@/lib/seo-regions";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const PHONE = buildTrackedContactPath("phone", "sofa_cushion");
const KAKAO_URL = buildTrackedContactPath("kakao", "sofa_cushion");

const FAQ_ITEMS = [
  {
    q: "우리 집 소파도 복원할 수 있나요?",
    a: "쿠션의 탄성 저하, 밴드 늘어짐, 스프링 이탈 등 원인과 내부 구조에 따라 가능한 작업이 달라집니다. 전체 모습과 꺼진 부분 사진으로 먼저 살펴보고, 사진에 드러나지 않는 손상은 현장 확인이 필요할 수 있습니다.",
  },
  {
    q: "사진을 보내면 무엇을 알 수 있나요?",
    a: "복원 가능성을 1차로 살펴보고 예상 비용 범위와 방문 가능 일정을 상담합니다. 전체 모습과 꺼진 부분 사진에 지역·증상을 함께 적어주세요. 추가 사진이나 내부 확인이 필요한 부분도 안내합니다.",
  },
  {
    q: "복원 비용은 어떻게 정해지나요?",
    a: "좌석 수와 꺼진 범위, 내부 구조의 상태, 필요한 자재와 작업에 따라 달라집니다. 사진으로 예상 범위를 상담하고, 자재·공임·출장비 등 포함 항목과 추가 확인이 필요한 부분을 작업 전에 함께 확인해 주세요.",
  },
  {
    q: "언제 방문하고, 작업은 얼마나 걸리나요?",
    a: "방문 일정은 지역과 예약 상황에 맞춰 상담합니다. 작업 소요시간은 내부 상태와 필요한 작업 범위를 확인한 뒤 상담합니다. 작업시간은 문의부터 방문까지의 대기 시간을 뜻하지 않습니다.",
  },
  {
    q: "직접 소파를 옮겨야 하나요?",
    a: "사진 상담 때 소파가 놓인 공간과 지역을 알려주세요. 현장에서 작업할 수 있는지, 작업 공간 확보나 별도 이동이 필요한지 소파 구조와 상태에 맞춰 상담합니다.",
  },
  {
    q: "수리 후 다시 꺼지면 어떻게 하나요?",
    a: "시공한 부위에 문제가 생기면 해당 부분의 사진과 증상을 보내주세요. A/S 대상 부위·기간·처리 방식은 작업 내용에 따라 상담에서 확인해 주세요.",
  },
  {
    q: "가죽 교체나 의자 천갈이도 함께 문의할 수 있나요?",
    a: "함께 작업하고 싶은 가구의 전체 사진과 손상 부위를 보내주세요. 작업 가능 여부, 필요한 준비와 추가 비용을 각각 확인해 안내합니다.",
  },
];

const FEATURED_CASES = [
  {
    id: "case-080",
    title: "가운데가 푹 꺼진 나뚜찌 소파",
    cause: "밴드 늘어짐 · 스펀지 노후",
    work: "고탄성 스펀지 충진과 하부 밴드 보강",
  },
  {
    id: "case-081",
    title: "앉을 때 지지력이 약해진 소파",
    cause: "S자 스프링 이탈",
    work: "이탈한 스프링을 잡고 엘라스틱 밴드로 보강",
  },
];

/* ─────────────────────────────────────────
   keyword → 지역·증상·표기(소파/쇼파) 파싱
───────────────────────────────────────── */
function parseKeyword(keyword: string): {
  region: string;
  symptom: string;
  sofaWord: string;
} {
  const kw = keyword.replace(/-/g, " ");
  const region = REGIONS.find((r) => kw.includes(r)) ?? "";
  const sofaWord = kw.includes("쇼파") ? "쇼파" : "소파";
  const symptom = kw.includes("꺼짐")
    ? "꺼짐"
    : kw.includes("주저앉음")
      ? "주저앉음"
      : kw.includes("처짐")
        ? "처짐"
        : kw.includes("탄성")
          ? "탄성저하"
          : "꺼짐";
  return { region, symptom, sofaWord };
}

/* ─────────────────────────────────────────
   CaseStrip
───────────────────────────────────────── */
function CaseStrip({ region }: { region?: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allCases = cases
    .filter((c) => c.category === "소파 복원")
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
    const cardWidth = (el.firstElementChild as HTMLElement).offsetWidth + 12;
    el.scrollTo({ left: i * cardWidth, behavior: "smooth" });
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[15px] font-bold text-neutral-900">실제 복원 사례</p>
        <Link
          href="/cases?cat=소파 복원"
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
                  src={item.beforeImg}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="72vw"
                  draggable={false}
                />
                <div
                  className="absolute top-2 left-2 rounded-full px-2.5 py-0.5 text-[10px] font-black text-white"
                  style={{ background: "#e32e40" }}>
                  BEFORE
                </div>
              </div>
              <div className="p-3 bg-white">
                <p className="text-[13px] font-extrabold leading-relaxed text-neutral-900">
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
      <div className="flex justify-center mt-4">
        {CASE_ITEMS.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1}번째 복원 사례 보기`}
            aria-current={i === activeIdx ? "true" : undefined}
            onClick={() => scrollTo(i)}
            className="flex h-11 w-11 items-center justify-center rounded-full"
          >
            <span aria-hidden="true" className="h-1.5 rounded-full transition-all" style={{ width: i === activeIdx ? 20 : 6, background: i === activeIdx ? "#1a5cff" : "#d1d5db" }} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   YouTubeFacade
───────────────────────────────────────── */
function YouTubeFacade({ videoId }: { videoId: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
      {loaded ? (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="리스토리 소파 쿠션 복원 시공 영상"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="absolute inset-0 h-full w-full cursor-pointer"
          aria-label="리스토리 소파 꺼짐 복원 수리 현장 영상 재생">
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt="소파 꺼짐 복원 수리 현장"
            fill
            unoptimized
            sizes="(min-width: 768px) 512px, 100vw"
            className="object-cover opacity-75"
          />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="text-[13px] font-bold text-white">실제 시공 영상 보기</span>
          </span>
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   PROPS
───────────────────────────────────────── */
interface Props {
  keyword?: string;
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export default function SofaCushionLanding({ keyword }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { region, symptom, sofaWord } = keyword
    ? parseKeyword(keyword)
    : { region: "", symptom: "", sofaWord: "소파" };

  const heroTitle = region
    ? `${region} ${sofaWord} ${symptom}\n교체 전에 복원부터`
    : "마음에 드는 소파,\n다시 편안하게";
  const heroSub = region
    ? `${region} ${sofaWord} ${symptom}, 사진으로 먼저 살펴보고 내부 상태에 맞는 복원 방법을 상담합니다.`
    : "겉은 괜찮은데 앉는 자리만 푹 꺼지나요? 내부 보강으로 다시 쓸 수 있는지 살펴봅니다.";
  const heroBadge = region
    ? `${region} 방문 일정 상담`
    : "사진으로 복원 가능성 확인";

  // 지역 케이스 수 (thin content 방지용 동적 데이터)
  const regionCaseCount = region
    ? cases.filter(
        (c) => c.category === "소파 복원" && c.region.includes(region),
      ).length
    : 0;

  return (
    <main
      className="bg-white"
      style={{
        fontFamily:
          "'Wanted Sans Variable','Wanted Sans',-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif",
      }}>
      <ServiceJsonLd
        name={
          region
            ? `${region} ${sofaWord} ${symptom} 복원 수리`
            : "소파 쿠션 복원"
        }
        description="소파 꺼짐·주저앉음의 원인과 내부 상태를 확인하고 스펀지·밴드·스프링에 필요한 복원 작업을 상담합니다. 사진으로 복원 가능성과 예상 비용 범위를 먼저 살펴보세요."
        includeAggregateRating={false}
        url={
          keyword
            ? `https://www.restorystudio.co.kr/sofa/${keyword}`
            : "https://www.restorystudio.co.kr/sofa"
        }
      />
      <FAQJsonLd faqs={FAQ_ITEMS} />

      {/* 1. HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#0a1628", minHeight: "100svh" }}>
        <div className="absolute inset-0 md:hidden">
          <Image
            src="/images/sofa/hero-sofa-2.webp"
            alt=""
            fill
            className="object-cover"
            style={{ opacity: 0.35 }}
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
                    ? `${region} ${sofaWord} 복원 수리 전문`
                    : "리스토리 소파 쿠션 복원"}
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
                className="inline-flex flex-col gap-1 rounded-2xl px-4 py-3 mb-6"
                style={{
                  background: "rgba(26,92,255,0.25)",
                  border: "1px solid rgba(26,92,255,0.4)",
                }}>
                <span className="text-[22px] font-black text-white">
                  {heroBadge}
                </span>
                <span className="text-[13px] font-medium text-white/50">
                  쿠션과 하부 지지 구조를 함께 살펴봅니다
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

              <p className="mt-4 text-[12px] leading-relaxed text-white/65">
                전체 모습 · 꺼진 부분 사진과 지역·증상을 보내주세요.
                <br />사진으로 알기 어려운 내부 손상은 현장 확인이 필요할 수 있습니다.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { n: "가능한 작업", l: "사진으로 1차 확인" },
                  { n: "예상 비용", l: "작업 범위 상담" },
                  { n: "방문 일정", l: "지역·예약 확인" },
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
              src="/images/sofa/hero-sofa-2.webp"
              alt="리스토리 소파 쿠션 복원"
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
              📍 {region} 출장 가능 여부와 일정을 사진으로 문의하세요
            </p>
          </div>
        </section>
      )}

      {/* ★ 지역 설명 블록 (케이스 수 포함 → thin content 방지) */}
      {region && (
        <section className="px-5 py-10" style={{ background: "#ffffff" }}>
          <div className="mx-auto max-w-lg">
            <h2
              className="text-[20px] font-black mb-3"
              style={{ color: "#111827" }}>
              {region} {sofaWord} {symptom} 복원 수리
            </h2>
            <p className="text-[14px] leading-[1.8] text-neutral-600">
              {region} 지역 {sofaWord} {symptom} 증상은 내부 쿠션과 지지 구조의
              상태에 따라 필요한 작업이 달라집니다. 사진으로 먼저 살펴보고,
              내부 확인이 필요한 부분과 방문 가능한 일정을 상담합니다.
              {regionCaseCount > 0 && (
                <>
                  {" "}
                  현재 공개된 {region} 지역 소파 복원 사례는{" "}
                  <strong className="text-neutral-900">
                    {regionCaseCount}건
                  </strong>
                  입니다.
                </>
              )}{" "}
              소파의 전체 모습과 꺼진 부분, 지역과 증상을 함께 보내주세요.
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
            <p className="text-[12px] font-bold tracking-widest text-[#1a5cff] mb-2">
              BEFORE / AFTER
            </p>
            <h2
              className="font-black leading-[1.2] mb-8"
              style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
              먼저, 비슷한 소파의
              <br />복원 과정을 보세요
            </h2>
          </FadeIn>
          <FadeIn delay={80}>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                {
                  img: "/images/sofa/before-after-1.jpg",
                  label: "BEFORE",
                  dark: true,
                },
                {
                  img: "/images/sofa/before-after-2.jpg",
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
                같은 소파입니다
              </p>
              <p className="text-[12px] text-white/60 mt-0.5">
                교체 없이 복원만 했습니다
              </p>
            </div>
          </FadeIn>

          <p className="mt-4 text-[13px] leading-relaxed text-neutral-500">
            복원 전후의 모습입니다. 가능한 개선 범위는 소파의 구조와 손상 상태에 따라 달라집니다.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {FEATURED_CASES.map((proof) => {
              const item = cases.find((entry) => entry.id === proof.id);
              if (!item) return null;
              return (
                <Link
                  key={proof.id}
                  href={`/cases/${proof.id}`}
                  className="overflow-hidden rounded-2xl border border-neutral-200 bg-white no-underline transition-shadow hover:shadow-md">
                  <div className="relative aspect-[4/3]">
                    <Image src={item.afterImg} alt={`${item.region} 소파 복원 후`} fill sizes="(min-width: 640px) 250px, 100vw" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="mb-2 text-[11px] font-bold text-[#1a5cff]">{item.region} · 해당 현장 약 2시간</p>
                    <h3 className="mb-3 text-[16px] font-black leading-snug text-neutral-900">{proof.title}</h3>
                    <dl className="space-y-2 text-[12px] leading-relaxed text-neutral-600">
                      <div><dt className="font-bold text-neutral-900">확인한 원인</dt><dd>{proof.cause}</dd></div>
                      <div><dt className="font-bold text-neutral-900">진행한 작업</dt><dd>{proof.work}</dd></div>
                    </dl>
                    <p className="mt-4 text-[12px] font-bold text-[#1a5cff]">전후 사진과 작업 기록 보기 →</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <CaseStrip region={region} />
        </div>
      </section>

      {/* 3. METHOD */}
      <section className="px-5 py-14 md:py-20 bg-white">
        <div className="mx-auto max-w-lg">
          <FadeIn>
            <p className="mb-2 text-[12px] font-bold tracking-widest text-[#1a5cff]">HOW WE REPAIR</p>
            <h2 className="mb-4 font-black leading-[1.2]" style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
              같은 꺼짐이어도,<br />손봐야 할 곳은 다릅니다
            </h2>
            <p className="mb-7 text-[14px] leading-relaxed text-neutral-500">
              쿠션뿐 아니라 아래에서 몸을 받쳐주는 구조도 살펴봅니다.
              필요한 자재와 보강 방법은 상태를 확인한 뒤 정합니다.
            </p>
          </FadeIn>
          <div className="space-y-3">
            {[
              { n: "01", title: "쿠션의 탄성이 줄었을 때", desc: "압착되거나 노후된 스펀지 상태를 확인합니다. 필요한 부분에 스펀지를 보강한 작업 사례를 확인해 보세요.", id: "case-080" },
              { n: "02", title: "밴드가 늘어나거나 빠졌을 때", desc: "좌방석을 받치는 밴드의 연결 부위와 늘어짐을 확인합니다. 하부 지지 구조를 보강한 사례가 있습니다.", id: "case-101" },
              { n: "03", title: "스프링이 이탈했을 때", desc: "안쪽 스프링과 고정 부위를 살펴봅니다. 이탈한 스프링을 다시 잡고 밴드로 보강한 과정을 볼 수 있습니다.", id: "case-081" },
            ].map((item) => (
              <div key={item.n} className="flex gap-4 rounded-2xl border border-neutral-200 bg-[#f8f9fb] p-5">
                <span className="text-[22px] font-black text-[#1a5cff]">{item.n}</span>
                <div>
                  <h3 className="mb-2 text-[15px] font-black text-neutral-900">{item.title}</h3>
                  <p className="text-[13px] leading-relaxed text-neutral-600">{item.desc}</p>
                  <Link href={`/cases/${item.id}`} className="mt-3 inline-block text-[12px] font-bold text-[#1a5cff]">해당 작업 사례 보기 →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#f8f9fb" }}>
        <div className="mx-auto max-w-lg">
          <FadeIn>
            <p className="text-[12px] font-bold tracking-widest text-[#1a5cff] mb-2">
              HOW IT WORKS
            </p>
            <h2
              className="font-black leading-[1.2] mb-2"
              style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
              사진 상담부터
              <br />
              필요한 복원 작업까지
            </h2>
            <p className="text-[14px] text-neutral-400 mb-10">
              가능한 작업과 준비할 내용을 순서대로 살펴봅니다
            </p>
          </FadeIn>
          <div className="flex flex-col gap-3">
            {[
              {
                step: "01", icon: "📸", title: "사진으로 1차 상담", time: "사진 · 지역",
                desc: "전체 모습과 꺼진 부분 사진, 지역·증상을 보내주세요. 복원 가능성과 예상 비용 범위, 방문 일정을 상담합니다.",
              },
              {
                step: "02", icon: "🔍", title: "현장에서 상태 확인", time: "내부 확인",
                desc: "사진에 보이지 않는 쿠션과 하부 구조를 살펴봅니다. 필요한 작업과 비용에 영향을 주는 부분을 함께 확인합니다.",
              },
              {
                step: "03", icon: "✅", title: "필요한 부위 복원", time: "상태별 작업",
                desc: "확인한 원인에 맞춰 쿠션과 지지 구조를 보강하고, 작업한 부위의 지지 상태와 착석감을 확인합니다.",
              },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div
                  className="flex gap-4 rounded-2xl p-5"
                  style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[18px]"
                      style={{ background: "#eef4ff" }}>
                      {s.icon}
                    </div>
                    {i < 2 && (
                      <div
                        className="w-px flex-1 mt-2"
                        style={{ background: "#e5e7eb", minHeight: 24 }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-[11px] font-black text-neutral-300">
                        {s.step}
                      </span>
                      <span className="text-[15px] font-black text-neutral-900">
                        {s.title}
                      </span>
                      <span
                        className="ml-auto rounded-full px-2.5 py-1 text-[11px] font-bold flex-shrink-0"
                        style={{ background: "#eef4ff", color: "#1a5cff" }}>
                        {s.time}
                      </span>
                    </div>
                    <p className="text-[13px] leading-[1.6] text-neutral-500">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <p className="mt-5 text-[13px] leading-relaxed text-neutral-500">
            작업 소요시간은 내부 상태와 필요한 작업 범위를 확인한 뒤 상담합니다.
            방문 날짜는 지역과 예약 상황에 맞춰 별도로 상담합니다.
          </p>
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
              사진 보내고 견적 받기
            </a>
          </FadeIn>
        </div>
      </section>

      {/* 5. COST & AFTERCARE */}
      <section className="px-5 py-14 md:py-20 bg-white">
        <div className="mx-auto max-w-lg">
          <FadeIn>
            <p className="mb-2 text-[12px] font-bold tracking-widest text-[#1a5cff]">COST & AFTERCARE</p>
            <h2 className="mb-4 font-black leading-[1.2]" style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
              가격을 비교할 때,<br />작업 범위도 같이 보세요
            </h2>
            <p className="mb-7 text-[14px] leading-relaxed text-neutral-500">
              소파마다 구조와 손상 정도가 다릅니다. 전체를 바꿀지, 필요한 부분을 복원할지 판단할 수 있도록 사진으로 예상 비용 범위를 먼저 상담합니다.
            </p>
          </FadeIn>
          <div className="space-y-3">
            {[
              { title: "좌석 수와 꺼진 범위", desc: "한 자리만 꺼졌는지, 여러 자리의 지지력이 함께 약해졌는지 확인합니다." },
              { title: "쿠션과 내부 지지 구조", desc: "스펀지·밴드·스프링·프레임 중 어떤 부분에 작업이 필요한지 살펴봅니다." },
              { title: "작업 내용과 방문 조건", desc: "필요한 자재와 작업, 현장 공간과 지역을 함께 확인합니다." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-neutral-200 bg-[#f8f9fb] p-5">
                <h3 className="mb-1 text-[15px] font-black text-neutral-900">{item.title}</h3>
                <p className="text-[13px] leading-relaxed text-neutral-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-[#c7d7ff] bg-[#eef4ff] p-5">
            <h3 className="mb-3 text-[16px] font-black text-neutral-900">작업을 결정하기 전, 함께 확인하세요</h3>
            <ul className="list-disc space-y-2 pl-5 text-[13px] leading-relaxed text-neutral-700">
              <li>안내받은 금액의 자재·공임·출장비 포함 여부</li>
              <li>현장 확인 후 작업 범위가 달라질 수 있는 부분</li>
              <li>A/S 대상 부위·기간·처리 방법</li>
            </ul>
            <p className="mt-4 text-[12px] leading-relaxed text-neutral-600">
              시공한 부위에 문제가 생기면 사진과 증상을 보내주세요. 작업 내용을 기준으로 상담합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 6. VIDEO */}
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
            <YouTubeFacade videoId="WkxTbZnYz6c" />
          </FadeIn>
        </div>
      </section>

      {/* 7. FAQ */}
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
                    type="button"
                    aria-expanded={openFaq === i}
                    aria-controls={`sofa-faq-${i}`}
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
                  <div id={`sofa-faq-${i}`} hidden={openFaq !== i}>
                    <p className="px-5 pb-4 pt-1 text-[13px] leading-[1.75] text-neutral-500 border-t border-neutral-100">
                      {f.a}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section
        className="px-5 py-16 md:py-24"
        style={{ background: "#0a1628" }}>
        <div className="mx-auto max-w-lg text-center">
          <FadeIn>
            <p
              className="text-[13px] font-bold tracking-widest mb-4"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              교체를 결정하기 전에
            </p>
            <h2
              className="font-black text-white leading-[1.2] mb-3 whitespace-pre-line"
              style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)" }}>
              {region
                ? `${region} ${sofaWord} ${symptom},\n우리 집 소파부터 확인하세요`
                : "우리 집 소파도\n다시 편하게 쓸 수 있을까요?"}
            </h2>
            <p
              className="text-[14px] mb-8"
              style={{ color: "rgba(255,255,255,0.4)" }}>
              사진으로 가능한 작업과 예상 비용 범위, 방문 일정을 상담하세요.
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
                "전체 모습",
                "꺼진 부분",
                "지역",
                "증상",
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

      <FloatingCTA compactMobile label="사진 보내고 복원 가능성 확인" />
    </main>
  );
}
