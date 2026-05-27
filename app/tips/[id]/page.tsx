import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tips } from "@/lib/tips";
import TipDetailContent from "./TipDetailContent";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return tips.map((tip) => ({ id: tip.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tip = tips.find((t) => t.id === id);
  if (!tip) return {};

  return {
    title: tip.title,
    description: tip.description,
    keywords: tip.tags,
    openGraph: {
      title: `${tip.title} | 리스토리 꿀팁`,
      description: tip.description,
      url: `https://restorystudio.co.kr/tips/${tip.id}`,
      type: "article",
      publishedTime: tip.createdAt,
      images: tip.thumbnail
        ? [{ url: tip.thumbnail, width: 800, height: 600 }]
        : undefined,
    },
    alternates: {
      canonical: `https://restorystudio.co.kr/tips/${tip.id}`,
    },
  };
}

export default async function TipDetailPage({ params }: Props) {
  const { id } = await params;
  const tip = tips.find((t) => t.id === id);
  if (!tip) return notFound();

  return <TipDetailContent tip={tip} />;
}
