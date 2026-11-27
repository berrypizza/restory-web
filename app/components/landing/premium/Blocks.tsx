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
  bigKicker = false,
}: {
  kicker: string;
  title: string;
  as?: "h2" | "p";
  /** 한글 소제목을 크게 — 이때 소제목이 h2가 되고 영문 제목은 장식 */
  bigKicker?: boolean;
}) {
  const KickerTag = bigKicker ? "h2" : "p";
  const TitleTag = bigKicker ? "p" : Tag;
  return (
    <InView className={`${s.glass} ${s.titleCard}`} threshold={0.3}>
      <KickerTag className={`${s.kicker} ${bigKicker ? s.kickerLg : ""} ${s.fade}`}>{kicker}</KickerTag>
      <TitleTag className={`${s.cardTitle} ${s.fade}`} style={{ transitionDelay: "0.08s" }}>
        {title}
      </TitleTag>
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
   제자리 뛰기 영상에서 한 걸음(10프레임, 12fps)을 뽑은 움직이는 webp를
   CSS로 왼쪽→오른쪽으로 옮김. 밴드가 화면에 있을 때만 data-run="on"
───────────────────────────────────────── */
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
        <picture>
          {/* 모션 줄이기: 멈춘 한 장 */}
          <source
            media="(prefers-reduced-motion: reduce)"
            srcSet="/images/premium/run/run-crew-still.webp"
          />
          <img
            src="/images/premium/run/run-crew.webp"
            srcSet="/images/premium/run/run-crew-sm.webp 752w, /images/premium/run/run-crew.webp 1236w"
            sizes="(min-width: 900px) 752px, 376px"
            width={1236}
            height={460}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   BeforeAfterSlider — 가운데 막대를 좌우로 끌어 전후 비교
   화면에 들어오면 막대가 좌우로 한 번씩 훑으며 비교를 보여주고,
   손대는 순간 자동 움직임은 멈춤 (모션 줄이기면 처음부터 멈춤)
───────────────────────────────────────── */
export function BeforeAfterSlider({
  before,
  after,
  beforeAlt,
  afterAlt,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  const boxRef = React.useRef<HTMLDivElement>(null);
  const handleRef = React.useRef<HTMLDivElement>(null);
  const touched = React.useRef(false);
  const dragging = React.useRef(false);

  const setPos = React.useCallback((pct: number) => {
    const v = Math.max(0, Math.min(100, pct));
    boxRef.current?.style.setProperty("--pos", `${v}%`);
    handleRef.current?.setAttribute("aria-valuenow", String(Math.round(v)));
  }, []);

  React.useEffect(() => {
    const box = boxRef.current;
    if (!box || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let start = 0;
    let visible = false;
    const tick = (t: number) => {
      if (touched.current || !visible) return;
      if (!start) start = t;
      // 50 → 85 → 15 → 50 을 3.6초에 한 바퀴
      setPos(50 + 35 * Math.sin(((t - start) / 3600) * Math.PI * 2));
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !touched.current) raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(box);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [setPos]);

  const fromPointer = (clientX: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (r) setPos(((clientX - r.left) / r.width) * 100);
  };

  return (
    <div
      ref={boxRef}
      className={s.baBox}
      onPointerDown={(e) => {
        touched.current = true;
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        fromPointer(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}>
      <Image src={after} alt={afterAlt} fill className="object-cover" sizes="(min-width: 1200px) 1100px, 100vw" draggable={false} />
      <div className={s.baBefore}>
        <Image src={before} alt={beforeAlt} fill className="object-cover" sizes="(min-width: 1200px) 1100px, 100vw" draggable={false} />
      </div>
      <span className={s.baTag}>BEFORE</span>
      <span className={s.baTag} data-after>
        AFTER
      </span>
      <div
        ref={handleRef}
        className={s.baHandle}
        role="slider"
        tabIndex={0}
        aria-label="작업 전후 비교 위치"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        onKeyDown={(e) => {
          if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
          e.preventDefault();
          touched.current = true;
          const now = Number(handleRef.current?.getAttribute("aria-valuenow") ?? 50);
          setPos(now + (e.key === "ArrowLeft" ? -5 : 5));
        }}>
        <span className={s.baKnob} aria-hidden="true">
          <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
            <path d="M6 1 1 6l5 5M16 1l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}
