import Image from "next/image";
import Link from "next/link";
import { businessLines, type BusinessLineId } from "@/lib/site-config";

const iconMap: Record<BusinessLineId, string> = {
  repair: "/images/icon_sink_repair.png",
  kitchen: "/images/icon_sink_reform.png",
  leather: "/images/icon_leather.png",
};

export const metadata = {
  title: "Re'Story - 싱크대수리 · 싱크대리폼 · 가죽교체",
  description: "사진 한 장으로 수리와 리폼 가능 여부를 먼저 안내드립니다.",
};

export default function MainPage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-[#1f66ff] px-6 py-20 text-white md:py-28">
        <div className="absolute left-10 top-12 text-3xl opacity-70">✦</div>
        <div className="absolute right-16 top-20 text-4xl opacity-70">✧</div>
        <div className="absolute bottom-12 left-1/3 text-3xl opacity-70">●</div>

        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-8 inline-flex rounded-r-full bg-white px-6 py-3 text-lg font-black text-[#1f66ff] shadow-lg">
              리스토리 스튜디오 확장형 홈서비스
            </div>

            <p className="text-2xl font-bold md:text-3xl">
              싱크대수리 · 싱크대리폼 · 가죽교체
            </p>

            <h1 className="mt-4 text-5xl font-black leading-tight tracking-tight md:text-7xl">
              버리기 전
              <br />
              사진 한 장이면
              <br />
              먼저 봅니다
            </h1>

            <p className="mt-7 max-w-xl text-lg font-medium leading-relaxed text-blue-50">
              세 개 라인으로 나눴습니다. 필요한 작업만 보고, 안 되는 건 안
              된다고 말합니다.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://blog.naver.com/sofaresq/224129090889"
                className="rounded-2xl bg-white px-7 py-4 text-center text-sm font-black text-[#1f66ff]">
                사진 보내고 확인
              </a>

              <a
                href="tel:010-9127-3024"
                className="rounded-2xl border border-white/40 px-7 py-4 text-center text-sm font-black text-white">
                전화 문의
              </a>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="rounded-[2rem] bg-white/15 p-6 backdrop-blur">
              <div className="rounded-[1.5rem] bg-white p-7 text-neutral-950 shadow-2xl">
                <p className="text-sm font-black text-[#1f66ff]">
                  사진 판단 흐름
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    "사진 접수",
                    "가능 여부 확인",
                    "범위 안내",
                    "방문 작업",
                  ].map((step, i) => (
                    <div
                      key={step}
                      className="flex items-center gap-4 rounded-2xl bg-neutral-50 p-4">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f66ff] text-sm font-black text-white">
                        {i + 1}
                      </span>

                      <span className="text-base font-black">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 아정당 스타일 아이콘 메뉴 */}
      <section className="border-b border-neutral-100 bg-white px-4 py-5">
        <div className="mx-auto grid max-w-[720px] grid-cols-3 items-start text-center">
          {businessLines.map((line) => (
            <Link
              key={line.id}
              href={line.href}
              className="flex flex-col items-center justify-start gap-2 rounded-2xl px-2 py-2 transition hover:bg-neutral-50">
              <div className="flex h-[54px] w-[54px] items-center justify-center">
                <Image
                  src={iconMap[line.id]}
                  alt={line.title}
                  width={54}
                  height={54}
                  className="h-[54px] w-[54px] object-contain"
                  priority
                />
              </div>

              <p className="whitespace-nowrap text-[13px] font-bold leading-none text-neutral-950">
                {line.title}
              </p>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-gradient-to-b from-[#f7f9fd] to-[#eef2f8] px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-7 text-[22px] font-black tracking-[-0.04em] text-neutral-950 md:text-[26px]">
            한 번의 클릭, 필요한 작업만
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {businessLines.map((line) => (
              <Link
                key={line.id}
                href={line.href}
                className="overflow-hidden rounded-[20px] bg-gradient-to-b from-white to-[#fbfcff] shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
                <div className="relative min-h-[160px] p-6">
                  <h3 className="text-[20px] font-black tracking-[-0.04em] text-neutral-950">
                    {line.title}
                  </h3>

                  <p className="mt-3 max-w-[210px] whitespace-pre-line text-[14px] font-medium leading-[1.7] text-neutral-700">
                    {line.description}
                  </p>

                  <Image
                    src={iconMap[line.id]}
                    alt={line.title}
                    width={96}
                    height={96}
                    className="absolute bottom-5 right-6 h-[86px] w-[86px] object-contain"
                  />
                </div>

                <div className="border-t border-[#e5eaf2] bg-gradient-to-b from-white to-[#f9fbff] px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-black text-[#005cff]">
                      자세히 보기
                    </span>
                    <span className="text-[22px] font-black text-[#005cff]">
                      ›
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>{" "}
    </main>
  );
}
