export default function HeroSection() {
  return (
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
            최저가로
            <br />
            다시 사용할 수 있게!!
          </h1>

          <p className="mt-7 max-w-xl text-lg font-medium leading-relaxed text-blue-50">
            세 개 라인으로 나눴습니다. 필요한 작업만 보고, 안 되는 건 안 된다고
            말합니다.
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
                {["사진 접수", "가능 여부 확인", "범위 안내", "방문 작업"].map(
                  (step, i) => (
                    <div
                      key={step}
                      className="flex items-center gap-4 rounded-2xl bg-neutral-50 p-4">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f66ff] text-sm font-black text-white">
                        {i + 1}
                      </span>

                      <span className="text-base font-black">{step}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
