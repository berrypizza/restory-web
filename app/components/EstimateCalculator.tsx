"use client";

import { useState } from "react";
import FadeIn from "@/app/components/FadeIn";

// TODO: 실제 수리 항목과 가격으로 교체
type OptionType = "fixed" | "count";

interface Category {
  id: string;
  label: string;
  icon: string;
  group: string;
  type: OptionType;
  fixedPrice?: number;
  fixedNote?: string;
  baseCount?: number;
  basePrice?: number;
  addPrice?: number;
  addUnit?: string;
  maxCount?: number;
}

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
      {/* 진행 바 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className="h-1.5 flex-1 rounded-full transition-all duration-300" style={{ backgroundColor: step >= s ? "#2fae8a" : "#2a2a2a" }} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div>
          <h3 className="font-black mb-6" style={{ fontSize: "clamp(1.3rem, 3vw, 1.7rem)", color: "white" }}>
            어떤 가구를 수리하시나요?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {groups.map((group) => (
              <button key={group} onClick={() => { setSelectedGroup(group); setStep(2); }}
                className="rounded-2xl p-5 text-center transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: "#1e1e1e", border: "1px solid #2a2a2a" }}>
                <div className="mb-3 text-3xl">{categories.find((c) => c.group === group)?.icon}</div>
                <span className="text-sm font-bold" style={{ color: "white" }}>{group}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 text-base font-semibold mb-5" style={{ color: "#aaa" }}>← 이전으로</button>
          <h3 className="font-black mb-6" style={{ fontSize: "clamp(1.3rem, 3vw, 1.7rem)", color: "white" }}>{selectedGroup} 수리</h3>
          <div className="flex flex-col gap-3">
            {categories.filter((c) => c.group === selectedGroup).map((c) => (
              <button key={c.id} onClick={() => { setSelectedId(c.id); setCount(c.baseCount ?? 1); setStep(3); }}
                className="flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: "#1e1e1e", border: "1px solid #2a2a2a" }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.icon}</span>
                  <span className="text-base font-bold" style={{ color: "white" }}>{c.label}</span>
                </div>
                <span style={{ color: "#aaa" }}>→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && cat && (
        <div>
          <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 text-base font-semibold mb-5" style={{ color: "#aaa" }}>← 이전으로</button>
          {cat.type === "count" && (
            <div className="flex items-center justify-between rounded-2xl p-3 mb-6" style={{ backgroundColor: "#141414", border: "1px solid #2a2a2a" }}>
              <button onClick={() => setCount(Math.max(cat.baseCount ?? 1, count - 1))}
                className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-black"
                style={{ backgroundColor: "#1e1e1e", color: "white", border: "1px solid #333" }}>−</button>
              <div className="text-center">
                <div className="text-4xl font-black" style={{ color: "white" }}>{count}</div>
                <div className="mt-1 text-sm" style={{ color: "#bbb" }}>{cat.addUnit || "개"}</div>
              </div>
              <button onClick={() => setCount(Math.min(cat.maxCount ?? 20, count + 1))}
                className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-black"
                style={{ backgroundColor: "#2fae8a", color: "white" }}>+</button>
            </div>
          )}
          <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, #0a1a12 0%, #0d1f17 100%)", border: "1px solid #2fae8a44" }}>
            <p className="text-sm font-bold mb-2" style={{ color: "#2fae8a" }}>예상 수리 비용</p>
            <span className="font-black" style={{ fontSize: "clamp(2.2rem, 6vw, 3rem)", color: "#2fae8a" }}>
              {total > 0 ? formatPrice(total) : "—"}
            </span>
            <p className="text-base leading-relaxed mt-3" style={{ color: "#bbb" }}>{breakdown}</p>
          </div>
          <div className="flex flex-col gap-3 mt-5">
            <a href="/request" className="w-full rounded-2xl py-5 text-center font-black text-white" style={{ backgroundColor: "#2fae8a" }}>
              상담 신청하고 정확한 견적 받기 →
            </a>
            <button onClick={reset} className="w-full rounded-2xl py-4 text-sm font-bold" style={{ backgroundColor: "#141414", color: "#aaa", border: "1px solid #2a2a2a" }}>
              처음부터 다시 계산하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EstimateCalculator() {
  return (
    <section className="px-6 py-16" style={{ backgroundColor: "#111" }}>
      <div className="mx-auto max-w-2xl">
        <FadeIn delay={0}>
          <div className="mb-8 text-center">
            <span className="inline-block text-sm tracking-widest uppercase mb-4 px-3 py-1.5 rounded-full font-bold" style={{ backgroundColor: "#2fae8a22", color: "#2fae8a", border: "1px solid #2fae8a55" }}>
              🧮 무료 견적 계산기
            </span>
            <h2 className="font-black leading-tight" style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", color: "white" }}>
              내 가구,
              <br />
              <span style={{ color: "#2fae8a" }}>얼마면 고칠 수 있을까?</span>
            </h2>
          </div>
        </FadeIn>
        <FadeIn delay={80}>
          <div className="rounded-2xl px-6 py-8" style={{ backgroundColor: "#161616", border: "1px solid #2fae8a33" }}>
            <Calculator />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
