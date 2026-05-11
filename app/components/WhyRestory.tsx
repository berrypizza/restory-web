"use client";

import FadeIn from "@/app/components/FadeIn";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_CHANGE_ME/chat";

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
    </svg>
  );
}

export default function WhyRestory() {
  return (
    <section style={{ backgroundColor: "#0d0d0d" }}>
      <div className="px-6 py-20 mx-auto max-w-3xl">
        <FadeIn delay={0}>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #2fae8a44" }}>
            <div className="px-7 py-7" style={{ background: "linear-gradient(135deg, #0a1a12 0%, #0d2018 100%)" }}>
              <p className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: "#2fae8a" }}>
                리스토리의 약속
              </p>
              <h3 className="font-black leading-snug mb-3" style={{ fontSize: "clamp(1.3rem, 3.5vw, 1.9rem)", color: "white" }}>
                위 4가지 중 하나라도 못 지키면
                <br />
                <span style={{ color: "#2fae8a" }}>출장비를 받지 않습니다.</span>
              </h3>
              <p className="text-base leading-relaxed" style={{ color: "#2fae8aaa" }}>
                광고 카피가 아닙니다. 실제로 지키지 못한 날은 청구하지 않습니다.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-2">
                {["📷 사진 1장 사전 진단", "💬 범위 먼저 공유", "✅ 불가 시 출장비 0원", "🛡 1년 무상 AS"].map((item, i) => (
                  <div key={i} className="rounded-xl px-3 py-2 text-sm font-bold" style={{ backgroundColor: "#2fae8a18", color: "#2fae8a", border: "1px solid #2fae8a33" }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="px-7 py-6" style={{ backgroundColor: "#0f0f0f", borderTop: "1px solid #1e1e1e" }}>
              <a
                href={KAKAO_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl py-4 font-black text-center transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#FEE500", color: "#191919", fontSize: "1.05rem" }}>
                <KakaoIcon />
                카카오로 직접 확인하기 →
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
