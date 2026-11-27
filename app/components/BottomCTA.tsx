import Link from "next/link";
import { buildTrackedContactPath } from "@/lib/attribution";
import { Arrow, CameraIcon, Star, RunCrew } from "@/app/components/landing/premium/Blocks";
import { RollText, Scrub } from "@/app/components/landing/premium/Motion";
import { display } from "@/app/components/landing/premium/fonts";
import p from "@/app/components/landing/premium/premium.module.css";

/* 홈·분야·일반 서비스 페이지 마지막 CONTACT 밴드 — 서비스 랜딩과 같은 파란 띠 + 뛰어가는 기사들 */
export default function BottomCTA() {
  return (
    <div className={`${p.page} ${display.variable}`}>
      <Scrub as="section" data-service-section="contact" className={p.contact}>
        <Star className={p.contactStar} />
        <RunCrew />
        <div className={p.wrap} style={{ position: "relative" }}>
          <Link href="/request" className={p.contactBig} aria-label="상담 접수하기" data-cta="bottom_request_title">
            <RollText text="CONTACT" />
          </Link>
          <div className={p.split}>
            <p className={p.labelSmall} style={{ color: "rgba(255,255,255,0.7)" }}>
              사진으로 먼저 확인하세요
            </p>
            <div>
              <h2 className={p.contactTitle}>내 가구도 수리할 수 있을까요?</h2>
              <p className={p.contactSub} data-service-anchor>
                상담할 품목과 사진을 남겨 주세요. 담당자가 확인하고 연락드려요.
              </p>
              <div className={p.btnRow}>
                <Link href="/request" className={p.btnOnBlue} data-cta="bottom_request">
                  <CameraIcon />
                  상담 접수하기
                </Link>
                <a href={buildTrackedContactPath("kakao", "bottom_cta")} data-cta="bottom_kakao" className={p.btnGhost}>
                  <RollText text="카카오톡" />
                </a>
                <a href={buildTrackedContactPath("phone", "bottom_cta")} data-cta="bottom_phone" className={p.btnGhost}>
                  <RollText text="전화 문의" />
                  <Arrow />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Scrub>
    </div>
  );
}
