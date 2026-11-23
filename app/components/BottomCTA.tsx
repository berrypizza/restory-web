import Link from "next/link";
import { buildTrackedContactPath } from "@/lib/attribution";
import s from "./customer.module.css";

export default function BottomCTA() {
  return <section data-service-section="contact" className={s.section}>
    <div className={s.wrap}><div className={s.consultBand}>
      <div><h2>내 가구도 수리할 수 있을까요?</h2><p data-service-anchor>상담할 품목과 사진을 남겨 주세요. 담당자가 확인하고 연락드려요.</p></div>
      <div className={s.actions}>
        <Link href="/request" className={s.mainButton}>상담 접수하기</Link>
        <a href={buildTrackedContactPath("kakao","bottom_cta")} data-cta="bottom_kakao" className={s.lightButton}>카카오톡</a>
        <a href={buildTrackedContactPath("phone","bottom_cta")} data-cta="bottom_phone" className={s.lightButton}>전화 문의</a>
      </div>
    </div></div>
  </section>;
}
