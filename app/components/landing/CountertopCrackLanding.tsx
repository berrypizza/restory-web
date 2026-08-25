"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/app/components/FadeIn";
import FloatingCTA from "@/app/components/landing/shared/FloatingCTA";
import { ServiceJsonLd, FAQJsonLd } from "@/app/components/JsonLd";
import { cases } from "@/lib/case-data";
import { REGIONS } from "@/lib/seo-regions";

const PHONE = "tel:1688-2957";
const KAKAO_URL = "http://pf.kakao.com/_hQExjX/chat";
const MAIN_IMAGE = "/images/sink-top-crack/main.png";
const AFTER_IMAGE = "/images/sink-top-crack/main-after.png";

const FAQ_ITEMS = [
  {
    q: "싱크대 상판 크랙은 무조건 교체해야 하나요?",
    a: "무조건 교체로 보지는 않습니다.\n\n크랙 위치, 갈라진 깊이, 상판 재질, 물이 닿는 위치인지에 따라 수리 가능 여부가 달라집니다. 사진으로 먼저 상태를 보고, 수리로 정리할 수 있는지 또는 교체 판단이 필요한지 구분합니다.",
  },
  {
    q: "사진만 보내도 수리 가능 여부를 알 수 있나요?",
    a: "상판 전체가 보이는 사진 1장과 갈라진 부분이 가까이 보이는 사진 1장을 보내주시면 1차 확인이 가능합니다.\n\n다만 크랙 안쪽까지 벌어졌는지, 하부 지지 상태가 약해졌는지는 현장에서 확인이 필요할 수 있습니다.",
  },
  {
    q: "갈라진 부분을 그냥 써도 되나요?",
    a: "작은 금처럼 보여도 물과 오염이 들어가면 갈라진 부위가 더 벌어질 수 있습니다.\n\n특히 모서리, 피스 구멍 주변, 하중이 걸리는 지점의 크랙은 먼저 상태를 확인하는 것이 좋습니다.",
  },
  {
    q: "수리 후 티가 전혀 안 나나요?",
    a: "상판 크랙 수리는 사용 가능한 상태로 정리하는 것이 우선입니다.\n\n재질과 색상, 균열 깊이에 따라 보수 흔적이 남을 수 있습니다. 사진을 보고 가능한 마감 범위를 먼저 안내드립니다.",
  },
  {
    q: "비용은 어떻게 정해지나요?",
    a: "크랙 길이, 파손 위치, 보강 필요 여부, 상판 재질에 따라 달라집니다.\n\n확인되지 않은 상태에서 금액을 단정하지 않고, 사진을 받은 뒤 예상 범위를 먼저 안내드립니다.",
  },
];

function parseKeyword(keyword: string): { region: string; symptom: string } {
  const kw = keyword.replace(/-/g, " ");
  const region = REGIONS.find((r) => kw.includes(r)) ?? "";
  const symptom = kw.includes("갈라짐")
    ? "갈라짐"
    : kw.includes("깨짐")
      ? "깨짐"
      : kw.includes("크랙")
        ? "크랙"
        : "수리";
  return { region, symptom };
}

function CaseStrip({ region }: { region?: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allCases = cases
    .filter((c) => c.category === "상판 크랙")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const matched = region
    ? allCases.filter((c) => c.region.includes(region))
    : [];
  const rest = allCases.filter((c) => !matched.includes(c));
  const CASE_ITEMS = [...matched, ...rest].slice(0, 6);

  if (CASE_ITEMS.length === 0) return null;

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
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[15px] font-bold text-neutral-900">실제 시공 사례</p>
        <Link
          href="/cases?cat=상판 크랙"
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
                  className="absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-[10px] font-black text-white"
                  style={{ background: "#e32e40" }}>
                  CRACK
                </div>
              </div>
              <div className="bg-white p-3">
                <p className="truncate text-[13px] font-extrabold text-neutral-900">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[11px] text-neutral-400">
                  {item.region}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-1.5">
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

interface Props {
  keyword?: string;
}

export default function CountertopCrackLanding({ keyword }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { region, symptom } = keyword
    ? parseKeyword(keyword)
    : { region: "", symptom: "" };

  const heroTitle = region
    ? `${region} 싱크대 상판 ${symptom}`
    : "상판 크랙\n교체 전에 확인하세요";
  const heroSub = region
    ? `${region} 싱크대 상판 크랙, 사진으로 수리 가능 여부 먼저 확인`
    : "갈라진 상판, 살릴 수 있는지 먼저 봅니다";
  const heroBadge = region ? `${region} 출장 확인` : "사진 한 장으로 먼저 확인";

  const regionCaseCount = region
    ? cases.filter(
        (c) => c.category === "상판 크랙" && c.region.includes(region),
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
        name={region ? `${region} 싱크대 상판 크랙 수리` : "싱크대 상판 크랙 수리"}
        description="싱크대 상판 크랙, 갈라짐, 깨짐 상태를 사진으로 먼저 확인하고 수리 가능 여부와 작업 방향을 안내합니다."
        url={
          keyword
            ? `https://www.restorystudio.co.kr/repair/${keyword}`
            : "https://www.restorystudio.co.kr/repair/sink-top-crack"
        }
      />
      <FAQJsonLd faqs={FAQ_ITEMS} />

      <section
        className="relative overflow-hidden"
        style={{ background: "#0a1628", minHeight: "100svh" }}>
        <div className="absolute inset-0 md:hidden">
          <Image
            src={MAIN_IMAGE}
            alt=""
            fill
            className="object-cover"
            style={{ opacity: 0.42 }}
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
          className="relative z-10 mx-auto flex max-w-7xl flex-col md:flex-row"
          style={{ minHeight: "100svh" }}>
          <div className="flex flex-1 flex-col justify-end px-6 pb-10 pt-20 md:w-[54%] md:flex-none md:flex-shrink-0 md:justify-center md:px-16 md:py-24">
            <FadeIn>
              <div
                className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5"
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
                    ? `${region} 상판 크랙 수리`
                    : "리스토리 싱크대 상판 크랙 수리"}
                </span>
              </div>
              <h1
                className="mb-3 whitespace-pre-line font-black leading-[1.15] text-white"
                style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}>
                {heroTitle}
              </h1>
              <p
                className="mb-4 font-medium text-white/60"
                style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)" }}>
                {heroSub}
              </p>
              <div
                className="mb-8 inline-flex items-baseline gap-2 rounded-2xl px-4 py-2.5"
                style={{
                  background: "rgba(26,92,255,0.25)",
                  border: "1px solid rgba(26,92,255,0.4)",
                }}>
                <span className="text-[22px] font-black text-white">
                  {heroBadge}
                </span>
                <span className="text-[13px] font-medium text-white/50">
                  가능 여부 먼저 안내
                </span>
              </div>
              <div className="flex flex-col gap-3 md:flex-row">
                <a
                  href={KAKAO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-2xl text-[16px] font-black"
                  style={{
                    background: "#FEE500",
                    color: "#1a1a1a",
                    padding: "18px 28px",
                  }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
                  </svg>
                  카카오로 사진 보내기
                </a>
                <a
                  href={PHONE}
                  className="flex items-center justify-center gap-2 rounded-2xl text-[15px] font-bold text-white"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    padding: "14px 24px",
                  }}>
                  전화 문의
                </a>
              </div>
              <div className="mt-8 flex items-center gap-6">
                {[
                  { n: "사진", l: "먼저 확인" },
                  { n: "원인", l: "단정 금지" },
                  { n: "선택", l: "수리/교체 구분" },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-[15px] font-black text-white">{s.n}</p>
                    <p className="text-[11px] text-white/40">{s.l}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <div className="hidden md:block md:w-[46%] flex-shrink-0 relative">
            <Image
              src={MAIN_IMAGE}
              alt="싱크대 상판 크랙 수리 전 상태"
              fill
              className="object-cover"
              style={{ opacity: 0.78 }}
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

      {region && (
        <section className="px-5 py-4" style={{ background: "#1a5cff" }}>
          <div className="mx-auto max-w-lg text-center">
            <p className="text-[14px] font-black text-white">
              {region} 지역 상판 크랙 · 사진 한 장으로 먼저 확인
            </p>
          </div>
        </section>
      )}

      {region && (
        <section className="px-5 py-10" style={{ background: "#ffffff" }}>
          <div className="mx-auto max-w-lg">
            <h2 className="mb-3 text-[20px] font-black text-neutral-900">
              {region} 싱크대 상판 크랙 수리
            </h2>
            <p className="text-[14px] leading-[1.8] text-neutral-600">
              {region} 지역 싱크대 상판 크랙은 갈라진 위치와 깊이,
              상판 재질을 먼저 확인해야 합니다.
              {regionCaseCount > 0 && (
                <>
                  {" "}
                  {region} 관련 사례{" "}
                  <strong className="text-neutral-900">{regionCaseCount}건</strong>
                  을 함께 확인할 수 있습니다.
                </>
              )}{" "}
              사진을 보내주시면 수리 가능한 상태인지 먼저 안내드립니다.
            </p>
          </div>
        </section>
      )}

      <section className="px-5 py-14 md:py-20" style={{ background: "#f8f9fb" }}>
        <div className="mx-auto max-w-lg">
          <FadeIn>
            <p className="mb-1 text-[12px] font-bold tracking-widest text-[#1a5cff]">
              BEFORE / AFTER
            </p>
            <h2
              className="mb-8 font-black leading-[1.2]"
              style={{ fontSize: "clamp(1.9rem, 6vw, 2.8rem)" }}>
              말보다 사진이 빠릅니다
            </h2>
          </FadeIn>
          <FadeIn delay={80}>
            <div className="mb-4 grid grid-cols-2 gap-2">
              {[
                {
                  img: MAIN_IMAGE,
                  label: "BEFORE",
                  alt: "싱크대 상판 크랙 수리 전",
                  dark: true,
                },
                {
                  img: AFTER_IMAGE,
                  label: "AFTER",
                  alt: "싱크대 상판 크랙 수리 후",
                  dark: false,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="relative overflow-hidden rounded-2xl bg-neutral-100"
                  style={{ aspectRatio: "4/3" }}>
                  <Image
                    src={item.img}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 px-3 py-2.5"
                    style={{
                      background: item.dark
                        ? "linear-gradient(to top, rgba(0,0,0,0.68), transparent)"
                        : "linear-gradient(to top, rgba(26,92,255,0.68), transparent)",
                    }}>
                    <span className="text-[13px] font-black tracking-widest text-white">
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
                같은 상판입니다
              </p>
              <p className="mt-0.5 text-[12px] text-white/65">
                크랙 부위를 확인하고 정리했습니다
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div
                className="rounded-2xl p-4 text-center"
                style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
                <p className="mb-1 text-[11px] font-semibold text-neutral-400">
                  상판 교체
                </p>
                <p
                  className="text-[22px] font-black"
                  style={{ color: "#ef4444" }}>
                  80~300만원
                </p>
                <p className="mt-1 text-[11px] text-neutral-400">
                  + 철거·제작 범위 확인
                </p>
              </div>
              <div
                className="rounded-2xl p-4 text-center"
                style={{ background: "#eef4ff", border: "1px solid #c7d7ff" }}>
                <p className="mb-1 text-[11px] font-semibold text-[#1a5cff]">
                  상판 크랙 수리
                </p>
                <p
                  className="text-[22px] font-black"
                  style={{ color: "#1a5cff" }}>
                  30~50만원
                </p>
                <p className="mt-1 text-[11px] text-[#1a5cff]/60">
                  + 상태 확인 후 안내
                </p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={180}>
            <div
              className="mt-4 overflow-hidden rounded-2xl"
              style={{ border: "1px solid #e5e7eb" }}>
              <div className="p-5" style={{ background: "#fff" }}>
                <p className="mb-3 text-[11px] font-bold tracking-widest text-neutral-400">
                  QUALITY PROOF
                </p>
                <h3 className="mb-1 text-[18px] font-black leading-[1.3] text-neutral-900">
                  왜 그냥 메우면 다시 벌어질까요?
                </h3>
                <p className="mb-5 text-[13px] leading-[1.7] text-neutral-500">
                  상판 크랙은 표면 흠집처럼 보여도 힘이 몰린 자리일 수 있어요.
                  <br />
                  리스토리는{" "}
                  <strong className="text-neutral-800">크랙 위치와 깊이</strong>
                  를 먼저 보고 보강과 마감 범위를 나눕니다.
                </p>
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "#f8f9fb",
                      border: "1px solid #e5e7eb",
                    }}>
                    <p className="mb-2 text-[11px] font-bold text-neutral-400">
                      단순 메움
                    </p>
                    <div className="mb-3 flex items-center gap-2">
                      <div
                        className="relative h-6 flex-1 overflow-hidden rounded"
                        style={{ background: "#e5e7eb" }}>
                        <div
                          className="absolute left-1/2 top-0 h-full"
                          style={{
                            width: 2,
                            background: "#ef4444",
                            transform: "rotate(12deg)",
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-[12px] font-black text-neutral-500">
                      표면만 채움
                    </p>
                    <p className="mt-1 text-[11px] leading-[1.5] text-neutral-400">
                      하중과 틈을 보지 않으면
                      <br />
                      다시 벌어질 수 있음
                    </p>
                  </div>
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "#eef4ff",
                      border: "1px solid #c7d7ff",
                    }}>
                    <p
                      className="mb-2 text-[11px] font-bold"
                      style={{ color: "#1a5cff" }}>
                      리스토리
                    </p>
                    <div className="mb-3 flex items-center gap-2">
                      <div
                        className="h-6 flex-1 rounded-lg"
                        style={{ background: "#1a5cff" }}
                      />
                    </div>
                    <p
                      className="text-[12px] font-black"
                      style={{ color: "#1a5cff" }}>
                      크랙 정리 + 마감
                    </p>
                    <p
                      className="mt-1 text-[11px] leading-[1.5]"
                      style={{ color: "rgba(26,92,255,0.6)" }}>
                      상태 확인 후
                      <br />
                      가능한 범위로 수리
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center justify-center gap-2 rounded-xl py-3"
                  style={{ background: "#eef4ff" }}>
                  <span
                    className="text-[16px] font-black"
                    style={{ color: "#1a5cff" }}>
                    확인 먼저
                  </span>
                  <span
                    className="text-[13px]"
                    style={{ color: "rgba(26,92,255,0.5)" }}>
                    → 수리와 교체 판단을 나눕니다
                  </span>
                </div>
              </div>
              <div
                className="grid grid-cols-2 border-t"
                style={{ borderColor: "#f3f4f6" }}>
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "4/3" }}>
                  <Image
                    src={MAIN_IMAGE}
                    alt="상판 크랙 수리 전 균열"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-3"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.65), transparent)",
                    }}>
                    <p className="text-[10px] font-semibold text-white/70">
                      수리 전
                    </p>
                    <p className="text-[13px] font-black text-white">
                      크랙 라인 확인
                    </p>
                  </div>
                </div>
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "4/3" }}>
                  <Image
                    src={AFTER_IMAGE}
                    alt="상판 크랙 수리 후 마감"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-3"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(26,92,255,0.7), transparent)",
                    }}>
                    <p className="text-[10px] font-semibold text-white/70">
                      수리 후
                    </p>
                    <p className="text-[13px] font-black text-white">
                      마감 정리
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="px-5 py-14 md:py-20" style={{ background: "#f8f9fb" }}>
        <div className="mx-auto max-w-lg">
          <FadeIn>
            <p className="mb-2 text-[12px] font-bold tracking-widest text-[#1a5cff]">
              REALITY
            </p>
            <h2
              className="mb-4 font-black leading-[1.2]"
              style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
              갈라진 모양보다
              <br />
              먼저 볼 것이 있습니다
            </h2>
            <p className="mb-8 text-[14px] leading-[1.8] text-neutral-500">
              상판 크랙은 겉으로 보이는 선만 보고 판단하기 어렵습니다. 모서리
              파손인지, 피스 구멍 주변 균열인지, 하중이 걸린 부분인지에 따라
              수리 방향이 달라질 수 있습니다.
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <div
              className="overflow-hidden rounded-2xl"
              style={{ border: "1px solid #e5e7eb" }}>
              <div className="relative aspect-[4/3] bg-neutral-100">
                <Image
                  src={MAIN_IMAGE}
                  alt="싱크대 상판 크랙 가까운 사진"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <div className="bg-white p-4">
                <p className="text-[15px] font-black text-neutral-900">
                  사진에서 먼저 확인할 부분
                </p>
                <p className="mt-2 text-[13px] leading-[1.75] text-neutral-500">
                  갈라진 길이, 벌어진 틈, 모서리 파손, 구멍 주변 균열을 함께
                  봅니다. 원인을 모르는 부분은 단정하지 않고 확인이 필요한
                  항목으로 남깁니다.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="px-5 py-14 md:py-20" style={{ background: "#fff" }}>
        <div className="mx-auto max-w-2xl">
          <FadeIn>
            <div className="mb-8 flex items-end gap-3">
              <div>
                <p className="mb-1 text-[12px] font-bold tracking-widest text-[#1a5cff]">
                  REVIEWS
                </p>
                <h2
                  className="font-black leading-[1.2]"
                  style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
                  직접 겪은 고객님들
                </h2>
              </div>
              <div className="ml-auto flex-shrink-0 pb-1 text-right">
                <p
                  className="text-[28px] font-black"
                  style={{ color: "#1a5cff" }}>
                  4.9★
                </p>
                <p className="text-[11px] text-neutral-400">고객 평점</p>
              </div>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              {
                keyword: "교체 전 확인",
                unit: "싱크대 상판 크랙 수리",
                area: "지역 확인 필요",
                name: "고객 후기",
                quote:
                  "상판을 바로 교체하기 전에 크랙 위치와 깊이를 먼저 확인하고 수리 가능 범위를 안내받았습니다.",
              },
              {
                keyword: "비용 부담 감소",
                unit: "싱크대 상판 크랙 수리",
                area: "지역 확인 필요",
                name: "고객 후기",
                quote:
                  "상판 교체 비용과 크랙 수리 비용을 나눠 보고, 현재 상태에 맞는 선택을 할 수 있었습니다.",
              },
            ].map((r, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div
                  className="h-full overflow-hidden rounded-2xl"
                  style={{ border: "1px solid #e5e7eb" }}>
                  <div
                    className="relative aspect-[16/9] overflow-hidden bg-neutral-100"
                    style={{
                      background:
                        "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 52%, #eef4ff 100%)",
                    }}>
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.56) 0%, transparent 58%)",
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[11px] font-semibold text-white/60">
                            {r.unit}
                          </p>
                          <p
                            className="font-black leading-none text-white"
                            style={{
                              fontSize: "clamp(1.1rem, 3.5vw, 1.5rem)",
                            }}>
                            {r.keyword}
                          </p>
                        </div>
                        <span
                          className="rounded-full px-3 py-1.5 text-[11px] font-black"
                          style={{ background: "#eef4ff", color: "#1a5cff" }}>
                          수리 완료
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="mb-2 text-[12px] text-neutral-400">
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

      <section className="px-5 py-14 md:py-20" style={{ background: "#f8f9fb" }}>
        <div className="mx-auto max-w-lg">
          <FadeIn>
            <p className="mb-2 text-[12px] font-bold tracking-widest text-[#1a5cff]">
              HOW IT WORKS
            </p>
            <h2
              className="mb-2 font-black leading-[1.2]"
              style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
              사진 한 장이면
              <br />
              확인이 시작됩니다
            </h2>
            <p className="mb-10 text-[14px] text-neutral-400">
              수리 가능 여부와 교체 판단을 먼저 나눕니다
            </p>
          </FadeIn>
          <div className="flex flex-col gap-3">
            {[
              {
                step: "01",
                title: "사진 보내기",
                desc: "상판 전체와 크랙 가까운 사진을 보내주세요.",
                time: "먼저 확인",
              },
              {
                step: "02",
                title: "상태 구분",
                desc: "크랙 위치, 깊이, 재질, 하중 위치를 보고 수리 가능 범위를 안내합니다.",
                time: "확인 필요",
              },
              {
                step: "03",
                title: "작업 방향 안내",
                desc: "수리가 가능한지, 현장 확인이 필요한지, 교체 판단이 나은지 구분해드립니다.",
                time: "선택 기준",
              },
            ].map((s, i) => (
              <FadeIn key={s.step} delay={i * 80}>
                <div
                  className="flex gap-4 rounded-2xl bg-white p-5"
                  style={{ border: "1px solid #e5e7eb" }}>
                  <div className="flex-shrink-0">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-[12px] font-black"
                      style={{ background: "#eef4ff", color: "#1a5cff" }}>
                      {s.step}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-[15px] font-black text-neutral-900">
                        {s.title}
                      </span>
                      <span
                        className="ml-auto flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold"
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
        </div>
      </section>

      <section className="px-5 py-14 md:py-20" style={{ background: "#fff" }}>
        <div className="mx-auto max-w-lg">
          <FadeIn>
            <p className="mb-2 text-[12px] font-bold tracking-widest text-[#1a5cff]">
              TRUST
            </p>
            <h2
              className="mb-8 font-black leading-[1.2]"
              style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
              걱정하시는 거<br />다 알고 있어요
            </h2>
          </FadeIn>
          <div className="mb-8 flex flex-col gap-3">
            {[
              {
                icon: "🛡",
                title: "3년 무상 A/S",
                desc: "시공 부위는 작업일 기준 3년 동안 무상 A/S를 적용합니다.",
              },
              {
                icon: "🔎",
                title: "상판 상태 무료 확인",
                desc: "사진을 먼저 보고 수리 가능한 상태인지, 현장 확인이 필요한지 안내드립니다.",
              },
              {
                icon: "📋",
                title: "생산물 배상책임보험 가입",
                desc: "시공 중 예상치 못한 문제가 생겨도 보험으로 보상받을 수 있습니다.",
              },
              {
                icon: "💬",
                title: "방문 전 가격 확정",
                desc: "사진 확인 후 상판 크랙 수리 비용을 안내하고, 견적 그대로 진행합니다.",
              },
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div
                  className="flex gap-4 rounded-2xl p-5"
                  style={{
                    background: "#f8f9fb",
                    border: "1px solid #e5e7eb",
                  }}>
                  <span className="flex-shrink-0 text-[24px]">{t.icon}</span>
                  <div>
                    <p className="mb-1 text-[15px] font-black text-neutral-900">
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
                  <p className="bg-neutral-50 py-3 text-center text-[12px] font-bold text-neutral-500">
                    {c.alt}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="px-5 py-14 md:py-20" style={{ background: "#f8f9fb" }}>
        <div className="mx-auto max-w-lg">
          <FadeIn>
            <p className="mb-2 text-[12px] font-bold tracking-widest text-[#1a5cff]">
              FAQ
            </p>
            <h2
              className="mb-8 font-black leading-[1.2]"
              style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>
              자주 묻는 질문
            </h2>
          </FadeIn>
          <div className="flex flex-col gap-2">
            {FAQ_ITEMS.map((f, i) => (
              <FadeIn key={f.q} delay={i * 50}>
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
                    <p className="whitespace-pre-line border-t border-neutral-100 px-5 pb-4 pt-1 text-[13px] leading-[1.75] text-neutral-500">
                      {f.a}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:py-24" style={{ background: "#0a1628" }}>
        <div className="mx-auto max-w-lg text-center">
          <FadeIn>
            <p
              className="mb-4 text-[13px] font-bold tracking-widest"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              사진으로 먼저 확인하세요
            </p>
            <h2
              className="mb-3 whitespace-pre-line font-black leading-[1.2] text-white"
              style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)" }}>
              {region
                ? `${region} 상판 크랙\n수리 가능 범위부터 확인`
                : "상판 크랙 사진 한 장이면\n확인이 시작됩니다"}
            </h2>
            <p
              className="mb-8 text-[14px] leading-[1.8]"
              style={{ color: "rgba(255,255,255,0.4)" }}>
              상판 전체 사진과 갈라진 부분 가까운 사진을 보내주세요.
              수리 가능한 상태인지 먼저 확인해드리겠습니다.
            </p>
            <div className="mx-auto flex max-w-sm flex-col gap-3">
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
                상판 사진으로 먼저 확인하기
              </a>
              <a
                href={PHONE}
                className="flex items-center justify-center gap-2 rounded-2xl text-[15px] font-bold text-white"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: "16px 24px",
                }}>
                1688-2957
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <FloatingCTA />
    </main>
  );
}
