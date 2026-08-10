import Image from "next/image";

const KAKAO_URL = "http://pf.kakao.com/_hQExjX/chat";
const PHONE = "tel:16882957";

export default function BottomCTA() {
  return (
    <section className="px-4 py-8 md:px-6 md:py-12">
      <div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl md:rounded-3xl"
        style={{
          background:
            "linear-gradient(135deg, #e8f0fe 0%, #dbe6ffc0 50%, #e32e4077 100%)",
        }}>
        <div className="relative z-10 px-6 pt-8 pb-40 md:px-10 md:py-16 md:pb-16">
          <p
            className="text-base font-bold mb-0.5 md:text-lg"
            style={{ color: "#111827" }}>
            밤 늦게, 새벽에도 상담 가능해요!
          </p>
          <p
            className="text-base font-bold mb-4 md:text-lg"
            style={{ color: "#111827" }}>
            클릭 한 번이면 끝!
          </p>
          <a
            href={PHONE}
            className="flex items-center gap-2 mb-5"
            style={{ textDecoration: "none" }}>
            <Image
              src="/images/phone-icon.png"
              alt="전화기 아이콘"
              width={48}
              height={48}
              className="h-[48px] w-[48px] object-contain md:h-[56px] md:w-[56px]"
            />
            <span
              className="text-2xl font-black md:text-4xl"
              style={{ color: "#1f66ff" }}>
              16882957
            </span>
          </a>
          <a
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-black text-white md:rounded-2xl md:px-10 md:py-4 md:text-base transition hover:opacity-90"
            style={{
              background: "linear-gradient(to right, #1f66ff, #4f8fff)",
            }}>
            문의하기 🔍
          </a>
        </div>
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
  );
}
