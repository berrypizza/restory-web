import Link from "next/link";
import { BusinessLineConfig, ServicePageConfig } from "@/lib/site-config";

function nl(text: string) {
  return text.split("\n").map((line, i) => (
    <span key={i}>
      {line}
      {i < text.split("\n").length - 1 && <br />}
    </span>
  ));
}

export function BusinessLinePage({ line }: { line: BusinessLineConfig }) {
  return (
    <main className="bg-white">
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-sm font-bold tracking-widest text-neutral-400">
            RE&apos;STORY
          </p>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-neutral-950">
            {nl(line.hero)}
          </h1>
          <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-neutral-500">
            {nl(line.description)}
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-black text-neutral-950 mb-2">
            {line.title} 세부 항목
          </h2>
          <p className="text-sm text-neutral-500 mb-8">
            항목을 선택하면 상세 페이지로 이동합니다.
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {line.services.map((service) => (
              <Link
                key={service.slug}
                href={`/${line.id}/${service.slug}`}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg">
                <p className="text-sm font-bold text-neutral-400">
                  {line.title}
                </p>
                <h3 className="mt-3 text-xl font-black text-neutral-950">
                  {service.shortTitle}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                  {service.description}
                </p>
                <p className="mt-6 text-sm font-black text-neutral-950">
                  자세히 보기 →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function ServiceLandingPage({
  service,
}: {
  service: ServicePageConfig;
}) {
  return (
    <main className="bg-white">
      {/* 히어로 */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-sm font-bold tracking-widest text-neutral-400">
            RE&apos;STORY
          </p>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-neutral-950">
            {nl(service.hero)}
          </h1>
          <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-neutral-500">
            {service.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="tel:01000000000"
              className="rounded-2xl bg-neutral-950 px-6 py-4 text-center text-sm font-black text-white">
              전화 문의
            </a>
            <a
              href="#"
              className="rounded-2xl border border-neutral-200 px-6 py-4 text-center text-sm font-black text-neutral-950">
              사진 보내고 가능 여부 확인
            </a>
          </div>
        </div>
      </section>

      {/* 고객 고민 */}
      <section className="px-6 py-14 bg-neutral-50">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {service.painPoints.map((point, i) => (
            <div
              key={point}
              className="rounded-2xl border border-neutral-200 bg-white p-6">
              <p className="text-sm font-black text-neutral-300">0{i + 1}</p>
              <p className="mt-4 text-lg font-black text-neutral-950">
                {point}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 작업 흐름 */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-black text-neutral-950">
            작업 흐름
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {service.process.map((step, i) => (
              <div
                key={step}
                className="rounded-2xl border border-neutral-200 p-6">
                <p className="text-sm font-black text-neutral-400">
                  STEP {i + 1}
                </p>
                <p className="mt-4 text-lg font-bold text-neutral-950">
                  {step}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-neutral-950 p-6 text-white">
            <p className="text-xl font-black">
              사진 보고 안 되는 건 안 된다고 솔직히 말씀드립니다.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-300">
              가구 사진 보내주시면 수리 가능 여부와 비용 범위를 먼저
              안내드립니다.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
