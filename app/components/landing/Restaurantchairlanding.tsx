"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/app/components/FadeIn";
import LeatherSampleSection from "./Leathersamplesection";
import FloatingCTA from "@/app/components/landing/shared/FloatingCTA";
import { ServiceJsonLd, FAQJsonLd } from "@/app/components/JsonLd";
import { cases } from "@/lib/case-data";

/* ─────────────────────────────────────────
   CaseStrip — 가죽 리폼 사례 가로 스크롤
───────────────────────────────────────── */
const CASE_ITEMS = cases
  .filter((c) => c.category === "가죽 리폼")
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 6);

function CaseStrip() {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      <div className="flex items-center justify-between mb-4 px-5">
        <p className="text-[13px] font-bold text-neutral-900">실제 시공 사례</p>
        <Link
          href="/cases?cat=가죽 리폼"
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
          paddingLeft: 20,
          paddingRight: 20,
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
   CONSTANTS
───────────────────────────────────────── */
const PHONE = "tel:010-6855-0957";
const KAKAO_URL = "http://pf.kakao.com/_hQExjX/chat";

const FAQ_ITEMS = [
  {
    q: "정말 새 의자보다 저렴한가요?",
    a: "네. 새 의자 대비 1/3~1/5 수준입니다. 수량이 많을수록 단가가 낮아집니다.",
  },
  {
    q: "영업 중에도 작업 가능한가요?",
    a: "영업 전·후, 휴무일, 새벽도 맞춤 일정 조율 가능합니다.",
  },
  {
    q: "몇 개부터 가능한가요?",
    a: "1개부터 가능합니다. 대량일수록 단가가 더 낮아집니다.",
  },
  {
    q: "색상은 어떻게 고르나요?",
    a: "실측 방문 시 실물 샘플을 가져가서 직접 비교해 선택하실 수 있습니다.",
  },
  {
    q: "A/S는 어떻게 되나요?",
    a: "시공 후 미흡한 부분은 100% 무상 재시공해드립니다.",
  },
];

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
          title="리스토리 의자 가죽 교체 시공 영상"
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
   MAIN
───────────────────────────────────────── */
export default function RestaurantChairLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main
      className="bg-white"
      style={{
        fontFamily:
          "'Wanted Sans Variable','Wanted Sans',-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif",
      }}>
      <ServiceJsonLd
        name="식당·카페 의자 가죽 교체"
        description="식당·카페 의자 가죽 교체 전문. 새 의자 대비 1/3~1/5 비용. 영업 외 시간 방문 시공, 1년 무상 A/S."
        url="https://restorystudio.co.kr/landing/restaurant-chair"
      />
      <FAQJsonLd faqs={FAQ_ITEMS} />

      {/* ══════════════════════════════════
          1. HERO
          모바일: 풀스크린 다크 / 콘텐츠 하단
          데스크탑: 2열 — 왼쪽 텍스트 + 오른쪽 이미지
      ══════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#0a1628", minHeight: "100svh" }}>
        {/* 모바일 전용 배경 이미지 */}
        <div className="absolute inset-0 md:hidden">
          <Image
            src="/images/chair/hero-chair.webp"
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
                "linear-gradient(to bottom, transparent 30%, #0a1628 100%)",
            }}
          />
        </div>

        {/* 레이아웃 컨테이너 */}
        <div
          className="relative z-10 mx-auto max-w-7xl flex flex-col md:flex-row"
          style={{ minHeight: "100svh" }}>
          {/* ── 왼쪽 컨텐츠 (모바일: 하단 / 데스크탑: 세로 중앙) ── */}
          <div
            className="flex-1 flex flex-col justify-end pb-10 pt-20 px-6
            md:flex-none md:w-[54%] md:justify-center md:px-16 md:py-24 md:flex-shrink-0">
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
                  리스토리 가죽 교체
                </span>
              </div>

              <h1
                className="font-black text-white leading-[1.15] mb-3"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
                의자 새로
                <br />
                사지 마세요
              </h1>
              <p
                className="font-medium text-white/60 mb-4"
                style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}>
                가죽만 바꾸면 새것처럼
              </p>

              {/* 앵커 가격 */}
              <div
                className="inline-flex items-baseline gap-2 rounded-2xl px-4 py-2.5 mb-8"
                style={{
                  background: "rgba(26,92,255,0.25)",
                  border: "1px solid rgba(26,92,255,0.4)",
                }}>
                <span className="text-[22px] font-black text-white">
                  개당 3만원~
                </span>
                <span className="text-[13px] font-medium text-white/50">
                  새 의자의 1/3 수준
                </span>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-3 md:flex-row md:gap-3">
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

              {/* 신뢰 지표 */}
              <div className="mt-8 flex items-center gap-6">
                {[
                  { n: "1,000건+", l: "시공 완료" },
                  { n: "4.9★", l: "네이버 평점" },
                  { n: "당일", l: "완료 가능" },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-[15px] font-black text-white">{s.n}</p>
                    <p className="text-[11px] text-white/40">{s.l}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* ── 오른쪽 이미지 (데스크탑 전용) ── */}
          <div className="hidden md:block md:w-[46%] relative flex-shrink-0">
            <Image
              src="/images/chair/hero-chair.webp"
              alt="리스토리 의자 가죽 교체"
              fill
              className="object-cover"
              style={{ opacity: 0.8 }}
              priority
              sizes="46vw"
            />
            {/* 왼쪽 페이드 — 다크 배경으로 자연스럽게 */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, #0a1628 0%, transparent 40%)",
              }}
            />
            {/* 하단 페이드 */}
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

      {/* ══════════════════════════════════
          2. PROOF — 진짜야?
          Before/After + 가격 비교
      ══════════════════════════════════ */}
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
                  img: "/images/chair/before-after-6.png",
                  label: "BEFORE",
                  dark: true,
                },
                {
                  img: "/images/chair/before-after-5.png",
                  label: "AFTER",
                  dark: false,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-2xl aspect-[3/4]">
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
                같은 의자입니다
              </p>
              <p className="text-[12px] text-white/60 mt-0.5">
                가죽만 교체했습니다
              </p>
            </div>
          </FadeIn>

          {/* 가격 비교 */}
          <FadeIn delay={150}>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div
                className="rounded-2xl p-4 text-center"
                style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
                <p className="text-[11px] font-semibold text-neutral-400 mb-1">
                  새 의자 6개 구매
                </p>
                <p
                  className="text-[22px] font-black"
                  style={{ color: "#ef4444" }}>
                  40~150만원
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  + 배송 2~5일 대기
                </p>
              </div>
              <div
                className="rounded-2xl p-4 text-center"
                style={{ background: "#eef4ff", border: "1px solid #c7d7ff" }}>
                <p className="text-[11px] font-semibold text-[#1a5cff] mb-1">
                  리스토리 천갈이 6개
                </p>
                <p
                  className="text-[22px] font-black"
                  style={{ color: "#1a5cff" }}>
                  21만원~
                </p>
                <p className="text-[11px] text-[#1a5cff]/60 mt-1">
                  + 당일 완료
                </p>
              </div>
            </div>
          </FadeIn>

          {/* 품질 증명 */}
          <FadeIn delay={180}>
            <div
              className="mt-4 overflow-hidden rounded-2xl"
              style={{ border: "1px solid #e5e7eb" }}>
              <div className="p-5" style={{ background: "#fff" }}>
                <p className="text-[11px] font-bold tracking-widest text-neutral-400 mb-3">
                  QUALITY PROOF
                </p>
                <h3 className="text-[18px] font-black text-neutral-900 leading-[1.3] mb-1">
                  저렴한데 왜 더 오래가나요?
                </h3>
                <p className="text-[13px] leading-[1.7] text-neutral-500 mb-5">
                  대부분 의자의 가죽은 얇은 중국산이에요.
                  <br />
                  리스토리는{" "}
                  <strong className="text-neutral-800">100% 국내산 가죽</strong>
                  만 사용합니다.
                </p>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-semibold text-neutral-400">
                        기존 의자 (중국산)
                      </span>
                      <span className="text-[13px] font-black text-neutral-400">
                        0.25인치
                      </span>
                    </div>
                    <div
                      className="h-3 rounded-full overflow-hidden"
                      style={{ background: "#f3f4f6" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: "25%", background: "#d1d5db" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-[12px] font-bold"
                        style={{ color: "#1a5cff" }}>
                        리스토리 국내산
                      </span>
                      <span
                        className="text-[13px] font-black"
                        style={{ color: "#1a5cff" }}>
                        0.53인치
                      </span>
                    </div>
                    <div
                      className="h-3 rounded-full overflow-hidden"
                      style={{ background: "#eef4ff" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: "80%", background: "#1a5cff" }}
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
                    2배 두꺼움
                  </span>
                  <span
                    className="text-[13px]"
                    style={{ color: "rgba(26,92,255,0.5)" }}>
                    → 더 오래갑니다
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
                    src="/images/chair/leather-china.jpg"
                    alt="중국산 가죽 두께 0.25인치 측정"
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
                      중국산 기존 가죽
                    </p>
                    <p className="text-[14px] font-black text-white">
                      0.25인치
                    </p>
                  </div>
                </div>
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "4/3" }}>
                  <Image
                    src="/images/chair/leather-korea.jpg"
                    alt="국내산 가죽 두께 0.53인치 측정"
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
                      리스토리 국내산
                    </p>
                    <p className="text-[14px] font-black text-white">
                      0.53인치
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════
          3. SAMPLES
      ══════════════════════════════════ */}
      <LeatherSampleSection />

      {/* ══════════════════════════════════
          4. REVIEWS
      ══════════════════════════════════ */}
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
                  직접 겪은 사장님들
                </h2>
              </div>
              <div className="ml-auto text-right pb-1 flex-shrink-0">
                <p
                  className="text-[28px] font-black"
                  style={{ color: "#1a5cff" }}>
                  4.9★
                </p>
                <p className="text-[11px] text-neutral-400">네이버 평점</p>
              </div>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                img: "/images/chair/review-1.jpg",
                count: "32개",
                unit: "카페 의자",
                area: "서울 강남구",
                name: "김** 사장님",
                quote:
                  "새 의자 산 줄 알고 손님들이 물어봐요. 가격은 새 의자의 1/3도 안 됐습니다.",
                tag: "당일 완료",
                tagBg: "#eef4ff",
                tagColor: "#1a5cff",
              },
              {
                img: "/images/chair/review-5.png",
                count: "1.5m 14개",
                unit: "고깃집 의자",
                area: "경기 부천시",
                name: "박** 사장님",
                quote:
                  "영업 끝나고 밤에 와서 해주셔서 영업 지장 하나도 없었어요. 다음에도 여기 할 겁니다.",
                tag: "야간 시공",
                tagBg: "#eef4ff",
                tagColor: "#1a5cff",
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
                            style={{ fontSize: "clamp(2rem, 6vw, 2.8rem)" }}>
                            {r.count}
                          </p>
                        </div>
                        <span
                          className="rounded-full px-3 py-1.5 text-[11px] font-black"
                          style={{ background: r.tagBg, color: r.tagColor }}>
                          {r.tag}
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
            <CaseStrip />
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════
          5. HOW
      ══════════════════════════════════ */}
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
              영업 전·후·새벽도 가능합니다
            </p>
          </FadeIn>
          <div className="flex flex-col gap-3">
            {[
              {
                step: "01",
                icon: "📸",
                title: "사진 보내기",
                desc: "의자 사진 + 수량만 카카오로 보내주세요. 30초 안에 가능 여부 확인해드립니다.",
                time: "30초",
              },
              {
                step: "02",
                icon: "🔍",
                title: "방문 견적",
                desc: "원하는 날짜·시간에 기사가 방문해서 실물 샘플 보여드리고 정확한 금액 안내드립니다.",
                time: "무료",
              },
              {
                step: "03",
                icon: "✅",
                title: "당일 시공 완료",
                desc: "영업 끝나고 와서 작업하고 갑니다. 뒷정리까지 하고 갑니다.",
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

      {/* ══════════════════════════════════
          6. TRUST
      ══════════════════════════════════ */}
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
                title: "100% 무상 재시공",
                desc: "시공 후 미흡한 부분은 무조건 다시 와서 고쳐드립니다. 비용 없습니다.",
              },
              {
                icon: "📋",
                title: "생산물 배상책임보험 가입",
                desc: "시공 중 예상치 못한 문제가 생겨도 보험으로 100% 보상됩니다.",
              },
              {
                icon: "💬",
                title: "출장 전 가격 확정",
                desc: "방문 후 갑자기 금액이 올라가는 일 없습니다. 견적 그대로 진행됩니다.",
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

      {/* ══════════════════════════════════
          7. VIDEO
      ══════════════════════════════════ */}
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
            <YouTubeFacade videoId="mvMybNNafKk" />
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════
          8. FAQ
      ══════════════════════════════════ */}
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
                    style={{ maxHeight: openFaq === i ? 160 : 0 }}>
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

      {/* ══════════════════════════════════
          9. FINAL CTA
      ══════════════════════════════════ */}
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
              className="font-black text-white leading-[1.2] mb-3"
              style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)" }}>
              의자 사진 한 장이면
              <br />
              충분합니다
            </h2>
            <p
              className="text-[14px] mb-8"
              style={{ color: "rgba(255,255,255,0.4)" }}>
              수량 + 지역만 알려주시면 바로 견적 드립니다
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
              {["개당 3만원~", "당일 완료", "무상 A/S", "야간 시공 가능"].map(
                (b, i) => (
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
                ),
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* STICKY CTA */}
      {/* <div
        className="fixed bottom-0 left-0 right-0 z-40 px-4 transition-all duration-300"
        style={{
          transform: showSticky ? "translateY(0)" : "translateY(110%)",
          paddingBottom: "max(16px, env(safe-area-inset-bottom))",
          background:
            "linear-gradient(to top, rgba(10,22,40,0.97) 0%, rgba(10,22,40,0.0) 100%)",
          paddingTop: 24,
        }}>
        <div className="mx-auto max-w-sm flex gap-2.5">
          <a
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl text-[15px] font-black"
            style={{
              background: "#FEE500",
              color: "#1a1a1a",
              padding: "16px 20px",
            }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
            </svg>
            카카오 상담
          </a>
          <a
            href={PHONE}
            className="flex items-center justify-center rounded-2xl text-[15px] font-bold text-white"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.15)",
              padding: "16px 20px",
            }}>
            📞
          </a>
        </div>
      </div> */}

      {/* STICKY CTA 지금 쓰는거 */}
      <FloatingCTA />
    </main>
  );
}
