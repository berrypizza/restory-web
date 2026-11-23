import type { Metadata } from "next";
import Link from "next/link";
import { cases } from "@/lib/case-data";
import { events } from "@/lib/event-data";
import { tips } from "@/lib/tips";
import CaseCard from "./cases/CaseCard";
import HeroSection from "./components/Herosection";
import BusinessLineCards from "./components/Businesslinecards";
import ReviewSection from "./components/Reviewsection";
import YoutubeSection from "./components/Youtubesection";
import BottomCTA from "./components/BottomCTA";
import s from "./components/customer.module.css";

export const metadata: Metadata = {
  title: "리스토리 Re'Story - 가구 출장 수리 리폼 전문",
  description: "서울·경기·인천 싱크대 수리와 리폼, 의자 가죽 교체, 소파 복원. 실제 시공 전후를 비교하고 사진으로 상담을 접수하세요.",
  alternates: { canonical: "https://www.restorystudio.co.kr" },
};

const caseIds = ["case-037", "case-086", "case-076"];
const guideIds = ["sangbujang-repair-vs-replace", "sink-door-replace-vs-full-kitchen-replace", "sofa-restoration-vs-buy-new"];

export default function MainPage() {
  return <main data-service-id="home" className={s.publicPage}>
    <HeroSection />
    <BusinessLineCards />
    <section data-service-section="cases" className={s.tintSection}>
      <div className={s.wrap}>
        <div className={s.sectionHead}><h2>실제 수리 현장</h2><Link href="/cases">사례 전체 보기</Link></div>
        <div className={s.caseGrid}>{caseIds.map(id => {
          const item = cases.find(entry => entry.id === id);
          return item && <CaseCard key={id} item={item} />;
        })}</div>
      </div>
    </section>
    <section data-service-section="articles" className={s.section}>
      <div className={s.wrap}>
        <div className={s.sectionHead}><h2>수리 전 알아두면 좋은 것</h2><Link href="/tips">가이드 전체 보기</Link></div>
        <div className={s.guideList}>{guideIds.map(id => {
          const tip = tips.find(item => item.id === id);
          return tip && <Link key={id} href={`/tips/${id}`}><span>{tip.category}</span><strong>{tip.title}</strong><small>{tip.readingTime}분 읽기</small></Link>;
        })}</div>
      </div>
    </section>
    <ReviewSection />
    <YoutubeSection />
    <section className={s.section} data-service-section="events"><div className={s.wrap}>
      <div className={s.sectionHead}><h2>이벤트</h2><Link href="/events">이벤트 전체 보기</Link></div>
      <div className={s.guideList}>{events.filter(item => item.status === "진행중").map(item => <Link key={item.id} href={`/events/${item.id}`}>
        <span>진행 중</span><strong>{item.title}</strong><small>{item.endDate}까지</small>
      </Link>)}</div>
      {events.every(item => item.status !== "진행중") && <p className={s.empty}>현재 진행 중인 이벤트가 없어요.</p>}
    </div></section>
    <BottomCTA />
  </main>;
}
