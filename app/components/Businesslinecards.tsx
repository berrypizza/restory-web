import Image from "next/image";
import Link from "next/link";
import { businessLines, type BusinessLineId } from "@/lib/site-config";

const iconMap: Record<BusinessLineId, string> = {
  repair: "/images/icon_sink_repair.png",
  kitchen: "/images/icon_sink_reform.png",
  leather: "/images/icon_leather.png",
  sofa: "/images/icon_sofa.png",
};

const cardData: Record<BusinessLineId, { desc: string; cta: string }> = {
  repair: {
    desc: "상부장 · 하부장 · 경첩 · 서랍레일\n당일 출장으로 바로 수리해드려요",
    cta: "사진으로 확인하기 ›",
  },
  kitchen: {
    desc: "문짝만 교체해도 새 주방!\n전체 리모델링의 1/5 비용",
    cta: "리폼 견적 확인하기 ›",
  },
  leather: {
    desc: "식당 · 카페 · 사무실 의자\n대량 천갈이 하루 완료",
    cta: "천갈이 단가 확인 ›",
  },
  sofa: {
    desc: "꺼진 소파, 버리지 마세요\n내부 보강으로 새것처럼",
    cta: "복원 가능 여부 확인 ›",
  },
};

export default function BusinessLineCards() {
  return (
    <section className="bg-white px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto max-w-5xl">
        <h2
          className="mb-7 text-xl font-black tracking-tight md:text-2xl"
          style={{ color: "#111827" }}>
          리스토리 서비스 라인업!
        </h2>

        {/* ── 데스크탑 ── */}
        <div className="hidden md:grid grid-cols-3 gap-4">
          {businessLines.map((line, i) => (
            <Link
              key={line.id}
              href={line.href}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl transition hover:shadow-lg"
              style={{
                backgroundColor: "#f8f9fc",
                border: "1px solid #eef1f6",
                minHeight: i < 3 ? 220 : 180,
              }}>
              {/* 상단: 텍스트 + 아이콘 */}
              <div className="relative flex-1 p-6">
                <div className="max-w-[60%]">
                  <h3
                    className="text-lg font-black mb-2"
                    style={{ color: "#111827" }}>
                    {line.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed whitespace-pre-line"
                    style={{ color: "#64748b" }}>
                    {cardData[line.id].desc}
                  </p>
                </div>

                <Image
                  src={iconMap[line.id]}
                  alt={line.title}
                  width={130}
                  height={130}
                  className="absolute right-4 bottom-0 object-contain group-hover:scale-105 transition-transform"
                  style={{ width: 120, height: 120 }}
                />
              </div>

              {/* 하단 CTA */}
              <div
                className="px-6 py-3.5"
                style={{ borderTop: "1px solid #eef1f6" }}>
                <span
                  className="text-sm font-bold"
                  style={{ color: "#1f66ff" }}>
                  {cardData[line.id].cta}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* ── 모바일: 2열 ── */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {businessLines.map((line) => (
            <Link
              key={line.id}
              href={line.href}
              className="relative overflow-hidden rounded-2xl"
              style={{
                backgroundColor: "#f8f9fc",
                border: "1px solid #eef1f6",
                minHeight: 150,
              }}>
              {/* 아이콘 — 오른쪽 위, 크게 */}
              <div className="flex justify-end px-3 pt-3">
                <Image
                  src={iconMap[line.id]}
                  alt={line.title}
                  width={80}
                  height={80}
                  className="object-contain"
                  style={{ width: 72, height: 72 }}
                />
              </div>

              {/* 텍스트 — 왼쪽 아래 */}
              <div className="px-4 pb-4 pt-1">
                <h3
                  className="text-[15px] font-black mb-1"
                  style={{ color: "#111827" }}>
                  {line.title}
                </h3>
                <p className="text-xs" style={{ color: "#94a3b8" }}>
                  {line.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* 서비스 전체보기 */}
        {/* <div className="mt-8 flex justify-center">
          <Link
            href="/repair"
            className="rounded-xl px-8 py-3.5 text-sm font-bold transition hover:bg-gray-50"
            style={{
              color: "#111827",
              border: "1px solid #d1d5db",
              backgroundColor: "#ffffff",
            }}>
            서비스 전체보기
          </Link>
        </div> */}
      </div>
    </section>
  );
}
