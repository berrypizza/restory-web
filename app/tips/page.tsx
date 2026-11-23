import type { Metadata } from "next";
import { tips, TIP_CATEGORIES } from "@/lib/tips";
import PublicIntro from "../components/PublicIntro";
import s from "../components/customer.module.css";
import TipsPageContent from "./TipsPageContent";

export const metadata: Metadata = {
  title: "꿀팁 게시판",
  description:
    "싱크대 수리, 의자 가죽 교체, 소파 복원, 싱크대 리폼 등 가구 관리에 필요한 꿀팁 모음.",
  openGraph: {
    title: "꿀팁 게시판 | 리스토리",
    description: "가구 수리·관리 꿀팁 모음. 비용 비교, 자가진단, 관리법.",
    url: "https://www.restorystudio.co.kr/tips",
  },
  alternates: {
    canonical: "https://www.restorystudio.co.kr/tips",
  },
};

export default async function TipsPage({ searchParams }: { searchParams: Promise<{ cat?: string; sort?: string }> }) {
  const query = await searchParams;
  const category = TIP_CATEGORIES.find(item => item.label === query.cat)?.label ?? "전체";
  const articles = tips.map(({ id, title, category, thumbnail, createdAt, readingTime, views }) =>
    ({ id, title, category, thumbnail, createdAt, readingTime, views }));
  return <main data-service-id="tips" className={s.publicPage}>
    <PublicIntro title="수리 가이드" description="고치기 전에 궁금한 비용, 자재, 관리법을 분야별로 살펴보세요." />
    <TipsPageContent articles={articles} category={category} order={query.sort === "latest" ? "latest" : "popular"} />
  </main>;
}
