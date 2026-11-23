"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TIP_CATEGORIES, type Tip } from "@/lib/tips/types";
import { useTipViews } from "./useTipViews";
import s from "../components/customer.module.css";

export type TipSummary = Pick<Tip, "id" | "title" | "category" | "thumbnail" | "createdAt" | "readingTime" | "views">;

function listUrl(category: string, order: string) {
  const q = new URLSearchParams();
  if (category !== "전체") q.set("cat", category);
  if (order === "latest") q.set("sort", order);
  return q.size ? "/tips?" + q : "/tips";
}

export default function TipsPageContent({ articles, category, order }: { articles: TipSummary[]; category: string; order: string }) {
  const router = useRouter();
  const views = useTipViews(articles);
  const filtered = articles.filter(tip => category === "전체" || tip.category === category).sort((a,b) =>
    (order === "popular" ? (views[b.id] ?? b.views) - (views[a.id] ?? a.views) : 0) || b.createdAt.localeCompare(a.createdAt));
  return <section className={s.section} data-service-section="articles"><div className={s.wrap}>
    <nav aria-label="가이드 분야" className={s.chips}>
      {["전체", ...TIP_CATEGORIES.map(cat => cat.label)].map(cat => <Link key={cat} scroll={false} href={listUrl(cat, order)} aria-current={category === cat ? "true" : undefined}>{cat}</Link>)}
    </nav>
    <div className={s.listTools}><p aria-live="polite">{category} 가이드 <strong>{filtered.length}개</strong></p>
      <select aria-label="가이드 정렬" value={order} onChange={event => router.push(listUrl(category,event.target.value), {scroll: false})}>
        <option value="popular">인기순</option><option value="latest">최신순</option>
      </select>
    </div>
    <div className={s.articleGrid}>{filtered.map(item => <Link key={item.id} href={`/tips/${item.id}`} className={s.articleCard}>
      <div className={s.articlePhoto}><Image src={item.thumbnail} alt="" fill sizes="(max-width: 600px) 112px, (max-width: 900px) 45vw, 350px" /></div>
      <div className={s.articleCopy}><span>{item.category} · {item.readingTime}분 읽기</span><h2>{item.title}</h2><time dateTime={item.createdAt}>{item.createdAt}</time></div>
    </Link>)}</div>
    {filtered.length === 0 && <p className={s.empty}>이 분야에 등록된 글이 아직 없어요. <Link href="/tips">전체 가이드 보기</Link></p>}
  </div></section>;
}
