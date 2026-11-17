import Image from "next/image";
import Link from "next/link";
import { EnrollButton, EnrollmentProvider } from "./EnrollmentDialog";
import FieldVideo from "./FieldVideo";
import AcademyIntroVideo from "./AcademyIntroVideo";
import AcademyTracking from "./AcademyTracking";
import MobileConsultBar from "./MobileConsultBar";
import { ACADEMY_OFFER as offer } from "@/lib/academy/offer";
import { cases } from "@/lib/case-data";
import styles from "./gisal.module.css";

const proofTopics: Record<string, { title: string; question: string }> = {
  "case-128": { title: "상부장 보강·재설치", question: "처짐의 원인을 확인한 뒤, 어떤 부분을 보강해야 할까요?" },
  "case-127": { title: "싱크대 문짝 교체", question: "기존 몸통을 살릴 수 있는지, 무엇을 확인해야 할까요?" },
  "case-115": { title: "붙박이 소파 천갈이", question: "찢어진 좌방석을 다시 마감하려면, 어떤 작업이 필요할까요?" },
  "case-101": { title: "소파 꺼짐 복원", question: "꺼짐의 원인에 따라 밴드와 쿠션을 어떻게 보강할까요?" },
};
const proofCases = cases.filter(item => Object.hasOwn(proofTopics, item.id));
const businessCase = cases.find(item => item.id === "case-115");
const setupChannelGroups = [
  { title: "필요한 고객에게 발견되기", purpose: "지역과 서비스 정보를 고객이 찾을 수 있게 준비합니다.", channels: ["네이버 플레이스", "당근", "숨고"] },
  { title: "내 서비스를 이해하고 선택하기", purpose: "소개와 작업 사례를 보고, 문의할 방법을 알 수 있게 준비합니다.", channels: ["사이트", "블로그"] },
  { title: "작업 소식과 생각을 이어서 전하기", purpose: "내 사업의 이야기를 꾸준히 올릴 채널의 기본을 준비합니다.", channels: ["인스타그램", "쓰레드", "유튜브"] },
] as const;

function cx(names: string) { return names.split(" ").map(name => styles[name]).join(" "); }

export default function GisalLanding() {
  return <EnrollmentProvider>

  <AcademyTracking />
  <a href="#main" className={cx("skip-link")}>본문으로 건너뛰기</a>
  <header className={cx("header")}>
    <div className={cx("wrap nav")}>
      <div className={cx("brandCollab")}>
        <a className={cx("brand")} href="#main" aria-label="기술로 살아남기 홈"><span className={cx("brand-mark")}>기살<span>.</span></span></a>
        <span className={cx("collabCross")} aria-hidden="true">×</span>
        <Link className={cx("restoryBrand")} href="/" aria-label="Restory 리스토리 메인으로 이동">Restory</Link>
      </div>
      <nav aria-label="메인 메뉴"><a href="#about">기살의 생각</a><a href="#people">현장 이야기</a><a href="#curriculum">커리큘럼</a><a href="#apply">모집 안내</a></nav>
      <EnrollButton className={cx("nav-cta")} />
    </div>
  </header>
  <main id="main">
    <section id="academy-hero" className={cx("hero")} aria-labelledby="hero-title">
      <div className={cx("hero-photo")} aria-hidden="true"></div>
      <div className={cx("hero-shade")} aria-hidden="true"></div>
      <div className={cx("wrap hero-inner")}>
        <div className={cx("hero-copy")}>
          <div className={cx("eyebrow")}><span className={cx("status-dot")}></span> 가구수리 출장 창업 {offer.cohort}기 <span className={cx("divider")}>/</span> 단 {offer.seats}명</div>
          <h1 id="hero-title">기술로 먹고살려면,<br /><span className={cx("highlight")}>사업을 알아야 합니다.</span></h1>
          <p className={cx("hero-desc")}>내 기술을 고객에게 알리고, 내 이름으로 사업할 준비.<br /><strong>사업자의 마인드·원칙, 브랜딩·마케팅·운영을 배웁니다.</strong><br />기술이 처음이어도 실제 시공 현장에서<br />강사 지도 아래 직접 실습하며 함께 배웁니다.</p>
          <figure className={cx("hero-team")} aria-label="기술로 살아남기를 함께하는 리스토리 형제"><Image className={cx("hero-team-first")} src="/gisal-assets/restory-hero-portrait.png" width="1000" height="1000" alt="리스토리 형제의 첫 번째 프로필 사진" fetchPriority="high" decoding="async" loading="eager" /><Image className={cx("hero-team-second")} src="/gisal-assets/restory-second-cutout-v2.png" alt="리스토리 형제의 두 번째 프로필 사진" fetchPriority="high" decoding="async" width="1060" height="1484" loading="eager" /></figure>
          <div className={cx("hero-price")}><span className={cx("price-label")}>{offer.cohort}기 기본 수강료</span><span className={cx("hero-price-now")}>{offer.basicPrice}<span>만 원</span></span></div>
          <div className={cx("hero-actions")}><EnrollButton location="hero" className={cx("button button-green")} /><a className={cx("text-link")} href="#plan-comparison">{offer.basicPrice}·{offer.setupPrice}만 원 과정 비교 <span aria-hidden="true">↓</span></a></div>
          <p className={cx("hero-consult-note")}>현재 상황과 창업 목표를 듣고, 과정 적합도와 시작 방향을 함께 확인합니다.</p>
          <p className={cx("hero-footnote")}>{offer.weeks}주 사업 교육 · {offer.weeks}주간 주 {offer.fieldSessionsPerWeek}회 현장 기술 교육<br />{offer.startDate} 개강 예정</p><p className={cx("practice-note")}>{offer.practiceCondition}</p>
        </div>
        <div className={cx("hero-aside")} aria-hidden="true"><div className={cx("vertical-note")}>BUILD YOUR SKILL. BUILD YOUR BUSINESS.</div><div className={cx("cohort-seal")}><span>FIRST CLASS</span><strong>{String(offer.seats).padStart(2, "0")}</strong><span>함께 시작할 네 사람</span></div><div className={cx("image-caption")}><span className={cx("portrait-label")}>RESTORY BROTHERS</span>리스토리 형제와 함께,<br /><b>기술부터 사업까지.</b></div></div>
      </div>
      <p className={cx("heroArtNote")}>배경은 교육 방향을 표현한 연출 이미지입니다.</p>
    </section>
    <section className={cx("quick-facts")} aria-label="1기 모집 핵심 정보"><div className={cx("wrap fact-row")}><div><span className={cx("fact-label")}>START</span><strong>{offer.startDateShort} <small>월요일 개강 예정</small></strong></div><div><span className={cx("fact-label")}>TOGETHER</span><strong>{offer.seats}명 <small>소수 정예</small></strong></div><div><span className={cx("fact-label")}>FIRST CLASS</span><strong>{offer.basicPrice}만 원 <small>{offer.cohort}기 기본 수강료</small></strong></div><a href="#apply" className={cx("fact-link")}>모집 자세히 보기 <span aria-hidden="true">↗</span></a></div></section>

    <section id="prepare" className={cx("offer-overview section-light")} aria-labelledby="prepare-title">
      <div className={cx("wrap offer-overview-grid")}>
        <div className={cx("overview-goals")}>
          <span className={cx("kicker")}>LEARNING GOALS · 사업을 준비하는 교육</span>
          <h2 id="prepare-title">내 사업을 준비하는<br /><span className={cx("underline-green")}>세 가지 학습 목표.</span></h2>
          <ol className={cx("overview-goals-list")}>
            <li><span aria-hidden="true">01</span><div><p className={cx("goal-question")}>어떤 기준으로 내 사업을 시작할까요?</p><h3>사업의 기준과 브랜드 방향</h3><p>내가 지킬 원칙과 고객에게 전할 가치를 정리합니다.</p></div></li>
            <li><span aria-hidden="true">02</span><div><p className={cx("goal-question")}>내 기술이 필요한 고객은 어떻게 만날까요?</p><h3>고객을 만나는 마케팅 흐름</h3><p>고객이 나를 발견하고 문의하기까지의 흐름을 설계합니다.</p></div></li>
            <li><span aria-hidden="true">03</span><div><p className={cx("goal-question")}>사이트를 만든 뒤에도 관리할 수 있을까요?</p><h3>직접 운영할 사업 사이트</h3><p>사이트를 만들고, 작업 사례·고객·일정을 관리하는 법을 배웁니다.</p></div></li>
          </ol>
          <a className={cx("overview-link")} href="#curriculum">5주 사업 교육·현장 교육 구성 보기 <span aria-hidden="true">↓</span></a>
        </div>
        <div id="plan-comparison" className={cx("plan-comparison")}>
          <table>
            <caption>교육은 같고,<br />초기 준비 방식이 다릅니다.</caption>
            <thead><tr><th scope="col">구성</th><th scope="col">기본 과정<strong>{offer.basicPrice}만 원</strong></th><th scope="col">{offer.setupName}<strong>{offer.setupPrice}만 원</strong></th></tr></thead>
            <tbody>
              <tr><th scope="row">사업·현장 교육</th><td>{offer.weeks}주 사업 교육<br />{offer.weeks}주간 주 {offer.fieldSessionsPerWeek}회 현장 기술 교육</td><td>기본 과정의<br />교육 모두 포함</td></tr>
              <tr><th scope="row">추가 기술 교육</th><td>주 {offer.fieldSessionsPerWeek}회 외·수료 후에도<br /><strong>추가 비용 없이 신청</strong><br />현장 일정에 맞춰 조율</td><td>기본 과정과<br />동일하게 신청 가능</td></tr>
              <tr><th scope="row">사이트·채널 준비</th><td>제작·운영 방법을 배우며<br /><strong>직접 구축</strong></td><td><strong>기살이 초기 구축</strong><br />수강생은 직접<br />운영법 학습</td></tr>
              <tr><th scope="row">이런 분께</th><td>배운 내용을 직접 구축하며 시작하고 싶은 분</td><td>초기 구축은 맡기고, 이후 직접 운영할 준비를 하고 싶은 분</td></tr>
            </tbody>
          </table>
          <p>{offer.setupName}는 기본 과정을 포함한 총 {offer.setupPrice}만 원입니다.<br /><strong>기본 과정에 {offer.setupPrice - offer.basicPrice}만 원을 더해 기살의 초기 구축과 운영 인계를 받는 구성입니다.</strong></p>
          <div className={cx("overview-plan-links")}><a href="#apply">기본 과정 상세 보기 <span aria-hidden="true">↓</span></a><a href="#premium">8개 채널 셋업 보기 <span aria-hidden="true">↓</span></a></div>
        </div>
      </div>
    </section>

    <AcademyIntroVideo />

    <section id="about" className={cx("about-focus")} aria-labelledby="about-title">
      <div className={cx("wrap about-focus-inner")}>
        <span className={cx("about-focus-label")}>WHY GISAL · 사업의 본질</span>
        <h2 id="about-title">고객에게 필요한 일을 하고,<br /><span>그 가치를 알리는 것부터.</span></h2>
        <p className={cx("about-focus-copy")}>기술을 익히는 일과 함께, 고객이 나를 찾고 선택하는 이유를 고민해야 합니다.<br /><strong>기살은 내 일의 기준을 세우고, 고객과 만나며, 사업을 운영하는 법을 다룹니다.</strong></p>
        <section className={cx("business-reality")} aria-labelledby="business-reality-title">
          <h3 id="business-reality-title">시작하는 것과,<br />본업으로 이어가는 것은 다릅니다.</h3>
          <div className={cx("business-reality-grid")}>
            <article className={cx("business-reality-card")} aria-labelledby="founder-experience-title">
              <span className={cx("business-reality-label")}>대표 개인 경험</span>
              <h4 id="founder-experience-title">함께 가구수리를 하던<br /><strong>10명 중 3명</strong></h4>
              <p className={cx("business-reality-context")}>3년 뒤에도 가구수리를 본업으로 이어갔습니다.</p>
              <figure className={cx("reality-chart")} role="img" aria-label="대표 개인 경험: 10명 중 본업 유지 3명, 다른 일 또는 부업으로 전환 7명">
                <div className={cx("reality-people")} aria-hidden="true">
                  {Array.from({ length: 10 }, (_, index) => (
                    <svg key={index} className={cx(index < 3 ? "reality-person reality-person-active" : "reality-person")} viewBox="0 0 24 40" focusable="false">
                      <circle cx="12" cy="6" r="4" />
                      <path d="M9 13h6a4 4 0 0 1 4 4v10h-4v11H9V27H5V17a4 4 0 0 1 4-4Z" />
                    </svg>
                  ))}
                </div>
                <figcaption className={cx("reality-chart-legend")}>
                  <span><span><i className={cx("reality-key reality-key-active")} aria-hidden="true" />본업 유지</span><strong>3명</strong></span>
                  <span><span><i className={cx("reality-key")} aria-hidden="true" />다른 일·부업 전환</span><strong>7명</strong></span>
                </figcaption>
              </figure>
              <p>나머지 7명은 다른 일을 시작하거나, 가구수리를 부업으로 전환했습니다. 이 경험은 기술을 익히는 것과 그 기술로 생계를 이어가는 일을 함께 고민하게 했습니다.</p>
              <p className={cx("business-reality-note")}>2026년 11월 대표의 회고입니다. 함께했던 10명에 대한 개인 경험이며, 업계 전체의 폐업 통계가 아닙니다.</p>
            </article>
            <article className={cx("business-reality-card business-reality-stat")} aria-labelledby="sole-business-stat-title">
              <span className={cx("business-reality-label")}>공식 통계 · 전국, 전 업종</span>
              <h4 id="sole-business-stat-title">종사자 1인 기업의 3년 생존율<strong>45.1<span>%</span></strong></h4>
              <p className={cx("business-reality-context")}>2021년 신생기업이 2024년까지 지속한 비율입니다.</p>
              <figure className={cx("reality-chart")} role="img" aria-label="전국 전 업종 종사자 1인 기업: 2021년 신생기업 전체 100% 중 2024년까지 생존한 기업 45.1%">
                <div className={cx("reality-bar-scale")} aria-hidden="true"><span>0%</span><span>전체 100%</span></div>
                <div className={cx("reality-bar")} aria-hidden="true"><span style={{ width: "45.1%" }} /></div>
                <figcaption className={cx("reality-chart-legend")}>
                  <span><span><i className={cx("reality-key reality-key-active")} aria-hidden="true" />3년 뒤 생존</span><strong>45.1%</strong></span>
                </figcaption>
              </figure>
              <p>국가데이터처 「2025년 기업생멸행정통계(잠정)」의 종사자 1인 기업 기준입니다.</p>
              <p className={cx("business-reality-note")}>2024년 기준 잠정치 · 2026년 10월 22일 발표.<br />가구수리만의 통계나 본업 유지율은 아니며, 생존이 충분한 소득을 뜻하지는 않습니다.</p>
              <a className={cx("business-reality-source")} href="https://mods.go.kr/boardDownload.es?bid=11469&list_no=447531&seq=1#page=64" target="_blank" rel="noopener noreferrer">공식 통계 원문 · 본문 58쪽 <span className={cx("sr-only")}>(PDF, 새 탭)</span><span aria-hidden="true">↗</span></a>
            </article>
          </div>
          <div className={cx("business-reality-bridge")}>
            <p><strong>기술과 함께, 고객을 만나고 사업을 운영할 준비가 필요합니다.</strong><br />기살에서는 강사의 실제 운영 사례를 살펴보고, 내 사업의 원칙과 고객을 만나는 방법을 배웁니다.</p>
            <a className={cx("text-link")} href="#business-proof">실제 사례로 사업 교육 방식 보기 <span aria-hidden="true">↓</span></a>
          </div>
        </section>
        <div className={cx("audience-fit")}>
          <h3>{offer.applicantTitle}</h3>
          <p>쉽게 번다는 말에 지쳤다면, 내 사업을 제대로 공부해 보세요.<br />기술이 처음이어도 괜찮습니다. {offer.applicantMindset}</p>
          <ul className={cx("fit-list")}>
            <li>고객이 왜 나를 선택하는지, 사업이 어떻게 이어지는지 깊이 공부할 분</li>
            <li>배운 내용을 직접 적용하고, 잘되지 않는 이유도 스스로 돌아볼 분</li>
            <li>익숙한 생각을 바꾸는 불편함을 받아들이고, 피드백을 바탕으로 다시 시도할 분</li>
          </ul>
          <div className={cx("fit-guidance")}>
            <h4>직접 실행하되, 배우는 과정에는 길잡이가 있습니다.</h4>
            <p>강사의 실제 사업 운영 사례로 고객과 일을 바라보는 관점을 배우고, 현장에서는 강사의 지도 아래 실습한 뒤 피드백을 받습니다.</p>
          </div>
          <p className={cx("fit-expectation")}>수업과 현장 참여, 배운 내용의 실행이 필요한 과정입니다. 수익이나 창업 성과를 보장하지 않습니다.</p>
        </div>
      </div>
    </section>

    <section id="business-proof" className={cx("business-proof")} aria-labelledby="business-proof-title">
      <div className={cx("wrap")}>
        <span className={cx("kicker")}>리스토리의 실제 사업 운영</span>
        <h2 id="business-proof-title">작업을 알리고, 선택을 돕고,<br /><span className={cx("green")}>문의할 길을 만듭니다.</span></h2>
        <p className={cx("section-intro")}>시공 사례 한 편에도 고객의 문제, 작업을 선택한 이유, 문의 방법이 담겨 있습니다.<br />실제 붙박이 소파 천갈이 사례로 사업 교육의 관점을 살펴보세요.</p>
        {businessCase && <div className={cx("business-case")}>
          <div className={cx("business-case-photos")}>
            <figure><Image src={businessCase.beforeImg} alt="천갈이 전, 앞쪽 인조가죽이 찢어진 매장 붙박이 소파" width={1800} height={1200} sizes="(max-width: 760px) 45vw, 260px" /><figcaption>실제 시공 전</figcaption></figure>
            <figure><Image src={businessCase.afterImg} alt="천갈이 후, 기존 구조를 살려 새 인조가죽으로 마감한 붙박이 소파" width={1800} height={1200} sizes="(max-width: 760px) 45vw, 260px" /><figcaption>실제 시공 후</figcaption></figure>
          </div>
          <div className={cx("business-case-copy")}>
            <span className={cx("business-proof-number")}>사업 교육 예시 · 인천 계양구 매장</span>
            <h3>소파를 고친 일을,<br />고객이 이해할 수 있는 제안으로.</h3>
            <p>{businessCase.summary}</p>
            <Link href={`/cases/${businessCase.id}`} target="_blank" rel="noopener noreferrer" prefetch={false} data-academy-business-proof="record">실제 사례 전체 읽기 <span className={cx("sr-only")}>(새 탭)</span><span aria-hidden="true">↗</span></Link>
          </div>
        </div>}
        <ol className={cx("business-proof-grid")}>
          <li>
            <span className={cx("business-proof-number")}>01 · 고객 이해</span>
            <h3>어떤 고객의 문제를 해결하나요?</h3>
            <p>이 사례는 매장 좌방석 앞쪽이 찢어져 내부 충전재가 보이는 상황에서 시작합니다. 기술의 이름을 나열하기 전에 고객이 겪는 구체적인 문제를 봅니다.</p>
            <p className={cx("business-lesson-question")}><strong>직접 생각해 보기</strong>내가 만나려는 고객은 누구이고, 어떤 불편을 해결할 수 있을까요?</p>
          </li>
          <li>
            <span className={cx("business-proof-number")}>02 · 가치 설명</span>
            <h3>왜 이 작업을 제안했을까요?</h3>
            <p>좌방석과 하부 상태를 확인한 뒤, 기존 구조를 살려 새 인조가죽으로 마감했습니다. 무엇을 고치는지와 그 판단의 근거를 함께 설명합니다.</p>
            <p className={cx("business-lesson-question")}><strong>직접 생각해 보기</strong>고객이 내 서비스를 선택할 이유를 어떤 근거로 설명할 수 있을까요?</p>
          </li>
          <li>
            <span className={cx("business-proof-number")}>03 · 문의 설계</span>
            <h3>고객의 다음 행동은 무엇인가요?</h3>
            <p>사례 글 끝에는 전체 사진 1장과 손상 부위 가까운 사진 1장을 보내 달라고 안내합니다. 관심을 가진 고객이 무엇을 준비해 문의하면 되는지 구체적으로 보여줍니다.</p>
            <p className={cx("business-lesson-question")}><strong>직접 생각해 보기</strong>내 서비스에 문의하기 전, 고객에게 어떤 정보를 요청해야 할까요?</p>
          </li>
        </ol>
        <div className={cx("business-proof-links")}><Link href="/cases" target="_blank" rel="noopener noreferrer" prefetch={false} data-academy-business-proof="browse">다른 실제 사례 보기 <span className={cx("sr-only")}>(새 탭)</span><span aria-hidden="true">↗</span></Link><Link href="/" target="_blank" rel="noopener noreferrer" prefetch={false} data-academy-business-proof="inquiry">서비스의 문의 동선 보기 <span className={cx("sr-only")}>(새 탭)</span><span aria-hidden="true">↗</span></Link></div>
        <p className={cx("business-proof-note")}>공개된 강사의 시공 사례를 사업 관점으로 읽는 해설 예시입니다. 사진은 교육생 실습 장면이 아니며, 교육생 성과나 특정 문의·매출 증가를 의미하지 않습니다.</p>
      </div>
    </section>

    <section id="curriculum" className={cx("curriculum roadmap")} aria-labelledby="roadmap-title">
      <div className={cx("wrap roadmap-inner")}>
        <header className={cx("roadmap-heading")}><span className={cx("roadmap-label")}>CURRICULUM</span><h2 id="roadmap-title">5주 동안 사업을 설계하고,<br /><span className={cx("green")}>주 2회 현장에서 기술을 배웁니다.</span></h2></header>
        <div className={cx("dual-track")}>
          <div><span>TRACK A · 사업을 만드는 {offer.weeks}주</span><h3>사업의 본질부터 내 운영 기반까지</h3><p>집중할 환경과 사업 원칙을 세우고, 고객에게 알리는 방법과 직접 운영할 웹사이트를 배웁니다.</p></div>
          <div><span>TRACK B · 현장에서 배우는 기술</span><h3>{offer.weeks}주간 주 {offer.fieldSessionsPerWeek}회 현장 동행 + 지도 실습</h3><p>관찰 → 판단 → 직접 실습 → 피드백. 실제 고객 현장에서 병행하며, 참여 가능한 작업은 일정·안전·숙련도에 따라 달라집니다.</p><p><strong>주 {offer.fieldSessionsPerWeek}회보다 더 배우고 싶다면, 추가 비용 없이 신청할 수 있습니다.</strong> 현장 일정에 맞춰 참여를 조율합니다.</p><a href="#field-method">현장 교육 방식과 기술 분야 보기 ↗</a></div>
        </div>
        <ol className={cx("roadmap-list")}>
          <li className={cx("roadmap-step")}><span className={cx("week-badge")}>1주차</span><div className={cx("week-content")}><h3>사업에 몰입하는 환경 만들기</h3><p><strong>부하율 · 잠재의식 · 사이버사이코네틱</strong>을 다루며,<br className={cx("roadmap-break")} /> 사업에 집중할 수 있는 환경을 만듭니다.</p></div></li>
          <li className={cx("roadmap-step")}><span className={cx("week-badge")}>2주차</span><div className={cx("week-content")}><h3>신념 · 사명 · 사업 원칙 세팅</h3><p>나를 알리는 <strong>브랜딩의 초석</strong>을 다지고,<br className={cx("roadmap-break")} /> 사업을 지속하는 힘이 될 나만의 원칙을 세웁니다.</p></div></li>
          <li className={cx("roadmap-step")}><span className={cx("week-badge")}>3주차</span><div className={cx("week-content")}><h3>사명을 전략으로, 브랜딩</h3><p>정리한 사명을 <strong>사업의 전략으로 구체화</strong>하고,<br className={cx("roadmap-break")} /> 나를 어떻게 알릴지 브랜딩의 방향을 잡습니다.</p></div></li>
          <li className={cx("roadmap-step")}><span className={cx("week-badge")}>4주차</span><div className={cx("week-content")}><h3>꿈의 고객을 찾는 퍼널 마케팅</h3><p><strong>꿈의 고객을 찾고, 고객이 나를 발견해 문의하기까지</strong>의 흐름을 설계합니다.<br className={cx("roadmap-break")} /> 블로그 · 숨고 · 당근 · 플레이스부터<br className={cx("roadmap-break")} /> 인스타 릴스 · 유튜브 쇼츠 · 유튜브 롱폼 · 쓰레드까지, 채널별 마케팅을 배웁니다.</p></div></li>
          <li className={cx("roadmap-step")}><span className={cx("week-badge")}>5주차</span><div className={cx("week-content")}><h3>바이브 코딩으로 나만의 사업 사이트 만들기</h3><p>랜딩페이지부터 <strong>고객 스케줄 등록·관리, 작업 사례를 계속 올리는 기능</strong>까지 직접 만듭니다.</p><ul className={cx("site-outcomes")} aria-label="직접 만드는 사이트의 기능"><li>나만의 랜딩페이지</li><li>고객 · 스케줄 관리</li><li>작업 사례 업로드</li></ul><p className={cx("week-goal")}>교육 이후에도 <strong>스스로 사이트를 관리하고 유지보수할 수 있도록</strong> 배웁니다.</p></div></li>
        </ol>
        <p className={cx("learning-progress-note")}>현장에서는 판단과 작업 결과를 강사와 함께 점검합니다. 숙련도와 사업 준비의 진행 정도는 개인마다 달라집니다.</p>
        <div className={cx("consult-bridge")}>
          <h3>이 배움이 내 상황에 맞는지,<br />먼저 함께 살펴보세요.</h3>
          <p>현재 경험과 창업 고민을 듣고, 사업 교육과 현장 실습의 적합도를 확인합니다.</p>
          <EnrollButton location="curriculum" className={cx("button button-green")} />
          <p className={cx("consult-bridge-note")}>온라인 진단은 무료입니다. 상담 신청만으로 수강 등록이나 결제가 확정되지 않습니다.</p>
          <a className={cx("text-link")} href="#apply">수강료와 모집 조건 보기 <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>


    <section id="field-method" className={cx("field-method")} aria-labelledby="field-method-title">
      <div className={cx("wrap")}>
        <span className={cx("kicker")}>사업의 기반이 되는 현장 기술</span>
        <h2 id="field-method-title">보는 교육에서 끝나지 않습니다.<br /><span className={cx("green")}>실제 현장에서, 직접 해봅니다.</span></h2>
        <p className={cx("section-intro")}>실제 고객에게 필요한 일이 무엇인지 현장에서 살펴봅니다.<br />강사와 함께 문제를 판단하고, 가능한 작업을 직접 해보며 안전과 품질의 기준을 배웁니다.</p>
        <ol className={cx("method-grid")}>
          {[
            ["관찰", "강사가 실제 고객 문제를 어떻게 진단하는지 봅니다."],
            ["판단", "원인과 수리 방법을 스스로 생각하고 설명해 봅니다."],
            ["직접 실습", "강사의 지도 아래 안전하고 허용된 공정을 직접 해봅니다."],
            ["피드백", "작업 결과와 안전·품질 기준을 함께 점검합니다."],
          ].map(([title, body], index) => <li key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></li>)}
        </ol>
        <p className={cx("condition-box")}>{offer.practiceCondition} 위험도가 높은 작업을 무리하게 맡기거나 교육생이 단독 시공하는 과정이 아닙니다.</p>
        <div className={cx("proof-heading")}><h3>강사가 실제로 하는 일부터 확인하세요.</h3><p>실제 리스토리 시공 사례 · 교육생 실습 장면이나 교육 성과가 아닙니다.</p></div>
        <div className={cx("proof-grid")}>
          {proofCases.map(item => <article key={item.id} className={cx("proof-card")}>
            <Link href={`/cases/${item.id}`} data-academy-proof={item.id} aria-label={`${item.title} 시공 사례 보기`}><Image src={item.afterImg} alt={`실제 리스토리 시공 완료 사례: ${item.title} (교육생 실습 장면 아님)`} width={720} height={480} sizes="(max-width: 760px) 45vw, 560px" /></Link>
            <div><span>{item.category}</span><h4><Link href={`/cases/${item.id}`} data-academy-proof={item.id} aria-label={`${item.title} 시공 사례 보기`}>{proofTopics[item.id].title} ↗</Link></h4><details className={cx("proof-details")}><summary>작업 내용과 판단 살펴보기 <span className={cx("expand")} aria-hidden="true"></span></summary><p>{item.summary}</p><p className={cx("proof-prompt")}>함께 생각할 질문: {proofTopics[item.id].question}</p></details></div>
          </article>)}
        </div>
        <details id="field-skills" className={cx("field-skills")}>
          <summary>소파·천갈이를 포함한 기술 분야 보기 <span className={cx("expand")} aria-hidden="true"></span></summary>
        <div className={cx("skill-catalog-heading")}><h3>현장에서 다룰 수 있는 기술 분야 예시</h3><p>모든 분야를 5주 안에 경험하거나 직접 시공한다고 보장하지 않습니다. 현장 일정과 실습 조건에 따라 달라집니다.</p></div>
        <div className={cx("skill-catalog")}>
          <article className={cx("skill-card")}><span className={cx("skill-card-number")}>01</span><div><h4>상부장 · 하부장 수리</h4><ul><li>상부장 처짐·들뜸 보강 및 재설치</li><li>싱크대 하부장 밑판 교체</li></ul></div></article>
          <article className={cx("skill-card")}><span className={cx("skill-card-number")}>02</span><div><h4>싱크대 문짝 교체 · 리폼</h4><ul><li>상·하부장 문짝과 서랍 앞판 교체</li><li>UV·PET 문짝 실측, 발주, 설치</li></ul></div></article>
          <article className={cx("skill-card")}><span className={cx("skill-card-number")}>03</span><div><h4>경첩 · 서랍 레일 교체</h4><ul><li>싱크대·붙박이장 문짝과 경첩 수리</li><li>양념장·서랍 볼레일·철레일 교체</li></ul></div></article>
          <article className={cx("skill-card")}><span className={cx("skill-card-number")}>04</span><div><h4>슬라이딩 도어 수리</h4><ul><li>문 열림·닫힘 상태 점검</li><li>슬라이딩 도어 바퀴(호차) 교체·조정</li></ul></div></article>
          <article className={cx("skill-card")}><span className={cx("skill-card-number")}>05</span><div><h4>의자 · 붙박이 소파 천갈이</h4><ul><li>식탁·업소용 의자, 붙박이 좌석 가죽 교체</li><li>기존 가죽 제거, 재단, 고정, 마감</li></ul></div></article>
          <article className={cx("skill-card")}><span className={cx("skill-card-number")}>06</span><div><h4>테이블 가죽 리폼</h4><ul><li>회의실 테이블 상판 가죽 교체</li><li>실측, 기존 가죽 제거, 부착, 마감</li></ul></div></article>
          <article className={cx("skill-card")}><span className={cx("skill-card-number")}>07</span><div><h4>소파 꺼짐 · 구조 복원</h4><ul><li>스펀지 교체, 밴드·스프링 보강</li><li>내부 목대, 하부 부직포, 다리 수리</li></ul></div></article>
          <article className={cx("skill-card")}><span className={cx("skill-card-number")}>08</span><div><h4>생활 가구 수리 · 공간 리폼</h4><ul><li>의자·식탁 다리, 침대 프레임 수리</li><li>냉장고장·로봇청소기장 리폼</li></ul></div></article>
        </div>
        </details>
      </div>
    </section>

    <section id="people" className={cx("people")} aria-labelledby="people-title">
      <div className={cx("wrap people-grid")}>
        <FieldVideo />
        <div className={cx("people-copy")}><span className={cx("kicker")}>RESTORY BROTHERS · 우리가 일하고 사업하는 방식</span><h2 id="people-title">현장에서 일하고,<br /><span className={cx("green")}>고객을 만나는 형제와 함께.</span></h2><p>리스토리에서 가구 수리·리폼 서비스를 운영하며,<br />작업을 알리고 고객을 만나며 사업을 운영해 왔습니다.</p><p>기술로 살아남기에서는 그 경험을 바탕으로<br />사업자의 기준, 나를 알리는 마케팅, 직접 운영하는 기반을<br />함께 배웁니다.</p><div className={cx("people-topics")}><span>가구 수리 · 리폼</span><span>고객과의 만남</span><span>나의 사업 운영</span></div><a href="#curriculum" className={cx("people-link")}>어떤 내용을 함께 배우나요? <span aria-hidden="true">↘</span></a></div>
      </div>
    </section>

    <section id="ai-start" className={cx("business-tools-note")} aria-labelledby="ai-start-title">
      <div className={cx("wrap business-tools-note-inner")}>
        <div>
          <span className={cx("kicker")}>도구는 사업을 돕기 위해</span>
          <h2 id="ai-start-title">AI로 도구는 달라져도,<br /><span>사업의 중심은 고객입니다.</span></h2>
          <p>바이브 코딩도 내 사업에 필요한 도구로 배웁니다.</p>
        </div>
        <a id="blog-read" className={cx("text-link")} href="https://blog.naver.com/fixermans" target="_blank" rel="noopener noreferrer" aria-label="리스토리 블로그 읽어보기 (새 탭)">리스토리의 일과 생각 읽기 <span aria-hidden="true">↗</span></a>
      </div>
    </section>

    <section id="field-support" className={cx("field-support")} aria-labelledby="field-support-title">
      <div className={cx("wrap field-support-inner")}>
        <header className={cx("field-support-heading")}><span className={cx("field-support-label")}>EXTRA LEARNING · 과정 중부터 수료 후까지</span><h2 id="field-support-title">주 {offer.fieldSessionsPerWeek}회보다 더 배우고 싶다면,<br /><span className={cx("green")}>추가 비용 없이 신청하세요.</span></h2><p>{offer.weeks}주 교육 기간 중은 물론, 수료 후에도<br />필요한 기술 교육을 추가 비용 없이 신청할 수 있습니다.</p></header>
        <ol className={cx("support-flow")} aria-label="추가 기술 교육 신청 및 참여 방식"><li><span>01</span><strong>필요한 기술 요청</strong></li><li><span>02</span><strong>현장 일정 조율</strong></li><li><span>03</span><strong>추가 비용 없이 교육</strong></li></ol>

        <p className={cx("field-support-closing")}>{offer.followUp}</p>
        <a className={cx("roadmap-link")} href="#apply">기술로 살아남기 1기 모집 안내 <span aria-hidden="true">↗</span></a>
      </div>
    </section>

    <section className={cx("belief")}><div className={cx("wrap belief-inner")}><div className={cx("belief-symbol")} aria-hidden="true">↗</div><div><span className={cx("kicker")}>OUR BELIEF</span><h2>기술은 먹고살기 위해.<br />사업은 <span>행복하게 살기 위해.</span></h2><p>혼자 고민하던 기술과 사업의 사이.<br />이번에는 같은 방향을 보는 네 사람이 함께 시작합니다.</p></div><span className={cx("belief-sign")}>기술로 살아남기.</span></div></section>

    <section id="apply" className={cx("enrollment section-light")}>
      <div className={cx("wrap enrollment-grid")}>
        <div className={cx("enrollment-copy")}>
          <span className={cx("kicker")}>03 — YOUR FIRST CHAPTER</span>
          <h2>첫 시작은,<br />딱 <span className={cx("underline-green")}>네 사람</span>과.</h2>
          <p>내 일의 기준을 세우고, 고객에게 나를 알리며,<br />내 이름으로 사업하고 싶다면.<br />기술로 살아남기 {offer.cohort}기에서 시작하세요.</p>
          <div className={cx("seat-illustration")} aria-label={`모집 정원 ${offer.seats}명`}>{Array.from({ length: offer.seats }, (_, index) => <span key={index}>{String(index + 1).padStart(2, "0")}</span>)}</div>
          <p className={cx("seats-caption")}>함께 시작할 {offer.cohort}기 모집 정원 · {offer.seats}명</p>
          <a className={cx("overview-link")} href="#plan-comparison">기본·셋업 과정 다시 비교하기 <span aria-hidden="true">↑</span></a>
        </div>
        <div className={cx("enrollment-ticket")}>
          <div className={cx("ticket-top")}><span><span className={cx("status-dot")}></span> {offer.cohort}기 모집 중</span><b>FIRST CLASS</b></div>
          <div className={cx("ticket-body")}>
            <p className={cx("ticket-label")}>기본 과정 · 사업 교육 + 현장 기술 교육</p><h3>기술로 살아남기</h3>
            <div className={cx("ticket-price")}>{offer.basicPrice}<span>만 원</span></div><p className={cx("ticket-price-caption")}>{offer.cohort}기 기본 수강료</p>
            <dl className={cx("ticket-facts")}><div><dt>개강일</dt><dd>{offer.startDate} 예정</dd></div><div><dt>모집 인원</dt><dd>{offer.seats}명 소수 정예</dd></div><div><dt>사업 과정</dt><dd>{offer.weeks}주</dd></div><div><dt>현장 기술 수업</dt><dd>{offer.weeks}주간 주 {offer.fieldSessionsPerWeek}회</dd></div><div><dt>수료 후 기술 교육</dt><dd>추가 비용 없이 신청 · 현장 일정 조율</dd></div><div><dt>교육 주제</dt><dd>기술 · 브랜딩 · 마케팅 · 웹사이트</dd></div></dl>
            <ul className={cx("offer-inclusions")}><li>사업자의 마인드·원칙, 브랜딩·마케팅·내 사업 웹사이트 학습</li><li>실제 고객 작업 관찰과 강사 지도 아래 가능한 공정 실습</li><li>과정 중·수료 후 추가 기술 교육 신청 가능 · 추가 비용 없음</li></ul>
            <p className={cx("plan-consult-note")}>사업을 배우고 직접 구축하며 시작하고 싶다면, 지금의 경험과 준비 상태부터 함께 살펴보세요. 어떤 과정이 맞는지 아직 정하지 않아도 괜찮습니다.</p>
            <EnrollButton location="basic" label="기본 과정 무료 상담" className={cx("button button-green")} />
            <p className={cx("consult-action-note")}>온라인 1:1 진단은 무료이며, 신청만으로 수강 등록이나 결제가 확정되지 않습니다.</p>
            <p className={cx("ticket-note")}>교육 장소·세부 시간표·결제 및 환불 조건은 확인 후 안내합니다.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="premium" className={cx("premium section-light")} aria-labelledby="premium-title">
      <div className={cx("wrap enrollment-grid")}>
        <div className={cx("premium-offer")}>
          <span className={cx("premium-label")}>START SETUP PACKAGE</span>
          <h2 id="premium-title">기술로 살아남기<br /><span className={cx("underline-green")}>{offer.setupName}</span></h2>
          <p className={cx("premium-intro")}>{offer.setupDescription}</p>
          <ol className={cx("setup-steps")} aria-label="사업 교육에서 셋업으로 이어지는 과정">
            <li><span>01</span><div><strong>내 사업의 방향은 내가 정합니다</strong><p>고객·서비스·활동 지역을 정하고, 사용할 사진과 정보를 준비합니다.</p></div></li>
            <li><span>02</span><div><strong>초기 구축은 기살이 맡습니다</strong><p>정리한 내용을 바탕으로 사이트와 채널에 소개·사례·문의 방법을 담아 초기 셋업을 진행합니다.</p></div></li>
            <li><span>03</span><div><strong>운영은 내 손으로 익힙니다</strong><p>소개 수정·사례 등록·문의 확인을 직접 해보며, 구축된 사이트와 채널을 운영하는 법을 익힙니다.</p></div></li>
          </ol>
        </div>
        <div className={cx("premium-card")}>
          <div className={cx("premium-price-block")}>
            <span className={cx("premium-price-label")}>기본 과정 포함 · 기살의 초기 구축 + 운영 인계</span>
            <p className={cx("premium-price")} aria-label={`${offer.setupName} 수강료 ${offer.setupPrice}만 원`}>{offer.setupPrice}<span>만 원</span></p>
            <p className={cx("premium-sale-label")}>{offer.setupName} 수강료</p>
          </div>
          <div className={cx("premium-care")}>
            <span className={cx("premium-care-label")}>사업 교육을 실제 시작으로 연결합니다</span>
            <h3>내 서비스를 알리고,<br /><span>문의받을 준비까지.</span></h3>
            <ul className={cx("premium-inclusions")} aria-label="포함된 기본 교육"><li>{offer.weeks}주 사업 교육</li><li>{offer.weeks}주간 주 {offer.fieldSessionsPerWeek}회 현장 기술 교육</li></ul>
            <ul className={cx("setup-channel-groups")} aria-label="고객이 만나는 흐름에 따른 8개 채널 초기 셋업">
              {setupChannelGroups.map(group => <li key={group.title}>
                <h4>{group.title}</h4>
                <p>{group.purpose}</p>
                <dl className={cx("setup-channels")}>
                  {offer.setupChannels.filter(channel => group.channels.some(name => name === channel.name)).map(channel => <div key={channel.name}><dt>{channel.name}</dt><dd>{channel.scope}</dd></div>)}
                </dl>
              </li>)}
            </ul>
            <p className={cx("premium-conditions")}>{offer.setupNote}</p>
            <p className={cx("plan-consult-note")}>초기 구축은 맡기고, 이후 직접 운영할 준비를 하고 싶다면 현재 준비된 내용과 막막한 부분을 알려주세요. 내 상황에 셋업 패키지가 필요한지 함께 살펴봅니다.</p>
            <EnrollButton location="premium" label="셋업 패키지 무료 상담" className={cx("button button-green")} />
            <p className={cx("consult-action-note")}>온라인 1:1 진단은 무료이며, 신청만으로 수강 등록이나 결제가 확정되지 않습니다.</p>
          </div>
        </div>
      </div>
    </section>

    <section className={cx("faq section-light")} aria-labelledby="faq-title"><div className={cx("wrap faq-grid")}><div><span className={cx("kicker")}>BEFORE WE START</span><h2 id="faq-title">처음이라서,<br />궁금한 이야기.</h2></div><div className={cx("faq-items")}>
      {[
        ["어떤 분에게 이 과정이 맞나요?", `${offer.applicantTitle} ${offer.applicantMindset} 고객에게 필요한 가치를 고민하고, 사업자의 원칙·브랜딩·마케팅·운영을 깊이 배우려는 분을 위한 과정입니다. 기술이 처음인 분도 참여할 수 있습니다. 수업과 현장 참여, 배운 내용의 실행이 필요하며 특정 수익이나 창업 성과를 보장하지 않습니다.`],
        ["기술이 없는 완전 초보자도 참여할 수 있나요?", "네. 기술 창업을 준비하는 완전 초보자도 대상입니다. 처음부터 혼자 작업하는 것이 아니라 관찰과 판단부터 배우고, 강사 지도 아래 가능한 공정을 실습합니다. 무료 진단에서 현재 경험과 과정 적합도를 함께 살펴봅니다."],
        ["현장에서는 구경만 하나요? 직접 작업도 해보나요?", `실제 고객 시공 현장에 동행해 관찰하고, 강사의 지도 아래 허용된 작업을 직접 실습한 뒤 피드백을 받습니다. ${offer.practiceCondition} 교육생에게 단독 시공을 맡기는 과정이 아닙니다.`],
        ["5주 동안 모든 수리 기술을 배울 수 있나요?", "모든 기술의 습득이나 모든 공정의 직접 실습을 보장하지 않습니다. 상·하부장, 문짝, 경첩·레일, 슬라이딩 도어, 가죽 리폼, 소파·가구 복원 등은 다룰 수 있는 분야의 예시이며 실제 현장 일정과 안전 조건에 따라 달라집니다."],
        ["사업 교육이 중심인가요? 기술 수업과 어떻게 병행하나요?", `네. 기술로 자기 사업을 준비하도록 사업자의 생각과 원칙, 브랜딩·마케팅·운영을 중심으로 배웁니다. ${offer.weeks}주 사업 교육과 ${offer.weeks}주간 주 ${offer.fieldSessionsPerWeek}회 현장 기술 교육을 병행합니다. 사업 교육은 몰입 환경 → 신념·사명·원칙 → 브랜딩 → 퍼널 마케팅 → 바이브 코딩 사업 사이트 순서입니다. 기술 교육은 실제 현장에서 진행하며 세부 요일·시간과 장소는 확인 후 안내합니다.`],
        ["언제 시작하고, 몇 명이 함께하나요?", `${offer.startDate} 개강 예정이며 ${offer.cohort}기 정원은 ${offer.seats}명입니다. 사업 과정은 ${offer.weeks}주입니다.`],
        [`${offer.setupName}는 기본 과정과 무엇이 다른가요?`, `${offer.setupDescription} ${offer.setupChannels.map(channel => channel.name).join("·")}의 초기 셋업이 포함됩니다. ${offer.setupApproach} ${offer.setupNote}`],
        [`주 ${offer.fieldSessionsPerWeek}회보다 더 교육받고 싶으면 신청할 수 있나요?`, offer.additionalFieldEducation],
        ["수료 후 어떤 지원을 받나요?", offer.followUp],
        ["수강료와 결제·취소·환불은 어떻게 되나요?", `기본 과정은 ${offer.basicPrice}만 원, ${offer.setupName}는 기본 과정을 포함해 ${offer.setupPrice}만 원입니다. 과정 중·수료 후 신청하는 추가 기술 교육에는 추가 비용이 없습니다. 온라인 1:1 진단은 무료, 선택 가능한 오프라인 상담은 5만 원입니다. 결제 방법·취소·환불 규정은 확인 후 안내하며 등록·결제 전 해당 조건을 확인해주세요. 상담 신청만으로 교육 등록이나 결제가 확정되지 않습니다.`],
        ["교육 후 바로 독립 시공하거나 일정 매출을 낼 수 있나요?", `기본 과정과 ${offer.setupName} 모두 독립 시공이나 특정 매출을 보장하지 않습니다. 작업별 숙련도와 안전 판단, 개인의 실행과 시장 상황에 따라 달라집니다.`],
        ["교육장 위치와 실제 방문 가능 지역은 어디인가요?", "교육장 주소와 현장 방문 가능 지역, 이동 방식 및 비용은 확인 후 안내합니다. 상담에서 거주 지역과 참여 가능한 시간을 알려주시면 일정 조율에 참고합니다."],
      ].map(([question, answer]) => <details key={question}><summary>{question}<span className={cx("expand")} aria-hidden="true"></span></summary><p>{answer}</p></details>)}
    </div></div></section>
  </main>
  <footer>
    <div className={cx("wrap footer-inner")}><a className={cx("brand")} href="#main"><span className={cx("brand-mark")}>기살<span>.</span></span><span className={cx("brand-name")}>기술로<br />살아남기</span></a><p>기술부터 사업까지, 행복하게 사업하는 법.</p><Link className={cx("restoryHome")} href="/">리스토리 스튜디오 ↗</Link><span>© 2026 GISAL.</span></div>
    <div className={cx("wrap")}>
      <div className={cx("footer-business")} role="group" aria-label="운영 사업자 정보">
        <p className={cx("footer-business-title")}>운영 사업자 정보</p>
        <dl>
          <div><dt>상호</dt><dd>리스토리 스튜디오</dd></div>
          <div><dt>대표자</dt><dd>고현호</dd></div>
          <div><dt>사업자등록번호</dt><dd>692-55-00721</dd></div>
          <div className={cx("footer-business-address")}><dt>사업장 주소</dt><dd>인천광역시 서구 염곡로498번안길 5-13. 302호(가정동)</dd></div>
          <div><dt>연락처</dt><dd><a href="tel:1688-2957">1688-2957</a></dd></div>
        </dl>
      </div>
    </div>
  </footer>
  <MobileConsultBar />


  </EnrollmentProvider>;
}
