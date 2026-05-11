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
    <section className="relative overflow-hidden" style={{ minHeight: "100svh", backgroundColor: "#ffffff" }}>
      <div className="absolute bottom-0 left-0 right-0 z-20 mx-auto max-w-3xl px-6 pb-20 md:pb-24 text-center">
        <FadeIn delay={0}>
          <p className="text-sm font-medium tracking-widest uppercase mb-6" style={{ color: "#aaa", letterSpacing: "0.2em" }}>
            Re&apos;Story Furniture Repair
          </p>
        </FadeIn>

        <FadeIn delay={120}>
          <h1
            className="font-black leading-[1.08] tracking-tight"
            style={{ fontSize: "clamp(2.4rem, 7vw, 4.5rem)", color: "#1a1a1a" }}>
            고칠 수 있는 가구를
            <br />
            버리지 마세요.
          </h1>
        </FadeIn>

        <FadeIn delay={240}>
          <p className="mt-6 leading-relaxed" style={{ fontSize: "clamp(1rem, 2.2vw, 1.2rem)", color: "#888" }}>
            사진 한 장이면 수리 가능 여부,
            <br />
            비용 범위까지 바로 안내드립니다.
          </p>
        </FadeIn>

        <FadeIn delay={360}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center max-w-md mx-auto">
            <a
              href={KAKAO_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2.5 rounded-xl px-8 py-4 font-bold text-center transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#FEE500", color: "#1a1a1a", fontSize: "1rem" }}>
              <KakaoIcon />
              카카오로 사진 보내기
            </a>
            <a
              href="tel:01000000000"
              className="flex items-center justify-center rounded-xl px-6 py-4 font-semibold transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#fafafa", border: "1px solid #e5e5e5", color: "#1a1a1a", fontSize: "1rem" }}>
              📞 전화 문의
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={480}>
          <div className="mt-10 flex justify-center items-center gap-2 text-sm font-medium" style={{ color: "#ccc" }}>
            <span className="animate-bounce inline-block">↓</span>
            <span>아래에서 직접 확인하세요</span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
