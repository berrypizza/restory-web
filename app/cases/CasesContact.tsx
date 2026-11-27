import Link from "next/link";
import { Arrow, CameraIcon, Star, RunCrew } from "@/app/components/landing/premium/Blocks";
import { RollText, Scrub } from "@/app/components/landing/premium/Motion";
import p from "@/app/components/landing/premium/premium.module.css";

/* 작업 사례 마지막 CONTACT 밴드 — 손 흔드는 캐릭터(마스코트 #3) */
export default function CasesContact({ requestHref, phoneHref, cta }: { requestHref: string; phoneHref: string; cta: string }) {
  return (
    <Scrub as="section" data-service-section="contact" className={p.contact}>
      <Star className={p.contactStar} />
      <RunCrew />
      <div className={p.wrap} style={{ position: "relative" }}>
        <Link href={requestHref} className={p.contactBig} aria-label="사진으로 상담 접수" data-cta={`${cta}_contact_title`}>
          <RollText text="CONTACT" />
        </Link>
        <div className={p.split}>
          <p className={p.labelSmall} style={{ color: "rgba(255,255,255,0.7)" }}>비슷한 고민이 있다면</p>
          <div>
            <h2 className={p.contactTitle} style={{ whiteSpace: "pre-line" }}>{"사진 2장으로\n우리 집 수리 방법부터"}</h2>
            <p className={p.contactSub}>가구 전체 1장 + 손상 부위 가까이 1장을 보내주세요. 수리 방법과 예상 범위를 먼저 안내해 드려요.</p>
            <div className={p.btnRow}>
              <Link href={requestHref} className={p.btnOnBlue} data-cta={`${cta}_request_contact`}>
                <CameraIcon />
                사진으로 상담 접수
              </Link>
              <a href={phoneHref} className={p.btnGhost}>
                <RollText text="1688-2957" />
                <Arrow />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Scrub>
  );
}
