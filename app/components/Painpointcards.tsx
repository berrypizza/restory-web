"use client";

import { useRef, useState } from "react";
import Link from "next/link";

const KAKAO_URL = "http://pf.kakao.com/_hQExjX/chat";

const cards = [
  {
    emoji: "😰",
    title: "교체 비용이\n부담되시죠",
    desc: "상부장 처짐, 문짝 떨어짐, 의자 가죽 벗겨짐까지.\n전체 교체 없이 수리만으로 해결되는 경우가 많습니다.",
    tags: ["상부장 처짐", "문짝 떨어짐", "가죽 벗겨짐"],
    answer: null,
  },
  {
    emoji: "🤔",
    title: "어디에 맡겨야\n할지 모르겠죠",
    desc: "수리인지 리폼인지 구분이 어려운 경우가 많아요.\n사진만 보내주시면 방향부터 먼저 알려드립니다.",
    tags: null,
    answer: {
      main: "사진 한 장 → 가능 여부 바로 확인",
      sub: "안 되는 건 안 된다고 말합니다",
    },
  },
  {
    emoji: "💸",
    title: "추가 비용 생길까봐\n걱정되시죠",
    desc: "사진 기준으로 비용 범위를 먼저 안내드려요.\n방문 후 금액이 올라가는 일 없습니다.",
    tags: null,
    questions: [
      '"추가 비용 생기나요?"',
      '"부분 작업 가능한가요?"',
      '"사진만 봐도 알 수 있나요?"',
    ],
  },
];

export default function PainPointCards() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

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
    <section className="bg-white px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <p className="text-[12px] font-bold tracking-widest text-[#1f66ff] mb-2">
            아직 망설여지세요?
          </p>
          <h2
            className="text-2xl font-black leading-tight md:text-[32px]"
            style={{ color: "#111827" }}>
            사진 한 장이면
            <br />
            가능한 범위부터 먼저 봅니다
          </h2>
        </div>

        {/* 모바일: scroll-snap / 데스크탑: 3열 */}

        {/* 모바일 */}
        <div className="md:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-3 overflow-x-auto"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              paddingBottom: 4,
            }}>
            {cards.map((card, i) => (
              <div
                key={i}
                style={{
                  scrollSnapAlign: "start",
                  flexShrink: 0,
                  width: "82vw",
                  maxWidth: 320,
                }}>
                <CardContent card={card} />
              </div>
            ))}
          </div>

          {/* 도트 */}
          <div className="flex justify-center gap-1.5 mt-5">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === activeIdx ? 20 : 6,
                  height: 6,
                  background: i === activeIdx ? "#1f66ff" : "#d1d5db",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* 데스크탑 */}
        <div className="hidden md:grid md:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <CardContent key={i} card={card} />
          ))}
        </div>

        {/* 하단 CTA */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-[15px] font-black w-full sm:w-auto"
            style={{ background: "#FEE500", color: "#1a1a1a" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
            </svg>
            사진 보내고 바로 확인
          </a>
          <a
            href="tel:010-6855-0957"
            className="flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-[15px] font-bold w-full sm:w-auto"
            style={{ border: "1px solid #e5e7eb", color: "#374151" }}>
            📞 전화로 물어보기
          </a>
        </div>
      </div>
    </section>
  );
}

function CardContent({ card }: { card: (typeof cards)[0] }) {
  return (
    <div
      className="flex flex-col h-full rounded-2xl p-6"
      style={{
        background: "linear-gradient(135deg, #f8faff 0%, #edf2fb 100%)",
        border: "1px solid #e8edf8",
      }}>
      <span className="text-[32px] mb-3">{card.emoji}</span>
      <h3
        className="text-[18px] font-black leading-[1.4] whitespace-pre-line mb-3"
        style={{ color: "#111827" }}>
        {card.title}
      </h3>
      <p
        className="text-[13px] leading-[1.8] whitespace-pre-line flex-1"
        style={{ color: "#64748b" }}>
        {card.desc}
      </p>

      {card.tags && (
        <div className="mt-5 flex flex-wrap gap-2">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-2xl px-3 py-1.5 text-[12px] font-black"
              style={{
                background: "#fff",
                color: "#1f66ff",
                border: "1px solid #dbeafe",
              }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {card.answer && (
        <div
          className="mt-5 rounded-xl px-4 py-4"
          style={{ background: "#fff", border: "1px solid #dbeafe" }}>
          <p
            className="text-[14px] font-black text-center"
            style={{ color: "#1f66ff" }}>
            {card.answer.main}
          </p>
          <p
            className="text-[11px] text-center mt-1"
            style={{ color: "#94a3b8" }}>
            {card.answer.sub}
          </p>
        </div>
      )}

      {card.questions && (
        <div className="mt-5 flex flex-col gap-2">
          {card.questions.map((q, i) => (
            <div
              key={i}
              className="rounded-full px-4 py-2 text-[12px] font-bold text-center"
              style={{
                background: "#fff",
                color: "#374151",
                border: "1px solid #e5e7eb",
                alignSelf: i % 2 === 1 ? "flex-end" : "flex-start",
              }}>
              {q}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
