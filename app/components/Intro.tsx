import FadeIn from "@/app/components/FadeIn";

export default function Intro() {
  const cardStyle = { backgroundColor: "#1e1e1e", border: "1px solid #2a2a2a" };
  const valueStyle: React.CSSProperties = { color: "#2fae8a", fontSize: "2.4rem", fontWeight: 900, lineHeight: 1 };

  const yesSet = [
    "기사가 오더니 '이거 교체하는 게 낫겠어요'라고 했다",
    "수리비가 끝나고 나서 처음 말보다 훨씬 많이 나왔다",
    "나중에 알고 보니 고칠 수 있는 가구였다 — 맞죠?",
  ];

  const stats = [
    { label: "월 평균 출장 수리", value: "100+", unit: "건" },
    { label: "고객 평점", value: "4.9", unit: "/ 5.0 ★" },
    { label: "누적 고객 후기", value: "1,000+", unit: "건" },
  ];

  return (
    <section className="flex flex-col items-center justify-center px-6 py-20" style={{ backgroundColor: "#111" }}>
      <div className="max-w-[760px] w-full text-center">
        {/* YES-SET */}
        <div className="flex flex-col gap-5 mb-12">
          {yesSet.map((text, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div
                className="rounded-2xl px-6 py-5 text-left"
                style={{
                  backgroundColor: i === 2 ? "#1a2e27" : "#1a1a1a",
                  border: `1px solid ${i === 2 ? "#2fae8a44" : "#252525"}`,
                }}>
                <p className="font-bold leading-snug" style={{
                  fontSize: "clamp(1.2rem, 3.5vw, 1.5rem)",
                  color: i === 2 ? "#2fae8a" : "rgba(255,255,255,0.85)",
                }}>
                  {i < 2 ? `✓ ${text}` : `→ ${text}`}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* 브랜드 소개 */}
        <FadeIn delay={0}>
          <div className="mb-10 text-center">
            <p className="font-black leading-snug" style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", color: "white" }}>
              제조사 구조를 아는 기사가
              <br />
              <span style={{ color: "#2fae8a" }}>직접 고칩니다.</span>
            </p>
            <p className="mt-5 mx-auto max-w-lg text-lg leading-relaxed" style={{ color: "#bbb" }}>
              재질, 조립 구조, 어디서 균열이 생기는지까지 압니다.
              <br />
              그냥 고치는 것과 <strong style={{ color: "white" }}>결과가 다른 이유</strong>가 여기 있습니다.
            </p>
          </div>
        </FadeIn>

        {/* 숫자 지표 */}
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((item, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="flex flex-col items-center justify-center rounded-2xl px-5 py-7 text-center" style={cardStyle}>
                <div className="text-base font-bold mb-3" style={{ color: "#aaa" }}>{item.label}</div>
                <div style={valueStyle}>{item.value}</div>
                <div className="mt-2 text-base font-semibold" style={{ color: "#2fae8a" }}>{item.unit}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
