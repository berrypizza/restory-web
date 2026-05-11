import React from "react";
import FadeIn from "@/app/components/FadeIn";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_CHANGE_ME/chat";

const steps = [
  { num: "01", text: "가구 사진 1~3장 찍기" },
  { num: "02", text: "지역 + 증상 한 줄 남기기" },
  { num: "03", text: "가능하면 비용 범위, 불가능하면 이유 먼저 안내" },
];

const badges = ["수리 불가 시 출장비 없음", "AS 기간 1년 보장", "숨은 비용 없음"];

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
    </svg>
  );
}

export default function ContactCTA() {
  return (
    <section className="px-6 py-24" style={{ backgroundColor: "#0d0d0d" }}>
      <div className="mx-auto max-w-5xl">
        <FadeIn delay={0}>
          <div className="text-center mb-10">
            <span
              className="inline-block text-sm tracking-widest uppercase mb-5 px-3 py-1.5 rounded-full font-bold"
              style={{ backgroundColor: "#2fae8a22", color: "#2fae8a", border: "1px solid #2fae8a55" }}>
              Contact
            </span>
            <h2 className="font-black leading-tight" style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", color: "white" }}>
              방치할수록
              <br />
              <span style={{ color: "#ef4444" }}>교체 얘기가 나옵니다.</span>
            </h2>
            <p className="mt-6 font-semibold leading-relaxed" style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)", color: "#bbb" }}>
              작은 이상이 느껴질 때가
              <br />
              제일 싸게 고칠 수 있는 타이밍입니다.
            </p>
          </div>
        </FadeIn>

        {/* Steps */}
        <div className="grid gap-4 sm:grid-cols-3 mb-10">
          {steps.map((s, i) => (
            <FadeIn key={s.num} delay={i * 100}>
              <div
                className="rounded-2xl px-6 py-7 flex items-start gap-5"
                style={{
                  backgroundColor: i === 2 ? "#2fae8a18" : "#161616",
                  border: `1px solid ${i === 2 ? "#2fae8a55" : "#2a2a2a"}`,
                }}>
                <span className="text-4xl font-black leading-none select-none flex-shrink-0 mt-0.5" style={{ color: i === 2 ? "#2fae8a" : "#444" }}>
                  {s.num}
                </span>
                <p className="font-bold leading-snug pt-1" style={{ fontSize: "clamp(1rem, 2.2vw, 1.2rem)", color: "#f0f0f0" }}>
                  {s.text}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* 운영시간 */}
        <FadeIn delay={0}>
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ backgroundColor: "#1e1e1e", border: "1px solid #333" }}>
              <span style={{ color: "#2fae8a", fontSize: 14 }}>🕐</span>
              <span className="text-sm font-semibold" style={{ color: "#ddd" }}>매일 오전 9시 — 오후 9시 운영</span>
              <span className="inline-block h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: "#2fae8a" }} />
              <span className="text-sm font-bold" style={{ color: "#2fae8a" }}>지금 상담 가능</span>
            </div>
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0}>
          <div className="flex flex-col gap-3 mb-12 max-w-lg mx-auto">
            <a
              href={KAKAO_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 rounded-2xl py-5 font-black text-center transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#FEE500", color: "#191919", fontSize: "1.15rem" }}>
              <KakaoIcon />
              카카오톡으로 바로 상담하기
            </a>
            <div className="grid grid-cols-2 gap-3">
              <a href="/request" className="rounded-2xl px-5 py-4 text-white font-bold text-center transition-opacity hover:opacity-90" style={{ backgroundColor: "#2fae8a", fontSize: "0.95rem" }}>
                📷 사진 문자 상담
              </a>
              <a href="tel:01000000000" className="rounded-2xl px-5 py-4 font-bold text-center transition-opacity hover:opacity-70" style={{ border: "1px solid #333", color: "#f0f0f0", backgroundColor: "#161616", fontSize: "0.95rem" }}>
                📞 전화 문의
              </a>
            </div>
          </div>
        </FadeIn>

        {/* 배지 */}
        <FadeIn delay={80}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {badges.map((b, i) => (
              <React.Fragment key={b}>
                <span className="flex items-center gap-2 text-base font-semibold" style={{ color: "#bbb" }}>
                  <span className="h-2 w-2 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: "#2fae8a" }} />
                  {b}
                </span>
                {i < badges.length - 1 && <span className="hidden sm:block" style={{ color: "#333" }}>·</span>}
              </React.Fragment>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
