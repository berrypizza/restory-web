import Link from "next/link";
import { cases } from "@/lib/case-data";
import { buildTrackedContactPath } from "@/lib/attribution";
import HomeCaseCompare from "./HomeCaseCompare";
import s from "./customer.module.css";

export default function HeroSection() {
  const project = cases.find(item => item.id === "case-126")!;
  return (
    <section data-service-section="hero" className={s.homeHero}>
      <div className={s.heroGrid}>
        <div className={s.heroText}>
          <p className={s.location}>서울 · 경기 · 인천 출장 수리</p>
          <h1>우리 집 가구,<br />다시 쓸 수 있을까요?</h1>
          <p className={s.lead}>싱크대부터 오래 앉은 소파까지. 가구 사진을 보내주시면 수리 방법과 예상 비용을 안내해요.</p>
          <div className={s.actions}>
            <Link className={s.mainButton} href="/request">사진으로 상담 접수</Link>
            <a className={s.lightButton} href={buildTrackedContactPath("kakao", "hero")} data-cta="hero_kakao">카카오톡 상담</a>
          </div>
          <div className={s.heroLinks}><a className={s.mobileBrowse} href="#services">수리 분야 보기</a><a className={s.phoneText} href={buildTrackedContactPath("phone","hero")} data-cta="hero_phone">전화 문의 1688-2957</a></div>
        </div>
        <HomeCaseCompare before={project.beforeImg} after={project.afterImg} href={`/cases/${project.id}`} />
      </div>
    </section>
  );
}
