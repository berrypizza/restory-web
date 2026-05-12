"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";

/* ═══════════════════════════════════════════
   WANTED SANS FONT
   ═══════════════════════════════════════════ */
function WantedSansFont() {
  return (
    // eslint-disable-next-line @next/next/no-css-tags
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.1/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css"
    />
  );
}

/* ═══════════════════════════════════════════
   FADE-IN ON SCROLL
   ═══════════════════════════════════════════ */
function FadeIn({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const transforms = {
    up: "translateY(32px)",
    down: "translateY(-32px)",
    left: "translateX(32px)",
    right: "translateX(-32px)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0,0)" : transforms[direction],
        transition: `opacity 0.7s cubic-bezier(.22,.61,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,.61,.36,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */
const SYMPTOMS = [
  {
    icon: "📐",
    title: "장 안쪽 뜸",
    desc: "벽에서 장이 떨어지기 시작한 상태",
  },
  {
    icon: "⬇️",
    title: "윗부분 처짐",
    desc: "상부장 전체가 아래로 내려앉는 증상",
  },
  {
    icon: "↔️",
    title: "옆부분 뜸",
    desc: "측면이 벌어지며 흔들리는 상태",
  },
];

const WHY_US = [
  { us: "시공목 전부 합판 사용", them: "시공목 PB(파티클보드) 사용" },
  { us: "작업 전 전부 보양 처리", them: "보양 안 함" },
  { us: "집진기 사용으로 깨끗한 현장", them: "먼지 그대로 방치" },
  { us: "무상 A/S 3년 보장", them: "A/S 1년 ~ 없음" },
];

const PROCESS = [
  {
    step: "01",
    title: "사진 접수",
    desc: "카카오톡 또는 사진접수로\n상부장 사진 1~3장 보내기",
    icon: "📷",
  },
  {
    step: "02",
    title: "상태 확인",
    desc: "수리 가능 여부 +\n예상 비용 범위 안내",
    icon: "🔍",
  },
  {
    step: "03",
    title: "방문 일정",
    desc: "우선 배정으로\n빠른 방문 일정 확정",
    icon: "📅",
  },
  {
    step: "04",
    title: "현장 시공",
    desc: "보양 → 수리 → 집진기 청소\n→ 완료 확인",
    icon: "🔧",
  },
];

const REVIEWS = [
  {
    name: "김**",
    area: "서울 송파구",
    text: "상부장이 처져서 그릇 넣기가 무서웠는데, 합판으로 교체하고 나니 흔들림이 전혀 없어요. 보양도 꼼꼼히 해주셔서 감동!",
    rating: 5,
  },
  {
    name: "이**",
    area: "경기 용인시",
    text: "다른 데는 교체하라고만 했는데 여기서 수리로 해결됐어요. 비용도 1/3 수준이었습니다.",
    rating: 5,
  },
  {
    name: "박**",
    area: "인천 부평구",
    text: "옆부분이 벌어져서 문의했는데 사진으로 바로 가능하다고 해주시고, 다음날 바로 와주셨어요.",
    rating: 5,
  },
  {
    name: "최**",
    area: "서울 강서구",
    text: "집진기 사용하시는 거 보고 놀랐어요. 먼지 하나 없이 깨끗하게 마무리해주셨습니다.",
    rating: 5,
  },
];

const FAQ = [
  {
    q: "상부장 수리, 교체보다 정말 저렴한가요?",
    a: "네. 대부분의 경우 교체 비용의 1/3~1/5 수준으로 수리 가능합니다. 사진 보내주시면 정확한 비용 범위를 먼저 안내드립니다.",
  },
  {
    q: "합판 시공목이 왜 중요한가요?",
    a: "PB(파티클보드)는 습기에 약해서 시간이 지나면 다시 처짐이 발생합니다. 합판은 내구성이 훨씬 뛰어나 장기적으로 안전합니다.",
  },
  {
    q: "수리 시간은 얼마나 걸리나요?",
    a: "상부장 1세트 기준 약 2~3시간 소요됩니다. 현장 상태에 따라 달라질 수 있으며, 사전에 안내드립니다.",
  },
  {
    q: "하부장 수리도 같이 가능한가요?",
    a: "네. 하부장 물먹음, 경첩 교체, 레일 교체 등 방문 시 함께 작업 가능합니다. 추가 출장비 없이 진행됩니다.",
  },
  {
    q: "A/S 3년은 어떤 범위인가요?",
    a: "수리 부위의 처짐 재발, 시공목 이탈 등에 대해 무상으로 재시공해드립니다.",
  },
];

const EXTRAS = [
  {
    icon: "💧",
    title: "하부장 물먹음",
    desc: "싱크대 아래 습기로 인한 부풀음·변형 수리",
  },
  {
    icon: "🔩",
    title: "경첩 교체",
    desc: "문짝 처짐·소음의 원인, 경첩 교체로 해결",
  },
  {
    icon: "🛤️",
    title: "레일 교체",
    desc: "서랍 안 들어가거나 빠지는 증상, 레일 교체",
  },
];

const PHONE = "tel:010-9127-3024";
const KAKAO_URL = "https://pf.kakao.com/_CHANGE_ME/chat";
const PHOTO_URL = "https://blog.naver.com/sofaresq/224129090889";

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export default function SangbujangLanding() {
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
      <WantedSansFont />
      {/* ────────────────────────────
          HERO IMAGE
         ──────────────────────────── */}
      <section>
        <Image
          src="/images/hero-sangbujang.png"
          alt="리스토리의 싱크대 상부장 수리"
          width={1080}
          height={1350}
          className="w-full h-auto"
          priority
        />
      </section>

      {/* ────────────────────────────
          HERO CTA BUTTONS
         ──────────────────────────── */}
      <section className="px-5 py-5" style={{ background: "#3672ff" }}>
        <div className="mx-auto flex max-w-3xl flex-col gap-2.5 sm:flex-row">
          <a
            href={PHONE}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-[15px] font-extrabold text-[#1a5cff] shadow-lg">
            📞 전화 문의
          </a>
          <a
            href={PHOTO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-white/40 px-6 py-4 text-[15px] font-extrabold text-white">
            📷 사진 접수
          </a>
        </div>
        <p
          className="mx-auto mt-3 max-w-3xl text-center text-[13px] font-semibold"
          style={{ color: "rgba(255,255,255,0.6)" }}>
          사진 한 장이면 수리 가능 여부 바로 안내드립니다
        </p>
      </section>

      {/* ────────────────────────────
          TRUST — 증명서 / 자격증
         ──────────────────────────── */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#fafafa" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="text-center">
              <p className="text-[15px] font-medium text-neutral-500">
                실력이 하느라 많이 답답하셨죠?
              </p>
              <h2 className="mt-2 text-[22px] font-black leading-[1.35] md:text-[28px]">
                파손 걱정 없는 정당한 수리
              </h2>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="mx-auto my-8 flex flex-col items-center">
              <div className="h-10 w-px bg-neutral-300" />
              <div className="mt-6 text-center">
                <p className="text-[20px] font-black md:text-[24px]">
                  본사 책임 제도로 스트레스
                </p>
                <p
                  className="mt-1 inline-block rounded-lg px-4 py-1.5 text-[20px] font-black md:text-[24px]"
                  style={{ background: "#d4f5c4", color: "#1a1a1a" }}>
                  싹- 다 잊으세요!
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="grid grid-cols-3 gap-3">
              {/* 증명서 1 */}
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                <div className="flex aspect-[3/4] items-center justify-center bg-neutral-100 p-3">
                  <Image
                    src="/images/cert-1.png"
                    alt="가입증명서"
                    width={300}
                    height={400}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
              {/* 증명서 2 */}
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                <div className="flex aspect-[3/4] items-center justify-center bg-neutral-100 p-3">
                  <Image
                    src="/images/cert-2.png"
                    alt="보험증서"
                    width={300}
                    height={400}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
              {/* 증명서 3 */}
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                <div className="flex aspect-[3/4] items-center justify-center bg-neutral-100 p-3">
                  <Image
                    src="/images/cert-3.png"
                    alt="사업자등록증"
                    width={300}
                    height={400}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ────────────────────────────
          3 SYMPTOMS — SELF CHECK
         ──────────────────────────── */}
      <section className="px-5 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-2 text-[13px] font-bold tracking-widest text-[#1a5cff]">
              SELF CHECK
            </p>
            <h2 className="text-[22px] font-black leading-[1.4] md:text-[28px]">
              이 중 하나라도 해당되면
              <br />
              <span className="text-[#e53e3e]">지금 바로 연락하세요</span>
            </h2>
          </FadeIn>

          <div className="mt-8 flex flex-col gap-3">
            {SYMPTOMS.map((s, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div
                  className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-[#e0e8f5] p-5"
                  style={{
                    background:
                      "linear-gradient(135deg, #f8faff 0%, #eef3ff 100%)",
                  }}>
                  <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                    {s.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[17px] font-extrabold">{s.title}</p>
                    <p className="mt-1 text-[13px] font-medium text-neutral-500">
                      {s.desc}
                    </p>
                  </div>
                  <div
                    className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-xs font-extrabold text-white"
                    style={{ background: i === 1 ? "#e53e3e" : "#1a5cff" }}>
                    !
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────
          STATS BANNER
         ──────────────────────────── */}
      <section
        className="px-5 py-12 text-center text-white md:py-16"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        }}>
        <FadeIn>
          <p
            className="mb-2 text-[13px] font-semibold tracking-widest"
            style={{ color: "rgba(255,255,255,0.4)" }}>
            TRACK RECORD
          </p>
          <p className="text-[44px] font-black tracking-tight md:text-[56px]">
            <span style={{ color: "#ffe066" }}>500</span>건+
          </p>
          <p
            className="mt-1 text-[15px] font-semibold"
            style={{ color: "rgba(255,255,255,0.6)" }}>
            매년 상부장 수리 시공 실적
          </p>

          <div className="mx-auto mt-8 flex max-w-xs justify-between">
            {[
              { n: "98%", l: "수리 성공률" },
              { n: "3년", l: "무상 A/S" },
              { n: "4.9", l: "고객 평점" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-[22px] font-black">{s.n}</p>
                <p
                  className="mt-1 text-[11px] font-semibold"
                  style={{ color: "rgba(255,255,255,0.45)" }}>
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ────────────────────────────
          URGENT — 우선 배정
         ──────────────────────────── */}
      <section className="px-5 py-14" style={{ background: "#fff7ed" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="relative rounded-2xl border-2 border-orange-200 bg-white p-7">
              <div className="absolute -top-3.5 left-5 rounded-full bg-[#e53e3e] px-4 py-1 text-[12px] font-extrabold text-white">
                ⚡ 우선 배정
              </div>
              <h3 className="mt-1 text-[19px] font-black leading-[1.45]">
                상부장은 떨어지면
                <br />
                <span className="text-[#e53e3e]">더 큰 문제</span>가 생깁니다
              </h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-neutral-600">
                그릇·가전 파손, 바닥 훼손, 부상 위험까지.
                <br />
                그래서{" "}
                <strong className="text-neutral-900">
                  상부장 수리 고객은 우선 배정
                </strong>
                으로 빠르게 방문합니다.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ────────────────────────────
          WHY US — 비교표
         ──────────────────────────── */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#f7f9fd" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-2 text-[13px] font-bold tracking-widest text-[#1a5cff]">
              WHY RE&apos;STORY
            </p>
            <h2 className="mb-8 text-[22px] font-black leading-[1.4] md:text-[28px]">
              왜 리스토리인가요?
            </h2>
          </FadeIn>

          <div className="flex flex-col gap-3">
            {WHY_US.map((item, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-[#e0e8f5]">
                  <div className="bg-[#1a5cff] p-4 text-white">
                    <p className="mb-1.5 text-[10px] font-bold tracking-wider opacity-60">
                      리스토리
                    </p>
                    <p className="text-[14px] font-bold">✓ {item.us}</p>
                  </div>
                  <div className="bg-neutral-100 p-4">
                    <p className="mb-1.5 text-[10px] font-bold tracking-wider text-neutral-400">
                      타사
                    </p>
                    <p className="text-[14px] font-semibold text-neutral-400">
                      ✗ {item.them}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────
          PROCESS — 절차
         ──────────────────────────── */}
      <section className="px-5 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-2 text-[13px] font-bold tracking-widest text-[#1a5cff]">
              PROCESS
            </p>
            <h2 className="mb-8 text-[22px] font-black leading-[1.4] md:text-[28px]">
              처음부터 끝까지 빠르게
            </h2>
          </FadeIn>

          <div className="grid grid-cols-2 gap-3">
            {PROCESS.map((p, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div
                  className="flex min-h-[148px] flex-col rounded-2xl border border-[#e0e8f5] p-5"
                  style={{
                    background: "linear-gradient(145deg, #f8faff, #eef3ff)",
                  }}>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[28px] font-black text-[#1a5cff] opacity-20">
                      {p.step}
                    </span>
                    <span className="text-[22px]">{p.icon}</span>
                  </div>
                  <p className="text-[16px] font-extrabold">{p.title}</p>
                  <p className="mt-2 whitespace-pre-line text-[12px] leading-[1.6] text-neutral-500">
                    {p.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────
          EXTRAS — 하부장 / 경첩 / 레일
         ──────────────────────────── */}
      <section className="px-5 py-14" style={{ background: "#f0f4ff" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-2 text-[13px] font-bold tracking-widest text-[#1a5cff]">
              PLUS SERVICE
            </p>
            <h2 className="text-[20px] font-black leading-[1.4]">
              방문 시 함께 가능합니다
            </h2>
            <p className="mb-7 mt-1 text-[13px] text-neutral-500">
              추가 출장비 없이 한 번에 해결
            </p>
          </FadeIn>

          <div className="flex flex-col gap-2.5">
            {EXTRAS.map((e, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="flex items-center gap-4 rounded-2xl border border-[#dce5f5] bg-white p-5">
                  <span className="flex-shrink-0 text-[26px]">{e.icon}</span>
                  <div>
                    <p className="text-[15px] font-extrabold">{e.title}</p>
                    <p className="mt-0.5 text-[12px] text-neutral-500">
                      {e.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────
          YOUTUBE
         ──────────────────────────── */}
      <section
        className="px-5 py-14 text-white md:py-20"
        style={{ background: "#1a1a1a" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p
              className="mb-2 text-[13px] font-bold tracking-widest"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              YOUTUBE
            </p>
            <h2 className="mb-6 text-[20px] font-black">
              실제 시공 영상을 확인하세요
            </h2>
          </FadeIn>

          <FadeIn delay={100}>
            {/* TODO: 실제 유튜브 영상 iframe 교체 */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-800 py-16">
              <div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                style={{ background: "rgba(255,255,255,0.1)" }}>
                <span className="ml-1 text-[28px]">▶</span>
              </div>
              <p
                className="text-[14px] font-semibold"
                style={{ color: "rgba(255,255,255,0.45)" }}>
                유튜브 영상 임베드 영역
              </p>
              <p
                className="mt-1 text-[11px]"
                style={{ color: "rgba(255,255,255,0.25)" }}>
                상부장 수리 실제 현장 시공 과정
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ────────────────────────────
          REVIEWS — 후기
         ──────────────────────────── */}
      <section className="px-5 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-2 text-[13px] font-bold tracking-widest text-[#1a5cff]">
              REVIEWS
            </p>
            <h2 className="text-[22px] font-black leading-[1.4]">
              실제 고객 후기
            </h2>
            <div className="mb-8 mt-2 flex items-center gap-2">
              <span className="text-[18px] text-amber-400">★★★★★</span>
              <span className="text-[20px] font-black">4.9</span>
              <span className="text-[13px] text-neutral-400">/ 5.0</span>
            </div>
          </FadeIn>

          <div className="flex flex-col gap-3">
            {REVIEWS.map((r, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="rounded-2xl border border-[#eaeffa] bg-[#fafbff] p-5">
                  <div className="mb-2.5 flex items-center justify-between">
                    <div>
                      <span className="text-[14px] font-extrabold">
                        {r.name}
                      </span>
                      <span className="ml-2 text-[12px] text-neutral-400">
                        {r.area}
                      </span>
                    </div>
                    <span className="text-[13px] text-amber-400">
                      {"★".repeat(r.rating)}
                    </span>
                  </div>
                  <p className="text-[14px] font-medium leading-[1.7] text-neutral-600">
                    {r.text}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────
          FAQ
         ──────────────────────────── */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#f7f9fd" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-2 text-[13px] font-bold tracking-widest text-[#1a5cff]">
              FAQ
            </p>
            <h2 className="mb-7 text-[22px] font-black">자주 묻는 질문</h2>
          </FadeIn>

          <div className="flex flex-col gap-2">
            {FAQ.map((f, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div className="overflow-hidden rounded-2xl border border-[#e0e8f5] bg-white">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}>
                    <span className="pr-3 text-[14px] font-bold text-neutral-900">
                      {f.q}
                    </span>
                    <span
                      className="flex-shrink-0 text-[16px] font-bold text-[#1a5cff] transition-transform duration-300"
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
                    <p className="border-t border-neutral-100 px-5 pb-5 pt-3 text-[13px] leading-[1.75] text-neutral-600">
                      {f.a}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────
          FINAL CTA
         ──────────────────────────── */}
      <section
        className="px-5 py-16 text-center text-white md:py-24"
        style={{
          background: "linear-gradient(150deg, #1a5cff 0%, #003ad6 100%)",
        }}>
        <FadeIn>
          <h2 className="text-[24px] font-black leading-[1.4] md:text-[32px]">
            상부장, 지금이
            <br />
            <span style={{ color: "#ffe066" }}>가장 저렴한</span> 타이밍입니다
          </h2>
          <p
            className="mt-3 text-[14px] leading-[1.7]"
            style={{ color: "rgba(255,255,255,0.7)" }}>
            사진 한 장이면 수리 가능 여부
            <br />
            바로 안내드립니다
          </p>

          <div className="mx-auto mt-8 flex max-w-xs flex-col gap-2.5">
            <a
              href={PHONE}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-[16px] font-extrabold text-[#1a5cff]">
              📞 전화 문의
            </a>
            <a
              href={KAKAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-[16px] font-extrabold"
              style={{ background: "#FEE500", color: "#1a1a1a" }}>
              💬 카카오톡 상담
            </a>
            <a
              href={PHOTO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/25 px-6 py-4 text-[15px] font-bold text-white"
              style={{ background: "rgba(255,255,255,0.12)" }}>
              📷 사진 접수
            </a>
          </div>

          <div className="mx-auto mt-7 flex flex-wrap justify-center gap-2">
            {["합판 시공목", "보양 처리", "집진기 사용", "3년 A/S"].map(
              (badge) => (
                <span
                  key={badge}
                  className="rounded-full px-3 py-1 text-[11px] font-semibold"
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

      {/* ────────────────────────────
          STICKY BOTTOM BAR
         ──────────────────────────── */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-3xl border-t border-neutral-200 px-4 pb-4 pt-3 transition-all duration-300"
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          opacity: showSticky ? 1 : 0,
          transform: showSticky ? "translateY(0)" : "translateY(100%)",
          pointerEvents: showSticky ? "auto" : "none",
        }}>
        <div className="flex gap-2">
          <a
            href={PHONE}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#1a5cff] px-4 py-3.5 text-[15px] font-extrabold text-white">
            📞 전화
          </a>
          <a
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-3.5 text-[15px] font-extrabold"
            style={{ background: "#FEE500", color: "#1a1a1a" }}>
            💬 카카오톡
          </a>
          <a
            href={PHOTO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-xl bg-neutral-100 px-4 py-3.5 text-[15px] font-extrabold text-neutral-900">
            📷
          </a>
        </div>
      </div>

      {/* spacer for sticky bar */}
      <div className="h-20" />
    </main>
  );
}
