"use client";

import { useRef, useEffect, useState, useCallback } from "react";

const reviews = [
  {
    category: "싱크대 수리",
    categoryColor: "#1f66ff",
    stars: 5,
    text: "상부장이 떨어질 것 같아서 걱정했는데, 사진 보내니까 바로 가능 여부 알려주시고 당일 방문해서 고쳐주셨어요. 가격도 합리적이었습니다.",
    reviewer: "@kim*****님 후기 중",
  },
  {
    category: "소파 복원",
    categoryColor: "#f59e0b",
    stars: 5,
    text: "소파 꺼짐이 심해서 버리려고 했는데, 리스토리에서 내부 보강으로 새것처럼 만들어주셨어요. 200만원 아꼈습니다.",
    reviewer: "@park*****님 후기 중",
  },
  {
    category: "가죽 리폼",
    categoryColor: "#ec4899",
    stars: 5,
    text: "식당 의자 30개 천갈이 했는데 하루 만에 끝났어요. 영업 중에 작업해주셔서 매출 손해도 없었습니다. 강추!",
    reviewer: "@lee*****님 후기 중",
  },
  {
    category: "싱크대 리폼",
    categoryColor: "#16a34a",
    stars: 5,
    text: "주방 전체 리모델링 견적이 500만원이었는데, 문짝만 교체하니까 훨씬 저렴하게 새 주방 느낌 났어요. 진작 할 걸.",
    reviewer: "@choi*****님 후기 중",
  },
  {
    category: "싱크대 수리",
    categoryColor: "#1f66ff",
    stars: 5,
    text: "수리 불가하면 출장비 안 받는다고 해서 부담 없이 불렀는데, 다행히 고쳐지더라고요. 1년 AS까지 해주셔서 믿음이 갑니다.",
    reviewer: "@jung*****님 후기 중",
  },
];

function ReviewCard({ r }: { r: (typeof reviews)[0] }) {
  return (
    <div
      className="flex flex-col items-center rounded-2xl px-5 py-6 text-center h-full"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
      }}>
      <span
        className="inline-block rounded-full px-3 py-1 text-xs font-bold mb-3"
        style={{
          backgroundColor: r.categoryColor + "15",
          color: r.categoryColor,
          border: `1px solid ${r.categoryColor}30`,
        }}>
        {r.category}
      </span>
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: r.stars }).map((_, j) => (
          <span key={j} style={{ color: "#facc15", fontSize: 18 }}>
            ★
          </span>
        ))}
      </div>
      <p
        className="flex-1 text-sm leading-relaxed mb-4"
        style={{ color: "#374151" }}>
        {r.text}
      </p>
      <div
        className="flex items-center gap-1.5 text-xs"
        style={{ color: "#94a3b8" }}>
        <span>👤</span>
        <span>{r.reviewer}</span>
      </div>
    </div>
  );
}

/* ── 데스크탑: 3장 보이고, 3초마다 1칸씩 자동 넘김 + 화살표 + 드래그 ── */
function DesktopCarousel() {
  const [idx, setIdx] = useState(0);
  const pausedRef = useRef(false);
  const dragRef = useRef({ startX: 0, dragging: false });
  const maxIdx = reviews.length - 3;

  const go = useCallback(
    (dir: number) => {
      setIdx((prev) => {
        const next = prev + dir;
        if (next < 0) return reviews.length - 3;
        if (next > maxIdx) return 0;
        return next;
      });
    },
    [maxIdx],
  );

  // 자동 넘김
  useEffect(() => {
    const timer = setInterval(() => {
      if (!pausedRef.current) go(1);
    }, 3000);
    return () => clearInterval(timer);
  }, [go]);

  // 마우스 드래그
  const onDragStart = (x: number) => {
    dragRef.current = { startX: x, dragging: true };
    pausedRef.current = true;
  };
  const onDragEnd = (x: number) => {
    if (!dragRef.current.dragging) return;
    const diff = dragRef.current.startX - x;
    if (Math.abs(diff) > 60) go(diff > 0 ? 1 : -1);
    dragRef.current.dragging = false;
  };

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
        dragRef.current.dragging = false;
      }}
      onMouseDown={(e) => onDragStart(e.clientX)}
      onMouseUp={(e) => {
        onDragEnd(e.clientX);
        pausedRef.current = true;
      }}
      onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        onDragEnd(e.changedTouches[0].clientX);
        setTimeout(() => {
          pausedRef.current = false;
        }, 3000);
      }}
      style={{ cursor: "grab" }}>
      {/* 화살표 */}
      <button
        onClick={() => go(-1)}
        className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold"
        style={{
          color: "#64748b",
          border: "1px solid #e5e7eb",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}>
        ‹
      </button>
      <button
        onClick={() => go(1)}
        className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold"
        style={{
          color: "#64748b",
          border: "1px solid #e5e7eb",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}>
        ›
      </button>

      {/* 카드 트랙 */}
      <div className="overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-500 ease-in-out pointer-events-none"
          style={{ transform: `translateX(-${idx * (100 / 3 + 1.35)}%)` }}>
          {reviews.map((r, i) => (
            <div
              key={i}
              className="flex-shrink-0"
              style={{ width: "calc(33.333% - 11px)" }}>
              <ReviewCard r={r} />
            </div>
          ))}
        </div>
      </div>

      {/* 인디케이터 점 */}
      <div className="flex justify-center gap-1.5 mt-5">
        {reviews.slice(0, maxIdx + 1).map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className="rounded-full transition-all"
            style={{
              width: i === idx ? 20 : 6,
              height: 6,
              backgroundColor: i === idx ? "#1f66ff" : "#d1d5db",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── 모바일: 수동 스와이프만, 스냅 ── */
function MobileCarousel() {
  return (
    <>
      <style>{`.mobile-review-track::-webkit-scrollbar{display:none}`}</style>
      <div
        className="mobile-review-track flex gap-3 overflow-x-auto pb-3 -mx-4 px-4"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          touchAction: "auto",
        }}>
        {reviews.map((r, i) => (
          <div
            key={i}
            className="flex-shrink-0 snap-start"
            style={{ width: "calc(42vw - 4px)", minWidth: 160 }}>
            <ReviewCard r={r} />
          </div>
        ))}
      </div>
    </>
  );
}

export default function ReviewSection() {
  return (
    <section className="bg-white px-4 py-14 md:px-10 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2
            className="text-xl font-black md:text-2xl"
            style={{ color: "#111827" }}>
            후기
          </h2>
          <a
            href="https://blog.naver.com/sofaresq"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold"
            style={{ color: "#64748b", textDecoration: "none" }}>
            전체보기 ›
          </a>
        </div>

        <div className="hidden md:block">
          <DesktopCarousel />
        </div>
        <div className="md:hidden">
          <MobileCarousel />
        </div>
      </div>
    </section>
  );
}
