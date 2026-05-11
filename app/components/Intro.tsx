import FadeIn from "@/app/components/FadeIn";

export default function Intro() {
  const stats = [
    { label: "월 평균 출장 수리", value: "100+", unit: "건" },
    { label: "고객 평점", value: "4.9", unit: "/ 5.0 ★" },
    { label: "누적 고객 후기", value: "1,000+", unit: "건" },
  ];

  return (
    <section className="flex flex-col items-center justify-center px-6 py-24" style={{ backgroundColor: "#fafafa" }}>
      <div className="max-w-[680px] w-full text-center">
        <FadeIn delay={0}>
          <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: "#aaa", letterSpacing: "0.15em" }}>
            About
          </p>
          <h2 className="font-black leading-tight" style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", color: "#1a1a1a" }}>
            구조를 아는 사람이
            <br />
            직접 고칩니다.
          </h2>
          <p className="mt-5 mx-auto max-w-lg text-base leading-relaxed" style={{ color: "#888" }}>
            재질, 조립 구조, 어디서 균열이 생기는지까지 압니다.
            <br />
            그냥 고치는 것과 결과가 다른 이유가 여기 있습니다.
          </p>
        </FadeIn>

        <div className="grid w-full grid-cols-3 gap-4 mt-14">
          {stats.map((item, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="flex flex-col items-center justify-center rounded-2xl px-4 py-7 text-center"
                style={{ backgroundColor: "#ffffff", border: "1px solid #eee" }}>
                <div className="text-xs font-medium mb-3" style={{ color: "#aaa" }}>{item.label}</div>
                <div className="font-black" style={{ fontSize: "2rem", color: "#1a1a1a", lineHeight: 1 }}>{item.value}</div>
                <div className="mt-2 text-sm font-medium" style={{ color: "#888" }}>{item.unit}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
