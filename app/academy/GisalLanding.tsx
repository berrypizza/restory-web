import Image from "next/image";
import Link from "next/link";
import { EnrollButton, EnrollmentProvider } from "./EnrollmentDialog";
import FieldVideo from "./FieldVideo";
import AcademyTracking from "./AcademyTracking";
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
    <section className={cx("hero")} aria-labelledby="hero-title">
      <div className={cx("hero-photo")} aria-hidden="true"></div>
      <div className={cx("hero-shade")} aria-hidden="true"></div>
      <div className={cx("wrap hero-inner")}>
        <div className={cx("hero-copy")}>
          <div className={cx("eyebrow")}><span className={cx("status-dot")}></span> 가구수리 출장 창업 {offer.cohort}기 <span className={cx("divider")}>/</span> 단 {offer.seats}명</div>
          <h1 id="hero-title">기술로 먹고살려면,<br /><span className={cx("highlight")}>사업을 알아야 합니다.</span></h1>
          <p className={cx("hero-desc")}>내 기술을 고객에게 알리고, 내 이름으로 사업할 준비.<br /><strong>사업자의 마인드·원칙, 브랜딩·마케팅·운영을 배웁니다.</strong><br />기술이 처음이어도 실제 시공 현장에서<br />강사 지도 아래 직접 실습하며 함께 배웁니다.</p>
          <figure className={cx("hero-team")} aria-label="기술로 살아남기를 함께하는 리스토리 형제"><Image className={cx("hero-team-first")} src="/gisal-assets/restory-hero-portrait.png" width="1000" height="1000" alt="리스토리 형제의 첫 번째 프로필 사진" fetchPriority="high" decoding="async" loading="eager" /><Image className={cx("hero-team-second")} src="/gisal-assets/restory-second-cutout-v2.png" alt="리스토리 형제의 두 번째 프로필 사진" fetchPriority="high" decoding="async" width="1060" height="1484" loading="eager" /></figure>
          <div className={cx("hero-price")}><span className={cx("price-label")}>{offer.cohort}기 기본 수강료</span><span className={cx("hero-price-now")}>{offer.basicPrice}<span>만 원</span></span></div>
          <div className={cx("hero-actions")}><EnrollButton location="hero" className={cx("button button-green")} /><a className={cx("text-link")} href="#curriculum">사업·현장 교육 구성 보기 <span aria-hidden="true">↓</span></a></div>
          <p className={cx("hero-consult-note")}>현재 상황과 창업 목표를 듣고, 과정 적합도와 시작 방향을 함께 확인합니다.</p>
          <p className={cx("hero-footnote")}>{offer.weeks}주 사업 교육 · {offer.weeks}주간 주 {offer.fieldSessionsPerWeek}회 현장 기술 교육<br />{offer.startDate} 개강 예정</p><p className={cx("practice-note")}>{offer.practiceCondition}</p>
        </div>
        <div className={cx("hero-aside")} aria-hidden="true"><div className={cx("vertical-note")}>BUILD YOUR SKILL. BUILD YOUR BUSINESS.</div><div className={cx("cohort-seal")}><span>FIRST CLASS</span><strong>{String(offer.seats).padStart(2, "0")}</strong><span>함께 시작할 네 사람</span></div><div className={cx("image-caption")}><span className={cx("portrait-label")}>RESTORY BROTHERS</span>리스토리 형제와 함께,<br /><b>기술부터 사업까지.</b></div></div>
      </div>
      <p className={cx("heroArtNote")}>배경은 교육 방향을 표현한 연출 이미지입니다.</p>
    </section>
    <section className={cx("quick-facts")} aria-label="1기 모집 핵심 정보"><div className={cx("wrap fact-row")}><div><span className={cx("fact-label")}>START</span><strong>{offer.startDateShort} <small>화요일 개강 예정</small></strong></div><div><span className={cx("fact-label")}>TOGETHER</span><strong>{offer.seats}명 <small>소수 정예</small></strong></div><div><span className={cx("fact-label")}>FIRST CLASS</span><strong>{offer.basicPrice}만 원 <small>{offer.cohort}기 기본 수강료</small></strong></div><a href="#apply" className={cx("fact-link")}>모집 자세히 보기 <span aria-hidden="true">↗</span></a></div></section>

    <section id="about" className={cx("about-focus")} aria-labelledby="about-title">
      <div className={cx("wrap about-focus-inner")}>
        <span className={cx("about-focus-label")}>WHY GISAL · 사업의 본질</span>
        <h2 id="about-title">고객에게 필요한 일을 하고,<br /><span>그 가치를 알리는 것부터.</span></h2>
        <p className={cx("about-focus-copy")}>기술을 익히는 일과 함께, 고객이 나를 찾고 선택하는 이유를 고민해야 합니다.<br /><strong>기살은 내 일의 기준을 세우고, 고객과 만나며, 사업을 운영하는 법을 다룹니다.</strong></p>
        <div className={cx("about-focus-cards")} aria-label="사업 교육에서 함께 다루는 세 가지 질문">
          <div className={cx("about-focus-card")}><strong>어떤 가치를 제공할까?</strong><span>사업자의 마인드 · 신념 · 사명 · 원칙</span></div>
          <div className={cx("about-focus-card about-focus-card-featured")}><strong>고객은 왜 나를 찾을까?</strong><span>브랜딩 · 고객 확보 · 퍼널 마케팅</span></div>
          <div className={cx("about-focus-card")}><strong>내 사업을 어떻게 운영할까?</strong><span>사업 사이트 · 고객과 일정 · 작업 사례</span></div>
        </div>
        <div className={cx("audience-fit")}>
          <h3>{offer.applicantTitle}</h3>
          <p>쉽게 번다는 말에 지쳤다면, 내 사업을 제대로 공부해 보세요.<br />기술이 처음이어도 괜찮습니다. {offer.applicantMindset}</p>
          <ul className={cx("fit-list")}>
            <li>고객이 왜 나를 선택하는지, 사업이 어떻게 이어지는지 깊이 공부할 분</li>
            <li>배운 내용을 직접 적용하고, 잘되지 않는 이유도 스스로 돌아볼 분</li>
            <li>익숙한 생각을 바꾸는 불편함을 받아들이고, 피드백을 바탕으로 다시 시도할 분</li>
          </ul>
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
        <p className={cx("business-lesson-summary")}>이처럼 고객을 이해하고, 서비스의 가치를 설명하고, 문의로 이어지는 흐름을 생각합니다. 브랜딩·퍼널 마케팅·사업 사이트 교육을 실제 운영과 연결하는 관점입니다.</p>
        <div className={cx("business-proof-links")}><Link href="/cases" target="_blank" rel="noopener noreferrer" prefetch={false} data-academy-business-proof="browse">다른 실제 사례 보기 <span className={cx("sr-only")}>(새 탭)</span><span aria-hidden="true">↗</span></Link><Link href="/" target="_blank" rel="noopener noreferrer" prefetch={false} data-academy-business-proof="inquiry">서비스의 문의 동선 보기 <span className={cx("sr-only")}>(새 탭)</span><span aria-hidden="true">↗</span></Link></div>
        <p className={cx("business-proof-note")}>공개된 강사의 시공 사례를 사업 관점으로 읽는 해설 예시입니다. 사진은 교육생 실습 장면이 아니며, 교육생 성과나 특정 문의·매출 증가를 의미하지 않습니다.</p>
      </div>
    </section>

    <section id="curriculum" className={cx("curriculum roadmap")} aria-labelledby="roadmap-title">
      <div className={cx("wrap roadmap-inner")}>
        <header className={cx("roadmap-heading")}><span className={cx("roadmap-label")}>CURRICULUM</span><h2 id="roadmap-title">5주 동안 사업을 설계하고,<br /><span className={cx("green")}>주 2회 현장에서 기술을 배웁니다.</span></h2><p>교육의 중심은 사업자의 생각과 원칙, 고객을 만나는 마케팅, 사업 운영입니다.<br />현장 기술 교육을 병행하며 실제 고객의 문제와 연결해 배웁니다.</p></header>
        <div className={cx("dual-track")}>
          <div><span>TRACK A · 사업을 만드는 {offer.weeks}주</span><h3>사업의 본질부터 내 운영 기반까지</h3><p>집중할 환경과 사업 원칙을 세우고, 고객에게 알리는 방법과 직접 운영할 웹사이트를 배웁니다.</p></div>
          <div><span>TRACK B · 현장에서 배우는 기술</span><h3>{offer.weeks}주간 주 {offer.fieldSessionsPerWeek}회 현장 동행 + 지도 실습</h3><p>관찰 → 판단 → 직접 실습 → 피드백. 실제 고객 현장에서 병행하며, 참여 가능한 작업은 일정·안전·숙련도에 따라 달라집니다.</p><a href="#field-method">현장 교육 방식과 기술 분야 보기 ↗</a></div>
        </div>
        <ol className={cx("roadmap-list")}>
          <li className={cx("roadmap-step")}><span className={cx("week-badge")}>1주차</span><div className={cx("week-content")}><h3>사업에 몰입하는 환경 만들기</h3><p><strong>부하율 · 잠재의식 · 사이버사이코네틱</strong>을 다루며,<br className={cx("roadmap-break")} /> 사업에 집중할 수 있는 환경을 만듭니다.</p></div></li>
          <li className={cx("roadmap-step")}><span className={cx("week-badge")}>2주차</span><div className={cx("week-content")}><h3>신념 · 사명 · 사업 원칙 세팅</h3><p>나를 알리는 <strong>브랜딩의 초석</strong>을 다지고,<br className={cx("roadmap-break")} /> 사업을 지속하는 힘이 될 나만의 원칙을 세웁니다.</p></div></li>
          <li className={cx("roadmap-step")}><span className={cx("week-badge")}>3주차</span><div className={cx("week-content")}><h3>사명을 전략으로, 브랜딩</h3><p>정리한 사명을 <strong>사업의 전략으로 구체화</strong>하고,<br className={cx("roadmap-break")} /> 나를 어떻게 알릴지 브랜딩의 방향을 잡습니다.</p></div></li>
          <li className={cx("roadmap-step")}><span className={cx("week-badge")}>4주차</span><div className={cx("week-content")}><h3>꿈의 고객을 찾는 퍼널 마케팅</h3><p><strong>꿈의 고객을 찾고, 고객이 나를 발견해 문의하기까지</strong>의 흐름을 설계합니다.<br className={cx("roadmap-break")} /> 블로그 · 숨고 · 당근 · 플레이스부터<br className={cx("roadmap-break")} /> 인스타 릴스 · 유튜브 쇼츠 · 유튜브 롱폼 · 쓰레드까지, 채널별 마케팅을 배웁니다.</p></div></li>
          <li className={cx("roadmap-step")}><span className={cx("week-badge")}>5주차</span><div className={cx("week-content")}><h3>바이브 코딩으로 나만의 사업 사이트 만들기</h3><p>랜딩페이지부터 <strong>고객 스케줄 등록·관리, 작업 사례를 계속 올리는 기능</strong>까지 직접 만듭니다.</p><ul className={cx("site-outcomes")} aria-label="직접 만드는 사이트의 기능"><li>나만의 랜딩페이지</li><li>고객 · 스케줄 관리</li><li>작업 사례 업로드</li></ul><p className={cx("week-goal")}>교육 이후에도 <strong>스스로 사이트를 관리하고 유지보수할 수 있도록</strong> 배웁니다.</p></div></li>
        </ol>
        <div className={cx("learning-goals")}><h3>내 사업의 기준과 고객을 만나는 흐름을 준비합니다.</h3><p>나만의 사업 원칙과 브랜드 방향을 정리하고, 고객이 나를 발견해 문의하기까지의 흐름을 설계합니다. 직접 만드는 사업 사이트에서는 고객·스케줄 관리와 작업 사례 업로드를 배웁니다.</p><p>현장에서는 판단과 작업 결과를 강사와 함께 점검합니다. 숙련도와 사업 준비의 진행 정도는 개인마다 달라집니다.</p></div>
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

    <section id="ai-start" className={cx("ai-start business-tools")} aria-labelledby="ai-start-title">
      <div className={cx("wrap business-tools-inner")}>
        <div>
          <span className={cx("kicker")}>도구는 사업을 돕기 위해</span>
          <h2 id="ai-start-title">AI로 도구는 달라져도,<br /><span>사업의 중심은 고객입니다.</span></h2>
          <p className={cx("ai-start-intro")}>바이브 코딩도 내 사업에 필요한 도구로 배웁니다.<br />작업 사례를 알리고, 고객과 일정을 관리하는 사이트를 직접 만듭니다.</p>
          <div id="blog-read" className={cx("ai-start-blog")}><a className={cx("blog-read-link")} href="https://blog.naver.com/fixermans" target="_blank" rel="noopener noreferrer" aria-label="리스토리 블로그 읽어보기 (새 탭)">리스토리의 일과 생각 읽기 <span aria-hidden="true">↗</span></a></div>
        </div>
        <figure className={cx("business-tools-visual")}><Image src="/gisal-assets/ai-skill-business.webp" width="1536" height="1024" alt="기술과 사업 도구를 표현한 연출 이미지: 노트북과 전동 공구, 로봇 팔" sizes="(max-width: 760px) 90vw, 420px" /><figcaption className={cx("artNote")}>교육 방향을 표현한 연출 이미지입니다.</figcaption></figure>
      </div>
    </section>

    <section id="field-support" className={cx("field-support")} aria-labelledby="field-support-title">
      <div className={cx("wrap field-support-inner")}>
        <header className={cx("field-support-heading")}><span className={cx("field-support-label")}>BEYOND 5 WEEKS</span><h2 id="field-support-title">수료 후 필요한 기술은,<br /><span className={cx("green")}>현장 일정에 맞춰 조율합니다.</span></h2><p>사업을 하다 필요한 기술이 생기면 요청하세요.<br />해당 작업 현장 일정에 맞춰 추가 기술 교육을 조율합니다.</p></header>
        <ol className={cx("support-flow")} aria-label="수료 후 기술 교육 진행 방식"><li><span>01</span><strong>필요한 기술 요청</strong></li><li><span>02</span><strong>현장 일정 조율</strong></li><li><span>03</span><strong>현장에서 추가 교육</strong></li></ol>

        <p className={cx("field-support-closing")}>5주 동안 사업의 기반을 만들고,<br /><strong>현장에서 필요한 기술은 요청하고 조율합니다.</strong><br />{offer.followUp}</p>
        <a className={cx("roadmap-link")} href="#apply">기술로 살아남기 1기 모집 안내 <span aria-hidden="true">↗</span></a>
      </div>
    </section>

    <section className={cx("belief")}><div className={cx("wrap belief-inner")}><div className={cx("belief-symbol")} aria-hidden="true">↗</div><div><span className={cx("kicker")}>OUR BELIEF</span><h2>기술은 먹고살기 위해.<br />사업은 <span>행복하게 살기 위해.</span></h2><p>혼자 고민하던 기술과 사업의 사이.<br />이번에는 같은 방향을 보는 네 사람이 함께 시작합니다.</p></div><span className={cx("belief-sign")}>기술로 살아남기.</span></div></section>

    <section id="apply" className={cx("enrollment section-light")}><div className={cx("wrap enrollment-grid")}><div className={cx("enrollment-copy")}><span className={cx("kicker")}>03 — YOUR FIRST CHAPTER</span><h2>첫 시작은,<br />딱 <span className={cx("underline-green")}>네 사람</span>과.</h2><p>내 일의 기준을 세우고, 고객에게 나를 알리며,<br />내 이름으로 사업하고 싶다면.<br />기술로 살아남기 {offer.cohort}기에서 시작하세요.</p><div className={cx("seat-illustration")} aria-label={`모집 정원 ${offer.seats}명`}>{Array.from({ length: offer.seats }, (_, index) => <span key={index}>{String(index + 1).padStart(2, "0")}</span>)}</div><p className={cx("seats-caption")}>함께 시작할 {offer.cohort}기 모집 정원 · {offer.seats}명</p></div><div className={cx("enrollment-ticket")}><div className={cx("ticket-top")}><span><span className={cx("status-dot")}></span> {offer.cohort}기 모집 중</span><b>FIRST CLASS</b></div><div className={cx("ticket-body")}><p className={cx("ticket-label")}>기본 과정 · 사업 교육 + 현장 기술 교육</p><h3>기술로 살아남기</h3><div className={cx("ticket-price")}>{offer.basicPrice}<span>만 원</span></div><p className={cx("ticket-price-caption")}>{offer.cohort}기 기본 수강료</p><dl className={cx("ticket-facts")}><div><dt>개강일</dt><dd>{offer.startDate} 예정</dd></div><div><dt>모집 인원</dt><dd>{offer.seats}명 소수 정예</dd></div><div><dt>사업 과정</dt><dd>{offer.weeks}주</dd></div><div><dt>현장 기술 수업</dt><dd>{offer.weeks}주간 주 {offer.fieldSessionsPerWeek}회</dd></div><div><dt>수료 후 기술 교육</dt><dd>현장 일정 조율 · 조건 별도 안내</dd></div><div><dt>교육 주제</dt><dd>기술 · 브랜딩 · 마케팅 · 웹사이트</dd></div></dl><ul className={cx("offer-inclusions")}><li>사업자의 마인드·원칙, 브랜딩·마케팅·내 사업 웹사이트 학습</li><li>실제 고객 작업 관찰과 강사 지도 아래 가능한 공정 실습</li><li>수료 후 요청형 추가 기술 교육 · 세부 조건 확인 필요</li></ul><EnrollButton location="basic" className={cx("button button-green")} /><p className={cx("ticket-note")}>현재 상황과 창업 목표를 듣고, 과정 적합도와 시작 방향을 함께 확인합니다. 교육 장소·세부 시간표·결제 및 환불 조건은 확인 후 안내합니다.</p></div></div></div></section>

    <section id="premium" className={cx("premium section-light")} aria-labelledby="premium-title">
      <div className={cx("wrap enrollment-grid")}>
        <div className={cx("premium-offer")}>
          <span className={cx("premium-label")}>PREMIUM</span>
          <h2 id="premium-title">기술로 살아남기<br /><span className={cx("underline-green")}>Premium.</span></h2>
          <p className={cx("premium-intro")}>{offer.premiumDescription}</p>
        </div>
        <div className={cx("premium-card")}>
          <div className={cx("premium-price-block")}>
            <span className={cx("premium-price-label")}>PREMIUM · 기본 과정 + 밀착 지원</span>

            <p className={cx("premium-price")} aria-label={`Premium 수강료 ${offer.premiumPrice}만 원`}>{offer.premiumPrice}<span>만 원</span></p>
            <p className={cx("premium-sale-label")}>Premium 수강료</p>
          </div>
          <div className={cx("premium-care")}>
            <span className={cx("premium-care-label")}>Premium 과정 구성</span>
            <h3>기본 과정에 더하는<br /><span>밀착 지원·케어.</span></h3>
            <ul className={cx("premium-inclusions")} aria-label="Premium 과정 구성"><li>기본 과정 포함</li><li>밀착 지원·케어</li></ul>
            <p className={cx("premium-conditions")}>{offer.premiumCondition}</p>
            <EnrollButton location="premium" className={cx("button button-green")} />
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
        ["수료 후 어떤 지원을 받나요?", `${offer.followUp} Premium은 ${offer.premiumDescription} ${offer.premiumCondition}`],
        ["수강료와 결제·취소·환불은 어떻게 되나요?", `기본 과정은 ${offer.basicPrice}만 원, Premium은 ${offer.premiumPrice}만 원입니다. 온라인 1:1 진단은 무료, 선택 가능한 오프라인 상담은 5만 원입니다. 결제 방법·추가 비용·취소·환불 규정은 확인 후 안내하며 등록·결제 전 해당 조건을 확인해주세요. 상담 신청만으로 교육 등록이나 결제가 확정되지 않습니다.`],
        ["교육 후 바로 독립 시공하거나 일정 매출을 낼 수 있나요?", "기본 과정과 Premium 모두 독립 시공이나 특정 매출을 보장하지 않습니다. 작업별 숙련도와 안전 판단, 개인의 실행과 시장 상황에 따라 달라집니다."],
        ["교육장 위치와 실제 방문 가능 지역은 어디인가요?", "교육장 주소와 현장 방문 가능 지역, 이동 방식 및 비용은 확인 후 안내합니다. 상담에서 거주 지역과 참여 가능한 시간을 알려주시면 일정 조율에 참고합니다."],
      ].map(([question, answer]) => <details key={question}><summary>{question}<span className={cx("expand")} aria-hidden="true"></span></summary><p>{answer}</p></details>)}
    </div></div></section>
  </main>
  <footer><div className={cx("wrap footer-inner")}><a className={cx("brand")} href="#main"><span className={cx("brand-mark")}>기살<span>.</span></span><span className={cx("brand-name")}>기술로<br />살아남기</span></a><p>기술부터 사업까지, 행복하게 사업하는 법.</p><Link className={cx("restoryHome")} href="/">리스토리 스튜디오 ↗</Link><span>© 2026 GISAL.</span></div></footer>
  <div className={cx("mobile-apply")}><div><small>{offer.cohort}기 기본 수강료</small><strong>{offer.basicPrice}만 원</strong></div><EnrollButton location="mobile" className={cx("button button-green")} /></div>


  </EnrollmentProvider>;
}
