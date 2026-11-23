"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildTrackedContactPath } from "@/lib/attribution";
import { primaryPages, studioPages } from "@/lib/public-navigation";
import s from "./customer.module.css";

export default function Footer() {
  const path = usePathname();
  if (path === "/request" || /^\/(admin|academy)(\/|$)/.test(path)) return null;
  return <footer className={s.footer}>
    <div className={s.wrap}>
      <div className={s.footerTop}>
        <div><Link className={s.footerBrand} href="/">리스토리 스튜디오</Link>
          <a className={s.footerPhone} href={buildTrackedContactPath("phone","footer")}>1688-2957</a>
          <span>전화 상담 09:00–21:00</span></div>
        <nav aria-label="서비스와 콘텐츠"><h2>둘러보기</h2>
          {[...primaryPages, ...studioPages].map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
        <nav aria-label="고객 문의와 채널"><h2>고객 문의</h2>
          <Link href="/request">사진으로 상담 접수</Link>
          <a href={buildTrackedContactPath("kakao","footer")}>카카오톡 상담</a>
          <a href="https://cafe.naver.com/f-e/cafes/22748193/menus/85?viewType=L">네이버 고객 문의함</a>
          <a href="https://blog.naver.com/sofaresq">시공 블로그</a>
          <a href="https://www.youtube.com/@리스토리스튜디오">현장 영상</a>
          <a href="https://www.instagram.com/restory_studio.kr/">인스타그램</a>
        </nav>
      </div>
      <div className={s.legal}>
        <p>상호 리스토리 스튜디오 · 대표 고현호 · 사업자등록번호 692-55-00721<br />인천광역시 서구 염곡로498번안길 5-13, 302호(가정동)</p>
        <Link href="/request#privacy-consent">상담 접수 개인정보 수집·이용 안내</Link>
      </div>
    </div>
  </footer>;
}
