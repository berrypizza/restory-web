"use client";

import { useState } from "react";
import FadeIn from "@/app/components/FadeIn";

type OptionType = "fixed" | "count";

interface Category {
  id: string; label: string; icon: string; group: string; type: OptionType;
  fixedPrice?: number; fixedNote?: string;
  baseCount?: number; basePrice?: number; addPrice?: number; addUnit?: string; maxCount?: number;
}

// TODO: 실제 항목/가격으로 교체
const categories: Category[] = [
  { id: "example_1", label: "항목 예시 1", icon: "🔨", group: "예시 그룹 A", type: "fixed", fixedPrice: 50000 },
  { id: "example_2", label: "항목 예시 2", icon: "🔧", group: "예시 그룹 A", type: "count", baseCount: 1, basePrice: 50000, addPrice: 10000, addUnit: "개", maxCount: 10 },
  { id: "example_3", label: "항목 예시 3", icon: "🛋️", group: "예시 그룹 B", type: "fixed", fixedPrice: 80000 },
];

const groups = Array.from(new Set(categories.map((c) => c.group)));

function formatPrice(p: number) {
  if (p >= 10000) return `${(p / 10000).toFixed(p % 10000 === 0 ? 0 : 1)}만원`;
  return `${p.toLocaleString()}원`;
}

function Calculator() {
  const [step, setStep] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [count, setCount] = useState(1);
  const cat = categories.find((c) => c.id === selectedId);

  const calcPrice = () => {
    if (!cat) return { total: 0, breakdown: "" };
    if (cat.type === "fixed") return { total: cat.fixedPrice!, breakdown: `정찰가 ${formatPrice(cat.fixedPrice!)}` };
    const extra = Math.max(0, count - cat.baseCount!) * cat.addPrice!;
    return { total: cat.basePrice! + extra, breakdown: `기본 ${formatPrice(cat.basePrice!)} + 추가 ${formatPrice(extra)}` };
  };

  const { total, breakdown } = calcPrice();
  const reset = () => { setStep(1); setSelectedGroup(null); setSelectedId(null); setCount(1); };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ backgroundColor: step >= s ? "#1a1a1a" : "#e5e5e5" }} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div>
          <h3 className="font-black mb-6" style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "#1a1a1a" }}>
            어떤 가구를 수리하시나요?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {groups.map((group) => (
              <button key={group} onClick={() => { setSelectedGroup(group); setStep(2); }}
                className="rounded-2xl p-5 text-center transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: "#fff", border: "1px solid #e5e5e5" }}>
                <div className="mb-3 text-3xl">{categories.find((c) => c.group === group)?.icon}</div>
                <span className="text-sm font-bold" style={{ color: "#1a1a1a" }}>{group}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <button onClick={() => setStep(1)} className="text-sm font-semibold mb-5" style={{ color: "#aaa" }}>← 이전</button>
          <h3 className="font-black mb-6" style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "#1a1a1a" }}>{selectedGroup}</h3>
          <div className="flex flex-col gap-3">
            {categories.filter((c) => c.group === selectedGroup).map((c) => (
              <button key={c.id} onClick={() => { setSelectedId(c.id); setCount(c.baseCount ?? 1); setStep(3); }}
                className="flex w-full items-center justify-between rounded-xl px-5 py-4 text-left transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: "#fff", border: "1px solid #e5e5e5" }}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{c.icon}</span>
                  <span className="text-sm font-bold" style={{ color: "#1a1a1a" }}>{c.label}</span>
                </div>
                <span style={{ color: "#ccc" }}>→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && cat && (
        <div>
          <button onClick={() => setStep(2)} className="text-sm font-semibold mb-5" style={{ color: "#aaa" }}>← 이전</button>
          {cat.type === "count" && (
            <div className="flex items-center justify-between rounded-xl p-3 mb-6" style={{ backgroundColor: "#fff", border: "1px solid #e5e5e5" }}>
              <button onClick={() => setCount(Math.max(cat.baseCount ?? 1, count - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-xl font-bold"
                style={{ backgroundColor: "#f5f5f5", color: "#1a1a1a" }}>−</button>
              <div className="text-center">
                <div className="text-3xl font-black" style={{ color: "#1a1a1a" }}>{count}</div>
                <div className="mt-1 text-xs" style={{ color: "#aaa" }}>{cat.addUnit || "개"}</div>
              </div>
              <button onClick={() => setCount(Math.min(cat.maxCount ?? 20, count + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-xl font-bold"
                style={{ backgroundColor: "#1a1a1a", color: "white" }}>+</button>
            </div>
          )}
          <div className="rounded-2xl p-6" style={{ backgroundColor: "#fafafa", border: "1px solid #e5e5e5" }}>
            <p className="text-xs font-medium mb-2" style={{ color: "#aaa" }}>예상 수리 비용</p>
            <span className="font-black" style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", color: "#1a1a1a" }}>
              {total > 0 ? formatPrice(total) : "—"}
            </span>
            <p className="text-sm mt-3" style={{ color: "#888" }}>{breakdown}</p>
          </div>
          <div className="flex flex-col gap-3 mt-5">
            <a href="/request" className="w-full rounded-xl py-4 text-center font-bold text-white" style={{ backgroundColor: "#1a1a1a" }}>
              상담 신청하기 →
            </a>
            <button onClick={reset} className="w-full rounded-xl py-3 text-sm font-semibold" style={{ backgroundColor: "#f5f5f5", color: "#888", border: "1px solid #e5e5e5" }}>
              처음부터 다시
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EstimateCalculator() {
  return (
    <section className="px-6 py-24" style={{ backgroundColor: "#ffffff" }}>
      <div className="mx-auto max-w-xl">
        <FadeIn delay={0}>
          <div className="mb-10 text-center">
            <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: "#aaa", letterSpacing: "0.15em" }}>
              Estimate
            </p>
            <h2 className="font-black leading-tight" style={{ fontSize: "clamp(1.6rem, 4.5vw, 2.4rem)", color: "#1a1a1a" }}>
              얼마면 고칠 수 있을까?
            </h2>
          </div>
        </FadeIn>
        <FadeIn delay={80}>
          <div className="rounded-2xl px-6 py-8" style={{ backgroundColor: "#fafafa", border: "1px solid #e5e5e5" }}>
            <Calculator />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
