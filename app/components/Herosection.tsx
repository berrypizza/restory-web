import Image from "next/image";

export default function HeroSection() {
  return (
    <>
      {/* ── 데스크탑 히어로 (md 이상) ── */}
      <section
        className="relative hidden md:block overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #1f66ff 0%, #4f8fff 70%, #7aadff 100%)",
        }}>
        <div className="mx-auto max-w-6xl grid grid-cols-[0.9fr_1.1fr] items-center">
          <div className="py-20 pl-10">
            <p className="mb-3 text-base font-bold tracking-wide text-blue-100">
              싱크대수리 · 싱크대리폼 · 가죽교체 · 소파복원
            </p>
            <h1 className="text-5xl font-black leading-[1.15] tracking-tight text-white">
              대부분,
              <br />
              그냥 바꾸면
              <br />
              <span className="text-yellow-300">152만원 손해!</span>
            </h1>
            <p className="mt-5 max-w-md text-lg font-medium leading-relaxed text-blue-100">
              리스토리에서 확인하고 버리는 비용 가져 가세요!
            </p>
            <div className="mt-8 flex gap-3">
              <a
                href="https://blog.naver.com/sofaresq/224129090889"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-white px-7 py-4 text-center text-sm font-black text-[#1f66ff] shadow-lg transition hover:shadow-xl">
                📷 사진 보내고 확인
              </a>
              <a
                href="tel:010-9127-3024"
                className="rounded-2xl border-2 border-white/40 px-7 py-4 text-center text-sm font-black text-white transition hover:bg-white/10">
                📞 전화 문의
              </a>
            </div>
          </div>
          <div className="flex items-end justify-center self-end">
            <Image
              src="/images/team.png"
              alt="리스토리 팀"
              width={560}
              height={500}
              className="object-contain object-bottom w-full"
              priority
            />
          </div>
        </div>
        <div className="absolute bottom-4 right-6 rounded-full bg-black/30 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          1/1 ›
        </div>
      </section>

      {/* ── 모바일 히어로 (아정당 스타일 둥근 카드) ── */}
      <section className="md:hidden bg-white px-4 pt-4">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background:
              "linear-gradient(180deg, #1f66ff 0%, #4f8fff 65%, #7aadff 100%)",
          }}>
          {/* 카드 내부 */}
          <div className="flex items-center">
            {/* 텍스트 왼쪽 */}
            <div className="flex-1 py-6 pl-5 pr-2">
              <p className="mb-2 text-[11px] font-bold text-blue-200">
                싱크대수리·싱크대리폼·가죽교체
              </p>
              <h2 className="text-[1.25rem] font-black leading-[1.3] text-white">
                그냥 바꾸면
                <br />
                <span className="text-yellow-300">152만원 손해!</span>
              </h2>
              <p className="mt-2 text-[11px] font-medium text-blue-100 leading-relaxed">
                리스토리에서 확인하고
                <br />
                버리는 비용 가져 가세요!
              </p>
            </div>

            {/* 팀 이미지 오른쪽 */}
            <div className="flex-shrink-0 self-end pr-1">
              <Image
                src="/images/team.png"
                alt="리스토리 팀"
                width={180}
                height={160}
                className="object-contain object-bottom"
                style={{ maxHeight: 150 }}
                priority
              />
            </div>
          </div>

          {/* 인디케이터 */}
          <div className="absolute bottom-2 right-3 rounded-full bg-black/30 px-2.5 py-0.5 text-[10px] font-bold text-white">
            1/1 ›
          </div>
        </div>

        {/* CTA 버튼 (카드 밖, 아정당처럼) */}
        <div className="flex flex-col gap-2.5 mt-4 px-1">
          <a
            href="https://blog.naver.com/sofaresq/224129090889"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-black text-[#1f66ff] shadow-sm"
            style={{ border: "1px solid #e5e7eb" }}>
            📷 사진 보내고 확인
          </a>
          <a
            href="tel:010-9127-3024"
            className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black text-white"
            style={{
              background: "linear-gradient(to right, #1f66ff, #4f8fff)",
            }}>
            📞 전화 문의
          </a>
        </div>
      </section>
    </>
  );
}
