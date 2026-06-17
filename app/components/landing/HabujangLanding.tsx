"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/app/components/FadeIn";
import FloatingCTA from "@/app/components/landing/shared/FloatingCTA";
import { ServiceJsonLd, FAQJsonLd } from "@/app/components/JsonLd";
import { cases } from "@/lib/case-data";
import { REGIONS } from "@/lib/seo-regions";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const PHONE = "tel:010-6855-0957";
const KAKAO_URL = "http://pf.kakao.com/_hQExjX/chat";

const FAQ_ITEMS = [
  {
    q: "하부장 밑판만 교체해도 되나요?",
    a: "네. 캐비닛 프레임이 멀쩡하면 물 먹은 밑판(바닥판)만 교체하면 됩니다. 싱크대 전체를 바꿀 필요가 없습니다.",
  },
  {
    q: "밑판이 왜 부풀어 오르나요?",
    a: "대부분의 싱크대 밑판은 PB(파티클보드)로 되어 있습니다. PB는 톱밥을 접착제로 뭉친 소재라 물이 닿으면 빠르게 흡수하고 부풀어 오릅니다. 배수관 연결부 누수, 결로, 설거지 물 튐 등이 주된 원인입니다.",
  },
  {
    q: "시공 시간은 얼마나 걸리나요?",
    a: "하부장 밑판 교체 기준 약 1~2시간 소요됩니다. 당일 시공 완료되며, 바로 사용 가능합니다.",
  },
  {
    q: "상부장 수리도 같이 가능한가요?",
    a: "네. 상부장 처짐·떨어짐, 경첩 교체, 레일 교체 등 방문 시 함께 작업 가능합니다. 추가 출장비 없이 진행됩니다.",
  },
  {
    q: "A/S 3년은 어떤 범위인가요?",
    a: "시공 후 3년간 무상 A/S를 제공합니다. 밑판 재파손, 들뜸 등 문제 발생 시 무상으로 재시공해드립니다.",
  },
];

/* ─────────────────────────────────────────
   keyword → 지역·증상 파싱
───────────────────────────────────────── */
function parseKeyword(keyword: string): { region: string; symptom: string } {
  const kw = keyword.replace(/-/g, " ");
  const region = REGIONS.find((r) => kw.includes(r)) ?? "";
  const symptom = kw.includes("물먹음")
    ? "물먹음"
    : kw.includes("썩음")
      ? "썩음"
      : kw.includes("곰팡이")
        ? "곰팡이"
        : kw.includes("밑판")
          ? "밑판 교체"
          : "수리";
  return { region, symptom };
}

/* ─────────────────────────────────────────
   CaseStrip
───────────────────────────────────────── */
function CaseStrip({ region }: { region?: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allCases = cases
    .filter((c) => c.category === "하부장 밑판 교체")
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
        <p className="text-[13px] font-bold text-neutral-900">실제 수리 사례</p>
        <Link
          href="/cases?cat=하부장 밑판 교체"
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

/* ─────────────────────────────────────────
   YouTubeFacade
───────────────────────────────────────── */
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
          title="리스토리 하부장 밑판 교체 시공 영상"
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

/* ─────────────────────────────────────────
   PROPS
───────────────────────────────────────── */
interface Props {
  keyword?: string;
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export default function HabujangLanding({ keyword }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { region, symptom } = keyword
    ? parseKeyword(keyword)
    : { region: "", symptom: "" };

  const heroTitle = region
    ? `${region} 하부장 ${symptom}`
    : "물 먹은 하부장\n교체하지 마세요";
  const heroSub = region
    ? `${region} 당일 출장 가능 · 밑판 교체로 더 저렴하게`
    : "밑판만 교체하면 됩니다";
  const heroBadge = region
    ? `${region} 출장 · 교체 비용의 1/5~`
    : "교체 비용의 1/5~";

  const regionCaseCount = region
    ? cases.filter(
        (c) => c.category === "하부장 밑판 교체" && c.region.includes(region),
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
            ? `${region} 싱크대 하부장 밑판 교체`
            : "싱크대 하부장 밑판 교체"
        }
        description="싱크대 하부장 밑판 물먹음·부풀음·파손 증상, 지판 교체. 교체 비용의 1/3~1/5. 3년 무상 A/S."
        url={
          keyword
            ? `https://www.restorystudio.co.kr/repair/${keyword}`
            : "https://www.restorystudio.co.kr/repair/habujang"
        }
      />
      <FAQJsonLd faqs={FAQ_ITEMS} />

      {/* 1. HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#0a1628", minHeight: "100svh" }}>
        <div className="absolute inset-0 md:hidden">
          <Image
            src="/images/hero-habujang.webp"
            alt=""
            fill
            className="object-cover"
            style={{ opacity: 0.7 }}
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
                    ? `${region} 하부장 수리 전문`
                    : "리스토리 하부장 수리"}
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
                  밑판만 교체
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
                  { n: "500건+", l: "연간 수리" },
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
              src="/images/hero-habujang.webp"
              alt="리스토리 하부장 밑판 교체"
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
              📍 {region} 지역 당일 출장 가능 · 사진 한 장으로 무료 견적
            </p>
          </div>
        </section>
      )}

      {/* ★ 지역 설명 블록 */}
      {region && (
        <section className="px-5 py-10" style={{ background: "#ffffff" }}>
          <div className="mx-auto max-w-lg">
            <h2
              className="text-[20px] font-black mb-3"
              style={{ color: "#111827" }}>
              {region} 싱크대 하부장 밑판 교체
            </h2>
            <p className="text-[14px] leading-[1.8] text-neutral-600">
              {region} 지역 싱크대 하부장 밑판 물먹음·부풀음·곰팡이 증상은
              리스토리가 당일 출장으로 해결합니다.
              {regionCaseCount > 0 && (
                <>
                  {" "}
                  리스토리의 {region} 지역 시공 완료 건수는{" "}
                  <strong className="text-neutral-900">
                    {regionCaseCount}건
                  </strong>
                  입니다.
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
            <p className="text-[12px] font-bold tracking-widest text-[#1a5cff] mb-2">
              BEFORE / AFTER
            </p>
            <h2
              className="font-black leading-[1.2] mb-8"
              style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
              말보다 사진이 빠릅니다
            </h2>
          </FadeIn>
          <FadeIn delay={80}>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                {
                  img: "/images/habujang/before.jpg",
                  label: "BEFORE",
                  dark: true,
                },
                {
                  img: "/images/habujang/after.jpg",
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
                같은 하부장입니다
              </p>
              <p className="text-[12px] text-white/60 mt-0.5">
                밑판만 교체했습니다
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div
                className="rounded-2xl p-4 text-center"
                style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
                <p className="text-[11px] font-semibold text-neutral-400 mb-1">
                  싱크대 전체 교체
                </p>
                <p
                  className="text-[22px] font-black"
                  style={{ color: "#ef4444" }}>
                  200~500만원
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  + 실측, 공사 5~7일 대기
                </p>
              </div>
              <div
                className="rounded-2xl p-4 text-center"
                style={{ background: "#eef4ff", border: "1px solid #c7d7ff" }}>
                <p className="text-[11px] font-semibold text-[#1a5cff] mb-1">
                  리스토리 밑판 교체
                </p>
                <p
                  className="text-[22px] font-black"
                  style={{ color: "#1a5cff" }}>
                  20~50만원~
                </p>
                <p className="text-[11px] text-[#1a5cff]/60 mt-1">
                  + 당일 완료
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={180}>
            <div
              className="mt-4 overflow-hidden rounded-2xl"
              style={{ border: "1px solid #e5e7eb" }}>
              <div className="p-5" style={{ background: "#fff" }}>
                <p className="text-[11px] font-bold tracking-widest text-neutral-400 mb-3">
                  QUALITY PROOF
                </p>
                <h3 className="text-[18px] font-black text-neutral-900 leading-[1.3] mb-1">
                  밑판이 부풀면 왜 위험한가요?
                </h3>
                <p className="text-[13px] leading-[1.7] text-neutral-500 mb-5">
                  대부분의 하부장 밑판은 습기에 약한 PB(파티클보드)예요.
                  <br />
                  물이 닿으면 빠르게 부풀고, 방치하면{" "}
                  <strong className="text-neutral-800">곰팡이와 악취</strong>로
                  번집니다.
                </p>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-semibold text-neutral-400">
                        기존 밑판 (PB 소재)
                      </span>
                      <span className="text-[13px] font-black text-neutral-400">
                        물에 취약
                      </span>
                    </div>
                    <div
                      className="h-3 rounded-full overflow-hidden"
                      style={{ background: "#f3f4f6" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: "20%", background: "#d1d5db" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-[12px] font-bold"
                        style={{ color: "#1a5cff" }}>
                        리스토리 교체 밑판
                      </span>
                      <span
                        className="text-[13px] font-black"
                        style={{ color: "#1a5cff" }}>
                        내구성 3배+
                      </span>
                    </div>
                    <div
                      className="h-3 rounded-full overflow-hidden"
                      style={{ background: "#eef4ff" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: "90%", background: "#1a5cff" }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl py-3"
                  style={{ background: "#eef4ff" }}>
                  <span
                    className="text-[16px] font-black"
                    style={{ color: "#1a5cff" }}>
                    곰팡이 재발 없음
                  </span>
                  <span
                    className="text-[13px]"
                    style={{ color: "rgba(26,92,255,0.5)" }}>
                    → 3년 무상 A/S 보증
                  </span>
                </div>
              </div>
              <div
                className="grid grid-cols-2 border-t"
                style={{ borderColor: "#f3f4f6" }}>
                {[
                  {
                    img: "/images/habujang/symptom-1.jpg",
                    sub: "기존 PB 밑판",
                    label: "물먹어 부풀음",
                    dark: true,
                  },
                  {
                    img: "/images/habujang/symptom-3.png",
                    sub: "방치 시",
                    label: "곰팡이 발생",
                    dark: false,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden"
                    style={{ aspectRatio: "4/3" }}>
                    <Image
                      src={item.img}
                      alt={item.sub}
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                    <div
                      className="absolute inset-0 flex flex-col justify-end p-3"
                      style={{
                        background: item.dark
                          ? "linear-gradient(to top, rgba(0,0,0,0.65), transparent)"
                          : "linear-gradient(to top, rgba(227,46,64,0.7), transparent)",
                      }}>
                      <p className="text-[10px] font-semibold text-white/70">
                        {item.sub}
                      </p>
                      <p className="text-[13px] font-black text-white">
                        {item.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* ★ 자재 직거래 섹션 */}
          <FadeIn delay={220}>
            <div
              className="mt-4 overflow-hidden rounded-2xl"
              style={{ border: "1px solid #e5e7eb" }}>
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "16/9" }}>
                <Image
                  src="/images/upper/factory-1.png"
                  alt="리스토리 자재 직매입"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[11px] font-bold tracking-widest text-white/50 mb-1">
                    WHY SO AFFORDABLE
                  </p>
                  <h3 className="text-[22px] font-black text-white leading-[1.2] mb-1">
                    공장 직거래, 중간 마진 없음
                  </h3>
                  <p className="text-[13px] text-white/60">
                    국내산 자재 직매입 · 유통사 마진 제로
                  </p>
                </div>
              </div>
              <div className="p-5" style={{ background: "#fff" }}>
                <p className="text-[13px] leading-[1.7] text-neutral-500">
                  시중 자재상을 거치지 않아요. 자재 공장에서{" "}
                  <strong className="text-neutral-800">직매입</strong>하니까
                  PB보다 3배 튼튼한 밑판을 쓰면서도 비용은 줄어요.
                </p>
                <div
                  className="mt-4 flex items-center justify-center gap-3 rounded-xl py-3.5"
                  style={{ background: "#0a1628" }}>
                  <span className="text-[17px] font-black text-white">
                    좋은 자재, 낮은 비용
                  </span>
                  <span className="text-[12px] text-white/40">
                    공장 직매입이라 가능한 이유
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. REVIEWS */}
      <section className="px-5 py-14 md:py-20" style={{ background: "#fff" }}>
        <div className="mx-auto max-w-2xl">
          <FadeIn>
            <div className="flex items-end gap-3 mb-8">
              <div>
                <p className="text-[12px] font-bold tracking-widest text-[#1a5cff] mb-1">
                  REVIEWS
                </p>
                <h2
                  className="font-black leading-[1.2]"
                  style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
                  직접 겪은 고객님들
                </h2>
              </div>
              <div className="ml-auto text-right pb-1 flex-shrink-0">
                <p
                  className="text-[28px] font-black"
                  style={{ color: "#1a5cff" }}>
                  4.9★
                </p>
                <p className="text-[11px] text-neutral-400">고객 평점</p>
              </div>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                img: "/images/habujang/review-1.jpeg",
                keyword: "새것처럼!",
                unit: "하부장 밑판 교체",
                area: "인천 서구",
                name: "김** 고객님",
                quote:
                  "배수관에서 물이 살짝 새서 밑판이 다 부풀었는데, 지판 교체하니 튼튼해졌어요.",
              },
              {
                img: "/images/habujang/review-2.jpg",
                keyword: "전체 교체 안 해도",
                unit: "하부장 밑판 교체",
                area: "서울 강서구",
                name: "박** 고객님",
                quote:
                  "다른 업체는 싱크대 전체를 바꿔야 한다고 했는데, 밑판만 교체해서 비용도 아꼈어요.",
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
                            style={{ fontSize: "clamp(1.2rem, 4vw, 1.6rem)" }}>
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
          <FadeIn delay={100}>
            <CaseStrip region={region} />
          </FadeIn>
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
              사진 한 장이면
              <br />
              나머지는 저희가 합니다
            </h2>
            <p className="text-[14px] text-neutral-400 mb-10">
              물 먹은 밑판, 빠를수록 곰팡이를 막습니다
            </p>
          </FadeIn>
          <div className="flex flex-col gap-3">
            {[
              {
                step: "01",
                icon: "📸",
                title: "사진 보내기",
                desc: "하부장 안쪽 사진만 카카오로 보내주세요. 30초 안에 교체 가능 여부 확인해드립니다.",
                time: "30초",
              },
              {
                step: "02",
                icon: "🔍",
                title: "상태 확인 + 견적",
                desc: "사진으로 1차 확인 후 정확한 금액 범위를 먼저 안내드립니다. 방문 전 금액 확정.",
                time: "무료",
              },
              {
                step: "03",
                icon: "✅",
                title: "방문 시공 완료",
                desc: `기존 밑판 제거 → 새 밑판 교체 → 완료.${region ? ` ${region} 당일 작업 마무리.` : " 당일 작업 마무리."}`,
                time: "당일 완료",
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
                    <div className="flex items-center gap-2 mb-1">
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

      {/* 5. TRUST */}
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
          <div className="flex flex-col gap-3 mb-10">
            {[
              {
                icon: "🛡",
                title: "3년 무상 재시공",
                desc: "밑판 재파손·들뜸 시 무조건 다시 와서 고쳐드립니다. 비용 없습니다.",
              },
              {
                icon: "📋",
                title: "생산물 배상책임보험 가입",
                desc: "시공 중 예상치 못한 문제가 생겨도 보험으로 100% 보상됩니다.",
              },
              {
                icon: "🧹",
                title: "시공 후 깔끔 정리",
                desc: "기존 밑판 철거 후 청소까지. 작업 후 현장 깨끗하게 정리하고 갑니다.",
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
          <FadeIn delay={150}>
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
            <YouTubeFacade videoId="fp2clUUef24" />
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
                    style={{ maxHeight: openFaq === i ? 200 : 0 }}>
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
              지금 바로 시작하세요
            </p>
            <h2
              className="font-black text-white leading-[1.2] mb-3 whitespace-pre-line"
              style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)" }}>
              {region
                ? `${region} 하부장 밑판\n사진 한 장이면 충분합니다`
                : "하부장 사진 한 장이면\n충분합니다"}
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
                📞 010-6855-0957
              </a>
            </div>
            <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
              {[
                "교체 비용의 1/5~",
                "밑판만 교체",
                "곰팡이 제거",
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

      <FloatingCTA />
    </main>
  );
}
