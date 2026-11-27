"use client";

/* ─────────────────────────────────────────
   프리미엄 랜딩 공용 블록 — 소파·싱크대 문짝 등 서비스 랜딩이 함께 씀
   (.claude/skills/restory-premium-landing 참고)
───────────────────────────────────────── */
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { InView } from "./Motion";
import s from "./premium.module.css";

export function Arrow() {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
      <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.6l1.4-2h5l1.4 2h1.6A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z" />
      <circle cx="12" cy="12.5" r="3.5" />
    </svg>
  );
}

/* 여섯 갈래 별 — CONTACT 밴드 배경 모티프 */
export function Star({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <g fill="#fff">
        {[0, 60, 120].map((deg) => (
          <path
            key={deg}
            transform={`rotate(${deg} 100 100)`}
            d="M100 0 C104 60 104 60 100 100 C96 60 96 60 100 0 Z M100 200 C96 140 96 140 100 100 C104 140 104 140 100 200 Z"
          />
        ))}
      </g>
    </svg>
  );
}

/* 유튜브 썸네일을 먼저 보여주고 눌렀을 때만 플레이어를 불러옴 */
export function YouTubeFacade({
  videoId,
  title,
  label,
}: {
  videoId: string;
  title: string;
  label: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <InView threshold={0.25}>
      <div className={`${s.clip} ${s.video}`}>
        {loaded ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setLoaded(true)} className={s.videoBtn} aria-label={label}>
            <Image
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt={title}
              fill
              unoptimized
              sizes="(min-width: 1200px) 1100px, 100vw"
              className="object-cover"
            />
            <span className={s.play}>
              <i>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </i>
              PLAY MOVIE
            </span>
          </button>
        )}
      </div>
    </InView>
  );
}

/* 설명 다이어그램 — 화면에 들어오면 RGB로 갈라지며 '지직', 이후 짧게 반복.
   shapes 는 viewBox 0 0 400 380 기준 SVG 조각 (원·텍스트) */
export function GlitchDiagram({ label, shapes }: { label: string; shapes: React.ReactNode }) {
  return (
    <InView threshold={0.35} className={s.glitch}>
      <svg className={s.venn} viewBox="0 0 400 380" role="img" aria-label={label}>
        {shapes}
      </svg>
      {[s.glitchR, s.glitchG, s.glitchB].map((c) => (
        <svg key={c} className={`${s.venn} ${s.glitchLayer} ${c}`} viewBox="0 0 400 380" aria-hidden="true">
          {shapes}
        </svg>
      ))}
    </InView>
  );
}

/* 세 원이 겹치는 벤 다이어그램 조각 */
export function VennShapes({
  top,
  left,
  right,
  core,
}: {
  top: [string, string];
  left: [string, string];
  right: [string, string];
  core: string;
}) {
  return (
    <>
      <circle cx="200" cy="130" r="112" pathLength={1} />
      <circle cx="132" cy="246" r="112" pathLength={1} />
      <circle cx="268" cy="246" r="112" pathLength={1} />
      <circle className={s.core} cx="200" cy="208" r="40" />
      <text x="200" y="78" textAnchor="middle" className={s.en}>{top[0]}</text>
      <text x="200" y="100" textAnchor="middle">{top[1]}</text>
      <text x="92" y="292" textAnchor="middle" className={s.en}>{left[0]}</text>
      <text x="92" y="314" textAnchor="middle">{left[1]}</text>
      <text x="308" y="292" textAnchor="middle" className={s.en}>{right[0]}</text>
      <text x="308" y="314" textAnchor="middle">{right[1]}</text>
      <text x="200" y="213" textAnchor="middle" className={s.coreText}>{core}</text>
    </>
  );
}

/* 클레이 시공 기사 캐릭터 + 말풍선 (화면에 들어오면 톡 튀어나와 살짝 둥실) */
export function Mascot({
  src,
  alt,
  width,
  height,
  className,
  bubble,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  bubble?: string;
}) {
  return (
    <InView className={`${s.mascot} ${className ?? ""}`} threshold={0.3}>
      {bubble && <p className={s.bubble}>{bubble}</p>}
      <div className={s.mascotFig}>
        <Image src={src} alt={alt} width={width} height={height} sizes="(min-width: 900px) 420px, 90vw" />
      </div>
    </InView>
  );
}

/* 반투명 유리 카드 위 '● 한글 라벨 + 큰 영문 타이틀' (모바일은 카드 없이 헤더) */
export function TitleCard({
  kicker,
  title,
  as: Tag = "h2",
}: {
  kicker: string;
  title: string;
  as?: "h2" | "p";
}) {
  return (
    <InView className={`${s.glass} ${s.titleCard}`} threshold={0.3}>
      <p className={`${s.kicker} ${s.fade}`}>{kicker}</p>
      <Tag className={`${s.cardTitle} ${s.fade}`} style={{ transitionDelay: "0.08s" }}>
        {title}
      </Tag>
    </InView>
  );
}

/* 사진 상담 CTA 카드: 폰 든 캐릭터 + 한 줄 + 접수 버튼 */
export function PhotoCtaCard({
  title,
  sub,
  href,
  label,
  cta,
}: {
  title: string;
  sub: string;
  href: string;
  label: string;
  cta: string;
}) {
  return (
    <InView className={`${s.glass} ${s.ctaCard}`} threshold={0.3}>
      <div className={s.ctaMascot}>
        <Image
          src="/images/premium/mascot-phone.png"
          alt="가구 사진이 담긴 휴대폰을 들고 엄지를 든 리스토리 기사 캐릭터"
          width={880}
          height={1168}
          sizes="(min-width: 768px) 180px, 112px"
        />
      </div>
      <div className={s.ctaText}>
        <p className={s.ctaTitle}>{title}</p>
        <p className={s.ctaSub}>{sub}</p>
      </div>
      <Link href={href} className={`${s.btnPrimary} ${s.ctaBtn}`} data-cta={cta}>
        <CameraIcon />
        {label}
      </Link>
    </InView>
  );
}

/* FAQ 아코디언 — 답변은 접혀 있어도 DOM에 남아 검색엔진이 읽음 */
export function FaqList({ items, idPrefix }: { items: { q: string; a: string }[]; idPrefix: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className={`${s.glass} ${s.faq} ${s.faqCard}`}>
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={s.faqItem}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`${idPrefix}-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
              className={s.faqQ}>
              <span>
                <b>Q{i + 1}</b>
                {f.q}
              </span>
              <span className={s.plus} aria-hidden="true" />
            </button>
            <div id={`${idPrefix}-${i}`} className={s.faqA} data-open={isOpen} aria-hidden={!isOpen}>
              <div>
                <p style={{ whiteSpace: "pre-line" }}>{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   RunCrew — CONTACT 밴드 아래로 기사 다섯 명이 뛰어 지나감
   밴드가 화면에 있을 때만 data-run="on" 으로 애니메이션을 돌림
───────────────────────────────────────── */
const RUNNERS = [
  { src: "/images/premium/run/run-1.webp", w: 379 },
  { src: "/images/premium/run/run-2.webp", w: 365 },
  { src: "/images/premium/run/run-3.webp", w: 371 },
  { src: "/images/premium/run/run-4.webp", w: 410 },
  { src: "/images/premium/run/run-5.webp", w: 367 },
];

export function RunCrew() {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => {
      el.dataset.run = e.isIntersecting ? "on" : "off";
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={s.runCrew} aria-hidden="true">
      <div className={s.runTrack}>
        {RUNNERS.map((r) => (
          <span key={r.src} className={s.runner}>
            <Image src={r.src} alt="" width={r.w} height={520} sizes="(min-width: 900px) 190px, 104px" unoptimized />
          </span>
        ))}
      </div>
    </div>
  );
}
