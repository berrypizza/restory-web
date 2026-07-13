import Link from "next/link";
import Image from "next/image";
import {
  BusinessLineConfig,
  ServicePageConfig,
  type BusinessLineId,
} from "@/lib/site-config";

/* ── 서비스별 아이콘 매핑 ── */
const serviceIconMap: Record<string, string> = {
  sangbujang: "/images/icon/icon-upper.png",
  habujang: "/images/icon/icon-down.png",
  "door-fall": "/images/icon/icon-door-drop.png",
  hinge: "/images/icon/icon-door-gear.png",
  "drawer-rail": "/images/icon/icon-rail.png",
  "bed-frame": "/images/icon/icon-bed.png",
  "table-leg": "/images/icon/icon-table.png",
  "sink-door": "/images/icon/icon-door-reform.png",
  "fridge-cabinet": "/images/icon/icon-refre.png",
  rocheong: "/images/icon/icon-robo.png",
  "restaurant-chair": "/images/icon/icon-chair-reform.png",
  "meeting-table": "/images/icon/icon-table.png",
  custom: "/images/icon/icon-chair-reform.png",
  sofa: "/images/icon/icon-sofa-sag.png",
  "sofa-frame": "/images/icon/icon-sofa-sag.png",
};

/* ── 라인별 대표 아이콘 ── */
const lineIconMap: Record<string, string> = {
  repair: "/images/icon_sink_repair.png",
  kitchen: "/images/icon_sink_reform.png",
  leather: "/images/icon_leather.png",
  sofa: "/images/icon_sofa.png",
};

function nl(text: string) {
  return text.split("\n").map((line, i) => (
    <span key={i}>
      {line}
      {i < text.split("\n").length - 1 && <br />}
    </span>
  ));
}

/* ════════════════════════════════════════
   BusinessLinePage — 세부 항목 그리드
   ════════════════════════════════════════ */
export function BusinessLinePage({ line }: { line: BusinessLineConfig }) {
  return (
    <main className="bg-white">
      {/* 히어로 */}
      <section className="px-4 py-8 md:px-6 md:py-12">
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl md:rounded-3xl"
          style={{
            background:
              "linear-gradient(135deg, #e8f0fe 0%, #dbe6ffc0 50%, #e32e4077 100%)",
          }}>
          {/* 콘텐츠 래퍼 */}
          <div className="relative z-10 px-6 pt-8 pb-40 md:px-10 md:py-16 md:pb-16">
            <h1
              className="text-3xl md:text-5xl font-black leading-tight"
              style={{ color: "#111827" }}>
              {nl(line.hero)}
            </h1>
            <p
              className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed"
              style={{ color: "#64748b" }}>
              {nl(line.description)}
            </p>
            <a
              href="tel:010-6855-0957"
              className="flex items-center gap-2 mb-5"
              style={{ textDecoration: "none" }}></a>
            <a
              href="http://pf.kakao.com/_hQExjX/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-black text-white md:rounded-2xl md:px-10 md:py-4 md:text-base transition hover:opacity-90"
              style={{
                background: "linear-gradient(to right, #1f66ff, #4f8fff)",
              }}>
              문의하기 🔍
            </a>
          </div>

          {/* 사람 이미지 — 오른쪽 아래 겹치기 (아정당 스타일) */}
          <Image
            src="/images/bro.webp"
            alt="리스토리 상담"
            width={280}
            height={320}
            className="absolute bottom-0 right-0 object-contain object-bottom pointer-events-none md:right-8"
            style={{ width: "clamp(180px, 45vw, 360px)", height: "auto" }}
          />
        </div>
      </section>

      {/* 서비스 라인업 그리드 */}
      <section className="px-4 pb-20 md:px-6">
        <div className="mx-auto max-w-5xl">
          <h2
            className="text-xl font-black mb-2 md:text-2xl"
            style={{ color: "#111827" }}>
            리스토리 서비스 라인업!
          </h2>
          <p className="text-sm mb-7" style={{ color: "#94a3b8" }}>
            항목을 선택하면 상세 페이지로 이동합니다.
          </p>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {line.services.map((service) => (
              <Link
                key={service.slug}
                href={`/${line.id}/${service.slug}`}
                className="group relative overflow-hidden rounded-2xl transition hover:shadow-lg"
                style={{
                  backgroundColor: "#f8f9fc",
                  border: "1px solid #eef1f6",
                  minHeight: 170,
                }}>
                {/* 아이콘 — 오른쪽 위 */}
                <div className="flex justify-end px-4 pt-4">
                  <Image
                    src={serviceIconMap[service.slug] || lineIconMap[line.id]}
                    alt={service.shortTitle}
                    width={72}
                    height={72}
                    className="object-contain group-hover:scale-105 transition-transform"
                    style={{ width: 64, height: 64 }}
                  />
                </div>
                {/* 텍스트 — 왼쪽 아래 */}
                <div className="px-5 pb-5 pt-2">
                  <h3
                    className="text-base font-black mb-1 md:text-lg"
                    style={{ color: "#111827" }}>
                    {service.shortTitle}
                  </h3>
                  <p
                    className="text-xs leading-relaxed md:text-sm"
                    style={{ color: "#94a3b8" }}>
                    {service.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ════════════════════════════════════════
   ServiceLandingPage — 개별 서비스
   ════════════════════════════════════════ */
export function ServiceLandingPage({
  service,
}: {
  service: ServicePageConfig;
}) {
  return (
    <main className="bg-white">
      {/* 히어로 */}
      <section className="px-6 py-14 md:py-20">
        <div className="mx-auto max-w-5xl">
          <p
            className="mb-3 text-sm font-bold tracking-widest"
            style={{ color: "#1f66ff" }}>
            RE&apos;STORY
          </p>
          <h1
            className="text-3xl md:text-5xl font-black leading-tight"
            style={{ color: "#111827" }}>
            {nl(service.hero)}
          </h1>
          <p
            className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed"
            style={{ color: "#64748b" }}>
            {service.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="tel:010-6855-0957"
              className="rounded-2xl px-6 py-4 text-center text-sm font-black text-white"
              style={{
                background: "linear-gradient(to right, #1f66ff, #4f8fff)",
              }}>
              📞 전화 문의
            </a>
            <a
              href="https://blog.naver.com/sofaresq/224129090889"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl px-6 py-4 text-center text-sm font-black"
              style={{
                color: "#1f66ff",
                border: "1px solid #dbe8ff",
                backgroundColor: "#f8fbff",
              }}>
              📷 사진 보내고 가능 여부 확인
            </a>
          </div>
        </div>
      </section>

      {/* 고객 고민 */}
      <section
        className="px-4 py-14 md:px-6"
        style={{ backgroundColor: "#f8f9fc" }}>
        <div className="mx-auto grid max-w-5xl gap-3 md:grid-cols-3">
          {service.painPoints.map((point, i) => (
            <div
              key={point}
              className="rounded-2xl bg-white p-6"
              style={{
                border: "1px solid #eef1f6",
                boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
              }}>
              <span
                className="inline-block rounded-full w-8 h-8 text-center leading-8 text-sm font-black mb-3"
                style={{ backgroundColor: "#eaf1ff", color: "#1f66ff" }}>
                {i + 1}
              </span>
              <p className="text-base font-black" style={{ color: "#111827" }}>
                {point}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 작업 흐름 */}
      <section className="px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2
            className="text-xl md:text-2xl font-black mb-8"
            style={{ color: "#111827" }}>
            작업 흐름
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {service.process.map((step, i) => (
              <div
                key={step}
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: "#f8f9fc",
                  border: "1px solid #eef1f6",
                }}>
                <span
                  className="inline-block rounded-lg px-2.5 py-1 text-xs font-black mb-3"
                  style={{ backgroundColor: "#1f66ff", color: "white" }}>
                  STEP {i + 1}
                </span>
                <p className="text-base font-bold" style={{ color: "#111827" }}>
                  {step}
                </p>
              </div>
            ))}
          </div>

          <div
            className="mt-8 rounded-2xl p-6"
            style={{ background: "linear-gradient(135deg, #1f66ff, #4f8fff)" }}>
            <p className="text-lg font-black text-white">
              사진 보고 안 되는 건 안 된다고 솔직히 말씀드립니다.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-blue-100">
              가구 사진 보내주시면 수리 가능 여부와 비용 범위를 먼저
              안내드립니다.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
