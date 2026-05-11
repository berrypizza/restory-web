import { notFound } from "next/navigation";
import { getLandingBySlug, landingPages } from "@/lib/landing-config";
import type { Metadata } from "next";
import FadeIn from "@/app/components/FadeIn";
import CompareTable from "@/app/components/CompareTable";
import ContactCTA from "@/app/components/ContactCTA";
import FloatingCTA from "@/app/components/FloatingCTA";

export function generateStaticParams() {
  return landingPages.map((lp) => ({ slug: lp.slug }));
}

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
    openGraph: { title: config.title, description: config.description, images: config.ogImage ? [config.ogImage] : [] },
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
      <main className="min-h-screen" style={{ backgroundColor: "#ffffff" }}>
        <section className="relative overflow-hidden" style={{ minHeight: "80svh", backgroundColor: "#ffffff" }}>
          <div className="absolute bottom-0 left-0 right-0 z-20 mx-auto max-w-3xl px-6 pb-20 text-center">
            <FadeIn delay={0}>
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-6"
                style={{ backgroundColor: "#f5f5f5", border: "1px solid #e5e5e5", color: "#888" }}>
                📍 {config.targetArea}
              </span>
            </FadeIn>

            <FadeIn delay={120}>
              <h1 className="font-black leading-[1.08] tracking-tight"
                style={{ fontSize: "clamp(2.2rem, 6.5vw, 4rem)", color: "#1a1a1a" }}>
                {config.heroTitle}
              </h1>
              <p className="mt-4 font-semibold" style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", color: "#888" }}>
                {config.heroSub}
              </p>
            </FadeIn>

            <FadeIn delay={240}>
              <p className="mt-4" style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)", color: "#aaa" }}>
                {config.heroAccent}
              </p>
            </FadeIn>

            <FadeIn delay={360}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center max-w-md mx-auto">
                <a href={config.kakaoUrl} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2.5 rounded-xl px-8 py-4 font-bold text-center transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#FEE500", color: "#1a1a1a", fontSize: "1rem" }}>
                  <KakaoIcon />
                  카카오로 사진 보내기
                </a>
                <a href={`tel:${config.phone}`}
                  className="flex items-center justify-center rounded-xl px-6 py-4 font-semibold transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "#fafafa", border: "1px solid #e5e5e5", color: "#1a1a1a" }}>
                  📞 전화 문의
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        <CompareTable />
        <ContactCTA />
      </main>
      <FloatingCTA />
    </>
  );
}
