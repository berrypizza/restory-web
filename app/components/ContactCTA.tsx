import React from "react";
import FadeIn from "@/app/components/FadeIn";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_aHYsX/chat";

const steps = [
  { num: "01", text: "가구 사진 1~3장 찍기" },
  { num: "02", text: "지역 + 증상 간단히 적기" },
  { num: "03", text: "가능 일정 · 비용 범위 안내" },
];

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
    </svg>
  );
}

export default function ContactCTA() {
  return (
    <section className="px-6 py-24" style={{ backgroundColor: "#fafafa" }}>
      <div className="mx-auto max-w-3xl">
        <FadeIn delay={0}>
          <div className="text-center mb-12">
            <p
              className="text-sm font-medium tracking-widest uppercase mb-4"
              style={{ color: "#aaa", letterSpacing: "0.15em" }}>
              Contact
            </p>
            <h2
              className="font-black leading-tight"
              style={{
                fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
                color: "#1a1a1a",
              }}>
              우리 가구에 이상을 느꼈다면
              <br />
              오늘 쉽게 고칠 수 있는
              <br />
              타이밍입니다
            </h2>
          </div>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-3 mb-12">
          {steps.map((s, i) => (
            <FadeIn key={s.num} delay={i * 100}>
              <div
                className="rounded-2xl px-6 py-6 flex items-start gap-4"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e5e5",
                }}>
                <span
                  className="text-3xl font-black leading-none select-none flex-shrink-0 mt-0.5"
                  style={{ color: "#e5e5e5" }}>
                  {s.num}
                </span>
                <p
                  className="font-semibold leading-snug pt-1"
                  style={{
                    fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                    color: "#444",
                  }}>
                  {s.text}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0}>
          <div className="flex flex-col gap-3 max-w-md mx-auto">
            <a
              href={KAKAO_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 rounded-xl py-4 font-bold text-center transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "#FEE500",
                color: "#1a1a1a",
                fontSize: "1.05rem",
              }}>
              <KakaoIcon />
              카카오톡으로 바로 상담하기
            </a>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://blog.naver.com/sofaresq/224129090889"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl px-5 py-3.5 font-bold text-center text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#1a1a1a", fontSize: "0.9rem" }}>
                📷 사진 접수
              </a>
              <a
                href="tel:010-9127-3024"
                className="rounded-xl px-5 py-3.5 font-semibold text-center transition-opacity hover:opacity-80"
                style={{
                  border: "1px solid #e5e5e5",
                  color: "#444",
                  backgroundColor: "#fff",
                  fontSize: "0.9rem",
                }}>
                📞 전화 문의
              </a>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={80}>
          <div className="flex items-center justify-center gap-6 mt-10">
            {["수리 불가 시 출장비 없음", "1년 무상 AS", "추가 비용 없음"].map(
              (b, i) => (
                <React.Fragment key={b}>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "#aaa" }}>
                    {b}
                  </span>
                  {i < 2 && <span style={{ color: "#e5e5e5" }}>·</span>}
                </React.Fragment>
              ),
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
