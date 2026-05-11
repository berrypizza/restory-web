import FadeIn from "@/app/components/FadeIn";

const rows = [
  { label: "사전 진단", other: "X\n일단 와봐야 알아요", ours: "O\n사진 1장으로 먼저 판단", highlight: false },
  { label: "수리 불가 시\n출장비", other: "청구", ours: "0원", highlight: false },
  { label: "견적 투명성", other: "현장서\n추가 발생", ours: "표준 단가 공개\n숨은 비용 없음", highlight: false },
  { label: "AS 보장", other: "X\n수리 후 연락 두절", ours: "1년 무상 AS", highlight: true },
  { label: "누적 후기", other: "후기 없음\n(0건)", ours: "1,000건+\n4.9★", highlight: true },
];

export default function CompareTable() {
  return (
    <section className="px-6 py-24" style={{ backgroundColor: "#ffffff" }}>
      <div className="mx-auto max-w-2xl">
        <FadeIn delay={0}>
          <div className="text-center mb-12">
            <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: "#aaa", letterSpacing: "0.15em" }}>
              Compare
            </p>
            <h2 className="font-black leading-tight" style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", color: "#1a1a1a" }}>
              어디에 맡기느냐에 따라
              <br />
              결과가 다릅니다.
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={80}>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #e5e5e5" }}>
            <div className="grid grid-cols-[1fr_auto_1fr]">
              <div className="px-5 py-4 text-center" style={{ backgroundColor: "#f5f5f5" }}>
                <p className="text-sm font-bold" style={{ color: "#aaa" }}>일반 업체</p>
              </div>
              <div className="flex items-center justify-center px-4" style={{ backgroundColor: "#fafafa", borderLeft: "1px solid #e5e5e5", borderRight: "1px solid #e5e5e5" }}>
                <p className="text-xs font-bold tracking-widest" style={{ color: "#ccc" }}>VS</p>
              </div>
              <div className="px-5 py-4 text-center" style={{ backgroundColor: "#1a1a1a" }}>
                <p className="text-sm font-bold" style={{ color: "white" }}>Re&apos;Story</p>
              </div>
            </div>

            {rows.map((row, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_1fr]" style={{ borderTop: "1px solid #eee" }}>
                <div className="px-5 py-5 flex items-center justify-center text-center" style={{ backgroundColor: "#fafafa" }}>
                  <p className="text-sm font-semibold whitespace-pre-line leading-snug" style={{ color: row.other.startsWith("X") ? "#dc2626" : "#aaa" }}>
                    {row.other}
                  </p>
                </div>
                <div className="flex items-center justify-center px-4 py-5 text-center" style={{ backgroundColor: "#fff", borderLeft: "1px solid #eee", borderRight: "1px solid #eee", minWidth: "6rem" }}>
                  <p className="text-xs font-semibold leading-snug whitespace-pre-line" style={{ color: "#aaa" }}>{row.label}</p>
                </div>
                <div className="px-5 py-5 flex items-center justify-center text-center" style={{ backgroundColor: row.highlight ? "#fafafa" : "#fff" }}>
                  <p className="text-sm font-black whitespace-pre-line leading-snug" style={{ color: "#1a1a1a" }}>
                    {row.ours}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
