import { notFound } from "next/navigation";
import { getLandingBySlug, landingPages } from "@/lib/landing-config";
import type { Metadata } from "next";

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
  return { title: config.title, description: config.description };
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
    <main style={{ backgroundColor: "#fff" }}>
      {/* 제목 */}
      <section className="px-6 pt-8 pb-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-black" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "#1a1a1a" }}>
            {config.heroTitle}
          </h1>
        </div>
      </section>

      {/* 상세 랜딩 콘텐츠 영역 */}
      <section className="px-6 pb-20">
        <div
          className="mx-auto max-w-5xl rounded-2xl"
          style={{ backgroundColor: "#f0f0f0", minHeight: "70vh" }}
        >
          {/* TODO: 상세 랜딩 콘텐츠 */}
          <div className="flex items-center justify-center" style={{ minHeight: "70vh" }}>
            <p style={{ color: "#888", fontSize: "1.1rem" }}>상세 랜딩 페이지</p>
          </div>
        </div>
      </section>
    </main>
  );
}
