"use client";

import { LandingTrail, LandingIntake, LandingSections } from "./shared/LandingNavigation";
import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import LeatherSampleSection from "./Leathersamplesection";
import FloatingCTA from "@/app/components/landing/shared/FloatingCTA";
import { ServiceJsonLd, FAQJsonLd } from "@/app/components/JsonLd";
import { buildTrackedContactPath } from "@/lib/attribution";
import { cases } from "@/lib/case-data";
import { REGIONS } from "@/lib/seo-regions";
import { Scrub, InView, RiseLines, RollText } from "./premium/Motion";
import {
  Arrow,
  CameraIcon,
  Star,
  YouTubeFacade,
  GlitchDiagram,
  VennShapes,
  Mascot,
  TitleCard,
  PhotoCtaCard,
  FaqList,
  RunCrew,
} from "./premium/Blocks";
import { display } from "./premium/fonts";
import s from "./premium/premium.module.css";

const PHONE = buildTrackedContactPath("phone", "restaurant_chair");
const PHOTO_CTA = "사진 올리고 견적 받기";

const FAQ_ITEMS = [
  { q: "정말 새 의자보다 저렴한가요?", a: "네. 새 의자 대비 1/3~1/5 수준입니다. 수량이 많을수록 단가가 낮아집니다." },
  { q: "영업 중에도 작업 가능한가요?", a: "영업 전·후, 휴무일, 새벽도 맞춤 일정 조율 가능합니다." },
  { q: "몇 개부터 가능한가요?", a: "1개부터 가능합니다. 대량일수록 단가가 더 낮아집니다." },
  { q: "색상은 어떻게 고르나요?", a: "실측 방문 시 실물 샘플을 가져가서 직접 비교해 선택하실 수 있습니다." },
  { q: "A/S는 어떻게 되나요?", a: "시공 후 미흡한 부분은 100% 무상 재시공해드립니다." },
];

const REVIEWS = [
  {
    img: "/images/chair/review-1.jpg",
    count: "32개",
    unit: "카페 의자",
    area: "서울 강남구",
    name: "김** 사장님",
    quote: "새 의자 산 줄 알고 손님들이 물어봐요. 가격은 새 의자의 1/3도 안 됐습니다.",
    tag: "당일 완료",
  },
  {
    img: "/images/chair/review-5.png",
    count: "1.5m 14개",
    unit: "고깃집 의자",
    area: "경기 부천시",
    name: "박** 사장님",
    quote: "영업 끝나고 밤에 와서 해주셔서 영업 지장 하나도 없었어요. 다음에도 여기 할 겁니다.",
    tag: "야간 시공",
  },
];

const TRUST_ITEMS = [
  { n: "01", title: "100% 무상 재시공", desc: "시공 후 미흡한 부분은 무조건 다시 와서 고쳐드립니다. 비용 없습니다." },
  { n: "02", title: "생산물 배상책임보험 가입", desc: "시공 중 예상치 못한 문제가 생겨도 보험으로 100% 보상됩니다." },
  { n: "03", title: "출장 전 가격 확정", desc: "방문 후 갑자기 금액이 올라가는 일 없습니다. 견적 그대로 진행됩니다." },
];

/* ─────────────────────────────────────────
   parseKeyword — 지역 슬러그에서 region / bizType 파싱
   "붙박이 소파" / "붙박이 쇼파" 둘 다 감지하되,
   화면에는 검색어에 실제로 들어온 단어 그대로 노출
───────────────────────────────────────── */
function parseKeyword(keyword: string): { region: string; bizType: string; isSofa: boolean; sofaWord: string } {
  const kw = keyword.replace(/-/g, " ");
  const region = REGIONS.find((r) => kw.includes(r)) ?? "";
  const isSofa = kw.includes("붙박이 쇼파") || kw.includes("붙박이 소파") || kw.includes("붙박이소파") || kw.includes("붙박이쇼파");
  // 입력에 실제로 들어온 단어를 그대로 사용 ("쇼파" 입력 → "쇼파" 출력)
  const sofaWord = kw.includes("쇼파") ? "쇼파" : "소파";
  const bizType = isSofa
    ? `붙박이 ${sofaWord}`
    : kw.includes("카페")
      ? "카페"
      : kw.includes("고깃집")
        ? "고깃집"
        : kw.includes("식당")
          ? "식당"
          : kw.includes("업소")
            ? "업소"
            : "식당·카페";
  return { region, bizType, isSofa, sofaWord };
}

/* 가로 스크롤 시공 사례 */
function CaseStrip({ region }: { region?: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const allCases = cases
    .filter((c) => c.parentCategory === "가죽 리폼" && c.category !== "회의실 테이블 가죽 교체")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const matched = region ? allCases.filter((c) => c.region.includes(region)) : [];
  const rest = allCases.filter((c) => !matched.includes(c));
  const CASE_ITEMS = [...matched, ...rest].slice(0, 6);

  const cardStep = () => {
    const first = scrollRef.current?.firstElementChild as HTMLElement | null;
    return first ? first.offsetWidth + 12 : 0;
  };
  const handleScroll = () => {
    const el = scrollRef.current;
    const w = cardStep();
    if (el && w > 0) setActiveIdx(Math.round(el.scrollLeft / w));
  };
  const scrollTo = (i: number) => scrollRef.current?.scrollTo({ left: i * cardStep(), behavior: "smooth" });

  return (
    <div className={s.strip}>
      <div className={s.secHead} style={{ marginBottom: 16 }}>
        <p className={s.labelSmall}>More cases · 실제 시공 사례</p>
        <Link href="/cases?cat=가죽 리폼" className={s.arrowLink}>
          <RollText text="VIEW ALL" />
          <Arrow />
        </Link>
      </div>
      <div ref={scrollRef} onScroll={handleScroll} className={s.stripTrack}>
        {CASE_ITEMS.map((item) => (
          <Link key={item.id} href={`/cases/${item.id}`} draggable={false} className={`${s.stripCard} ${s.work}`}>
            <div className={s.workImg}>
              <Image src={item.afterImg} alt={item.title} fill className="object-cover" sizes="(min-width: 768px) 320px, 74vw" draggable={false} />
              <span className={s.pairTag} data-after>
                AFTER
              </span>
            </div>
            <p>{item.title}</p>
            <small>{item.region}</small>
          </Link>
        ))}
      </div>
      <div className={s.dots}>
        {CASE_ITEMS.map((_, i) => (
          <button
            key={i}
            type="button"
            className={s.dot}
            aria-label={`${i + 1}번째 시공 사례 보기`}
            aria-current={i === activeIdx ? "true" : undefined}
            onClick={() => scrollTo(i)}>
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* 사진 접수 + 전화 버튼 한 줄 (하단 고정 버튼이 겹치지 않도록 data-chair-contact) */
function ContactButtons({ href, onBlue = false, cta }: { href: string; onBlue?: boolean; cta: string }) {
  return (
    <div data-chair-contact className={s.btnRow}>
      <Link href={href} className={onBlue ? s.btnOnBlue : s.btnPrimary} data-cta={cta}>
        <CameraIcon />
        {PHOTO_CTA}
      </Link>
      <a href={PHONE} className={onBlue ? s.btnGhost : s.btnDark}>
        <RollText text={onBlue ? "1688-2957" : "전화 문의"} />
        <Arrow />
      </a>
    </div>
  );
}

interface Props {
  keyword?: string;
}

export default function RestaurantChairLanding({ keyword }: Props) {
  const { region, bizType, isSofa, sofaWord } = keyword
    ? parseKeyword(keyword)
    : { region: "", bizType: "", isSofa: false, sofaWord: "소파" };

  // 사진 상담은 자체 접수 양식으로 (의자 천갈이 / 붙박이 소파는 가죽 상담 항목)
  const REQUEST_URL = `/request?service=${isSofa ? "leather" : "chairs"}`;
  const item = isSofa ? sofaWord : "의자";

  // 기존 h1 문구를 줄 단위로 (줄마다 다른 텍스처가 채워짐)
  const heroTitle = region
    ? isSofa
      ? [`${region} 붙박이 ${sofaWord}`, "천갈이"]
      : [`${region} ${bizType} 의자`, "가죽 교체"]
    : ["의자 새로", "사지 마세요"];

  const heroSub = region
    ? isSofa
      ? `${region} 당일 출장 가능 · 부스석·붙박이 ${sofaWord} 천갈이 전문`
      : `${region} 당일 출장 가능 · 새 의자 대비 1/3~1/5 비용`
    : "가죽만 바꾸면 새것처럼";
  const heroBadge = region ? `${region} 당일 출장 · 개당 3만원~` : "개당 3만원~";

  const regionCaseCount = region
    ? cases.filter((c) => c.parentCategory === "가죽 리폼" && c.category !== "회의실 테이블 가죽 교체" && c.region.includes(region)).length
    : 0;

  return (
    <main
      data-service-id={isSofa ? "restaurant-sofa" : "restaurant-chair"}
      data-service-keyword={keyword}
      className={`${s.page} ${display.variable}`}>
      <ServiceJsonLd
        name={region ? (isSofa ? `${region} 붙박이 ${sofaWord} 천갈이` : `${region} ${bizType} 의자 가죽 교체`) : "식당·카페 의자 가죽 교체"}
        description="식당·카페 의자 가죽 교체 전문. 새 의자 대비 1/3~1/5 비용. 영업 외 시간 방문 시공, 무상 A/S."
        url={keyword ? `https://www.restorystudio.co.kr/leather/${keyword}` : "https://www.restorystudio.co.kr/leather/restaurant-chair"}
      />
      <FAQJsonLd faqs={FAQ_ITEMS} />

      {/* 1. HERO — 밝은 매장 사진 위 반투명 안개, 흐린 빛 구체, 텍스처가 채워진 대형 제목 */}
      <Scrub as="section" data-service-section="hero" data-premium-hero className={s.hero}>
        <div className={s.heroBg}>
          <Image src="/images/chair/hero-store-studio.jpg" alt="" fill priority className="object-cover" sizes="100vw" />
        </div>
        <span className={`${s.orb} ${s.orbA}`} aria-hidden="true" />
        <span className={`${s.orb} ${s.orbB}`} aria-hidden="true" />
        <span className={`${s.orb} ${s.orbC}`} aria-hidden="true" />
        <span className={s.grain} aria-hidden="true" />
        <div className={s.heroTrail}>
          <LandingTrail field="leather" title={isSofa ? "붙박이 소파 천갈이" : "의자 가죽 천갈이"} />
        </div>
        <p className={s.heroGhost} aria-hidden="true">
          RE&apos;STORY LEATHER CHAIR
        </p>

        <div className={`${s.wrap} ${s.heroInner}`}>
          <p className={`${s.heroEyebrow} ${s.heroFade}`}>
            {region ? (isSofa ? `${region} 붙박이 ${sofaWord} 천갈이 전문` : `${region} 의자 가죽 교체 전문`) : "리스토리 가죽 교체"}
          </p>
          <RiseLines onLoad as="h1" className={s.heroTitle} lines={heroTitle} />
          <p className={`${s.heroEn} ${s.heroFade}`} style={{ animationDelay: "0.25s" }}>
            Change the leather, keep the chair.
          </p>

          <div className={`${s.heroGlass} ${s.heroFade}`} style={{ animationDelay: "0.35s" }}>
            <p className={s.heroSub}>{heroSub}</p>
            <p className={s.heroPrice}>
              <strong>{heroBadge}</strong>
              <span>새 {item}의 1/3 수준</span>
            </p>
            <ContactButtons href={REQUEST_URL} cta="chair_request_hero" />
            <dl className={s.heroFacts}>
              {[
                { n: "1,000건+", l: "시공 완료" },
                { n: "4.9★", l: "네이버 평점" },
                { n: "당일", l: "완료 가능" },
              ].map((f) => (
                <div key={f.l}>
                  <dt>{f.n}</dt>
                  <dd>{f.l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className={s.scrollCue} aria-hidden="true">
          SCROLL <span />
        </div>
      </Scrub>
      <LandingSections sections={[["guide-cases", "시공 사례"], ["guide-process", "작업 과정"], ["guide-faq", "자주 묻는 질문"]]} />

      {/* ── 이하 본문: 뒤에 흐린 빛 구체가 떠다니고, 내용은 반투명 유리 카드 위에 ── */}
      <Scrub className={s.glassZone}>
        <div className={s.ambient} aria-hidden="true">
          <div className={s.ambientSticky}>
            <span className={`${s.ambientOrb} ${s.ambientOrb1}`} />
            <span className={`${s.ambientOrb} ${s.ambientOrb2}`} />
            <span className={`${s.ambientOrb} ${s.ambientOrb3}`} />
            <span className={s.grain} />
          </div>
        </div>

        {/* ★ 지역 배너 + 설명 (케이스 수 포함) */}
        {region && (
          <>
            <div className={s.regionBand}>{region} 지역 당일 출장 가능 · 영업 외 시간 방문 시공</div>
            <section data-service-section="regional_intro" className={s.regionIntro}>
              <div className={`${s.wrap} ${s.split}`}>
                <TitleCard as="p" kicker={`${region} 지역`} title="Area" />
                <div className={s.glass}>
                  <h2 className={s.title}>{isSofa ? `${region} 붙박이 ${sofaWord} 천갈이` : `${region} ${bizType} 의자 가죽 교체`}</h2>
                  <p className={s.body}>
                    {region} 지역 {isSofa ? `붙박이 ${sofaWord} 천갈이는` : `${bizType} 의자 가죽 교체는`} 리스토리가 당일 출장으로 해결합니다. 새 {item} 구매 비용의 1/3~1/5 수준으로, 영업 끝나고 방문해서 당일 완료합니다.
                    {regionCaseCount > 0 && (
                      <>
                        {" "}
                        {region} 지역 시공 완료 <strong style={{ color: "var(--ink)" }}>{regionCaseCount}건</strong>.
                      </>
                    )}{" "}
                    사진 한 장 보내주시면 {region} 출장 가능 여부와 개당 비용을 바로 안내드립니다.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* 2. 증거 — 전후 · 가격 비교 · 가죽 품질(캐릭터 #1) · 공장 직매입(글리치) */}
        <section data-service-section="cases" id="guide-cases" className={s.section}>
          <div className={s.wrap}>
            <div className={s.split}>
              <TitleCard kicker="교체 전후" title="Before / After" />
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["말보다 사진이 빠릅니다"]} />
                <InView className={s.sameSofa}>
                  <strong className={s.fade}>같은 의자입니다.</strong>
                  <span className={s.fade} style={{ transitionDelay: "0.1s" }}>
                    가죽만 교체했습니다
                  </span>
                </InView>
              </div>
            </div>
            <InView className={s.compare} threshold={0.15}>
              <div className={`${s.clip} ${s.compareItem}`}>
                <Image src="/images/chair/before-after-6.png" alt="가죽 교체 전 의자" fill className="object-cover" sizes="(min-width: 1200px) 580px, 50vw" />
                <span className={s.compareTag}>BEFORE</span>
              </div>
              <div className={`${s.clip} ${s.compareItem}`}>
                <Image src="/images/chair/before-after-5.png" alt="가죽 교체 후 의자" fill className="object-cover" sizes="(min-width: 1200px) 580px, 50vw" />
                <span className={s.compareTag} data-after>
                  AFTER
                </span>
              </div>
            </InView>

            <div className={`${s.glass} ${s.afterCard}`}>
              <dl className={s.priceList} data-cols="2">
                <div className={s.priceRow} data-tone="muted">
                  <dt>새 의자 6개 구매</dt>
                  <dd>40~150만원</dd>
                  <dd className={s.priceDesc}>+ 배송 2~5일 대기</dd>
                </div>
                <div className={s.priceRow} data-tone="blue">
                  <dt>리스토리 천갈이 6개</dt>
                  <dd>21만원~</dd>
                  <dd className={s.priceDesc}>+ 당일 완료</dd>
                </div>
              </dl>
            </div>

            <div className={`${s.split} ${s.afterCard}`}>
              <div className={s.stickyCol}>
                <TitleCard kicker="가죽 품질" title="Quality" as="p" />
                <Mascot
                  src="/images/chair/mascot-diagnose.png"
                  alt="찢어진 의자 방석 가죽을 들춰 살피는 리스토리 기사 캐릭터"
                  width={1168}
                  height={880}
                  className={s.mascotDiagnose}
                  bubble="가죽 두께부터 볼게요"
                />
              </div>
              <div className={s.glass}>
                <p className={s.kicker}>QUALITY PROOF</p>
                <h3 className={s.title}>저렴한데 왜 더 오래가나요?</h3>
                <p className={s.body}>
                  대부분 의자의 가죽은 얇은 중국산이에요. 리스토리는 <strong style={{ color: "var(--ink)" }}>100% 국내산 가죽</strong>만 사용합니다.
                </p>
                <div className={s.barList}>
                  <div className={s.bar}>
                    <p>
                      <span>기존 의자 (중국산)</span>
                      <b>0.25인치</b>
                    </p>
                    <i style={{ width: "25%" }} />
                  </div>
                  <div className={s.bar} data-tone="blue">
                    <p>
                      <span>리스토리 국내산</span>
                      <b>0.53인치</b>
                    </p>
                    <i style={{ width: "80%" }} />
                  </div>
                </div>
                <p className={s.badge}>2배 두꺼움 → 더 오래갑니다</p>
                <div className={s.compare}>
                  {[
                    { src: "/images/chair/leather-china.jpg", alt: "중국산 가죽 두께 0.25인치 측정", label: "중국산 기존 가죽 · 0.25인치" },
                    { src: "/images/chair/leather-korea.jpg", alt: "국내산 가죽 두께 0.53인치 측정", label: "리스토리 국내산 · 0.53인치", after: true },
                  ].map((ph) => (
                    <div key={ph.src} className={s.workImg}>
                      <Image src={ph.src} alt={ph.alt} fill className="object-cover" sizes="(min-width: 768px) 300px, 45vw" />
                      <span className={s.pairTag} data-after={ph.after || undefined}>
                        {ph.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`${s.glass} ${s.workGlass} ${s.afterCard}`}>
              <div className={`${s.workImg} ${s.workImgWide}`}>
                <Image src="/images/chair/factory-1.jpg" alt="리스토리 가죽 직매입 창고 — 국내산 가죽 1,000종 보유" fill className="object-cover" sizes="(min-width: 1200px) 1100px, 100vw" />
              </div>
              <div className={s.factoryBody}>
                <div>
                  <p className={s.kicker}>WHY SO AFFORDABLE</p>
                  <h3 className={s.title}>이 창고에서 직접 가져옵니다</h3>
                  <p className={s.note}>국내산 가죽 1,000종 · 중간 유통 없음</p>
                  <p className={s.body}>
                    도매상·유통사를 거치지 않아요. 가죽 공장에서 <strong style={{ color: "var(--ink)" }}>직매입</strong>하니까 국내산 고급 가죽을 새 의자보다 저렴하게 씁니다.
                  </p>
                  <p className={s.strongNote}>공장가 = 소비자가 · 품질 타협 없이 저렴한 이유</p>
                </div>
                <div className={s.vennWrap}>
                  <GlitchDiagram
                    label="국내산 가죽, 공장 직매입, 당일 시공이 함께여서 새 의자보다 합리적입니다"
                    shapes={<VennShapes top={["LEATHER", "국내산 가죽"]} left={["FACTORY", "공장 직매입"]} right={["SAME DAY", "당일 시공"]} core="Value" />}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Scrub>

      {/* 3. 가죽 샘플 (다른 가죽 랜딩과 같이 쓰는 섹션) */}
      <LeatherSampleSection requestHref={REQUEST_URL} />

      <Scrub className={s.glassZone}>
        <div className={s.ambient} aria-hidden="true">
          <div className={s.ambientSticky}>
            <span className={`${s.ambientOrb} ${s.ambientOrb1}`} />
            <span className={`${s.ambientOrb} ${s.ambientOrb2}`} />
            <span className={`${s.ambientOrb} ${s.ambientOrb3}`} />
            <span className={s.grain} />
          </div>
        </div>

        {/* 4. 리뷰 */}
        <section data-service-section="reviews" className={s.section}>
          <div className={s.wrap}>
            <div className={s.split}>
              <TitleCard kicker="사장님 후기" title="Reviews" as="p" />
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["직접 겪은 사장님들"]} />
                <div className={s.ratingRow}>
                  <p className={s.ratingScore}>4.9★</p>
                  <p className={s.note}>네이버 평점</p>
                </div>
              </div>
            </div>
            <div className={s.works}>
              {REVIEWS.map((r, idx) => (
                <InView key={r.name} threshold={0.2}>
                  <div className={`${s.glass} ${s.workGlass} ${s.fade}`} style={{ transitionDelay: `${idx * 0.1}s` }}>
                    <div className={`${s.workImg} ${s.workImgWide}`}>
                      <Image src={r.img} alt={r.name} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
                      <span className={s.pairTag} data-after>
                        {r.tag}
                      </span>
                    </div>
                    <div className={s.workMeta}>
                      <span className={s.tag}>
                        {r.unit} {r.count}
                      </span>
                      <p className={s.workSummary} data-full>
                        “{r.quote}”
                      </p>
                      <p className={s.note}>
                        {r.name} · {r.area}
                      </p>
                    </div>
                  </div>
                </InView>
              ))}
            </div>
            <CaseStrip region={region} />
          </div>
        </section>

        {/* 5. 작업 과정 — 캐릭터 #2 (행동 유도) */}
        <section data-service-section="process" id="guide-process" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <TitleCard kicker="작업 과정" title="Process" />
            <div className={s.glass}>
              <RiseLines className={s.title} lines={["사진 한 장이면", "나머지는 저희가 합니다"]} />
              <p className={s.body}>영업 전·후·새벽도 가능합니다</p>
            </div>
          </div>
          <div className={s.wrap}>
            <div className={`${s.glass} ${s.rowsCard}`}>
              <InView className={s.rows} as="ol" threshold={0.1}>
                {[
                  { step: "01", title: "사진 보내기", desc: "의자 사진 + 수량만 보내주세요. 확인 후 가능 여부와 개당 비용을 안내해드립니다.", time: "사진 접수" },
                  { step: "02", title: "방문 견적", desc: "원하는 날짜·시간에 기사가 방문해서 실물 샘플 보여드리고 정확한 금액 안내드립니다.", time: "무료" },
                  {
                    step: "03",
                    title: "당일 시공 완료",
                    desc: `영업 끝나고 와서 작업하고 갑니다. 뒷정리까지 하고 갑니다.${region ? ` ${region} 당일 완료.` : ""}`,
                    time: "당일 완료",
                  },
                ].map((p) => (
                  <li key={p.step} className={`${s.row} ${s.fade}`}>
                    <span className={s.rowNum}>{p.step}</span>
                    <h3 className={s.rowTitle}>{p.title}</h3>
                    <p className={s.rowDesc}>{p.desc}</p>
                    <span className={`${s.tag} ${s.rowAside}`}>{p.time}</span>
                  </li>
                ))}
              </InView>
            </div>
            <div data-chair-contact>
              <PhotoCtaCard
                title="사진 한 장이면 충분해요"
                sub={`${item} 사진 + 수량 + 지역만 보내주세요.`}
                href={REQUEST_URL}
                label={PHOTO_CTA}
                cta="chair_request_process"
              />
            </div>
          </div>
        </section>

        {/* 6. 신뢰 */}
        <section data-service-section="warranty" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <div className={s.stickyCol}>
              <TitleCard kicker="보증과 보험" title="Trust" />
            </div>
            <div>
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["걱정하시는 거", "다 알고 있어요"]} />
                <InView className={`${s.rows} ${s.rowsCompact}`} as="ol" threshold={0.1}>
                  {TRUST_ITEMS.map((t) => (
                    <li key={t.n} className={`${s.row} ${s.fade}`}>
                      <span className={s.rowNum}>{t.n}</span>
                      <h3 className={s.rowTitle}>{t.title}</h3>
                      <p className={s.rowDesc}>{t.desc}</p>
                    </li>
                  ))}
                </InView>
              </div>
              <div className={`${s.compare} ${s.afterCard}`}>
                {[
                  { src: "/images/cert-5.png", alt: "생산물배상책임보험증서" },
                  { src: "/images/cert-4.png", alt: "리스토리 A/S 보증서" },
                ].map((c) => (
                  <div key={c.src} className={`${s.glass} ${s.certCard}`}>
                    <Image src={c.src} alt={c.alt} width={300} height={400} className={s.certImg} />
                    <p>{c.alt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7. 영상 */}
        <section data-service-section="video" className={s.section}>
          <div className={s.wrap}>
            <div className={s.videoHead}>
              <TitleCard kicker="실제 시공 영상" title="Movie" />
            </div>
            <div className={`${s.glass} ${s.videoCard}`}>
              <YouTubeFacade videoId="mvMybNNafKk" title="리스토리 의자 가죽 교체 시공 영상" label="의자 가죽 교체 시공 영상 재생" />
            </div>
          </div>
        </section>

        {/* 8. FAQ */}
        <section data-service-section="faq" id="guide-faq" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <div className={s.stickyCol}>
              <TitleCard kicker="자주 묻는 질문" title="FAQ" as="p" />
            </div>
            <div>
              <h2 className={`${s.title} ${s.faqHeading}`}>자주 묻는 질문</h2>
              <FaqList items={FAQ_ITEMS} idPrefix="chair-faq" />
            </div>
          </div>
        </section>
      </Scrub>

      {/* 9. CONTACT — 캐릭터 #3 (마무리) */}
      <Scrub as="section" data-service-section="contact" className={s.contact}>
        <Star className={s.contactStar} />
        <RunCrew />
        <div className={s.wrap} style={{ position: "relative" }}>
          <Link href={REQUEST_URL} className={s.contactBig} aria-label={PHOTO_CTA} data-cta="chair_request_contact_title">
            <RollText text="CONTACT" />
          </Link>
          <div className={s.split}>
            <p className={s.labelSmall} style={{ color: "rgba(255,255,255,0.7)" }}>
              지금 바로 시작하세요
            </p>
            <div>
              <h2 className={s.contactTitle} style={{ whiteSpace: "pre-line" }}>
                {region
                  ? isSofa
                    ? `${region} ${sofaWord} 사진 한 장이면\n충분합니다`
                    : `${region} 의자 사진 한 장이면\n충분합니다`
                  : "의자 사진 한 장이면\n충분합니다"}
              </h2>
              <p className={s.contactSub}>수량 + 지역만 알려주시면 바로 견적 드립니다</p>
              <ContactButtons href={REQUEST_URL} onBlue cta="chair_request_contact" />
              <div className={s.chips}>
                {["개당 3만원~", "당일 완료", "무상 A/S", "야간 시공 가능"].map((b) => (
                  <span key={b}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Scrub>

      <LandingIntake field="leather" service={isSofa ? "leather" : "chairs"} />
      <FloatingCTA compactMobile avoidOverlapSelector="[data-chair-contact]" label={PHOTO_CTA} kakaoUrl={REQUEST_URL} newTab={false} />
    </main>
  );
}
