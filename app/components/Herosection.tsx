import Image from "next/image";
import { buildTrackedContactPath } from "@/lib/attribution";

const KAKAO_URL = buildTrackedContactPath("kakao", "hero");
const PHONE = buildTrackedContactPath("phone", "hero");

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
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="hero_kakao"
                className="rounded-2xl bg-white px-7 py-4 text-center text-sm font-black text-[#1f2631] shadow-lg transition hover:shadow-xl">
                📷 사진 보내고 견적 받기
              </a>
              <a
                href={PHONE}
                data-cta="hero_phone"
                className="rounded-2xl border-2 border-white/40 px-7 py-4 text-center text-sm font-black text-white transition hover:bg-white/10">
                📞 전화 문의
              </a>
            </div>
          </div>
          <div className="flex items-end justify-center self-end">
            <Image
              src="/images/team-work-v2.png"
              alt="리스토리 팀"
              width={633}
              height={448}
              className="object-contain object-bottom w-full"
              priority
            />
          </div>
        </div>
        <div className="absolute bottom-4 right-6 rounded-full bg-black/30 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          1/1 ›
        </div>
      </section>

      {/* ── 모바일 히어로 ── */}
      <section className="md:hidden bg-white px-4 pt-4">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background:
              "linear-gradient(180deg, #1f66ff 0%, #4f8fff 65%, #7aadff 100%)",
          }}>
          <div className="flex items-center">
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
            <div className="flex-shrink-0 self-end pr-1">
              <Image
                src="/images/team-work-v2.png"
                alt="리스토리 팀"
                width={180}
                height={160}
                className="object-contain object-bottom"
                style={{ maxHeight: 150 }}
                priority
              />
            </div>
          </div>
          <div className="absolute bottom-2 right-3 rounded-full bg-black/30 px-2.5 py-0.5 text-[10px] font-bold text-white">
            1/1 ›
          </div>
        </div>

        {/* CTA 버튼 */}
        <div className="flex flex-col gap-2.5 mt-4 px-1">
          <a
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="hero_mobile_kakao"
            className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black"
            style={{ background: "#FEE500", color: "#1a1a1a" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
            </svg>
            사진 보내고 상담 받기
          </a>
          <a
            href={PHONE}
            data-cta="hero_mobile_phone"
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
