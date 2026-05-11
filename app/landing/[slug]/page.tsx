import { notFound } from "next/navigation";
import { getLandingBySlug, landingPages } from "@/lib/landing-config";
import type { Metadata } from "next";
import FadeIn from "@/app/components/FadeIn";
import CompareTable from "@/app/components/CompareTable";
import ContactCTA from "@/app/components/ContactCTA";
import FloatingCTA from "@/app/components/FloatingCTA";

// 빌드 시 정적 생성
export function generateStaticParams() {
  return landingPages.map((lp) => ({ slug: lp.slug }));
}

// 동적 메타데이터
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = getLandingBySlug(slug);
  if (!config) return {};
  return {
    title: config.title,
    description: config.description,
    openGraph: {
      title: config.title,
      description: config.description,
      images: config.ogImage ? [config.ogImage] : [],
    },
  };
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
    </svg>
  );
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = getLandingBySlug(slug);
  if (!config) notFound();

  return (
    <>
      <main className="min-h-screen" style={{ backgroundColor: "#1e1e1e" }}>
        {/* 히어로 */}
        <section className="relative overflow-hidden" style={{ minHeight: "80svh" }}>
          <div className="absolute inset-0 z-0" style={{ backgroundColor: "#0a0a0a" }} />
          <div
            className="absolute inset-0 z-10"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.97) 100%)",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 z-20 mx-auto max-w-5xl px-6 pb-14">
            <FadeIn delay={0}>
              <div className="mb-5">
                <span
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
                  style={{ backgroundColor: "#44ef7718", border: "1px solid #00ffa297", color: "#00ffa2" }}>
                  📍 {config.targetArea}
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <h1
                className="font-black leading-[1.1] tracking-tight"
                style={{ fontSize: "clamp(2.4rem, 7vw, 5rem)", color: "white" }}>
                {config.heroTitle}
                <br />
                <span style={{ color: "#00ffa2", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", fontWeight: 700 }}>
                  {config.heroSub}
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={240}>
              <p className="mt-6 font-bold" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "rgba(255,255,255,0.8)" }}>
                {config.heroAccent}
              </p>
            </FadeIn>

            <FadeIn delay={360}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row max-w-lg">
                <a
                  href={config.kakaoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2.5 rounded-2xl px-8 py-5 font-black text-center transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#FEE500", color: "#191919", fontSize: "1.1rem" }}>
                  <KakaoIcon />
                  카카오로 사진 보내기
                </a>
                <a
                  href={`tel:${config.phone}`}
                  className="flex items-center justify-center rounded-2xl px-6 py-5 font-bold transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    color: "white",
                    backdropFilter: "blur(8px)",
                  }}>
                  📞 전화 문의
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 비교표 */}
        <CompareTable />

        {/* CTA */}
        <ContactCTA />
      </main>
      <FloatingCTA />
    </>
  );
}
