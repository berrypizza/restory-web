import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cases } from "@/lib/case-data";
import { events } from "@/lib/event-data";
import { tips } from "@/lib/tips";
import { businessLines } from "@/lib/site-config";
import { fieldInfo } from "@/lib/public-navigation";
import { buildTrackedContactPath } from "@/lib/attribution";
import CaseCard from "./cases/CaseCard";
import BottomCTA from "./components/BottomCTA";
import { Scrub, InView, RiseLines, RollText } from "./components/landing/premium/Motion";
import { Arrow, CameraIcon, Mascot, TitleCard, PhotoCtaCard, YouTubeFacade } from "./components/landing/premium/Blocks";
import { display } from "./components/landing/premium/fonts";
import p from "./components/landing/premium/premium.module.css";

export const metadata: Metadata = {
  title: "리스토리 Re'Story - 가구 출장 수리 리폼 전문",
  description: "서울·경기·인천 싱크대 수리와 리폼, 의자 가죽 교체, 소파 복원. 실제 시공 전후를 비교하고 사진으로 상담을 접수하세요.",
  alternates: { canonical: "https://www.restorystudio.co.kr" },
};

const caseIds = ["case-037", "case-086", "case-076"];
const guideIds = ["sangbujang-repair-vs-replace", "sink-door-replace-vs-full-kitchen-replace", "sofa-restoration-vs-buy-new"];

const reviews = [
  { category: "싱크대 수리", text: "상부장이 떨어질 것 같아서 걱정했는데, 사진 보내니까 바로 가능 여부 알려주시고 당일 방문해서 고쳐주셨어요. 가격도 합리적이었습니다.", reviewer: "@kim*****님 후기 중" },
  { category: "소파 복원", text: "소파 꺼짐이 심해서 버리려고 했는데, 리스토리에서 내부 보강으로 새것처럼 만들어주셨어요. 200만원 아꼈습니다.", reviewer: "@park*****님 후기 중" },
  { category: "가죽 리폼", text: "식당 의자 30개 천갈이 했는데 하루 만에 끝났어요. 영업 중에 작업해주셔서 매출 손해도 없었습니다. 강추!", reviewer: "@lee*****님 후기 중" },
  { category: "싱크대 리폼", text: "주방 전체 리모델링 견적이 500만원이었는데, 문짝만 교체하니까 훨씬 저렴하게 새 주방 느낌 났어요. 진작 할 걸.", reviewer: "@choi*****님 후기 중" },
  { category: "싱크대 수리", text: "수리 불가하면 출장비 안 받는다고 해서 부담 없이 불렀는데, 다행히 고쳐지더라고요. 1년 AS까지 해주셔서 믿음이 갑니다.", reviewer: "@jung*****님 후기 중" },
];

const videos = [
  { id: "mvMybNNafKk", title: "식당 의자 천갈이 현장" },
  { id: "fp2clUUef24", title: "싱크대 수리 현장" },
];

export default function MainPage() {
  const project = cases.find((item) => item.id === "case-126")!;
  const liveEvents = events.filter((item) => item.status === "진행중");

  return (
    <main data-service-id="home" className={`${p.page} ${display.variable}`}>
      {/* 1. HERO — 밝은 주방 사진 위 반투명 안개, 흐린 빛 구체, 텍스처가 채워진 대형 제목 */}
      <Scrub as="section" data-service-section="hero" data-premium-hero className={p.hero}>
        <div className={p.heroBg}>
          <Image src="/images/door/hero-kitchen-studio.jpg" alt="" fill priority className="object-cover" sizes="100vw" />
        </div>
        <span className={`${p.orb} ${p.orbA}`} aria-hidden="true" />
        <span className={`${p.orb} ${p.orbB}`} aria-hidden="true" />
        <span className={`${p.orb} ${p.orbC}`} aria-hidden="true" />
        <span className={p.grain} aria-hidden="true" />
        {/* 다른 랜딩의 경로 표시 자리만큼 떠 있는 내비 아래로 비움 */}
        <div className={p.heroTrail} aria-hidden="true" />
        <p className={p.heroGhost} aria-hidden="true">
          RE&apos;STORY FURNITURE REPAIR
        </p>

        <div className={`${p.wrap} ${p.heroInner}`}>
          <p className={`${p.heroEyebrow} ${p.heroFade}`}>서울 · 경기 · 인천 출장 수리</p>
          <RiseLines onLoad as="h1" className={p.heroTitle} lines={["우리 집 가구,", "다시 쓸 수 있을까요?"]} />
          <p className={`${p.heroEn} ${p.heroFade}`} style={{ animationDelay: "0.25s" }}>
            Repair before you replace.
          </p>

          <div className={`${p.heroGlass} ${p.heroFade}`} style={{ animationDelay: "0.35s" }}>
            <p className={p.heroSub}>싱크대부터 오래 앉은 소파까지. 가구 사진을 보내주시면 수리 방법과 예상 비용을 안내해요.</p>
            <div className={p.btnRow}>
              <Link href="/request" className={p.btnPrimary} data-cta="home_request_hero">
                <CameraIcon />
                사진으로 상담 접수
              </Link>
              <a href={buildTrackedContactPath("kakao", "hero")} className={p.btnDark} data-cta="hero_kakao">
                <RollText text="카카오톡 상담" />
                <Arrow />
              </a>
            </div>
            <p className={p.heroHint}>
              <a href="#services">수리 분야 보기</a> ·{" "}
              <a href={buildTrackedContactPath("phone", "hero")} data-cta="hero_phone">
                전화 문의 1688-2957
              </a>
            </p>
          </div>
        </div>
        <div className={p.scrollCue} aria-hidden="true">
          SCROLL <span />
        </div>
      </Scrub>

      {/* ── 이하 본문: 뒤에 흐린 빛 구체가 떠다니고, 내용은 반투명 유리 카드 위에 ── */}
      <Scrub className={p.glassZone}>
        <div className={p.ambient} aria-hidden="true">
          <div className={p.ambientSticky}>
            <span className={`${p.ambientOrb} ${p.ambientOrb1}`} />
            <span className={`${p.ambientOrb} ${p.ambientOrb2}`} />
            <span className={`${p.ambientOrb} ${p.ambientOrb3}`} />
            <span className={p.grain} />
          </div>
        </div>

        {/* 2. 수리 분야 — 캐릭터 #1 */}
        <section id="services" data-service-section="services" className={p.section}>
          <div className={p.wrap}>
            <div className={p.split}>
              <div className={p.stickyCol}>
                <TitleCard kicker="수리 분야" title="Services" as="p" />
                <Mascot
                  src="/images/door/mascot-diagnose.png"
                  alt="싱크대 문짝의 경첩을 살펴보는 리스토리 기사 캐릭터"
                  width={1168}
                  height={880}
                  className={p.mascotDiagnose}
                  bubble="어디가 불편하세요?"
                />
              </div>
              <div className={p.glass}>
                <RiseLines as="h2" className={p.title} lines={["어디를", "수리할까요?"]} />
                <p className={p.body}>새로 사기 전에, 고쳐서 다시 쓸 수 있는지 먼저 확인하세요. 분야를 고르면 수리 방법과 실제 사례를 볼 수 있어요.</p>
              </div>
            </div>
            <div className={`${p.works} ${p.works4}`}>
              {businessLines.map((line, idx) => {
                const field = fieldInfo[line.id];
                return (
                  <InView key={line.id} threshold={0.2}>
                    <Link href={line.href} className={`${p.work} ${p.glass} ${p.workGlass} ${p.fade}`} style={{ transitionDelay: `${idx * 0.08}s` }}>
                      <div className={p.workImg}>
                        <Image src={field.image} alt="" fill className="object-cover" sizes="(min-width: 900px) 280px, 46vw" style={{ objectPosition: field.position }} />
                      </div>
                      <div className={p.workMeta}>
                        <h3 className={p.workTitle}>{field.label}</h3>
                        <p className={p.workSummary}>{field.detail}</p>
                        <span className={`${p.arrowLink} ${p.workMore}`}>
                          <RollText text="VIEW" />
                          <Arrow />
                        </span>
                      </div>
                    </Link>
                  </InView>
                );
              })}
            </div>
          </div>
        </section>

        {/* 거대한 회색 영문 */}
        <Scrub className={p.marquee} aria-hidden="true">
          <span className={p.marqueeLine}>Repair before</span>
          <span className={p.marqueeLine}>you replace.</span>
        </Scrub>

        {/* 3. 실제 수리 현장 — 전후 비교 + 사례 */}
        <section data-service-section="cases" className={p.section}>
          <div className={p.wrap}>
            <div className={p.split}>
              <TitleCard kicker="실제 수리 현장" title="Before / After" as="p" />
              <div className={p.glass}>
                <RiseLines as="h2" className={p.title} lines={["실제 수리 현장"]} />
                <InView className={p.sameSofa}>
                  <strong className={p.fade}>같은 주방입니다.</strong>
                  <span className={p.fade} style={{ transitionDelay: "0.1s" }}>
                    파주 · 싱크대 문짝만 교체했습니다
                  </span>
                </InView>
              </div>
            </div>
            <InView className={p.compare} threshold={0.15}>
              <div className={`${p.clip} ${p.compareItem}`}>
                <Image src={project.beforeImg} alt="파주 싱크대 문짝 교체 전 주방" fill className="object-cover" sizes="(min-width: 1200px) 580px, 50vw" style={{ objectPosition: "53% 61%" }} />
                <span className={p.compareTag}>BEFORE</span>
              </div>
              <div className={`${p.clip} ${p.compareItem}`}>
                <Image src={project.afterImg} alt="파주 싱크대 문짝 교체 후 주방" fill className="object-cover" sizes="(min-width: 1200px) 580px, 50vw" style={{ objectPosition: "53% 61%" }} />
                <span className={p.compareTag} data-after>
                  AFTER
                </span>
              </div>
            </InView>
            <div className={p.afterCard}>
              <Link href={`/cases/${project.id}`} className={p.arrowLink}>
                이 사례 자세히 보기
                <Arrow />
              </Link>
            </div>
            <div className={`${p.works} ${p.works3} ${p.afterCard}`}>
              {caseIds.map((id) => {
                const item = cases.find((entry) => entry.id === id);
                return item && <CaseCard key={id} item={item} />;
              })}
            </div>
            <div className={p.afterCard}>
              <Link href="/cases" className={p.arrowLink}>
                <RollText text="ALL CASES" />
                <Arrow />
              </Link>
            </div>
          </div>
        </section>

        {/* 4. 사진 상담 — 캐릭터 #2 (행동 유도) */}
        <section data-service-section="photo_guide" className={p.section}>
          <div className={p.wrap}>
            <PhotoCtaCard
              title="사진 한 장이면 시작돼요"
              sub="가구 전체 1장 + 불편한 부분 가까이 1장, 지역만 보내주세요."
              href="/request"
              label="사진으로 상담 접수"
              cta="home_request_mid"
            />
          </div>
        </section>

        {/* 5. 가이드 */}
        <section data-service-section="articles" className={p.section}>
          <div className={`${p.wrap} ${p.split}`}>
            <div className={p.stickyCol}>
              <TitleCard kicker="수리 가이드" title="Guide" as="p" />
            </div>
            <div className={`${p.glass} ${p.rowsCard}`}>
              <h2 className={p.title}>수리 전 알아두면 좋은 것</h2>
              <InView className={`${p.rows} ${p.rowsCompact}`} as="ol" threshold={0.1}>
                {guideIds.map((id, i) => {
                  const tip = tips.find((item) => item.id === id);
                  return (
                    tip && (
                      <li key={id} className={`${p.row} ${p.fade}`}>
                        <span className={p.rowNum}>0{i + 1}</span>
                        <h3 className={p.rowTitle}>
                          <Link href={`/tips/${id}`}>{tip.title}</Link>
                        </h3>
                        <p className={p.rowDesc}>
                          {tip.category} · {tip.readingTime}분 읽기
                        </p>
                      </li>
                    )
                  );
                })}
              </InView>
              <Link href="/tips" className={p.arrowLink}>
                가이드 전체 보기
                <Arrow />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. 후기 */}
        <section data-service-section="reviews" className={p.section}>
          <div className={p.wrap}>
            <div className={p.split}>
              <TitleCard kicker="고객 후기" title="Reviews" as="p" />
              <div className={p.glass}>
                <RiseLines as="h2" className={p.title} lines={["고객 후기"]} />
                <p className={p.body}>직접 맡겨 보신 분들의 이야기예요.</p>
              </div>
            </div>
            <div className={`${p.works} ${p.works3}`}>
              {reviews.map((r, idx) => (
                <InView key={r.reviewer} threshold={0.2}>
                  <figure className={`${p.glass} ${p.fade}`} style={{ transitionDelay: `${(idx % 3) * 0.08}s` }}>
                    <span className={p.tag}>{r.category}</span>
                    <blockquote className={p.workSummary} data-full>
                      “{r.text}”
                    </blockquote>
                    <figcaption className={p.note}>{r.reviewer}</figcaption>
                  </figure>
                </InView>
              ))}
            </div>
          </div>
        </section>

        {/* 7. 영상 */}
        <section data-service-section="video" className={p.section}>
          <div className={p.wrap}>
            <div className={p.split}>
              <TitleCard kicker="영상으로 보는 수리 과정" title="Movie" as="p" />
              <div className={p.glass}>
                <h2 className={p.title}>영상으로 보는 수리 과정</h2>
                <a href="https://www.youtube.com/@surirang-911" className={p.arrowLink}>
                  채널 보기
                  <Arrow />
                </a>
              </div>
            </div>
            <div className={`${p.works} ${p.afterCard}`}>
              {videos.map((v) => (
                <div key={v.id} className={`${p.glass} ${p.videoCard}`}>
                  <YouTubeFacade videoId={v.id} title={v.title} label={`${v.title} 재생`} />
                  <p className={p.note} style={{ marginTop: 12 }}>
                    {v.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. 이벤트 */}
        <section data-service-section="events" className={p.section}>
          <div className={`${p.wrap} ${p.split}`}>
            <div className={p.stickyCol}>
              <TitleCard kicker="이벤트" title="Events" as="p" />
            </div>
            <div className={`${p.glass} ${p.rowsCard}`}>
              <h2 className={p.title}>이벤트</h2>
              {liveEvents.length > 0 ? (
                <ol className={`${p.rows} ${p.rowsCompact}`}>
                  {liveEvents.map((item, i) => (
                    <li key={item.id} className={p.row}>
                      <span className={p.rowNum}>0{i + 1}</span>
                      <h3 className={p.rowTitle}>
                        <Link href={`/events/${item.id}`}>{item.title}</Link>
                      </h3>
                      <p className={p.rowDesc}>진행 중 · {item.endDate}까지</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className={p.body}>현재 진행 중인 이벤트가 없어요.</p>
              )}
              <Link href="/events" className={p.arrowLink}>
                이벤트 전체 보기
                <Arrow />
              </Link>
            </div>
          </div>
        </section>
      </Scrub>

      {/* 9. CONTACT — 뛰어가는 기사들 */}
      <BottomCTA />
    </main>
  );
}
