"use client";

import React, { useEffect, useRef } from "react";
import s from "./premium.module.css";

/* ─────────────────────────────────────────
   공통: 모션 줄이기 설정 확인
───────────────────────────────────────── */
function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* ─────────────────────────────────────────
   useScrollVar — 요소의 스크롤 진행도를 CSS 변수 --p (0~1)로
   mode "through": 화면 아래에 걸칠 때 0 → 화면 위로 빠질 때 1
   mode "reveal" : 화면 85% 지점에서 시작해 중앙 위쪽에서 1
   mode "pin"    : 섹션 상단이 화면 상단에 닿은 뒤부터 섹션 끝까지
───────────────────────────────────────── */
type ScrollMode = "through" | "reveal" | "pin";

export function useScrollVar<T extends HTMLElement>(mode: ScrollMode = "through") {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.setProperty("--p", "1");
      return;
    }
    let raf = 0;
    let last = -1;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let p: number;
      if (mode === "reveal") {
        p = (vh * 0.85 - r.top) / (vh * 0.5 + r.height * 0.5);
      } else if (mode === "pin") {
        p = -r.top / Math.max(1, r.height - vh);
      } else {
        p = (vh - r.top) / (vh + r.height);
      }
      p = Math.min(1, Math.max(0, p));
      if (Math.abs(p - last) > 0.0005) {
        last = p;
        el.style.setProperty("--p", p.toFixed(4));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mode]);
  return ref;
}

/* ─────────────────────────────────────────
   Scrub — --p 를 받는 범용 래퍼
───────────────────────────────────────── */
export function Scrub({
  mode = "through",
  className,
  style,
  children,
  as: Tag = "div",
  ...rest
}: {
  mode?: ScrollMode;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  as?: "div" | "section" | "figure";
} & Omit<React.HTMLAttributes<HTMLElement>, "style" | "className">) {
  const ref = useScrollVar<HTMLDivElement>(mode);
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
}

/* ─────────────────────────────────────────
   InView — 한 번 화면에 들어오면 data-inview="true"
───────────────────────────────────────── */
export function InView({
  className,
  style,
  children,
  threshold = 0.2,
  as: Tag = "div",
}: {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  threshold?: number;
  as?: "div" | "ul" | "ol" | "figure" | "dl";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      el.dataset.inview = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.inview = "true";
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={className}
      style={style}
      data-inview="false">
      {children}
    </Tag>
  );
}

/* ─────────────────────────────────────────
   InkText — 스크롤에 맞춰 회색 → 진한 글자로 한 글자씩 번짐
   (Loyal ABOUT US 문단 효과)
───────────────────────────────────────── */
export function InkText({
  lines,
  className,
  as: Tag = "p",
}: {
  lines: string[];
  className?: string;
  as?: "p" | "h2" | "h3" | "div";
}) {
  const ref = useScrollVar<HTMLElement>("reveal");
  const total = lines.reduce((n, l) => n + l.length, 0);
  let i = 0;
  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`${s.ink} ${className ?? ""}`}
      style={{ "--n": total } as React.CSSProperties}>
      <span className="sr-only">{lines.join(" ")}</span>
      {lines.map((line, li) => (
        <span key={li} className={s.inkLine} aria-hidden="true">
          {[...line].map((ch, ci) => {
            const idx = i++;
            return (
              <span
                key={ci}
                className={s.inkChar}
                style={{ "--i": idx } as React.CSSProperties}>
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

/* ─────────────────────────────────────────
   RiseLines — 마스크 안에서 한 줄씩 올라오는 타이틀
───────────────────────────────────────── */
export function RiseLines({
  lines,
  className,
  as: Tag = "h2",
  delay = 0,
  onLoad = false,
  glitchLine,
}: {
  lines: string[];
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  onLoad?: boolean;
  /** 이 줄에 RGB 지지직 효과 (벤 다이어그램과 같은 박자) */
  glitchLine?: number;
}) {
  const content = (
    <Tag className={className}>
      {lines.map((l, i) => (
        <span key={i} className={i === glitchLine ? `${s.riseMask} ${s.glitchText}` : s.riseMask}>
          <span
            className={s.riseLine}
            style={{ transitionDelay: `${delay + i * 70}ms`, animationDelay: `${delay + i * 70}ms` }}>
            {l}
          </span>
          {i === glitchLine &&
            [s.gtR, s.gtG, s.gtB].map((c) => (
              // 글자는 CSS로 그림 — 제목(h1) 텍스트에 같은 문구가 중복되지 않게
              <span key={c} className={`${s.gtLayer} ${c}`} data-text={l} aria-hidden="true" />
            ))}
        </span>
      ))}
    </Tag>
  );
  if (onLoad) return <div className={s.riseOnLoad}>{content}</div>;
  return <InView threshold={0.4}>{content}</InView>;
}

/* ─────────────────────────────────────────
   RollText — 호버 시 글자가 한 칸씩 위로 굴러가는 링크 텍스트
   (Loyal 내비게이션 / CONTACT 밴드)
───────────────────────────────────────── */
export function RollText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`${s.roll} ${className ?? ""}`} aria-label={text}>
      {[...text].map((ch, i) => (
        <span
          key={i}
          className={s.rollChar}
          aria-hidden="true"
          style={{ transitionDelay: `${i * 22}ms` }}
          data-char={ch === " " ? " " : ch}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
