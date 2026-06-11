"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import FadeIn from "@/app/components/FadeIn";

const KAKAO_URL = "http://pf.kakao.com/_hQExjX/chat";
const PHONE = "tel:010-6855-0957";

// 카탈로그별 대표 색상 — 실제 이미지 기반
const CATALOGS = [
  {
    id: 1,
    img: "/images/chair/1-1.png",
    label: "Mirano",
    brands: "MIRANO 시리즈 · 28종",
    swatches: [
      "#1a1a1a",
      "#2e2e2e",
      "#c8941a",
      "#d4b878",
      "#b8d4c8",
      "#6878a0",
      "#be3028",
    ],
  },
  {
    id: 2,
    img: "/images/chair/2.png",
    label: "Cruz · Venice 패브릭",
    brands: "CRUZ · VENICE 패브릭 시리즈 · 28종",
    swatches: [
      "#2a3850",
      "#1e1e20",
      "#70a050",
      "#88b820",
      "#3a4a20",
      "#e0d8c0",
      "#686858",
    ],
  },
  {
    id: 3,
    img: "/images/chair/3.png",
    label: "Venice",
    brands: "VENICE 가죽 시리즈 · 28종",
    swatches: [
      "#e8dfc0",
      "#f0ece0",
      "#c07840",
      "#c07040",
      "#885040",
      "#502028",
      "#b09060",
    ],
  },
  {
    id: 4,
    img: "/images/chair/4.png",
    label: "Nuvrino-α · Venice · Choice",
    brands: "NUVRINO-α · VENICE · CHOICE · 28종",
    swatches: [
      "#c8c870",
      "#808040",
      "#484848",
      "#1a2038",
      "#c08840",
      "#f0ece0",
      "#d06010",
    ],
  },
  {
    id: 5,
    img: "/images/chair/5.png",
    label: "Cruz",
    brands: "CRUZ 시리즈 · 28종",
    swatches: [
      "#d0e0c0",
      "#e8e0c0",
      "#c8b878",
      "#c07840",
      "#3a2018",
      "#801828",
      "#c08828",
    ],
  },
];

export default function LeatherSampleSection() {
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [fading, setFading] = useState(false);
  const [toast, setToast] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleKakaoInquiry = async (cat: (typeof CATALOGS)[number]) => {
    const msg = `안녕하세요! 가죽 샘플 문의드립니다.\n관심 샘플: ${cat.label}\n(${cat.brands})\n\n방문 견적 원합니다.`;
    try {
      await navigator.clipboard.writeText(msg);
    } catch {
      // clipboard 실패해도 카카오는 열어줌
    }
    setToast(true);
    setTimeout(() => setToast(false), 3000);
    setTimeout(() => window.open(KAKAO_URL, "_blank"), 300);
  };

  // 모달 열리면 body 스크롤 잠금
  useEffect(() => {
    if (modalIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalIdx]);

  const closeModal = () => setModalIdx(null);

  const goTo = (nextIdx: number) => {
    if (nextIdx < 0 || nextIdx >= CATALOGS.length) return;
    setFading(true);
    setTimeout(() => {
      setModalIdx(nextIdx);
      setFading(false);
    }, 150);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx > 0) goTo((modalIdx ?? 0) + 1);
    else goTo((modalIdx ?? 0) - 1);
  };

  const current = modalIdx !== null ? CATALOGS[modalIdx] : null;

  return (
    <>
      <section
        className="px-5 py-10 md:py-14"
        style={{ background: "#f7f9fd" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            {/* 헤더 */}
            <div className="mb-5">
              <p className="text-[12px] font-bold text-[#1a5cff] tracking-widest mb-1">
                LEATHER SAMPLE
              </p>
              <h3 className="text-[22px] font-black text-neutral-900 md:text-[26px]">
                원하는 색상을 골라보세요
              </h3>
              <p className="text-[13px] text-neutral-400 mt-1">
                탭해서 크게 보고 바로 문의할 수 있어요
              </p>
            </div>

            {/* 카탈로그 카드 그리드 */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
              {CATALOGS.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => setModalIdx(i)}
                  className="group relative overflow-hidden rounded-2xl text-left transition-all active:scale-95"
                  style={{
                    border: "1.5px solid #e8eef8",
                    background: "#fff",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    padding: 0,
                  }}>
                  {/* 이미지 프리뷰 — 상단 1/3만 크롭해서 보여줌 */}
                  <div
                    className="overflow-hidden"
                    style={{ aspectRatio: "4/3" }}>
                    <div style={{ transform: "translateY(0)", height: "300%" }}>
                      <Image
                        src={cat.img}
                        alt={`가죽 샘플 ${cat.id}`}
                        width={400}
                        height={1200}
                        className="w-full h-auto"
                        style={{ marginTop: "0%" }}
                      />
                    </div>
                  </div>

                  {/* 카드 하단 */}
                  <div className="p-3">
                    <div className="flex items-center gap-1 mb-2">
                      {cat.swatches.slice(0, 5).map((color, ci) => (
                        <div
                          key={ci}
                          className="rounded-full flex-shrink-0"
                          style={{
                            width: 14,
                            height: 14,
                            backgroundColor: color,
                            border: "1px solid rgba(0,0,0,0.08)",
                          }}
                        />
                      ))}
                      <span className="text-[10px] text-neutral-400 ml-0.5">
                        +더보기
                      </span>
                    </div>
                    <p className="text-[12px] font-black text-neutral-800 truncate">
                      {cat.label}
                    </p>
                    <p className="text-[11px] font-semibold text-neutral-400 truncate mt-0.5">
                      {cat.brands}
                    </p>
                  </div>

                  {/* 호버/탭 오버레이 */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(26,92,255,0.08)" }}>
                    <span
                      className="rounded-full px-3 py-1.5 text-[12px] font-bold text-white"
                      style={{ background: "#1a5cff" }}>
                      크게 보기
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 토스트 */}
      {toast && (
        <div
          className="fixed bottom-36 left-1/2 z-[60] flex items-center gap-2 rounded-2xl px-5 py-3.5 text-[13px] font-bold text-white shadow-xl"
          style={{
            transform: "translateX(-50%)",
            background: "#1a1a1a",
            animation: "fadeInUp 0.2s ease",
          }}>
          <span style={{ color: "#4ade80" }}>✓</span>
          메시지 복사됐어요. 카카오에 붙여넣기 해주세요
        </div>
      )}

      {/* 모달 */}
      {modalIdx !== null && current && (
        <>
          {/* 백드롭 — 데스크탑에서 뒤 어둡게, 클릭하면 닫힘 */}
          <div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.75)" }}
            onClick={closeModal}
          />

          {/* 모달 본체
              모바일  : 풀스크린 (inset-0)
              데스크탑: 센터 오버레이 (width 440px, max-height 88vh)
          */}
          <div
            className="fixed z-50 flex flex-col
              inset-0
              md:inset-auto md:rounded-3xl md:overflow-hidden"
            style={{
              background: "#111",
              // 데스크탑 센터 포지셔닝
            }}
            ref={(el) => {
              if (el) {
                const isMd = window.innerWidth >= 768;
                if (isMd) {
                  el.style.width = "440px";
                  el.style.maxHeight = "88vh";
                  el.style.top = "50%";
                  el.style.left = "50%";
                  el.style.transform = "translate(-50%, -50%)";
                } else {
                  el.style.width = "";
                  el.style.maxHeight = "";
                  el.style.top = "";
                  el.style.left = "";
                  el.style.transform = "";
                }
              }
            }}
            onClick={(e) => e.stopPropagation()}>
            {/* 헤더 */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ background: "#111" }}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[13px] font-semibold text-white flex-shrink-0">
                  <span className="text-[#1a5cff] font-black text-[15px]">
                    {modalIdx + 1}
                  </span>{" "}
                  / {CATALOGS.length}
                </span>
                <span className="text-[12px] font-bold text-white truncate">
                  {current.label}
                </span>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full text-neutral-400"
                style={{
                  background: "#2a2a2a",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 15,
                }}>
                ✕
              </button>
            </div>

            {/* 도트 */}
            <div
              className="flex justify-center gap-1.5 pb-2 flex-shrink-0"
              style={{ background: "#111" }}>
              {CATALOGS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === modalIdx ? 20 : 6,
                    height: 6,
                    background: i === modalIdx ? "#1a5cff" : "#444",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
              ))}
            </div>

            {/* 이미지 스크롤 + 스와이프 */}
            <div
              className="flex-1 overflow-y-auto"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{ touchAction: "pan-y" }}>
              <div
                style={{
                  opacity: fading ? 0 : 1,
                  transition: "opacity 0.15s ease",
                }}>
                <Image
                  src={current.img}
                  alt={`가죽 샘플 ${modalIdx + 1}`}
                  width={640}
                  height={1800}
                  className="w-full h-auto pointer-events-none"
                  draggable={false}
                />
              </div>
              {/* 모바일 힌트 */}
              <p className="md:hidden text-center text-[12px] text-neutral-500 py-3 select-none">
                ← 밀어서 다른 샘플 보기 →
              </p>
              {/* 데스크탑 이전/다음 */}
              <div className="hidden md:flex gap-2 px-4 py-3">
                <button
                  onClick={() => goTo(modalIdx - 1)}
                  disabled={modalIdx === 0}
                  className="flex-1 rounded-xl py-2.5 text-[13px] font-bold transition-all"
                  style={{
                    background: modalIdx === 0 ? "#1e1e1e" : "#2a2a2a",
                    color: modalIdx === 0 ? "#444" : "#fff",
                    border: "none",
                    cursor: modalIdx === 0 ? "default" : "pointer",
                    fontFamily: "inherit",
                  }}>
                  ‹ 이전
                </button>
                <button
                  onClick={() => goTo(modalIdx + 1)}
                  disabled={modalIdx === CATALOGS.length - 1}
                  className="flex-1 rounded-xl py-2.5 text-[13px] font-bold transition-all"
                  style={{
                    background:
                      modalIdx === CATALOGS.length - 1 ? "#1e1e1e" : "#1a5cff",
                    color: modalIdx === CATALOGS.length - 1 ? "#444" : "#fff",
                    border: "none",
                    cursor:
                      modalIdx === CATALOGS.length - 1 ? "default" : "pointer",
                    fontFamily: "inherit",
                  }}>
                  다음 ›
                </button>
              </div>
            </div>

            {/* 하단 CTA */}
            <div
              className="flex-shrink-0 px-4 py-4 flex flex-col gap-2"
              style={{ background: "#111", borderTop: "1px solid #1e1e1e" }}>
              <button
                onClick={() => handleKakaoInquiry(current)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-black"
                style={{
                  background: "#FEE500",
                  color: "#1a1a1a",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}>
                💬 이 색상으로 카카오 문의
              </button>
              <a
                href={PHONE}
                className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[14px] font-bold text-white"
                style={{ background: "#1e1e1e", border: "1px solid #2a2a2a" }}>
                📞 전화 문의
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
