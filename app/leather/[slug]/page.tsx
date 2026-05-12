import { notFound } from "next/navigation";
import { ServiceLandingPage } from "@/app/components/CategoryPages";
import { getService, getAllSlugs } from "@/lib/site-config";

export function generateStaticParams() {
  return getAllSlugs("leather").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService("leather", slug);
  return {
    title: service ? `${service.title} | Re'Story` : "Re'Story",
    description: service?.description,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService("leather", slug);
  if (!service) return notFound();
  return <ServiceLandingPage service={service} />;
}
