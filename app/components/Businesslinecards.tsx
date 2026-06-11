import Image from "next/image";
import Link from "next/link";
import { businessLines, type BusinessLineId } from "@/lib/site-config";

const iconMap: Record<BusinessLineId, string> = {
  repair: "/images/icon_sink_repair.png",
  kitchen: "/images/icon_sink_reform.png",
  leather: "/images/icon_leather.png",
  sofa: "/images/icon_sofa.png",
};

const cardData: Record<
  BusinessLineId,
  { desc: string; cta: string; badge: string }
> = {
  repair: {
    desc: "문짝 처짐·물먹음\n당일 출장 바로 해결",
    cta: "견적 확인",
    badge: "당일 완료",
  },
  kitchen: {
    desc: "문짝만 바꿔도 새 주방\n전체 교체의 20% 비용",
    cta: "견적 확인",
    badge: "교체비 1/5~",
  },
  leather: {
    desc: "식당·카페 의자 대량\n영업 중 작업 가능",
    cta: "단가 확인",
    badge: "개당 3만원~",
  },
  sofa: {
    desc: "꺼진 소파 버리지 말고\n내부 보강으로 복원",
    cta: "복원 확인",
    badge: "새 소파 1/10",
  },
};

const compareData = [
  { label: "싱크대 전체 교체", price: "200~400만원", isExpensive: true },
  { label: "리스토리 리폼", price: "40~80만원", isExpensive: false },
  { label: "소파 새 구매", price: "100~300만원", isExpensive: true },
  { label: "리스토리 복원", price: "15~30만원", isExpensive: false },
];

export default function BusinessLineCards() {
  return (
    <section className="bg-white px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-5xl">
        {/* 헤더 */}
        <div className="mb-6">
          <p className="mb-1 text-[11px] font-semibold tracking-widest text-[#1f66ff] uppercase">
            SERVICES
          </p>
          <h2 className="text-[22px] font-black text-gray-900 md:text-3xl">
            리스토리 서비스 라인업
          </h2>
        </div>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {businessLines.map((line) => {
            const data = cardData[line.id];
            const icon = iconMap[line.id];

            return (
              <Link
                key={line.id}
                href={line.href}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(31,102,255,0.12)]"
                style={{
                  minHeight: 172,
                  textDecoration: "none",
                  border: "1.5px solid #eef0f5",
                }}>
                {/* 뱃지 */}
                <span
                  className="absolute right-3 top-3 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{
                    background: "rgba(31,102,255,0.08)",
                    color: "#1f66ff",
                  }}>
                  {data.badge}
                </span>

                {/* 아이콘 */}
                <div
                  className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{ background: "rgba(31,102,255,0.06)" }}>
                  <Image
                    src={icon}
                    alt={line.title}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>

                {/* 텍스트 */}
                <div className="flex-1">
                  <h3 className="mb-1 text-[15px] font-black text-gray-900">
                    {line.title}
                  </h3>
                  <p className="whitespace-pre-line text-[12px] leading-[1.65] text-gray-500">
                    {data.desc}
                  </p>
                </div>

                {/* CTA */}
                <div className="mt-3 flex items-center gap-0.5">
                  <span className="text-[12px] font-bold text-[#1f66ff]">
                    {data.cta}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1f66ff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 비교 섹션 */}
        <div
          className="mt-5 rounded-2xl p-5"
          style={{
            background: "rgba(31,102,255,0.04)",
            border: "1.5px solid rgba(31,102,255,0.1)",
          }}>
          <p className="mb-4 text-[13px] font-black text-gray-900">
            왜 리스토리인가
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {compareData.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-2">
                <span className="shrink-0 text-[12px] text-gray-500">
                  {item.label}
                </span>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold"
                  style={
                    item.isExpensive
                      ? { background: "#FEECEC", color: "#C0392B" }
                      : { background: "rgba(31,102,255,0.1)", color: "#1f66ff" }
                  }>
                  {item.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
