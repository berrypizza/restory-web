"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const cards = [
  {
    title: "교체해야 할까봐\n부담되시죠.",
    desc: "상부장 처짐, 문짝 떨어짐,\n의자 가죽 벗겨짐까지.\n전체 교체 없이 가능한 경우도 많습니다.",
    tags: ["상부장 처짐", "문짝 떨어짐", "가죽 벗겨짐"],
  },
  {
    title: "어디에 맡겨야 할지\n헷갈리셨죠.",
    desc: "싱크대 수리인지,\n리폼인지 구분 어려운 경우가 많습니다.\n사진으로 먼저 방향부터 봅니다.",
    cta: {
      main: "사진 → 가능 여부 확인",
      sub: "안 되는 건 안 된다고 말합니다.",
    },
  },
  {
    title: "비용이 계속 커질까봐\n걱정되시죠.",
    desc: "현장 상태마다 다르기 때문에\n사진 기준으로 범위를 먼저 안내드립니다.",
    questions: [
      '"추가 비용 생기나요?"',
      '"부분 작업 가능한가요?"',
      '"사진만 봐도 알 수 있나요?"',
    ],
  },
];

function CardContent({ card }: { card: (typeof cards)[0] }) {
  return (
    <div className="rounded-[24px] bg-gradient-to-b from-[#f8faff] to-[#edf2fb] p-7 shadow-[0_2px_12px_rgba(15,23,42,0.04)] h-full flex flex-col">
      <h3 className="text-xl font-black leading-[1.4] tracking-tight text-neutral-950 whitespace-pre-line md:text-2xl">
        {card.title}
      </h3>
      <p className="mt-4 text-sm leading-[1.8] text-neutral-500 whitespace-pre-line md:text-[15px]">
        {card.desc}
      </p>
      {card.tags && (
        <div className="mt-6 flex flex-wrap gap-2">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-2xl bg-white px-4 py-2 text-[13px] font-black text-[#1f66ff] shadow-sm">
              {tag}
            </span>
          ))}
        </div>
      )}
      {card.cta && (
        <div className="mt-8 flex items-center justify-center flex-1">
          <div className="rounded-[20px] bg-white px-6 py-5 shadow-sm">
            <p className="text-center text-[15px] font-black text-[#1f66ff]">
              {card.cta.main}
            </p>
            <p className="mt-2 text-center text-[12px] font-medium text-neutral-500">
              {card.cta.sub}
            </p>
          </div>
        </div>
      )}
      {card.questions && (
        <div className="mt-6 flex flex-col items-start gap-2.5">
          {card.questions.map((q, i) => (
            <div
              key={i}
              className="rounded-full bg-white px-4 py-2 text-[13px] font-black text-neutral-700 shadow-sm"
              style={{ marginLeft: i % 2 === 1 ? 20 : 0 }}>
              {q}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── 모바일: translateX 슬라이드 + 자동 + 스와이프 + 점 ── */
function MobilePainCarousel() {
  const [idx, setIdx] = useState(0);
  const touchRef = useRef({ startX: 0, touching: false });
  const pausedRef = useRef(false);

  const go = useCallback((dir: number) => {
    setIdx((prev) => {
      const next = prev + dir;
      if (next < 0) return cards.length - 1;
      if (next > cards.length - 1) return 0;
      return next;
    });
  }, []);

  // 자동 넘김
  useEffect(() => {
    const timer = setInterval(() => {
      if (!pausedRef.current) go(1);
    }, 3500);
    return () => clearInterval(timer);
  }, [go]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current = { startX: e.touches[0].clientX, touching: true };
    pausedRef.current = true;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current.touching) return;
    const diff = touchRef.current.startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
    touchRef.current.touching = false;
    setTimeout(() => {
      pausedRef.current = false;
    }, 5000);
  };

  return (
    <div>
      <div
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}>
        <div
          className="flex"
          style={{
            transform: `translateX(-${idx * 100}%)`,
            transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
          {cards.map((card, i) => (
            <div key={i} className="flex-shrink-0 w-full px-1">
              <CardContent card={card} />
            </div>
          ))}
        </div>
      </div>

      {/* 인디케이터 */}
      <div className="flex justify-center gap-2 mt-5">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIdx(i);
              pausedRef.current = true;
              setTimeout(() => {
                pausedRef.current = false;
              }, 5000);
            }}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === idx ? 20 : 8,
              height: 8,
              backgroundColor: i === idx ? "#1f66ff" : "#d1d5db",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function PainPointCards() {
  return (
    <section className="bg-white px-4 py-16 md:px-5 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-neutral-500 md:text-[15px]">
            아직도 시공 걱정 하고 계시나요?
          </p>
          <h2 className="mt-2 text-2xl font-black leading-tight tracking-tight text-neutral-950 md:text-[38px]">
            사진 한 장이면
            <br />
            가능한 범위부터 먼저 봅니다.
          </h2>
        </div>

        {/* 데스크탑: 3열 그리드 */}
        <div className="hidden md:grid md:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <CardContent key={i} card={card} />
          ))}
        </div>

        {/* 모바일: 슬라이드 캐러셀 */}
        <div className="md:hidden">
          <MobilePainCarousel />
        </div>
      </div>
    </section>
  );
}
