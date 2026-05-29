"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import FadeIn from "@/app/components/FadeIn";
import Link from "next/link";
import { cases } from "@/lib/case-data";
import FloatingCTA from "@/app/components/landing/shared/FloatingCTA";
import { ServiceJsonLd, FAQJsonLd } from "@/app/components/JsonLd";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */
const REVIEWS = [
  {
    name: "김**",
    area: "인천 서구",
    text: "싱크대 밑에 물이 새서 바닥이 다 부풀어 올랐는데, 지판만 교체하니 완전히 새것처럼 됐어요.",
    rating: 5,
  },
  {
    name: "박**",
    area: "서울 강서구",
    text: "하부장 바닥이 축 처져서 그릇 넣기도 무서웠는데, 당일 시공으로 바로 해결됐습니다.",
    rating: 5,
  },
  {
    name: "이**",
    area: "경기 부천시",
    text: "다른 곳은 싱크대 전체 교체해야 한다고 했는데, 리스토리는 밑판만 교체해서 비용이 1/5도 안 들었어요.",
    rating: 5,
  },
  {
    name: "최**",
    area: "서울 마포구",
    text: "물 먹은 밑판 걷어내고 시공해주셨는데, 이제 습기 걱정 없이 쓸 수 있어서 든든합니다.",
    rating: 5,
  },
];

const FAQ = [
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
    q: "A/S는 어떻게 되나요?",
    a: "시공 후 3년간 무상 A/S를 제공합니다. 밑판 재파손, 들뜸 등 문제 발생 시 무상으로 재시공해드립니다.",
  },
];

const EXTRAS = [
  {
    icon: "🔧",
    title: "상부장 처짐 수리",
    desc: "상부장 처짐·뜸 증상 함께 수리 가능",
  },
  { icon: "🚪", title: "문짝 리폼", desc: "낡은 문짝도 함께 교체 가능" },
  {
    icon: "💧",
    title: "배수관 점검",
    desc: "누수 원인 점검 및 안내",
  },
];

const PHONE = "tel:010-6855-0957";
const KAKAO_URL = "http://pf.kakao.com/_hQExjX/chat";
const PHOTO_URL = "https://blog.naver.com/sofaresq/224129090889";

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export default function HabujangLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main
      className="bg-white"
      style={{
        fontFamily:
          "'Wanted Sans Variable', 'Wanted Sans', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
      }}>
      {/* seo */}
      <ServiceJsonLd
        name="싱크대 하부장 밑판 교체"
        description="싱크대 하부장 밑판 물먹음·부풀음·파손 증상, 지판 교체. 교체 비용의 1/3~1/5. 3년 무상 A/S."
        url="https://restorystudio.co.kr/repair/habujang"
      />
      <FAQJsonLd faqs={FAQ} />

      <FadeIn>
        {/* HERO IMAGE */}
        <section className="relative" style={{ background: "#1f66ff" }}>
          <Image
            src="/images/hero-habujang.webp"
            alt="리스토리 싱크대 하부장 밑판 교체"
            width={1080}
            height={1350}
            className="w-full h-auto"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-white via-white/60 to-transparent md:pb-20">
            <div className="w-full max-w-5xl px-6 pb-8 pt-24 md:px-10 md:pb-12 md:pt-32">
              <p className="text-[13px] text-[#1f66ff] font-bold md:text-[15px]">
                <Image
                  src="/images/logo.png"
                  alt="리스토리"
                  width={30}
                  height={30}
                  className="inline-block mr-2"
                />
                리스토리 하부장 수리
              </p>
              <p className="mt-1 text-[28px] font-black leading-[1.3] text-[#1f66ff] md:text-[42px]">
                물 먹은 하부장,
              </p>
              <p className="text-[28px] font-medium leading-[1.3] text-neutral-900 md:text-[42px]">
                지판 교체로 1/5비용 절약
              </p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* HERO CTA BUTTONS */}
      <section className="px-5 py-5 md:py-7" style={{ background: "#3672ff" }}>
        <div className="mx-auto flex max-w-3xl flex-col gap-2.5 sm:flex-row">
          <a
            href={PHONE}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-[15px] font-extrabold text-[#1a5cff] shadow-lg md:py-5 md:text-[17px]">
            📞 전화 문의
          </a>
          <a
            href={PHOTO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-white/40 px-6 py-4 text-[15px] font-extrabold text-white md:py-5 md:text-[17px]">
            📷 사진 접수
          </a>
        </div>
        <p
          className="mx-auto mt-3 max-w-3xl text-center text-[13px] font-semibold md:text-[14px]"
          style={{ color: "rgba(255,255,255,0.6)" }}>
          사진 한 장이면 밑판 교체 가능 여부 바로 안내드립니다
        </p>
      </section>

      {/* PHOTO REVIEWS */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#f5f5f5" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="text-center">
              <p className="text-[28px] leading-none text-amber-400 md:text-[32px]">
                ★★★★★
              </p>
              <h2 className="mt-4 text-[30px] font-medium text-neutral-600 leading-[1.4] md:text-[45px]">
                실제 고객님들이 인정한
                <br />
                <span className="text-[40px] font-black text-neutral-900 md:text-[55px]">
                  솔직후기
                </span>
              </h2>
              <p className="mt-3 text-[22px] font-medium text-neutral-600">
                평점 5점 만점에
              </p>
              <p
                className="mt-1 text-[40px] font-black md:text-[52px]"
                style={{ color: "#1a5cff" }}>
                4.9
                <span className="text-[20px] font-bold text-neutral-400 md:text-[24px]">
                  점
                </span>
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="mt-10 grid grid-cols-2 gap-3 md:gap-5">
              <div className="overflow-hidden rounded-xl bg-white shadow-sm md:rounded-2xl">
                <div className="aspect-[4/3] overflow-hidden bg-neutral-200">
                  <Image
                    src="/images/habujang/review-1.jpeg"
                    alt="하부장 밑판 교체 후기 1"
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 md:p-6">
                  <p className="text-[11px] text-neutral-400 md:text-[13px]">
                    인천 서구 김**
                  </p>
                  <p className="mt-1.5 text-[14px] font-extrabold leading-[1.4] text-[#1a5cff] md:text-[16px]">
                    물 먹은 바닥이
                    <br />
                    완전 새것처럼!
                  </p>
                  <p className="mt-2 text-[11px] leading-[1.6] text-neutral-600 md:text-[13px]">
                    배수관에서 물이 살짝 새서 밑판이 다 부풀었는데, 지판
                    교체하니 튼튼해졌어요.
                  </p>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl bg-white shadow-sm md:rounded-2xl">
                <div className="aspect-[4/3] overflow-hidden bg-neutral-200">
                  <Image
                    src="/images/habujang/review-2.jpg"
                    alt="하부장 밑판 교체 후기 2"
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 md:p-6">
                  <p className="text-[11px] text-neutral-400 md:text-[13px]">
                    서울 강서구 박**
                  </p>
                  <p className="mt-1.5 text-[14px] font-extrabold leading-[1.4] text-[#1a5cff] md:text-[16px]">
                    전체 교체 안 해도
                    <br />
                    이렇게 해결되다니
                  </p>
                  <p className="mt-2 text-[11px] leading-[1.6] text-neutral-600 md:text-[13px]">
                    다른 업체는 싱크대 전체를 바꿔야 한다고 했는데, 밑판만
                    교체해서 비용도 아꼈어요.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* WHY 밑판 교체 */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#fafafa" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="text-center">
              <p className="text-[25px] font-medium text-neutral-600 md:text-[30px]">
                싱크대 전체를 바꿔야 하나요?
              </p>
              <h2 className="mt-2 text-[30px] font-black leading-[1.35] md:text-[45px]">
                밑판만 교체하면 됩니다!
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="mx-auto my-8 flex flex-col items-center md:my-10">
              <div className="h-10 w-px bg-neutral-300" />
              <div className="mt-6 text-center">
                <p className="text-[30px] font-black md:text-[45px]">
                  전체 교체 비용의
                </p>
                <p
                  className="mt-1 inline-block rounded-lg px-4 py-1.5 text-[20px] font-black md:text-[26px]"
                  style={{ background: "#1f66ff", color: "#ffffff" }}>
                  1/3~1/5 수준으로 해결!
                </p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="grid grid-cols-2 gap-3 md:gap-5">
              {[
                { img: "/images/habujang/before.jpg", label: "시공 전" },
                { img: "/images/habujang/after.jpg", label: "시공 후" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                    <Image
                      src={item.img}
                      alt={item.label}
                      width={400}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-[16px] font-extrabold md:text-[18px]">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* TRUST */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#f5f5f5" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="text-center">
              <p className="text-[25px] font-medium text-neutral-600 md:text-[30px]">
                걱정 없이 맡기세요
              </p>
              <h2 className="mt-2 text-[30px] font-black leading-[1.35] md:text-[45px]">
                AS 걱정 없는 확실한 시공
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="flex mt-10 justify-center gap-5 md:gap-10">
              {[
                { src: "/images/cert-2.png", alt: "생산물배상책임 보험증서" },
                { src: "/images/cert-4.png", alt: "리스토리 A/S 보증서" },
              ].map((cert, i) => (
                <div
                  key={i}
                  className="flex-1 max-w-[280px] md:max-w-[310px] overflow-hidden rounded-xl border border-neutral-200 bg-white md:rounded-2xl">
                  <div className="flex aspect-[3/4] items-center justify-center bg-neutral-100 p-3 md:p-5">
                    <Image
                      src={cert.src}
                      alt={cert.alt}
                      width={300}
                      height={400}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <p className="bg-neutral-100 pb-[18px] text-center text-[16px] font-bold text-neutral-600 md:text-[18px]">
                    {cert.alt}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SPECIALS */}
      <section
        className="px-5 pt-10 text-center text-white md:pt-16"
        style={{ background: "#1f66ff" }}>
        <FadeIn>
          <p className="text-[40px] leading-none md:text-[48px]">🧐</p>
          <p
            className="mt-4 text-[40px] font-thin md:text-[55px]"
            style={{ color: "rgb(255, 255, 255)" }}>
            왜 유명하냐고요?
          </p>
          <h2 className="mt-2 text-[40px] font-black md:text-[55px]">
            리스토리 하부장 수리는 특별합니다!
          </h2>
        </FadeIn>
      </section>

      {/* Special 01 */}
      <section
        className="px-5 pt-14 md:py-20"
        style={{ background: "#1f66ff" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="rounded-2xl bg-white p-6 shadow-sm md:p-10">
              <div className="text-center">
                <span className="inline-block rounded-full border border-neutral-300 px-4 py-1.5 text-[13px] font-bold text-neutral-600 md:text-[14px]">
                  Special 01
                </span>
                <h3 className="mt-4 text-[20px] font-black md:text-[26px]">
                  시공 후 문제 생기면{" "}
                  <span className="text-[#1a5cff]">책임</span>져 주나요?
                </h3>
              </div>
              <div className="mt-6 overflow-hidden rounded-xl md:mt-8">
                <Image
                  src="/images/special-1-2.png"
                  alt="본사 안심 보상제"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Special 02 */}
      <section
        className="px-5 pt-7 pb-14 md:pt-7 md:pb-20"
        style={{ background: "#1f66ff" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="rounded-2xl bg-white p-6 shadow-sm md:p-10">
              <div className="text-center">
                <span className="inline-block rounded-full border border-neutral-300 px-4 py-1.5 text-[13px] font-bold text-neutral-600 md:text-[14px]">
                  Special 02
                </span>
                <h3 className="mt-4 text-[20px] font-black md:text-[26px]">
                  절차는 간편한가요?
                </h3>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:gap-5">
                <div className="overflow-hidden rounded-xl">
                  <Image
                    src="/images/special-02-1.png"
                    alt="사진만 찍어도 비대면 무료 견적 가능"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
                <div className="overflow-hidden rounded-xl">
                  <Image
                    src="/images/special-02-2.png"
                    alt="365일 밤 10시까지 상담 가능"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SELF CHECK */}
      <section className="px-5 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-2 text-[13px] font-bold tracking-widest text-[#1a5cff] md:text-[14px]">
              SELF CHECK
            </p>
            <h2 className="text-[30px] font-black leading-[1.4] md:text-[45px]">
              이런 상태라면
              <br />
              <span className="text-[#e53e3e]">밑판 교체가 필요합니다</span>
            </h2>
          </FadeIn>
          <FadeIn delay={120}>
            <div className="mt-8 grid grid-cols-2 gap-3 md:gap-5">
              {[
                {
                  img: "/images/habujang/symptom-1.jpg",
                  title: "밑판 부풀어 오름",
                  desc: "물이 스며들어\nPB판이 부풀어 오른 상태",
                },
                {
                  img: "/images/habujang/symptom-2.jpg",
                  title: "밑판 처짐·꺼짐",
                  desc: "그릇 무게를 버티지 못해\n바닥이 처진 상태",
                },
                {
                  img: "/images/habujang/symptom-3.png",
                  title: "곰팡이·악취",
                  desc: "물 먹은 PB에서\n곰팡이가 발생한 상태",
                },
                {
                  img: "/images/habujang/symptom-4.png",
                  title: "밑판 파손·구멍",
                  desc: "PB가 삭아서\n구멍이 난 상태",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                  <div className="aspect-square overflow-hidden bg-neutral-100">
                    <Image
                      src={s.img}
                      alt={s.title}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4 md:p-5">
                    <p className="text-[16px] font-extrabold md:text-[18px]">
                      {s.title}
                    </p>
                    <p className="mt-1.5 whitespace-pre-line text-[14px] leading-[1.6] text-neutral-500 md:text-[16px]">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 실제 시공 사례 슬라이더 */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#ffffff" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-2 text-[13px] font-bold tracking-widest text-[#1a5cff] md:text-[14px]">
              REAL CASES
            </p>
            <h2 className="text-[24px] font-black leading-[1.4] md:text-[32px]">
              실제 시공 사례를 확인하세요
            </h2>
            <p className="mt-1 text-[13px] text-neutral-500 md:text-[15px]">
              좌우로 넘겨 보세요
            </p>
          </FadeIn>
          <FadeIn delay={120}>
            {(() => {
              const CASE_ITEMS = cases
                .filter((c) => c.category === "하부장 밑판 교체")
                .slice(0, 8);

              function CaseSlider() {
                const [idx, setIdx] = React.useState(0);
                const pausedRef = React.useRef(false);
                const dragRef = React.useRef({
                  startX: 0,
                  dragging: false,
                  moved: false,
                });
                const maxIdx = CASE_ITEMS.length - 1;
                const cardPercent = 80;

                const go = React.useCallback(
                  (dir: number) => {
                    setIdx((prev) => {
                      const next = prev + dir;
                      if (next < 0) return maxIdx;
                      if (next > maxIdx) return 0;
                      return next;
                    });
                  },
                  [maxIdx],
                );

                React.useEffect(() => {
                  const timer = setInterval(() => {
                    if (!pausedRef.current) go(1);
                  }, 3500);
                  return () => clearInterval(timer);
                }, [go]);

                const onDragStart = (x: number) => {
                  dragRef.current = { startX: x, dragging: true, moved: false };
                  pausedRef.current = true;
                };
                const onDragEnd = (x: number) => {
                  if (!dragRef.current.dragging) return;
                  const diff = dragRef.current.startX - x;
                  if (Math.abs(diff) > 40) {
                    dragRef.current.moved = true;
                    go(diff > 0 ? 1 : -1);
                  }
                  dragRef.current.dragging = false;
                  setTimeout(() => {
                    pausedRef.current = false;
                  }, 3500);
                };

                return (
                  <>
                    <div
                      className="relative select-none mt-8"
                      onMouseEnter={() => {
                        pausedRef.current = true;
                      }}
                      onMouseLeave={() => {
                        pausedRef.current = false;
                        dragRef.current.dragging = false;
                      }}
                      onMouseDown={(e) => onDragStart(e.clientX)}
                      onMouseUp={(e) => onDragEnd(e.clientX)}
                      onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
                      onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
                      style={{ cursor: "grab" }}>
                      <div className="overflow-hidden rounded-2xl">
                        <div
                          className="flex gap-3 transition-transform duration-500 ease-in-out pointer-events-none"
                          style={{
                            transform: `translateX(-${idx * (cardPercent + 1.2)}%)`,
                          }}>
                          {CASE_ITEMS.map((item) => (
                            <div
                              key={item.id}
                              className="flex-shrink-0"
                              style={{ width: `${cardPercent}%` }}>
                              <Link
                                href={`/cases/${item.id}`}
                                onClick={(e) => {
                                  if (dragRef.current.moved) e.preventDefault();
                                }}
                                draggable={false}
                                className="block overflow-hidden rounded-2xl border border-neutral-200 bg-white"
                                style={{ textDecoration: "none" }}>
                                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                                  <Image
                                    src={item.beforeImg}
                                    alt={item.title}
                                    width={400}
                                    height={300}
                                    className="h-full w-full object-cover"
                                    draggable={false}
                                  />
                                  <div
                                    className="absolute top-2 left-2 rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                                    style={{
                                      backgroundColor: "#e32e40",
                                      color: "white",
                                    }}>
                                    BEFORE
                                  </div>
                                </div>
                                <div className="p-4">
                                  <span
                                    className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                                    style={{
                                      backgroundColor: "#1f66ff15",
                                      color: "#1f66ff",
                                    }}>
                                    {item.category}
                                  </span>
                                  <p
                                    className="mt-2 text-[15px] font-extrabold truncate"
                                    style={{ color: "#111827" }}>
                                    {item.title}
                                  </p>
                                  <p
                                    className="mt-1 text-[12px] line-clamp-2"
                                    style={{ color: "#64748b" }}>
                                    {item.summary}
                                  </p>
                                  <div className="mt-2">
                                    <span
                                      className="text-[11px]"
                                      style={{ color: "#94a3b8" }}>
                                      {item.region}
                                    </span>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-1.5 mt-4">
                      {CASE_ITEMS.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setIdx(i);
                            pausedRef.current = true;
                            setTimeout(() => {
                              pausedRef.current = false;
                            }, 3500);
                          }}
                          className="rounded-full transition-all"
                          style={{
                            width: i === idx ? 20 : 6,
                            height: 6,
                            backgroundColor: i === idx ? "#1f66ff" : "#d1d5db",
                          }}
                        />
                      ))}
                    </div>
                  </>
                );
              }

              return <CaseSlider />;
            })()}
          </FadeIn>
          <FadeIn delay={200}>
            <div className="mt-6 flex justify-center">
              <Link
                href="/cases?cat=하부장 밑판 교체"
                className="flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-[15px] font-extrabold text-white md:px-10 md:py-4 md:text-[17px]"
                style={{ background: "#1a5cff", textDecoration: "none" }}>
                📋 더 많은 실제 사례 보러가기 ›
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* YOUTUBE */}
      <section
        className="px-5 py-14 text-white md:py-20"
        style={{ background: "#1a1a1a" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p
              className="mb-2 text-[13px] font-bold tracking-widest md:text-[14px]"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              YOUTUBE
            </p>
            <h2 className="mb-6 text-[20px] font-black md:text-[26px]">
              실제 시공 영상을 확인하세요
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-800">
              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/유튜브ID"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* URGENT */}
      <section
        className="px-5 py-14 md:py-20"
        style={{
          background: "linear-gradient(150deg, #000f36 0%, #003ad6 100%)",
        }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="relative rounded-2xl border-2 border-orange-200 bg-white p-7 md:p-10">
              <div className="absolute -top-3.5 left-5 rounded-full bg-[#e53e3e] px-4 py-1 text-[20px] font-extrabold text-white md:text-[35px]">
                ⚠️ 방치하면 위험
              </div>
              <h3 className="mt-1 text-[30px] font-black leading-[1.45] md:text-[45px]">
                물 먹은 밑판,
                <br />
                <span className="text-[#e53e3e]">곰팡이와 악취</span>의 원인
              </h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-neutral-600 md:text-[16px]">
                물 먹은 PB 밑판을 방치하면 곰팡이가 번지고, 악취가 주방 전체로
                퍼집니다. 위생과 건강을 위해 빠른 교체를 권장합니다.
                <br />
                <strong
                  className="text-[18px] font-bold md:text-[22px]"
                  style={{ color: "#1f66ff" }}>
                  당일 시공, 바로 사용 가능합니다.
                </strong>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* STATS BANNER */}
      <section
        className="px-5 py-12 text-center text-white md:py-20"
        style={{
          background: "linear-gradient(135deg, #1f66ff 0%, #003bbb 100%)",
        }}>
        <FadeIn>
          <p
            className="mb-2 text-[30px] font-black tracking-widest md:text-[45px]"
            style={{ color: "rgb(255, 255, 255)" }}>
            지판 교체의 자신감
          </p>
          <p className="text-[50px] font-black tracking-tight md:text-[80px]">
            <span style={{ color: "#ffffff" }}>3년</span>
          </p>
          <p
            className="mt-1 text-[25px] font-semibold md:text-[35px]"
            style={{ color: "rgba(255, 255, 255, 0.79)" }}>
            무상 A/S 보장
          </p>
          <div className="mx-auto mt-8 flex max-w-sm justify-between md:mt-10 md:max-w-md">
            {[
              { n: "99%", l: "시공 만족도" },
              { n: "당일", l: "시공 완료" },
              { n: "4.9", l: "고객 평점" },
            ].map((s, i) => (
              <div
                key={i}
                className="border border-white/25 text-center bg-white/20 px-4 py-3 rounded-lg shadow-md md:px-6 md:py-4">
                <p className="text-[22px] font-black md:text-[28px]">{s.n}</p>
                <p
                  className="mt-1 text-[18px] font-semibold md:text-[22px]"
                  style={{ color: "rgba(255,255,255,0.79)" }}>
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* PROCESS */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#f7f9fd" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="text-center">
              <p className="text-[26px] font-medium text-neutral-600 md:text-[34px]">
                처음부터 끝까지 쉽고 빠르게
              </p>
              <h2 className="mt-2 text-[26px] font-black md:text-[34px]">
                리스토리 <span className="text-[#1a5cff]">시공절차</span>
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <div className="mt-12 grid grid-cols-4 gap-3 text-center md:gap-6">
              {[
                {
                  icon: "/images/icon_step1.png",
                  step: "01",
                  title: "사진 접수",
                  desc: "하부장 안쪽\n사진 보내기",
                },
                {
                  icon: "/images/icon_step2.png",
                  step: "02",
                  title: "진단 & 견적",
                  desc: "교체 필요 여부\n비용 안내",
                },
                {
                  icon: "/images/icon_step3.png",
                  step: "03",
                  title: "방문 시공",
                  desc: "기존 밑판 제거 후\n지판 교체",
                },
                {
                  icon: "/images/icon_step4.png",
                  step: "04",
                  title: "완료",
                  desc: "당일 완료\n바로 사용",
                },
              ].map((p, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="flex h-[72px] w-[72px] items-center justify-center md:h-[100px] md:w-[100px]">
                    <Image
                      src={p.icon}
                      alt={p.title}
                      width={100}
                      height={100}
                      className="h-[72px] w-[72px] rounded-full border border-neutral-200 object-contain md:h-[100px] md:w-[100px]"
                    />
                  </div>
                  <p className="mt-5 text-[22px] font-black text-[#1a5cff] md:text-[26px]">
                    {p.step}
                  </p>
                  <p className="mt-2 text-[16px] font-extrabold md:text-[18px]">
                    {p.title}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-[13px] leading-[1.6] text-neutral-600 md:text-[14px]">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="mt-10 flex justify-center md:mt-12">
              <a
                href={PHONE}
                className="flex items-center justify-center gap-2 rounded-full px-10 py-4 text-[17px] font-extrabold text-white md:px-12 md:py-5 md:text-[19px]"
                style={{ background: "#1a5cff" }}>
                📞 간편접수 010-6855-0957
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* EXTRAS */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#f0f4ff" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-2 text-[13px] font-bold tracking-widest text-[#1a5cff] md:text-[14px]">
              PLUS SERVICE
            </p>
            <h2 className="text-[20px] font-black leading-[1.4] md:text-[26px]">
              방문 시 함께 가능합니다
            </h2>
            <p className="mb-7 mt-1 text-[13px] text-neutral-600 md:text-[15px]">
              추가 출장비 없이 한 번에 해결
            </p>
          </FadeIn>
          <div className="flex flex-col gap-2.5 md:grid md:grid-cols-3 md:gap-4">
            {EXTRAS.map((e, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="flex items-center gap-4 rounded-2xl border border-[#dce5f5] bg-white p-5 md:flex-col md:items-start md:p-6">
                  <span className="flex-shrink-0 text-[26px] md:text-[32px]">
                    {e.icon}
                  </span>
                  <div>
                    <p className="text-[15px] font-extrabold md:text-[17px]">
                      {e.title}
                    </p>
                    <p className="mt-0.5 text-[12px] text-neutral-600 md:mt-1.5 md:text-[14px]">
                      {e.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#f7f9fd" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-2 text-[13px] font-bold tracking-widest text-[#1a5cff] md:text-[14px]">
              FAQ
            </p>
            <h2 className="mb-7 text-[22px] font-black md:text-[28px]">
              자주 묻는 질문
            </h2>
          </FadeIn>
          <div className="flex flex-col gap-2 md:gap-3">
            {FAQ.map((f, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div className="overflow-hidden rounded-2xl border border-[#e0e8f5] bg-white">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left md:px-7 md:py-5"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}>
                    <span className="pr-3 text-[14px] font-bold text-neutral-900 md:text-[16px]">
                      {f.q}
                    </span>
                    <span
                      className="flex-shrink-0 text-[16px] font-bold text-[#1a5cff] transition-transform duration-300 md:text-[18px]"
                      style={{
                        transform:
                          openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                      }}>
                      ▾
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: openFaq === i ? 200 : 0 }}>
                    <p className="border-t border-neutral-100 px-5 pb-5 pt-3 text-[13px] leading-[1.75] text-neutral-600 md:px-7 md:text-[15px]">
                      {f.a}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="px-5 py-16 text-center text-white md:py-24"
        style={{
          background: "linear-gradient(150deg, #1a5cff 0%, #003ad6 100%)",
        }}>
        <FadeIn>
          <h2 className="text-[24px] font-black leading-[1.4] md:text-[36px]">
            물 먹은 하부장 밑판
            <br />
            <span style={{ color: "#ffe066" }}>지판 교체로 새것처럼!</span>
          </h2>
          <p
            className="mt-3 text-[14px] leading-[1.7] md:text-[17px]"
            style={{ color: "rgba(255,255,255,0.7)" }}>
            사진 한 장이면 교체 가능 여부
            <br />
            바로 안내드립니다
          </p>
          <div className="mx-auto mt-8 flex max-w-xs flex-col gap-2.5 md:max-w-sm">
            <a
              href={PHONE}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-[16px] font-extrabold text-[#1a5cff] md:py-5 md:text-[18px]">
              📞 전화 문의
            </a>
            <a
              href={KAKAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-[16px] font-extrabold md:py-5 md:text-[18px]"
              style={{ background: "#FEE500", color: "#1a1a1a" }}>
              💬 카카오톡 상담
            </a>
            <a
              href={PHOTO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/25 px-6 py-4 text-[15px] font-bold text-white md:py-5 md:text-[17px]"
              style={{ background: "rgba(255,255,255,0.12)" }}>
              📷 사진 접수
            </a>
          </div>
          <div className="mx-auto mt-7 flex flex-wrap justify-center gap-2">
            {["지판 교체", "당일 완료", "3년 A/S", "곰팡이 제거"].map(
              (badge) => (
                <span
                  key={badge}
                  className="rounded-full px-3 py-1 text-[11px] font-semibold md:text-[13px]"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.5)",
                  }}>
                  {badge}
                </span>
              ),
            )}
          </div>
        </FadeIn>
      </section>
      <FloatingCTA />
    </main>
  );
}
