import FadeIn from "@/app/components/FadeIn";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_CHANGE_ME/chat";

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
    </svg>
  );
}

export default function HookIntro() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "100svh" }}>
      {/* TODO: 배경 이미지 교체 */}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: "#1a1a1a" }}
      />
      <div
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.97) 100%)",
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 z-20 mx-auto max-w-5xl px-6 pb-14 md:pb-16">
        <FadeIn delay={0}>
          <div className="mb-7">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
              style={{
                backgroundColor: "#44ef7718",
                border: "1px solid #00ffa297",
                color: "#00ffa2",
              }}>
              리스토리 가구수리
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={120}>
          <h1
            className="font-black leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(2.8rem, 7.5vw, 5.5rem)", color: "white" }}>
            고칠 수 있는 가구를
            <br />
            <span style={{ color: "#00ffa2" }}>버리셨나요?</span>
            <br />
            <span style={{ color: "white", fontSize: "clamp(1.9rem, 3.5vw, 2.4rem)", fontWeight: 700 }}>
              사진 한 장이면 충분합니다
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={240}>
          <div className="mt-6 max-w-lg">
            <p className="font-bold mb-3" style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", color: "rgba(255,255,255,0.82)" }}>
              ✓ 사진 상담 → 수리 가능 여부 즉시 안내
            </p>
            <p className="font-medium leading-relaxed" style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", color: "rgba(255,255,255,0.72)" }}>
              <span style={{ color: "#00ffa2", fontWeight: 800 }}>3분이면 확인됩니다.</span>
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={360}>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row max-w-lg">
            <a
              href={KAKAO_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2.5 rounded-2xl px-8 py-5 font-black text-center transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#FEE500", color: "#191919", fontSize: "1.1rem" }}>
              <KakaoIcon />
              카카오로 사진 보내기
            </a>
            <a
              href="tel:01000000000"
              className="sm:w-auto flex items-center justify-center rounded-2xl px-6 py-5 font-bold transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "white",
                fontSize: "1rem",
                backdropFilter: "blur(8px)",
              }}>
              📞 전화 문의
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={480}>
          <div className="mt-8 flex w-fit items-center gap-2 text-base font-semibold" style={{ color: "rgba(255,255,255,0.64)" }}>
            <span className="animate-bounce inline-block">↓</span>
            <span>왜 다른지 직접 확인해보세요</span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
