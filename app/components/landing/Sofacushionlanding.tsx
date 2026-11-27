"use client";

import { LandingTrail, LandingIntake, LandingSections } from "./shared/LandingNavigation";
import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import FloatingCTA from "@/app/components/landing/shared/FloatingCTA";
import { ServiceJsonLd, FAQJsonLd } from "@/app/components/JsonLd";
import { buildTrackedContactPath } from "@/lib/attribution";
import { cases } from "@/lib/case-data";
import { REGIONS } from "@/lib/seo-regions";
import {
  Scrub,
  InView,
  InkText,
  RiseLines,
  RollText,
} from "./premium/Motion";
import { display } from "./premium/fonts";
import { Arrow, CameraIcon, Star, YouTubeFacade, GlitchDiagram, VennShapes, Mascot, TitleCard, RunCrew } from "./premium/Blocks";
import s from "./premium/premium.module.css";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const PHONE = buildTrackedContactPath("phone", "sofa_cushion");
// 사진 상담은 자체 접수 양식으로 (소파 항목이 미리 선택된 상태로 열림)
const REQUEST_URL = "/request?service=sofa";

const FAQ_ITEMS = [
  {
    q: "우리 집 소파도 복원할 수 있나요?",
    a: "쿠션의 탄성 저하, 밴드 늘어짐, 스프링 이탈 등 원인과 내부 구조에 따라 가능한 작업이 달라집니다. 전체 모습과 꺼진 부분 사진으로 먼저 살펴보고, 사진에 드러나지 않는 손상은 현장 확인이 필요할 수 있습니다.",
  },
  {
    q: "사진을 보내면 무엇을 알 수 있나요?",
    a: "복원 가능성을 1차로 살펴보고 예상 비용 범위와 방문 가능 일정을 상담합니다. 전체 모습과 꺼진 부분 사진에 지역·증상을 함께 적어주세요. 추가 사진이나 내부 확인이 필요한 부분도 안내합니다.",
  },
  {
    q: "복원 비용은 어떻게 정해지나요?",
    a: "좌석 수와 꺼진 범위, 내부 구조의 상태, 필요한 자재와 작업에 따라 달라집니다. 사진으로 예상 범위를 상담하고, 자재·공임·출장비 등 포함 항목과 추가 확인이 필요한 부분을 작업 전에 함께 확인해 주세요.",
  },
  {
    q: "언제 방문하고, 작업은 얼마나 걸리나요?",
    a: "방문 일정은 지역과 예약 상황에 맞춰 상담합니다. 작업 소요시간은 내부 상태와 필요한 작업 범위를 확인한 뒤 상담합니다. 작업시간은 문의부터 방문까지의 대기 시간을 뜻하지 않습니다.",
  },
  {
    q: "직접 소파를 옮겨야 하나요?",
    a: "사진 상담 때 소파가 놓인 공간과 지역을 알려주세요. 현장에서 작업할 수 있는지, 작업 공간 확보나 별도 이동이 필요한지 소파 구조와 상태에 맞춰 상담합니다.",
  },
  {
    q: "수리 후 다시 꺼지면 어떻게 하나요?",
    a: "시공한 부위에 문제가 생기면 해당 부분의 사진과 증상을 보내주세요. A/S 대상 부위·기간·처리 방식은 작업 내용에 따라 상담에서 확인해 주세요.",
  },
  {
    q: "가죽 교체나 의자 천갈이도 함께 문의할 수 있나요?",
    a: "함께 작업하고 싶은 가구의 전체 사진과 손상 부위를 보내주세요. 작업 가능 여부, 필요한 준비와 추가 비용을 각각 확인해 안내합니다.",
  },
];

const FEATURED_CASES = [
  {
    id: "case-080",
    title: "가운데가 푹 꺼진 나뚜찌 소파",
    cause: "밴드 늘어짐 · 스펀지 노후",
    work: "고탄성 스펀지 충진과 하부 밴드 보강",
  },
  {
    id: "case-081",
    title: "앉을 때 지지력이 약해진 소파",
    cause: "S자 스프링 이탈",
    work: "이탈한 스프링을 잡고 엘라스틱 밴드로 보강",
  },
];

const METHOD_ITEMS = [
  { n: "01", title: "쿠션의 탄성이 줄었을 때", desc: "압착되거나 노후된 스펀지 상태를 확인합니다. 필요한 부분에 스펀지를 보강한 작업 사례를 확인해 보세요.", id: "case-080" },
  { n: "02", title: "밴드가 늘어나거나 빠졌을 때", desc: "좌방석을 받치는 밴드의 연결 부위와 늘어짐을 확인합니다. 하부 지지 구조를 보강한 사례가 있습니다.", id: "case-101" },
  { n: "03", title: "스프링이 이탈했을 때", desc: "안쪽 스프링과 고정 부위를 살펴봅니다. 이탈한 스프링을 다시 잡고 밴드로 보강한 과정을 볼 수 있습니다.", id: "case-081" },
];

const PROCESS_ITEMS = [
  {
    step: "01", title: "사진으로 1차 상담", time: "사진 · 지역",
    desc: "전체 모습과 꺼진 부분 사진, 지역·증상을 보내주세요. 복원 가능성과 예상 비용 범위, 방문 일정을 상담합니다.",
  },
  {
    step: "02", title: "현장에서 상태 확인", time: "내부 확인",
    desc: "사진에 보이지 않는 쿠션과 하부 구조를 살펴봅니다. 필요한 작업과 비용에 영향을 주는 부분을 함께 확인합니다.",
  },
  {
    step: "03", title: "필요한 부위 복원", time: "상태별 작업",
    desc: "확인한 원인에 맞춰 쿠션과 지지 구조를 보강하고, 작업한 부위의 지지 상태와 착석감을 확인합니다.",
  },
];

const COST_ITEMS = [
  { n: "01", title: "좌석 수와 꺼진 범위", desc: "한 자리만 꺼졌는지, 여러 자리의 지지력이 함께 약해졌는지 확인합니다." },
  { n: "02", title: "쿠션과 내부 지지 구조", desc: "스펀지·밴드·스프링·프레임 중 어떤 부분에 작업이 필요한지 살펴봅니다." },
  { n: "03", title: "작업 내용과 방문 조건", desc: "필요한 자재와 작업, 현장 공간과 지역을 함께 확인합니다." },
];

/* ─────────────────────────────────────────
   keyword → 지역·증상·표기(소파/쇼파) 파싱
───────────────────────────────────────── */
function parseKeyword(keyword: string): {
  region: string;
  symptom: string;
  sofaWord: string;
} {
  const kw = keyword.replace(/-/g, " ");
  const region = REGIONS.find((r) => kw.includes(r)) ?? "";
  const sofaWord = kw.includes("쇼파") ? "쇼파" : "소파";
  const symptom = kw.includes("꺼짐")
    ? "꺼짐"
    : kw.includes("주저앉음")
      ? "주저앉음"
      : kw.includes("처짐")
        ? "처짐"
        : kw.includes("탄성")
          ? "탄성저하"
          : "꺼짐";
  return { region, symptom, sofaWord };
}

/* ─────────────────────────────────────────
   CaseStrip — 가로 스크롤 사례
───────────────────────────────────────── */
function CaseStrip({ region }: { region?: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allCases = cases
    .filter((c) => c.category === "소파 복원")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const matched = region
    ? allCases.filter((c) => c.region.includes(region))
    : [];
  const rest = allCases.filter((c) => !matched.includes(c));
  const CASE_ITEMS = [...matched, ...rest].slice(0, 6);

  const cardStep = () => {
    const el = scrollRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    return first ? first.offsetWidth + 14 : 0;
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    const w = cardStep();
    if (el && w > 0) setActiveIdx(Math.round(el.scrollLeft / w));
  };

  const scrollTo = (i: number) => {
    scrollRef.current?.scrollTo({ left: i * cardStep(), behavior: "smooth" });
  };

  return (
    <div className={s.strip}>
      <div className={s.secHead} style={{ marginBottom: 24 }}>
        <p className={s.labelSmall}>More cases · 실제 복원 사례</p>
        <Link href="/cases?cat=소파 복원" className={s.arrowLink}>
          <RollText text="VIEW ALL" />
          <Arrow />
        </Link>
      </div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={s.stripTrack}>
        {CASE_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={`/cases/${item.id}`}
            draggable={false}
            className={`${s.stripCard} ${s.work}`}>
            <div className={s.workImg}>
              <Image
                src={item.beforeImg}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 320px, 74vw"
                draggable={false}
              />
              <span className={s.compareTag} style={{ top: 10, left: 10, bottom: "auto", fontSize: 10, padding: "5px 10px" }}>
                BEFORE
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
            aria-label={`${i + 1}번째 복원 사례 보기`}
            aria-current={i === activeIdx ? "true" : undefined}
            onClick={() => scrollTo(i)}>
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PROPS
───────────────────────────────────────── */
interface Props {
  keyword?: string;
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export default function SofaCushionLanding({ keyword }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { region, symptom, sofaWord } = keyword
    ? parseKeyword(keyword)
    : { region: "", symptom: "", sofaWord: "소파" };

  const heroTitle = region
    ? [`${region} ${sofaWord}`, `${symptom}, 교체 전에`, "복원부터."]
    : ["꺼진 소파를", "다시 편안한", "자리로."];
  const heroSub = region
    ? `${region} ${sofaWord} ${symptom}, 사진으로 먼저 살펴보고 내부 상태에 맞는 복원 방법을 상담합니다.`
    : "겉은 괜찮은데 앉는 자리만 푹 꺼지나요? 내부 보강으로 다시 쓸 수 있는지 살펴봅니다.";

  // 지역 케이스 수 (thin content 방지용 동적 데이터)
  const regionCaseCount = region
    ? cases.filter(
        (c) => c.category === "소파 복원" && c.region.includes(region),
      ).length
    : 0;

  return (
    <main
      data-service-id="sofa-sag"
      data-service-keyword={keyword}
      className={`${s.page} ${display.variable}`}>
      <ServiceJsonLd
        name={
          region
            ? `${region} ${sofaWord} ${symptom} 복원 수리`
            : "소파 쿠션 복원"
        }
        description="소파 꺼짐·주저앉음의 원인과 내부 상태를 확인하고 스펀지·밴드·스프링에 필요한 복원 작업을 상담합니다. 사진으로 복원 가능성과 예상 비용 범위를 먼저 살펴보세요."
        includeAggregateRating={false}
        url={
          keyword
            ? `https://www.restorystudio.co.kr/sofa/${keyword}`
            : "https://www.restorystudio.co.kr/sofa"
        }
      />
      <FAQJsonLd faqs={FAQ_ITEMS} />

      {/* 1. HERO — 밝은 배경 위 반투명 소파 사진, 흐린 빛 구체, 그라데이션 대형 타이포 */}
      <Scrub as="section" data-service-section="hero" data-premium-hero className={s.hero}>
        <div className={s.heroBg}>
          <Image
            src="/images/sofa/hero-sofa-studio.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <span className={`${s.orb} ${s.orbA}`} aria-hidden="true" />
        <span className={`${s.orb} ${s.orbB}`} aria-hidden="true" />
        <span className={`${s.orb} ${s.orbC}`} aria-hidden="true" />
        <span className={s.grain} aria-hidden="true" />
        <div className={s.heroTrail}>
          <LandingTrail field="sofa" title="소파 복원" />
        </div>
        <p className={s.heroGhost} aria-hidden="true">
          RE&apos;STORY SOFA RESTORATION
        </p>

        <div className={`${s.wrap} ${s.heroInner}`}>
          <p className={`${s.heroEyebrow} ${s.heroFade}`}>
            {region ? `${region} · Sofa Restoration` : "Re'Story · Sofa Cushion Restoration"}
          </p>
          <RiseLines onLoad as="h1" className={s.heroTitle} lines={heroTitle} />
          <p className={`${s.heroEn} ${s.heroFade}`} style={{ animationDelay: "0.25s" }}>
            Restore the comfort, keep the sofa.
          </p>

          <div className={`${s.heroGlass} ${s.heroFade}`} style={{ animationDelay: "0.35s" }}>
            <p className={s.heroSub}>{heroSub}</p>
            <div className={s.btnRow}>
              <Link href={REQUEST_URL} className={s.btnPrimary} data-cta="sofa_request_hero">
                <CameraIcon />
                사진 올리고 상담 받기
              </Link>
              <a href={PHONE} className={s.btnDark}>
                <RollText text="전화 문의" />
                <Arrow />
              </a>
            </div>
            <p className={s.heroHint}>
              전체 모습 · 꺼진 부분 사진과 지역·증상을 보내주세요.
              사진으로 알기 어려운 내부 손상은 현장 확인이 필요할 수 있습니다.
            </p>
            <dl className={s.heroFacts}>
              {[
                { n: "가능한 작업", l: "사진으로 1차 확인" },
                { n: "예상 비용", l: "작업 범위 상담" },
                { n: "방문 일정", l: "지역·예약 확인" },
              ].map((f) => (
                <div key={f.n}>
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
      <LandingSections sections={[["guide-cases", "시공 사례"], ["guide-budget", "예상 비용"], ["guide-faq", "자주 묻는 질문"]]} />

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

        {/* ★ 지역 배너 + 설명 (thin content 방지) */}
        {region && (
          <>
            <div className={s.regionBand}>
              {region} 출장 가능 여부와 일정을 사진으로 문의하세요
            </div>
            <section data-service-section="regional_intro" className={s.regionIntro}>
              <div className={`${s.wrap} ${s.split}`}>
                <TitleCard as="p" kicker={`${region} 지역`} title="Area" />
                <div className={s.glass}>
                  <h2 className={s.title}>
                    {region} {sofaWord} {symptom} 복원 수리
                  </h2>
                  <p className={s.body}>
                    {region} 지역 {sofaWord} {symptom} 증상은 내부 쿠션과 지지 구조의
                    상태에 따라 필요한 작업이 달라집니다. 사진으로 먼저 살펴보고,
                    내부 확인이 필요한 부분과 방문 가능한 일정을 상담합니다.
                    {regionCaseCount > 0 && (
                      <>
                        {" "}
                        현재 공개된 {region} 지역 소파 복원 사례는{" "}
                        <strong style={{ color: "var(--ink)" }}>{regionCaseCount}건</strong>
                        입니다.
                      </>
                    )}{" "}
                    소파의 전체 모습과 꺼진 부분, 지역과 증상을 함께 보내주세요.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* 2. CONCERN */}
        <section data-service-section="concern" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <div className={s.stickyCol}>
              <TitleCard kicker="꺼짐의 원인" title="Why it sags" />
              <Mascot
                src="/images/sofa/mascot-diagnose.png"
                alt="꺼진 소파 쿠션을 손으로 눌러 확인하는 리스토리 기사 캐릭터"
                width={1168}
                height={880}
                className={s.mascotDiagnose}
                bubble="어디가 꺼졌는지부터 볼게요"
              />
            </div>
            <div className={s.glass}>
              <InkText
                lines={[
                  "겉은 아직 멀쩡한데",
                  "앉는 자리만 푹 꺼졌다면,",
                  "바꾸기 전에",
                  "속부터 확인해 볼 때입니다.",
                ]}
              />
              <InView className={s.concernBody}>
                <p className={`${s.body} ${s.fade}`}>
                  소파가 꺼지는 이유는 하나가 아닙니다. 오래 눌린 스펀지,
                  늘어난 밴드, 자리를 벗어난 스프링처럼 원인이 겹쳐 있는 경우가 많습니다.
                </p>
                <p className={`${s.body} ${s.fade}`} style={{ transitionDelay: "0.12s" }}>
                  쿠션뿐 아니라 아래에서 몸을 받쳐주는 구조까지 함께 살펴보고,
                  필요한 자재와 보강 방법은 상태를 확인한 뒤 정합니다.
                </p>
              </InView>
            </div>
          </div>
        </section>

        {/* 거대한 회색 영문 — 스크롤에 따라 좌우로 흐름 */}
        <Scrub className={s.marquee} aria-hidden="true">
          <span className={s.marqueeLine}>Restore the comfort,</span>
          <span className={s.marqueeLine}>keep the sofa you love.</span>
        </Scrub>

        {/* 3. BEFORE / AFTER */}
        <section data-service-section="cases" id="guide-cases" className={s.section}>
          <div className={s.wrap}>
            <div className={s.split}>
              <TitleCard kicker="복원 전후" title="Before / After" />
              <div className={s.glass}>
                <RiseLines
                  className={s.title}
                  lines={["먼저, 비슷한 소파의", "복원 과정을 보세요"]}
                />
                <InView className={s.sameSofa}>
                  <strong className={s.fade}>같은 소파입니다.</strong>
                  <span className={s.fade} style={{ transitionDelay: "0.1s" }}>교체 없이 복원만 했습니다</span>
                </InView>
                <p className={s.note}>
                  복원 전후의 모습입니다. 가능한 개선 범위는 소파의 구조와 손상 상태에 따라 달라집니다.
                </p>
              </div>
            </div>
            <InView className={s.compare} threshold={0.15}>
              <div className={`${s.clip} ${s.compareItem}`}>
                <Image src="/images/sofa/before-after-1.jpg" alt="복원 전 꺼진 소파" fill className="object-cover" sizes="(min-width: 1200px) 580px, 50vw" />
                <span className={s.compareTag}>BEFORE</span>
              </div>
              <div className={`${s.clip} ${s.compareItem}`}>
                <Image src="/images/sofa/before-after-2.jpg" alt="복원 후 소파" fill className="object-cover" sizes="(min-width: 1200px) 580px, 50vw" />
                <span className={s.compareTag} data-after>AFTER</span>
              </div>
            </InView>

            <div className={s.works}>
              {FEATURED_CASES.map((proof, idx) => {
                const item = cases.find((entry) => entry.id === proof.id);
                if (!item) return null;
                return (
                  <InView key={proof.id} threshold={0.2}>
                    <Link href={`/cases/${proof.id}`} className={`${s.work} ${s.glass} ${s.workGlass} ${s.fade}`} style={{ transitionDelay: `${idx * 0.12}s` }}>
                      <div className={s.workImg}>
                        <Image src={item.afterImg} alt={`${item.region} 소파 복원 후`} fill sizes="(min-width: 700px) 50vw, 100vw" className="object-cover" />
                      </div>
                      <div className={s.workMeta}>
                        <span className={s.tag}>{item.region} · 해당 현장 약 2시간</span>
                        <h3 className={s.workTitle}>{proof.title}</h3>
                        <dl className={s.workDl}>
                          <div><dt>확인한 원인</dt><dd>{proof.cause}</dd></div>
                          <div><dt>진행한 작업</dt><dd>{proof.work}</dd></div>
                        </dl>
                        <span className={`${s.arrowLink} ${s.workMore}`}>
                          <RollText text="READ MORE" />
                          <Arrow />
                        </span>
                      </div>
                    </Link>
                  </InView>
                );
              })}
            </div>
            <CaseStrip region={region} />
          </div>
        </section>

        {/* 풀블리드 이미지 밴드 — 스크롤하면 모서리가 펴지며 화면을 채움 */}
        <Scrub className={s.band}>
          <div className={s.bandFrame}>
            <Image src="/images/sofa/before-after-2.jpg" alt="" fill className="object-cover" sizes="100vw" />
          </div>
          <div className={`${s.wrap} ${s.bandText}`}>
            <p className={s.bandTitle}>RESTORE</p>
            <Link href="/cases?cat=소파 복원" className={`${s.arrowLink} ${s.bandLink}`}>
              <RollText text="ALL CASES" />
              <Arrow />
            </Link>
          </div>
        </Scrub>

        {/* 4. METHOD */}
        <section data-service-section="scope" className={s.section}>
          <div className={s.wrap}>
            <div className={s.split}>
              <div className={s.stickyCol}>
                <TitleCard kicker="복원 방식" title="How we repair" />
              </div>
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["같은 꺼짐이어도,", "손봐야 할 곳은 다릅니다"]} />
                <InView>
                  <p className={`${s.body} ${s.fade}`}>
                    쿠션뿐 아니라 아래에서 몸을 받쳐주는 구조도 살펴봅니다.
                    스펀지 · 밴드 · 스프링이 함께 받쳐줄 때 착석감이 돌아옵니다.
                    필요한 자재와 보강 방법은 상태를 확인한 뒤 정합니다.
                  </p>
                </InView>
                <div className={s.vennWrap}>
                  <GlitchDiagram
                    label="스펀지, 밴드, 스프링 세 가지 구조가 함께 받쳐야 편안한 착석감이 돌아옵니다"
                    shapes={<VennShapes top={["CUSHION", "스펀지"]} left={["BAND", "밴드"]} right={["SPRING", "스프링"]} core="Comfort" />}
                  />
                </div>
              </div>
            </div>
            <div className={`${s.glass} ${s.rowsCard}`}>
              <InView className={s.rows} as="ol" threshold={0.1}>
                {METHOD_ITEMS.map((item) => (
                  <li key={item.n} className={`${s.row} ${s.fade}`}>
                    <span className={s.rowNum}>{item.n}</span>
                    <h3 className={s.rowTitle}>{item.title}</h3>
                    <p className={s.rowDesc}>{item.desc}</p>
                    <Link href={`/cases/${item.id}`} className={`${s.arrowLink} ${s.rowAside}`} aria-label={`${item.title} 작업 사례 보기`}>
                      <RollText text="CASE" />
                      <Arrow />
                    </Link>
                  </li>
                ))}
              </InView>
            </div>
          </div>
        </section>

        {/* 5. PROCESS */}
        <section data-service-section="process" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <TitleCard kicker="진행 순서" title="Process" />
            <div className={s.glass}>
              <RiseLines className={s.title} lines={["사진 상담부터", "필요한 복원 작업까지"]} />
              <InView>
                <p className={`${s.body} ${s.fade}`}>
                  가능한 작업과 준비할 내용을 순서대로 살펴봅니다
                </p>
              </InView>
            </div>
          </div>
          <div className={s.wrap}>
            <div className={`${s.glass} ${s.rowsCard}`}>
              <InView className={s.rows} as="ol" threshold={0.1}>
                {PROCESS_ITEMS.map((p) => (
                  <li key={p.step} className={`${s.row} ${s.fade}`}>
                    <span className={s.rowNum}>{p.step}</span>
                    <h3 className={s.rowTitle}>{p.title}</h3>
                    <p className={s.rowDesc}>{p.desc}</p>
                    <span className={`${s.tag} ${s.rowAside}`}>{p.time}</span>
                  </li>
                ))}
              </InView>
            </div>
            <p className={`${s.note} ${s.afterCard}`}>
              작업 소요시간은 내부 상태와 필요한 작업 범위를 확인한 뒤 상담합니다.
              방문 날짜는 지역과 예약 상황에 맞춰 별도로 상담합니다.
            </p>
            <InView className={`${s.glass} ${s.ctaCard}`} threshold={0.3}>
              <div className={s.ctaMascot}>
                <Image
                  src="/images/premium/mascot-phone.png"
                  alt="소파 사진이 담긴 휴대폰을 들고 엄지를 든 리스토리 기사 캐릭터"
                  width={880}
                  height={1168}
                  sizes="(min-width: 768px) 180px, 112px"
                />
              </div>
              <div className={s.ctaText}>
                <p className={s.ctaTitle}>사진 한 장이면 시작돼요</p>
                <p className={s.ctaSub}>전체 모습과 꺼진 부분 사진, 지역만 보내주세요.</p>
              </div>
              <Link href={REQUEST_URL} className={`${s.btnPrimary} ${s.ctaBtn}`} data-cta="sofa_request_mid">
                <CameraIcon />
                사진 올리고 견적 받기
              </Link>
            </InView>
          </div>
        </section>

        {/* 6. COST & AFTERCARE */}
        <section data-service-section="budget" id="guide-budget" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <div className={s.stickyCol}>
              <TitleCard kicker="비용과 A/S" title="Cost & Care" />
            </div>
            <div>
              <div className={s.glass}>
                <RiseLines className={s.title} lines={["가격을 비교할 때,", "작업 범위도 같이 보세요"]} />
                <InView>
                  <p className={`${s.body} ${s.fade}`}>
                    소파마다 구조와 손상 정도가 다릅니다. 전체를 바꿀지, 필요한 부분을 복원할지
                    판단할 수 있도록 사진으로 예상 비용 범위를 먼저 상담합니다.
                  </p>
                </InView>
                <InView className={`${s.rows} ${s.rowsCompact}`} as="ol" threshold={0.1}>
                  {COST_ITEMS.map((item) => (
                    <li key={item.n} className={`${s.row} ${s.fade}`}>
                      <span className={s.rowNum}>{item.n}</span>
                      <h3 className={s.rowTitle}>{item.title}</h3>
                      <p className={s.rowDesc}>{item.desc}</p>
                    </li>
                  ))}
                </InView>
              </div>
              <InView>
                <div className={`${s.glass} ${s.checkBox} ${s.fade}`}>
                  <h3>작업을 결정하기 전, 함께 확인하세요</h3>
                  <ul>
                    <li>안내받은 금액의 자재·공임·출장비 포함 여부</li>
                    <li>현장 확인 후 작업 범위가 달라질 수 있는 부분</li>
                    <li>A/S 대상 부위·기간·처리 방법</li>
                  </ul>
                  <p className={s.note}>
                    시공한 부위에 문제가 생기면 사진과 증상을 보내주세요. 작업 내용을 기준으로 상담합니다.
                  </p>
                </div>
              </InView>
            </div>
          </div>
        </section>

        {/* 7. VIDEO */}
        <section data-service-section="video" className={s.section}>
          <div className={s.wrap}>
            <div className={s.videoHead}>
              <TitleCard kicker="실제 시공 영상" title="Movie" />
            </div>
            <div className={`${s.glass} ${s.videoCard}`}>
              <YouTubeFacade videoId="WkxTbZnYz6c" title="리스토리 소파 쿠션 복원 시공 영상" label="리스토리 소파 꺼짐 복원 수리 현장 영상 재생" />
            </div>
          </div>
        </section>

        {/* 8. FAQ */}
        <section data-service-section="faq" id="guide-faq" className={s.section}>
          <div className={`${s.wrap} ${s.split}`}>
            <div className={s.stickyCol}>
              <TitleCard kicker="자주 묻는 질문" title="FAQ" />
            </div>
            <div className={`${s.glass} ${s.faq} ${s.faqCard}`}>
              {FAQ_ITEMS.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={i} className={s.faqItem}>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`sofa-faq-${i}`}
                      onClick={() => setOpenFaq(open ? null : i)}
                      className={s.faqQ}>
                      <span>
                        <b>Q{i + 1}</b>
                        {f.q}
                      </span>
                      <span className={s.plus} aria-hidden="true" />
                    </button>
                    <div id={`sofa-faq-${i}`} className={s.faqA} data-open={open} aria-hidden={!open}>
                      <div>
                        <p>{f.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </Scrub>

      {/* 9. CONTACT 밴드 */}
      <Scrub as="section" data-service-section="contact" className={s.contact}>
        <Star className={s.contactStar} />
        <RunCrew />
        <div className={s.wrap} style={{ position: "relative" }}>
          <Link href={REQUEST_URL} className={s.contactBig} aria-label="사진 올리고 상담 받기" data-cta="sofa_request_contact_title">
            <RollText text="CONTACT" />
          </Link>
          <div className={s.split}>
            <p className={s.labelSmall} style={{ color: "rgba(255,255,255,0.7)" }}>교체를 결정하기 전에</p>
            <div>
              <h2 className={s.contactTitle}>
                {region ? (
                  <>
                    {region} {sofaWord} {symptom},<br />
                    우리 집 소파부터 확인하세요
                  </>
                ) : (
                  <>
                    우리 집 소파도
                    <br />
                    다시 편하게 쓸 수 있을까요?
                  </>
                )}
              </h2>
              <p className={s.contactSub}>
                사진으로 가능한 작업과 예상 비용 범위, 방문 일정을 상담하세요.
              </p>
              <div className={s.btnRow}>
                <Link href={REQUEST_URL} className={s.btnOnBlue} data-cta="sofa_request_contact">
                  <CameraIcon />
                  사진 올리고 상담 받기
                </Link>
                <a href={PHONE} className={s.btnGhost}>
                  <RollText text="1688-2957" />
                </a>
              </div>
              <div className={s.chips}>
                {["전체 모습", "꺼진 부분", "지역", "증상"].map((b) => (
                  <span key={b}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Scrub>

      <LandingIntake field="sofa" service="sofa" />
      <FloatingCTA compactMobile label="사진 올리고 복원 가능성 확인" kakaoUrl={REQUEST_URL} newTab={false} />
    </main>
  );
}
