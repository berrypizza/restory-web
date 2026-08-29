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
const PHONE = "tel:1688-2957";
const KAKAO_URL = "http://pf.kakao.com/_hQExjX/chat";

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
    a: "상부장 전체가 보이는 사진 1장과 벽에서 벌어지거나 처진 부분이 가까이 보이는 사진 1장을 보내주시면 예상되는 문제 범위를 먼저 확인할 수 있습니다.\n\n사진과 함께 작업 지역, 문 걸림·틈 벌어짐·기울어짐 같은 현재 증상을 적어주세요.\n\n사진으로 문짝이나 경첩 문제인지, 시공목과 고정 상태까지 점검해야 하는지 먼저 안내할 수 있습니다. 다만 내부 파손 정도와 정확한 작업 범위는 현장 점검이나 상부장 분리 후 확정됩니다.",
  },
  {
    q: "상부장 수리 비용과 작업 시간은 어떻게 되나요?",
    a: "상부장 처짐 수리는 현재 25만 원이며, 일반적인 현장 작업 시간은 약 2시간입니다.\n\n작업에는 상부장을 내린 뒤 고정 상태를 확인하고, 시공목과 약해진 부분을 보강한 후 재설치와 수평 조절을 진행하는 과정이 포함됩니다.\n\n다만 상부장이 전체 추락했거나 장 몸통의 파손이 심해 추가 보강 또는 새 제작이 필요한 경우에는 작업 범위와 비용이 달라질 수 있습니다.",
  },
  {
    q: "작업 전에 고객이 준비할 것은 무엇인가요?",
    a: "작업 전 상부장 안에 들어 있는 그릇과 물건을 비워두시면 됩니다.\n\n주방 전체를 비우거나 별도로 철거할 필요는 없으며, 상부장 아래 작업 공간에 놓인 물건만 잠시 옮겨주시면 작업을 시작하기 수월합니다.\n\n사진 접수 후 현장에서 추가로 준비해야 할 부분이 있다면 방문 전에 안내드립니다.",
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

/* ─────────────────────────────────────────
   CaseStrip
───────────────────────────────────────── */
function CaseStrip({ region }: { region?: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allCases = cases
    .filter((c) => c.category === "상부장 처짐")
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
        <p className="text-[15px] font-bold text-neutral-900">실제 수리 사례</p>
        <Link
          href="/cases?cat=상부장 처짐"
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
          title="리스토리 상부장 수리 시공 영상"
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
export default function SangbujangLanding({ keyword }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { region, symptom } = keyword
    ? parseKeyword(keyword)
    : { region: "", symptom: "" };

  const heroTitle = region
    ? `${region} 싱크대 상부장 ${symptom}`
    : "상부장 처짐\n교체하지 마세요";
  const heroSub = region
    ? `${region} 당일 출장 가능 · 합판 수리로 더 튼튼하게`
    : "합판 수리로 더 튼튼하게, 더 저렴하게";
  const heroBadge = region
    ? `${region} 출장 · 교체 비용의 1/3~`
    : "교체 비용의 1/3~";

  // 지역 케이스 수 (thin content 방지용 동적 데이터)
  const regionCaseCount = region
    ? cases.filter(
        (c) => c.category === "상부장 처짐" && c.region.includes(region),
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
        name={region ? `${region} 싱크대 상부장 수리` : "싱크대 상부장 수리"}
        description="싱크대 상부장 처짐·추락 증상 합판 시공목으로 수리. 교체 비용의 1/3~1/5. 3년 무상 A/S."
        url={
          keyword
            ? `https://www.restorystudio.co.kr/repair/${keyword}`
            : "https://www.restorystudio.co.kr/repair/sangbujang"
        }
      />
      <FAQJsonLd faqs={FAQ_ITEMS} />

      {/* 1. HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#0a1628", minHeight: "100svh" }}>
        <div className="absolute inset-0 md:hidden">
          <Image
            src="/images/upper/hero-im.png"
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
                    ? `${region} 상부장 수리 전문`
                    : "리스토리 상부장 수리"}
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
                  합판 시공목 사용
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
              src="/images/upper/hero.webp"
              alt="리스토리 상부장 수리"
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

      {/* ★ 지역 설명 블록 (케이스 수 포함 → thin content 방지) */}
      {region && (
        <section className="px-5 py-10" style={{ background: "#ffffff" }}>
          <div className="mx-auto max-w-lg">
            <h2
              className="text-[20px] font-black mb-3"
              style={{ color: "#111827" }}>
              {region} 싱크대 상부장 처짐 수리
            </h2>
            <p className="text-[14px] leading-[1.8] text-neutral-600">
              {region} 지역 싱크대 상부장 처짐·떨어짐 증상은 리스토리가 당일
              출장으로 해결합니다. {region} 아파트 특성상 PB 소재 시공목이 많아
              습기에 취약한 경우가 많습니다.
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
                  img: "/images/upper/before.jpg",
                  label: "BEFORE",
                  dark: true,
                },
                { img: "/images/upper/after.jpg", label: "AFTER", dark: false },
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
                같은 상부장입니다
              </p>
              <p className="text-[12px] text-white/60 mt-0.5">
                교체 없이 수리만 했습니다
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div
                className="rounded-2xl p-4 text-center"
                style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
                <p className="text-[11px] font-semibold text-neutral-400 mb-1">
                  상부장 전체 교체
                </p>
                <p
                  className="text-[22px] font-black"
                  style={{ color: "#ef4444" }}>
                  80~200만원
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  + 실측, 공사 5~7일 대기
                </p>
              </div>
              <div
                className="rounded-2xl p-4 text-center"
                style={{ background: "#eef4ff", border: "1px solid #c7d7ff" }}>
                <p className="text-[11px] font-semibold text-[#1a5cff] mb-1">
                  리스토리 합판 수리
                </p>
                <p
                  className="text-[22px] font-black"
                  style={{ color: "#1a5cff" }}>
                  20~40만원~
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
                  수리했는데 왜 더 튼튼한가요?
                </h3>
                <p className="text-[13px] leading-[1.7] text-neutral-500 mb-5">
                  대부분의 상부장 시공목은 습기에 약한 PB(파티클보드)예요.
                  <br />
                  리스토리는{" "}
                  <strong className="text-neutral-800">100% 합판</strong>으로만
                  교체합니다.
                </p>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-semibold text-neutral-400">
                        기존 상부장 (PB 소재)
                      </span>
                      <span className="text-[13px] font-black text-neutral-400">
                        습기에 약함
                      </span>
                    </div>
                    <div
                      className="h-3 rounded-full overflow-hidden"
                      style={{ background: "#f3f4f6" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: "30%", background: "#d1d5db" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-[12px] font-bold"
                        style={{ color: "#1a5cff" }}>
                        리스토리 합판 시공목
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
                    처짐 재발 없음
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
                    img: "/images/tips/pb-damaged.jpg",
                    alt: "PB 파티클보드 소재",
                    sub: "기존 PB 소재",
                    label: "습기에 부서짐",
                    dark: true,
                  },
                  {
                    img: "/images/tips/plywood-cross-section.png",
                    alt: "합판 시공목",
                    sub: "리스토리 합판",
                    label: "내구성 3배+",
                    dark: false,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden"
                    style={{ aspectRatio: "4/3" }}>
                    <Image
                      src={item.img}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                    <div
                      className="absolute inset-0 flex flex-col justify-end p-3"
                      style={{
                        background: item.dark
                          ? "linear-gradient(to top, rgba(0,0,0,0.65), transparent)"
                          : "linear-gradient(to top, rgba(26,92,255,0.7), transparent)",
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
          {/* ★ 자재 직거래 섹션 — PB vs 합판 카드 바로 아래 */}
          <FadeIn delay={220}>
            <div
              className="mt-4 overflow-hidden rounded-2xl"
              style={{ border: "1px solid #e5e7eb" }}>
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "16/9" }}>
                <Image
                  src="/images/upper/factory-1.png"
                  alt="리스토리 자재 직매입 — 국내산 합판 직거래"
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
                    WHY SO STRONG & AFFORDABLE
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
                  PB보다 3배 튼튼한 합판을 쓰면서도 비용은 줄어요.
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
                img: "/images/review-photo-1.jpg",
                keyword: "처짐 재발 없음",
                unit: "상부장 수리",
                area: "서울 강서구 화곡동",
                name: "김현* 고객님",
                quote:
                  "상부장이 떨어졌는데, 합판 시공목으로 튼튼하게 고쳐주셨어요. 작업 후에도 먼지 하나 없이 깨끗하게 청소해주셔서 감동했습니다.",
              },
              {
                img: "/images/review-photo-2.jpg",
                keyword: "교체 비용의 1/3",
                unit: "상부장 수리",
                area: "부천 작동",
                name: "이승* 고객님",
                quote:
                  "다른 데는 교체하라고만 했는데 여기서 수리로 해결됐어요. 비용도 1/3 수준이었습니다. 보양지 쓰시는 거 보고 놀랐어요.",
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
              상부장 수리는 빠를수록 안전합니다
            </p>
          </FadeIn>
          <div className="flex flex-col gap-3">
            {[
              {
                step: "01",
                icon: "📸",
                title: "사진 보내기",
                desc: "상부장 사진만 카카오로 보내주세요. 30초 안에 수리 가능 여부 확인해드립니다.",
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
                desc: `보양 처리 → 합판 수리 → 집진기 청소 → 완료.${region ? ` ${region} 당일 작업 마무리.` : " 당일 작업 마무리."}`,
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
                desc: "수리 후 처짐 재발·시공목 이탈 시 무조건 다시 와서 고쳐드립니다.",
              },
              {
                icon: "📋",
                title: "생산물 배상책임보험 가입",
                desc: "시공 중 예상치 못한 문제가 생겨도 보험으로 100% 보상됩니다.",
              },
              {
                icon: "🧹",
                title: "집진기 사용 · 보양 처리",
                desc: "작업 전 전 구간 보양 처리, 집진기로 마무리. 작업 후 현장 깨끗하게 정리하고 갑니다.",
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
            <YouTubeFacade videoId="tDAtB2ClG08" />
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
                    style={{ maxHeight: openFaq === i ? 560 : 0 }}>
                    <p className="whitespace-pre-line px-5 pb-4 pt-1 text-[13px] leading-[1.75] text-neutral-500 border-t border-neutral-100">
                      {f.a}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={320}>
            <div
              className="mt-6 rounded-2xl bg-white px-5 py-5"
              style={{ border: "1px solid #e5e7eb" }}>
              <p className="mb-2 text-[14px] font-black text-neutral-900">
                함께 확인 가능한 싱크대 문제
              </p>
              <p className="text-[13px] leading-[1.75] text-neutral-500">
                상부장 방문 시 하부장 밑판 물먹음, 문짝·경첩, 서랍
                레일처럼 함께 불편한 부분이 있다면 사진을 미리 보내주세요.
                같은 날 확인 가능한 범위와 별도 작업이 필요한 범위를 나눠
                안내드립니다.
              </p>
            </div>
          </FadeIn>
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
              사진으로 먼저 확인하세요
            </p>
            <h2
              className="font-black text-white leading-[1.2] mb-3 whitespace-pre-line"
              style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)" }}>
              {region
                ? `${region} 상부장 수리\n가능 범위부터 확인해보세요`
                : "사진으로 수리 가능 범위부터\n확인해보세요"}
            </h2>
            <p
              className="text-[14px] leading-[1.8] mb-8"
              style={{ color: "rgba(255,255,255,0.4)" }}>
              상부장 전체 사진 1장과 벽에서 벌어지거나 처진 부분의 가까운
              사진 1장을 보내주세요. 작업 지역과 현재 증상을 함께 적어주시면
              먼저 확인할 부분과 예상 작업 범위를 안내드립니다.
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
                상부장 사진으로 먼저 확인하기
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
                "교체 비용의 1/3~",
                "합판 시공목",
                "집진기 청소",
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
