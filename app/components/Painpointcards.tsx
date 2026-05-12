export default function PainPointCards() {
  return (
    <section className="bg-white px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-[15px] font-medium tracking-[-0.03em] text-neutral-500">
            아직도 시공 걱정 하고 계시나요?
          </p>

          <h2 className="mt-2 text-[26px] font-black leading-tight tracking-[-0.05em] text-neutral-950 md:text-[38px]">
            사진 한 장이면
            <br />
            가능한 범위부터 먼저 봅니다.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {/* 카드 1 */}
          <div className="rounded-[30px] bg-gradient-to-b from-[#f8faff] to-[#edf2fb] p-8 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
            <h3 className="text-[24px] font-black leading-[1.4] tracking-[-0.05em] text-neutral-950">
              교체해야 할까봐
              <br />
              부담되시죠.
            </h3>

            <p className="mt-5 text-[15px] leading-[1.8] text-neutral-500">
              상부장 처짐, 문짝 떨어짐,
              <br />
              의자 가죽 벗겨짐까지.
              <br />
              전체 교체 없이 가능한 경우도 많습니다.
            </p>

            <div className="mt-8 space-y-3">
              <div className="inline-flex rotate-[-5deg] rounded-2xl bg-white px-4 py-2 text-[13px] font-black text-[#005cff] shadow-sm">
                상부장 처짐
              </div>

              <div className="ml-5 inline-flex rotate-[3deg] rounded-2xl bg-white px-4 py-2 text-[13px] font-black text-[#005cff] shadow-sm">
                문짝 떨어짐
              </div>

              <div className="inline-flex rotate-[-3deg] rounded-2xl bg-white px-4 py-2 text-[13px] font-black text-[#005cff] shadow-sm">
                가죽 벗겨짐
              </div>
            </div>
          </div>

          {/* 카드 2 */}
          <div className="rounded-[30px] bg-gradient-to-b from-[#f8faff] to-[#edf2fb] p-8 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
            <h3 className="text-[24px] font-black leading-[1.4] tracking-[-0.05em] text-neutral-950">
              어디에 맡겨야 할지
              <br />
              헷갈리셨죠.
            </h3>

            <p className="mt-5 text-[15px] leading-[1.8] text-neutral-500">
              싱크대 수리인지,
              <br />
              리폼인지 구분 어려운 경우가 많습니다.
              <br />
              사진으로 먼저 방향부터 봅니다.
            </p>

            <div className="mt-10 flex items-center justify-center">
              <div className="rounded-[24px] bg-white px-6 py-5 shadow-sm">
                <p className="text-center text-[15px] font-black text-[#005cff]">
                  사진 → 가능 여부 확인
                </p>

                <p className="mt-2 text-center text-[12px] font-medium text-neutral-500">
                  안 되는 건 안 된다고 말합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 카드 3 */}
          <div className="rounded-[30px] bg-gradient-to-b from-[#f8faff] to-[#edf2fb] p-8 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
            <h3 className="text-[24px] font-black leading-[1.4] tracking-[-0.05em] text-neutral-950">
              비용이 계속 커질까봐
              <br />
              걱정되시죠.
            </h3>

            <p className="mt-5 text-[15px] leading-[1.8] text-neutral-500">
              현장 상태마다 다르기 때문에
              <br />
              사진 기준으로 범위를 먼저 안내드립니다.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3">
              <div className="rounded-full bg-white px-4 py-2 text-[13px] font-black text-neutral-700 shadow-sm">
                &quot;추가 비용 생기나요?&quot;
              </div>

              <div className="ml-5 rounded-full bg-white px-4 py-2 text-[13px] font-black text-neutral-700 shadow-sm">
                &quot;부분 작업 가능한가요?&quot;
              </div>

              <div className="rounded-full bg-white px-4 py-2 text-[13px] font-black text-neutral-700 shadow-sm">
                &quot;사진만 봐도 알 수 있나요?&quot;
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
