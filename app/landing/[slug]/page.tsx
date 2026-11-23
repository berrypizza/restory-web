import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLandingBySlug, landingPages } from "@/lib/landing-config";
import { cases } from "@/lib/case-data";
import { services, type Service } from "@/lib/consultation-services";
import { withLandingSeo } from "@/lib/landing-seo";
import PublicIntro from "@/app/components/PublicIntro";
import s from "@/app/components/customer.module.css";

const destinations: Record<string, { service: Service; caseId: string; href: string }> = {
  cheongali: { service: "chairs", caseId: "case-086", href: "/leather/restaurant-chair" },
  sangbujang: { service: "upper", caseId: "case-125", href: "/repair/sangbujang" },
  "cheongali-2": { service: "chairs", caseId: "case-070", href: "/leather/restaurant-chair" },
  "cheongali-3": { service: "chairs", caseId: "case-044", href: "/leather/restaurant-chair" },
  "cheongali-4": { service: "chairs", caseId: "case-049", href: "/leather/restaurant-chair" },
  "cheongali-5": { service: "leather", caseId: "case-115", href: "/leather" },
  "cheongali-6": { service: "chairs", caseId: "case-053", href: "/leather/restaurant-chair" },
};

export function generateStaticParams() {
  return landingPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const config = getLandingBySlug(slug);
  if (!config) notFound();
  return withLandingSeo({ title: config.title, description: config.description, alternates: { canonical: "/landing/" + slug },
    robots: { index: false, follow: true, googleBot: { index: false, follow: true } } });
}

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const config = getLandingBySlug(slug);
  const target = destinations[slug];
  if (!config || !target) notFound();
  const guide = services[target.service];
  const item = cases.find(entry => entry.id === target.caseId)!;
  return <main data-service-id="campaign" data-service-keyword={slug} className={s.publicPage}>
    <PublicIntro title={config.heroTitle} description={config.description} photo={{ src: item.afterImg, alt: item.title }}>
      <Link className={s.mainButton} href={`/request?service=${target.service}`}>사진으로 상담 접수</Link>
      <Link className={s.lightButton} href={target.href}>수리 방법 자세히 보기</Link>
    </PublicIntro>
    <div className={s.section}><div className={s.wrap}><div className={s.columns}>
      <section data-service-section="budget"><h2 className={s.subHeading}>견적은 어떻게 정하나요?</h2>
        <p className={s.lead}>{guide.cost}</p>
        <Link className={s.textLink} href={`/cases/${item.id}`}>{item.region} 작업 사례 보기</Link>
      </section>
      <section data-service-section="photo_guide"><h2 className={s.subHeading}>어떤 사진이 필요한가요?</h2><p className={s.lead}>{guide.photos}</p></section>
    </div></div></div>
  </main>;
}
