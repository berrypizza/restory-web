"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { buildTrackedContactPath } from "@/lib/attribution";

interface FloatingCTAProps {
  phone?: string;
  kakaoUrl?: string;
  onReviewClick?: () => void;
}

export default function FloatingCTA({
  phone = buildTrackedContactPath("phone", "floating_cta"),
  kakaoUrl = buildTrackedContactPath("kakao", "floating_cta"),
  onReviewClick,
}: FloatingCTAProps) {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className="fixed right-4 z-50 flex flex-col items-end gap-3 transition-all duration-300 md:right-6"
        style={{
          bottom: showSticky ? 80 : 32,
          opacity: showSticky ? 1 : 0,
          transform: showSticky ? "translateY(0)" : "translateY(20px)",
          pointerEvents: showSticky ? "auto" : "none",
        }}>
        {onReviewClick && (
          <button
            type="button"
            onClick={onReviewClick}
            className="order-2 relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white text-[11px] font-black leading-none text-[#1a5cff] shadow-[0px_-4px_16px_0px_rgba(0,0,0,0.22)] transition-all duration-200 hover:scale-105 active:scale-95 md:h-14 md:w-14 md:text-[12px]"
            aria-label="리뷰 바로 보기">
            <span className="absolute inset-0 animate-[spin_5s_linear_infinite]">
              {[0, 1, 2, 3, 4].map((star) => (
                <span
                  key={star}
                  className="absolute left-1/2 top-1/2 text-[9px] leading-none text-[#fbbc04] md:text-[10px]"
                  style={{
                    transform: `rotate(${star * 72}deg) translateY(-19px) rotate(-${star * 72}deg)`,
                    transformOrigin: "center",
                  }}>
                  ★
                </span>
              ))}
            </span>
            <span className="relative z-10">리뷰</span>
          </button>
        )}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="order-1 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0px_-4px_16px_0px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-105 active:scale-95 md:h-14 md:w-14"
          aria-label="맨 위로">
          <span className="text-[18px] text-neutral-500 md:text-[20px]">↑</span>
        </button>
        <a
          href={phone}
          data-cta="floating_phone"
          className="order-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0px_-4px_16px_0px_rgba(0,0,0,0.35)] transition-all duration-200 hover:scale-105 active:scale-95 md:h-14 md:w-14"
          aria-label="전화 문의">
          <Image
            src="/images/phone-icon.png"
            alt="전화기 아이콘"
            width={48}
            height={48}
            className="h-[48px] w-[48px] object-contain md:h-[56px] md:w-[56px]"
          />
        </a>
        <a
          href={kakaoUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cta="floating_kakao_icon"
          className="order-4 flex h-12 w-12 items-center justify-center rounded-full shadow-[0px_-4px_16px_0px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-105 active:scale-95 md:h-14 md:w-14"
          style={{ background: "#FEE500" }}
          aria-label="카카오톡 상담">
          <Image
            src="/images/kakao-logo.png"
            alt="카카오톡 로고"
            width={48}
            height={48}
            className="h-[48px] w-[48px] object-contain md:h-[56px] md:w-[56px]"
          />
        </a>
      </div>
      <a
        href={kakaoUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-cta="floating_kakao_bar"
        className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-2 py-4 text-[17px] font-extrabold text-white shadow-[0px_-4px_16px_0px_rgba(0,0,0,0.25)] transition-all duration-300 md:bottom-6 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-fit md:rounded-full md:px-12 md:py-4"
        style={{
          background: "linear-gradient(135deg, #3672ff 0%, #1a5cff 100%)",
          opacity: showSticky ? 1 : 0,
          transform: showSticky ? "translateY(0)" : "translateY(100%)",
          pointerEvents: showSticky ? "auto" : "none",
        }}>
        😊 카톡으로 무료 견적 받기 &gt;
      </a>
      <div className="h-20" />
    </>
  );
}
