import { cases } from "@/lib/case-data";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const item = cases.find((c) => c.id === params.id);
  if (!item) return {};

  const isReform =
    item.parentCategory === "싱크대 리폼" ||
    item.parentCategory === "가죽 리폼";

  const imageUrl = `https://restorystudio.co.kr${
    isReform ? item.afterImg : item.beforeImg
  }`;

  const imageAlt = isReform ? `${item.title} 리폼 후` : `${item.title} 수리 전`;

  return {
    title: item.title,
    description: item.summary,
    openGraph: {
      title: item.title,
      description: item.summary,
      url: `https://restorystudio.co.kr/cases/${item.id}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: imageAlt,
        },
      ],
    },
  };
}

export default function CaseDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
