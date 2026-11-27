"use client";

import { LandingTrail, LandingIntake, LandingSections } from "./shared/LandingNavigation";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LeatherSampleSection from "./Leathersamplesection";
import FloatingCTA from "@/app/components/landing/shared/FloatingCTA";
import { FAQJsonLd, ServiceJsonLd } from "@/app/components/JsonLd";
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

const PHONE = buildTrackedContactPath("phone", "meeting_table_leather");
// 사진 상담은 자체 접수 양식으로 (회의 테이블 천갈이 항목이 미리 선택된 상태로 열림)
const REQUEST_URL = `/request?item=${encodeURIComponent("회의 테이블 천갈이")}`;
const PHOTO_CTA = "사진 올리고 견적 받기";

const REVIEWS = [
  {
    img: "/images/cases/case-014-after.jpg",
    count: "회의실",
    unit: "상판 가죽 교체",
    area: "서울 강남구",
    name: "법인 고객",
    quote: "테이블을 새로 사야 하나 고민했는데 상판만 바꾸니 회의실 분위기가 바로 달라졌습니다.",
    tag: "업무 전 작업",
  },
  {
    img: "/images/cases/case-012-after.jpg",
    count: "중역실",
    unit: "인조가죽 마감",
    area: "인천 송도",
    name: "사무실 고객",
    quote: "가죽 샘플 보고 고를 수 있어서 좋았고, 일정 맞춰 방문해주셔서 업무 지장 없이 끝났습니다.",
    tag: "일정 조율",
  },
];

const PROCESS_STEPS = [
  { step: "01", title: "사진 보내기", desc: "테이블 전체 사진과 상판 손상 부위 사진을 보내주세요. 교체 가능 여부를 먼저 확인해드립니다.", time: "사진 접수" },
  { step: "02", title: "방문 견적", desc: "원하는 날짜·시간에 방문해서 상판 크기, 모서리 마감, 가죽 샘플을 확인하고 정확한 금액을 안내드립니다.", time: "무료" },
  { step: "03", title: "일정 맞춤 시공", desc: "회의 일정과 업무 시간을 피해 기존 가죽 제거, 표면 정리, 새 인조가죽 마감까지 진행합니다.", time: "일정 조율" },
];

const TRUST_ITEMS = [
  { n: "01", title: "마감 불량 무상 보완", desc: "시공 후 들뜸이나 마감 미흡이 확인되면 무상으로 다시 방문해 보완합니다." },
  { n: "02", title: "생산물 배상책임보험 가입", desc: "현장 작업 중 예상치 못한 문제가 생겨도 보험 기준에 따라 책임 있게 대응합니다." },
  { n: "03", title: "방문 전 견적 범위 안내", desc: "사진으로 상판 상태를 먼저 확인하고, 방문 전 교체 가능 여부와 비용 범위를 안내합니다." },
];

const FAQ_ITEMS = [
  {
    q: "회의실 테이블 상판 가죽만 교체 가능한가요?",
    a: "네. 상판 구조가 살아있다면 기존 인조가죽을 제거하고 새 원단으로 교체할 수 있습니다. 사진으로 먼저 가능 여부를 확인해드립니다.",
  },
  {
    q: "중역 테이블도 현장에서 작업하나요?",
    a: "대부분 현장 작업으로 진행합니다. 테이블 크기와 마감 방식에 따라 분해가 필요한 경우에는 방문 견적 때 안내드립니다.",
  },
  {
    q: "색상이나 질감 변경도 가능한가요?",
    a: "가능합니다. 블랙, 브라운, 그레이 계열부터 사무실 분위기에 맞는 인조가죽 샘플을 비교해 선택하실 수 있습니다.",
  },
  {
    q: "업무 시간 외 작업도 가능한가요?",
    a: "가능합니다. 회의실 사용 일정에 맞춰 퇴근 후, 주말, 휴무일 작업 일정을 조율합니다.",
  },
  {
    q: "A/S는 어떻게 되나요?",
    a: "시공 후 들뜸이나 마감 미흡이 있으면 무상으로 재방문해 보완합니다.",
  },
];

function parseKeyword(keyword?: string) {
  const kw = keyword ? keyword.replace(/-/g, " ") : "";
  const region = REGIONS.find((r) => kw.includes(r)) ?? "";

  const tableWord = kw.includes("중역")
    ? "중역 테이블"
    : kw.includes("책상")
      ? "회의실 책상"
      : kw.includes("회의테이블")
        ? "회의테이블"
        : "회의실 테이블";

  const materialWord = kw.includes("인조가죽") || kw.includes("인조 가죽")
    ? "인조가죽"
    : "가죽";

  return { region, tableWord, materialWord };
}

/* 가로 스크롤 시공 사례 */
function TableCaseStrip({ region }: { region?: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tableCases = cases
    .filter((c) => c.parentCategory === "가죽 리폼" && c.category === "회의실 테이블 가죽 교체")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const matched = region ? tableCases.filter((c) => c.region.includes(region)) : [];
  const rest = tableCases.filter((c) => !matched.includes(c));
  const caseItems = [...matched, ...rest].slice(0, 6);

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

  if (caseItems.length === 0) return null;

  return (
    <div className={s.strip}>
      <div className={s.secHead} style={{ marginBottom: 16 }}>
        <p className={s.labelSmall}>테이블 가죽 교체 사례</p>
        <Link href={`/cases?cat=${encodeURIComponent("회의실 테이블 가죽 교체")}`} className={s.arrowLink}>
          <RollText text="VIEW ALL" />
          <Arrow />
        </Link>
      </div>
      <div ref={scrollRef} onScroll={handleScroll} className={s.stripTrack}>
        {caseItems.map((item) => (
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
      {caseItems.length > 1 && (
        <div className={s.dots}>
          {caseItems.map((_, i) => (
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
      )}
    </div>
  );
}

/* 사진 접수 + 전화 버튼 한 줄 (하단 고정 버튼이 겹치지 않도록 data-table-contact) */
function ContactButtons({ onBlue = false, cta }: { onBlue?: boolean; cta: string }) {
  return (
    <div data-table-contact className={s.btnRow}>
      <Link href={REQUEST_URL} className={onBlue ? s.btnOnBlue : s.btnPrimary} data-cta={cta}>
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

export default function MeetingTableLeatherLanding({ keyword }: Props) {
  const { region, tableWord, materialWord } = parseKeyword(keyword);

  // 기존 h1 문구를 줄 단위로 (줄마다 다른 텍스처가 채워짐)
  const heroTitle = region ? [`${region} ${tableWord}`, `${materialWord} 교체`] : ["회의실 테이블", "인조가죽 교체"];
  const heroSub = region
    ? `${region} 사무실 방문 시공 · 상판 가죽 벗겨짐·오염·갈라짐 교체`
    : "중역 테이블 상판 가죽, 새로 사지 말고 교체하세요";
  const targetUrl = keyword
    ? `https://www.restorystudio.co.kr/leather/${keyword}`
    : "https://www.restorystudio.co.kr/leather/회의실-테이블-인조가죽-교체";

  return (
    <main data-service-id="meeting-table" data-service-keyword={keyword} className={`${s.page} ${display.variable}`}>
      <ServiceJsonLd
        name={region ? `${region} ${tableWord} ${materialWord} 교체` : "회의실 테이블 인조가죽 교체"}
        description="회의실 테이블·중역 테이블 상판 인조가죽 교체 전문. 가죽 벗겨짐, 오염, 갈라짐을 새 인조가죽으로 교체합니다."
        url={targetUrl}
      />
      <FAQJsonLd faqs={FAQ_ITEMS} />

      {/* 1. HERO — 회의실 테이블 사진 위 반투명 안개, 흐린 빛 구체, 텍스처가 채워진 대형 제목 */}
      <Scrub as="section" data-service-section="hero" data-premium-hero className={s.hero}>
        <div className={s.heroBg}>
          <Image src="/images/cases/case-014-after.jpg" alt="" fill priority className="object-cover" sizes="100vw" />
        </div>
        <span className={`${s.orb} ${s.orbA}`} aria-hidden="true" />
        <span className={`${s.orb} ${s.orbB}`} aria-hidden="true" />
        <span className={`${s.orb} ${s.orbC}`} aria-hidden="true" />
        <span className={s.grain} aria-hidden="true" />
        <div className={s.heroTrail}>
          <LandingTrail field="leather" title="회의실 테이블 가죽 교체" />
        </div>
        <p className={s.heroGhost} aria-hidden="true">
          RE&apos;STORY MEETING TABLE
        </p>

        <div className={`${s.wrap} ${s.heroInner}`}>
          <p className={`${s.heroEyebrow} ${s.heroFade}`}>
            {region ? `${region} 회의실 테이블 가죽 교체` : "리스토리 테이블 가죽 교체"}
          </p>
          <RiseLines onLoad as="h1" className={s.heroTitle} lines={heroTitle} />
          <p className={`${s.heroEn} ${s.heroFade}`} style={{ animationDelay: "0.25s" }}>
            Renew the top, keep the table.
          </p>

          <div className={`${s.heroGlass} ${s.heroFade}`} style={{ animationDelay: "0.35s" }}>
            <p className={s.heroSub}>{heroSub}</p>
            <p className={s.heroPrice}>
              <strong>새 테이블 구매 전</strong>
              <span>상판 가죽만 먼저 확인</span>
            </p>
            <ContactButtons cta="meeting_table_request_hero" />
            <dl className={s.heroFacts}>
              {[
                { n: "상판만", l: "부분 교체" },
                { n: "현장", l: "방문 시공" },
                { n: "무상", l: "마감 A/S" },
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

        {/* ★ 지역 배너 + 설명 */}
        {region && (
          <>
            <div className={s.regionBand}>{region} 사무실 방문 가능 · 회의 일정에 맞춰 작업 조율</div>
            <section data-service-section="regional_intro" className={s.regionIntro}>
              <div className={`${s.wrap} ${s.split}`}>
                <TitleCard as="p" kicker={`${region} 지역`} title="Area" />
                <div className={s.glass}>
                  <h2 className={s.title}>
                    {region} {tableWord} {materialWord} 교체
                  </h2>
                  <p className={s.body}>
                    {region} 지역 회의실·중역 테이블 상판 가죽 교체는 리스토리가 방문 작업으로 해결합니다. 새 테이블 구매보다 부담을 낮추고, 회의 일정과 업무 시간에 맞춰 작업 시간을 조율합니다. 사진 3장만 보내주시면 {region} 방문 가능 여부와 교체 범위를 바로 안내해드립니다.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* 2. 증거 — 전후 · 비용 비교 · 가죽 품질(캐릭터 #1) · 직매입(글리치) */}
        <section data-service-section="cases" id="guide-cases" className={s.section}>
          <div className={s.wrap}>
            <div className={s.split}>
              <TitleCard kicker="BEFORE / AFTER" title="Before / After" />
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["상판 가죽만 바꿔도", "회의실 분위기가 달라집니다"]} />
                <InView className={s.sameSofa}>
                  <strong className={s.fade}>같은 테이블입니다.</strong>
                  <span className={s.fade} style={{ transitionDelay: "0.1s" }}>
                    상판 인조가죽만 교체했습니다
                  </span>
                </InView>
              </div>
            </div>
            <InView className={s.compare} threshold={0.15}>
              <div className={`${s.clip} ${s.compareItem}`}>
                <Image src="/images/cases/case-014-before.jpg" alt="회의실 테이블 가죽 교체 BEFORE" fill className="object-cover" sizes="(min-width: 1200px) 580px, 50vw" />
                <span className={s.compareTag}>BEFORE</span>
              </div>
              <div className={`${s.clip} ${s.compareItem}`}>
                <Image src="/images/cases/case-014-after.jpg" alt="회의실 테이블 가죽 교체 AFTER" fill className="object-cover" sizes="(min-width: 1200px) 580px, 50vw" />
                <span className={s.compareTag} data-after>
                  AFTER
                </span>
              </div>
            </InView>

            <div className={`${s.glass} ${s.afterCard}`}>
              <dl className={s.priceList} data-cols="2">
                <div className={s.priceRow} data-tone="muted">
                  <dt>새 회의 테이블 구매</dt>
                  <dd>수십~수백만원</dd>
                  <dd className={s.priceDesc}>+ 운반·폐기 부담</dd>
                </div>
                <div className={s.priceRow} data-tone="blue">
                  <dt>리스토리 상판 교체</dt>
                  <dd>부분 리폼</dd>
                  <dd className={s.priceDesc}>+ 일정 맞춤 작업</dd>
                </div>
              </dl>
            </div>

            <div className={`${s.split} ${s.afterCard}`}>
              <div className={s.stickyCol}>
                <TitleCard kicker="가죽 품질" title="Quality" as="p" />
                <Mascot
                  src="/images/chair/mascot-diagnose.png"
                  alt="낡은 가죽을 들춰 상태를 살피는 리스토리 기사 캐릭터"
                  width={1168}
                  height={880}
                  className={s.mascotDiagnose}
                  bubble="상판 가죽 상태부터 볼게요"
                />
              </div>
              <div className={s.glass}>
                <p className={s.kicker}>QUALITY PROOF</p>
                <h3 className={s.title}>넓은 상판이라 더 두꺼운 자재가 필요합니다</h3>
                <p className={s.body}>
                  회의실 테이블은 손, 노트북, 문서가 계속 닿는 면적이 넓습니다. 리스토리는 <strong style={{ color: "var(--ink)" }}>국내산 인조가죽</strong>을 기준으로 샘플을 비교해 안내합니다.
                </p>
                <div className={s.barList}>
                  <div className={s.bar}>
                    <p>
                      <span>기존 저가형 가죽</span>
                      <b>얇은 마감</b>
                    </p>
                    <i style={{ width: "28%" }} />
                  </div>
                  <div className={s.bar} data-tone="blue">
                    <p>
                      <span>리스토리 국내산</span>
                      <b>두꺼운 마감</b>
                    </p>
                    <i style={{ width: "82%" }} />
                  </div>
                </div>
                <p className={s.badge}>두께감 있는 자재 · 상판에 맞게 선택</p>
                <div className={s.compare}>
                  {[
                    { src: "/images/chair/leather-china.jpg", alt: "기존 저가형 가죽 두께 비교", label: "기존 저가형 · 얇은 마감" },
                    { src: "/images/chair/leather-korea.jpg", alt: "리스토리 국내산 가죽 두께 비교", label: "리스토리 국내산 · 두꺼운 마감", after: true },
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
                <Image src="/images/chair/factory-1.jpg" alt="리스토리 가죽 직매입 창고" fill className="object-cover" sizes="(min-width: 1200px) 1100px, 100vw" />
              </div>
              <div className={s.factoryBody}>
                <div>
                  <p className={s.kicker}>WHY SO AFFORDABLE</p>
                  <h3 className={s.title}>이 창고에서 직접 가져옵니다</h3>
                  <p className={s.note}>국내산 인조가죽 샘플 · 중간 유통 최소화</p>
                  <p className={s.body}>
                    도매상·유통사를 거치지 않고 가죽 공장에서 직접 가져오는 구조라 넓은 테이블 상판도 품질을 낮추지 않고 합리적인 견적으로 안내할 수 있습니다.
                  </p>
                  <p className={s.strongNote}>공장가에 가까운 견적 · 품질 타협 없이</p>
                </div>
                <div className={s.vennWrap}>
                  <GlitchDiagram
                    label="국내산 인조가죽, 공장 직매입, 일정 맞춤 시공이 함께여서 새 테이블보다 합리적입니다"
                    shapes={<VennShapes top={["LEATHER", "국내산 가죽"]} left={["FACTORY", "공장 직매입"]} right={["SCHEDULE", "일정 맞춤"]} core="Value" />}
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
              <TitleCard kicker="REVIEWS" title="Reviews" as="p" />
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["직접 맡긴 사무실들"]} />
                <div className={s.ratingRow}>
                  <p className={s.ratingScore}>4.9★</p>
                  <p className={s.note}>시공 만족도</p>
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
                        {r.count} · {r.unit}
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
            <TableCaseStrip region={region} />
          </div>
        </section>

        {/* 5. 작업 과정 — 캐릭터 #2 (행동 유도) */}
        <section data-service-section="process" id="guide-process" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <TitleCard kicker="HOW IT WORKS" title="Process" />
            <div className={s.glass}>
              <RiseLines className={s.title} lines={["사진 한 장이면", "나머지는 저희가 합니다"]} />
              <p className={s.body}>회의 전·후, 업무 시간에 맞춰 조율 가능합니다</p>
            </div>
          </div>
          <div className={s.wrap}>
            <div className={`${s.glass} ${s.rowsCard}`}>
              <InView className={s.rows} as="ol" threshold={0.1}>
                {PROCESS_STEPS.map((p) => (
                  <li key={p.step} className={`${s.row} ${s.fade}`}>
                    <span className={s.rowNum}>{p.step}</span>
                    <h3 className={s.rowTitle}>{p.title}</h3>
                    <p className={s.rowDesc}>{p.desc}</p>
                    <span className={`${s.tag} ${s.rowAside}`}>{p.time}</span>
                  </li>
                ))}
              </InView>
            </div>
            <div data-table-contact>
              <PhotoCtaCard
                title="사진 한 장이면 충분해요"
                sub="테이블 전체 + 손상 부위 사진, 지역만 보내주세요."
                href={REQUEST_URL}
                label={PHOTO_CTA}
                cta="meeting_table_request_process"
              />
            </div>
          </div>
        </section>

        {/* 6. 신뢰 */}
        <section data-service-section="warranty" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <div className={s.stickyCol}>
              <TitleCard kicker="TRUST" title="Trust" />
            </div>
            <div>
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["사무실 작업이라도", "걱정 없게 준비합니다"]} />
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
                  { src: "/images/cert-5.png", alt: "생산물 배상책임보험" },
                  { src: "/images/cert-4.png", alt: "리스토리 A/S 보증" },
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
              <TitleCard kicker="실제 가죽 교체 작업은 이렇게 진행됩니다" title="Movie" />
            </div>
            <div className={`${s.glass} ${s.videoCard}`}>
              <YouTubeFacade videoId="LEax7aI5kWc" title="리스토리 가죽 교체 시공 영상" label="실제 가죽 교체 시공 영상 보기" />
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
              <FaqList items={FAQ_ITEMS} idPrefix="table-faq" />
            </div>
          </div>
        </section>
      </Scrub>

      {/* 9. CONTACT — 캐릭터 #3 (마무리) */}
      <Scrub as="section" data-service-section="contact" className={s.contact}>
        <Star className={s.contactStar} />
        <RunCrew />
        <div className={s.wrap} style={{ position: "relative" }}>
          <Link href={REQUEST_URL} className={s.contactBig} aria-label={PHOTO_CTA} data-cta="meeting_table_request_contact_title">
            <RollText text="CONTACT" />
          </Link>
          <div className={s.split}>
            <p className={s.labelSmall} style={{ color: "rgba(255,255,255,0.7)" }}>
              사진으로 먼저 확인하세요
            </p>
            <div>
              <h2 className={s.contactTitle} style={{ whiteSpace: "pre-line" }}>
                {region ? `${region} 테이블 사진 한 장이면\n가능 여부를 안내드립니다` : "테이블 사진 한 장이면\n가능 여부를 안내드립니다"}
              </h2>
              <p className={s.contactSub}>전체 사진 + 손상 부위 사진 + 지역만 보내주세요</p>
              <ContactButtons onBlue cta="meeting_table_request_contact" />
              <div className={s.chips}>
                {["상판만 부분 교체", "방문 시공", "일정 맞춤 작업", "마감 무상 A/S"].map((b) => (
                  <span key={b}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Scrub>

      <LandingIntake field="leather" item="회의 테이블 천갈이" />
      <FloatingCTA compactMobile avoidOverlapSelector="[data-table-contact]" label={PHOTO_CTA} kakaoUrl={REQUEST_URL} newTab={false} />
    </main>
  );
}
