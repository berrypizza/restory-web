import Image from "next/image";
import Link from "next/link";
import { EnrollButton, EnrollmentProvider } from "./EnrollmentDialog";
import FieldVideo from "./FieldVideo";
import styles from "./gisal.module.css";

function cx(names: string) { return names.split(" ").map(name => styles[name]).join(" "); }

export default function GisalLanding() {
  return <EnrollmentProvider>

  <a href="#main" className={cx("skip-link")}>본문으로 건너뛰기</a>
  <header className={cx("header")}>
    <div className={cx("wrap nav")}>
      <div className={cx("brandCollab")}>
        <a className={cx("brand")} href="#main" aria-label="기술로 살아남기 홈"><span className={cx("brand-mark")}>기살<span>.</span></span></a>
        <span className={cx("collabCross")} aria-hidden="true">×</span>
        <Link className={cx("restoryBrand")} href="/" aria-label="Restory 리스토리 메인으로 이동">Restory</Link>
      </div>
      <nav aria-label="메인 메뉴"><a href="#about">기살의 생각</a><a href="#people">현장 이야기</a><a href="#curriculum">커리큘럼</a><a href="#apply">모집 안내</a></nav>
      <EnrollButton className={cx("nav-cta")}>1 : 1 무료 진단 시작하기 <span aria-hidden="true">↗</span></EnrollButton>
    </div>
  </header>
  <main id="main">
    <section className={cx("hero")} aria-labelledby="hero-title">
      <div className={cx("hero-photo")} aria-hidden="true"></div>
      <div className={cx("hero-shade")} aria-hidden="true"></div>
      <div className={cx("wrap hero-inner")}>
        <div className={cx("hero-copy")}>
          <div className={cx("eyebrow")}><span className={cx("status-dot")}></span> 1기 모집 중 <span className={cx("divider")}>/</span> 단 4명, 소수 정예</div>
          <h1 id="hero-title">손님 없는 기술자는<br />기술이 있어도<br /><span className={cx("highlight")}>무쓸모!</span><span className={cx("title-dot")} aria-hidden="true">↗</span></h1>
          <p className={cx("hero-desc")}>기술부터 사업까지,<br /><strong>행복하게 사업하는 법.</strong></p>
          <figure className={cx("hero-team")} aria-label="기술로 살아남기를 함께하는 리스토리 형제"><Image className={cx("hero-team-first")} src="/gisal-assets/restory-hero-portrait.png" width="1000" height="1000" alt="리스토리 형제의 첫 번째 프로필 사진" fetchPriority="high" decoding="async" loading="eager" /><Image className={cx("hero-team-second")} src="/gisal-assets/restory-second-cutout-v2.png" alt="리스토리 형제의 두 번째 프로필 사진" fetchPriority="high" decoding="async" width="1060" height="1484" loading="eager" /></figure>
          <div className={cx("hero-price")}><span className={cx("price-label")}>1기 특별 수강료</span><span className={cx("old-price")}>1,000만 원</span><span className={cx("hero-price-now")}>490<span>만 원</span></span></div>
          <div className={cx("hero-actions")}><EnrollButton className={cx("button button-green")}>1 : 1 무료 진단 시작하기 <span aria-hidden="true">↗</span></EnrollButton><a className={cx("text-link")} href="#curriculum">무엇을 배우나요? <span aria-hidden="true">↓</span></a></div>
          <p className={cx("hero-footnote")}>2026. 12. 01 (화) 개강 <span>·</span> 기술 창업 &amp; 사업 교육</p>
        </div>
        <div className={cx("hero-aside")} aria-hidden="true"><div className={cx("vertical-note")}>BUILD YOUR SKILL. BUILD YOUR BUSINESS.</div><div className={cx("cohort-seal")}><span>FIRST CLASS</span><strong>04</strong><span>함께 시작할 네 사람</span></div><div className={cx("image-caption")}><span className={cx("portrait-label")}>RESTORY BROTHERS</span>리스토리 형제와 함께,<br /><b>기술부터 사업까지.</b></div></div>
      </div>
      <p className={cx("heroArtNote")}>배경은 교육 방향을 표현한 연출 이미지입니다.</p>
    </section>
    <section className={cx("quick-facts")} aria-label="1기 모집 핵심 정보"><div className={cx("wrap fact-row")}><div><span className={cx("fact-label")}>START</span><strong>12.01 <small>화요일 개강</small></strong></div><div><span className={cx("fact-label")}>TOGETHER</span><strong>4명 <small>소수 정예</small></strong></div><div><span className={cx("fact-label")}>FIRST CLASS</span><strong>490만 원 <small>1기 특별가</small></strong></div><a href="#apply" className={cx("fact-link")}>모집 자세히 보기 <span aria-hidden="true">↗</span></a></div></section>

    <section id="ai-start" className={cx("ai-start")} aria-labelledby="ai-start-title">
      <div className={cx("wrap ai-start-inner")}>
        <span className={cx("kicker")}>AI 시대, 나의 다음 시작</span>
        <h2 id="ai-start-title">AI 시대, 기술로 창업.<br /><span>나도 가능할까요?</span></h2>
        <p className={cx("ai-start-intro")}>변하는 시대, 내 손에 남는 기술.<br />나를 알리는 방법부터 사업의 시작까지 함께 배웁니다.</p>
        <figure className={cx("ai-start-visual")}><Image src="/gisal-assets/ai-skill-business.webp" width="1536" height="1024" alt="기술 창업의 방향을 표현한 연출 이미지: 노트북, 전동 공구와 로봇 팔" loading="lazy" decoding="async" /></figure>
        <p className={cx("artNote")}>교육 방향을 표현한 연출 이미지입니다.</p>
        <div className={cx("ai-start-bottom")}><p>기술을 배우는 것에서,<br /><strong>내 이름으로 사업하는 것까지.</strong></p><a className={cx("text-link")} href="#curriculum">어떻게 시작하나요? <span aria-hidden="true">↓</span></a></div>
        <div id="blog-read" className={cx("ai-start-blog")}><a className={cx("blog-read-link")} href="https://blog.naver.com/fixermans" target="_blank" rel="noopener noreferrer" aria-label="블로그 읽어보기 (새 탭)">블로그 읽어보기 <span aria-hidden="true">↗</span></a></div>
      </div>
    </section>

    <section id="about" className={cx("about-focus")} aria-labelledby="about-title">
      <div className={cx("wrap about-focus-inner")}>
        <span className={cx("about-focus-label")}>WHY GISAL</span>
        <h2 id="about-title">잘하는 기술자에서,<br /><span>찾아오는 사업자로.</span></h2>
        <p className={cx("about-focus-copy")}>내 기술을 알리고, 제대로 값을 받고,<br /><strong>내 삶을 지키며 사업하는 법을 배웁니다.</strong></p>
        <div className={cx("about-focus-cards")} aria-label="함께 배우는 사업의 세 가지 방향">
          <div className={cx("about-focus-card")}><strong>신념 + 사명 + 원칙</strong><span>지속 가능한 행복한 사업 만들기</span></div>
          <div className={cx("about-focus-card about-focus-card-featured")}><strong>퍼널 마케팅 + 브랜딩</strong><span>지속 가능한 마케팅</span></div>
          <div className={cx("about-focus-card")}><strong>바이브 코딩으로</strong><span>똑똑하게 기술 사업 하기</span></div>
        </div>
      </div>
    </section>

    <section id="people" className={cx("people")} aria-labelledby="people-title">
      <div className={cx("wrap people-grid")}>
        <FieldVideo />
        <div className={cx("people-copy")}><span className={cx("kicker")}>FROM THE FIELD — 현장의 경험을 교육으로</span><h2 id="people-title">기술을 아는 사람과,<br /><span className={cx("green")}>사업까지 함께.</span></h2><p>리스토리에서 가구 수리·리폼 서비스를 운영하며,<br />기술이 고객을 만나 사업이 되는 과정을 고민해 왔습니다.</p><p>기술로 살아남기에서는 그 경험을 바탕으로<br />일하는 기술, 나를 알리는 방법, 오래가는 사업을<br />함께 이야기합니다.</p><div className={cx("people-topics")}><span>가구 수리 · 리폼</span><span>고객과의 만남</span><span>나의 사업 운영</span></div><a href="#curriculum" className={cx("people-link")}>어떤 내용을 함께 배우나요? <span aria-hidden="true">↘</span></a></div>
      </div>
    </section>

    <section id="curriculum" className={cx("curriculum roadmap")} aria-labelledby="roadmap-title">
      <div className={cx("wrap roadmap-inner")}>
        <header className={cx("roadmap-heading")}><span className={cx("roadmap-label")}>CURRICULUM</span><h2 id="roadmap-title">5주, <span className={cx("green")}>기술 창업 성장 로드맵</span></h2><p>사업에 몰입하는 환경부터 브랜딩·마케팅, 직접 운영하는 웹사이트까지.<br /> 5주 동안 내 사업의 기반을 하나씩 만듭니다.</p></header>
        <aside className={cx("field-training")} aria-label="5주간 함께 진행하는 현장 기술 수업"><div><span>5주 내내, 함께</span><strong>주 2회 현장 기술 수업</strong></div><p>모든 기술은 <b>실제 현장에서 직접 보고 배웁니다.</b><br />이론식 기술 강의는 진행하지 않습니다.<br /><a className={cx("field-support-link")} href="#field-support">5주 이후에도 필요한 기술을 계속 배우세요 <span aria-hidden="true">↗</span></a></p></aside>
        <ol className={cx("roadmap-list")}>
          <li className={cx("roadmap-step")}><span className={cx("week-badge")}>1주차</span><div className={cx("week-content")}><h3>사업에 몰입하는 환경 만들기</h3><p><strong>부하율 · 잠재의식 · 사이버사이코네틱</strong>을 다루며,<br className={cx("roadmap-break")} /> 사업에 집중할 수 있는 환경을 만듭니다.</p></div></li>
          <li className={cx("roadmap-step")}><span className={cx("week-badge")}>2주차</span><div className={cx("week-content")}><h3>신념 · 사명 · 사업 원칙 세팅</h3><p>나를 알리는 <strong>브랜딩의 초석</strong>을 다지고,<br className={cx("roadmap-break")} /> 사업을 지속하는 힘이 될 나만의 원칙을 세웁니다.</p></div></li>
          <li className={cx("roadmap-step")}><span className={cx("week-badge")}>3주차</span><div className={cx("week-content")}><h3>사명을 전략으로, 브랜딩</h3><p>정리한 사명을 <strong>사업의 전략으로 구체화</strong>하고,<br className={cx("roadmap-break")} /> 나를 어떻게 알릴지 브랜딩의 방향을 잡습니다.</p></div></li>
          <li className={cx("roadmap-step")}><span className={cx("week-badge")}>4주차</span><div className={cx("week-content")}><h3>꿈의 고객을 찾는 퍼널 마케팅</h3><p><strong>꿈의 고객을 찾고, 고객이 나를 발견해 문의하기까지</strong>의 흐름을 설계합니다.<br className={cx("roadmap-break")} /> 블로그 · 숨고 · 당근 · 플레이스부터<br className={cx("roadmap-break")} /> 인스타 릴스 · 유튜브 쇼츠 · 유튜브 롱폼 · 쓰레드까지, 채널별 마케팅을 배웁니다.</p></div></li>
          <li className={cx("roadmap-step")}><span className={cx("week-badge")}>5주차</span><div className={cx("week-content")}><h3>바이브 코딩으로 나만의 사업 사이트 만들기</h3><p>랜딩페이지부터 <strong>고객 스케줄 등록·관리, 작업 사례를 계속 올리는 기능</strong>까지 직접 만듭니다.</p><ul className={cx("site-outcomes")} aria-label="직접 만드는 사이트의 기능"><li>나만의 랜딩페이지</li><li>고객 · 스케줄 관리</li><li>작업 사례 업로드</li></ul><p className={cx("week-goal")}>교육 이후에도 <strong>스스로 사이트를 관리하고 유지보수할 수 있도록</strong> 배웁니다.</p></div></li>
        </ol>
        <a className={cx("roadmap-link")} href="#apply">5주 과정 모집 안내 보기 <span aria-hidden="true">↗</span></a>
      </div>
    </section>

    <section id="field-support" className={cx("field-support")} aria-labelledby="field-support-title">
      <div className={cx("wrap field-support-inner")}>
        <header className={cx("field-support-heading")}><span className={cx("field-support-label")}>BEYOND 5 WEEKS</span><h2 id="field-support-title">5주가 끝나도,<br /><span className={cx("green")}>기술 교육은 계속됩니다.</span></h2><p>사업을 하다 필요한 기술이 생기면 요청하세요.<br />리스토리의 가구 수리·리폼 기술을 실제 현장에서 계속 알려드립니다.</p></header>
        <ol className={cx("support-flow")} aria-label="수료 후 기술 교육 진행 방식"><li><span>01</span><strong>필요한 기술 요청</strong></li><li><span>02</span><strong>현장 일정 조율</strong></li><li><span>03</span><strong>현장에서 추가 교육</strong></li></ol>
        <div className={cx("skill-catalog-heading")}><h3>이런 기술을 배웁니다.</h3><p>필요한 항목을 요청하면 해당 작업 현장 일정에 맞춰 교육을 이어갑니다.</p></div>
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
        <p className={cx("field-support-closing")}>5주 동안 사업의 기반을 만들고,<br /><strong>현장에서 필요한 기술은 계속 채워갑니다.</strong></p>
        <a className={cx("roadmap-link")} href="#apply">기술로 살아남기 1기 모집 안내 <span aria-hidden="true">↗</span></a>
      </div>
    </section>

    <section className={cx("belief")}><div className={cx("wrap belief-inner")}><div className={cx("belief-symbol")} aria-hidden="true">↗</div><div><span className={cx("kicker")}>OUR BELIEF</span><h2>기술은 먹고살기 위해.<br />사업은 <span>행복하게 살기 위해.</span></h2><p>혼자 고민하던 기술과 사업의 사이.<br />이번에는 같은 방향을 보는 네 사람이 함께 시작합니다.</p></div><span className={cx("belief-sign")}>기술로 살아남기.</span></div></section>

    <section id="apply" className={cx("enrollment section-light")}><div className={cx("wrap enrollment-grid")}><div className={cx("enrollment-copy")}><span className={cx("kicker")}>03 — YOUR FIRST CHAPTER</span><h2>첫 시작은,<br />딱 <span className={cx("underline-green")}>네 사람</span>과.</h2><p>기술을 배우고, 나를 알리고,<br />내 이름으로 행복하게 사업하고 싶다면.<br />기술로 살아남기 1기에서 시작하세요.</p><div className={cx("seat-illustration")} aria-label="모집 정원 4명"><span>01</span><span>02</span><span>03</span><span>04</span></div><p className={cx("seats-caption")}>함께 시작할 1기 모집 정원 · 4명</p></div><div className={cx("enrollment-ticket")}><div className={cx("ticket-top")}><span><span className={cx("status-dot")}></span> 1기 모집 중</span><b>FIRST CLASS</b></div><div className={cx("ticket-body")}><p className={cx("ticket-label")}>5주 사업 과정 + 수료 후 요청형 기술 교육</p><h3>기술로 살아남기</h3><div className={cx("ticket-old")}>정가 <del>10,000,000원</del><span>510만 원 할인</span></div><div className={cx("ticket-price")}>490<span>만 원</span></div><p className={cx("ticket-price-caption")}>1기 특별 수강료</p><dl className={cx("ticket-facts")}><div><dt>개강일</dt><dd>2026년 12월 1일 (화)</dd></div><div><dt>모집 인원</dt><dd>4명 소수 정예</dd></div><div><dt>사업 과정</dt><dd>5주</dd></div><div><dt>현장 기술 수업</dt><dd>5주간 주 2회</dd></div><div><dt>수료 후 기술 교육</dt><dd>요청에 따라 계속</dd></div><div><dt>교육 주제</dt><dd>기술 · 브랜딩 · 마케팅 · 웹사이트</dd></div></dl><EnrollButton className={cx("button button-green")}>1 : 1 무료 진단 시작하기 <span aria-hidden="true">↗</span></EnrollButton><p className={cx("ticket-note")}>교육 장소 · 세부 시간표는 추후 안내됩니다.</p></div></div></div></section>

    <section id="premium" className={cx("premium section-light")} aria-labelledby="premium-title">
      <div className={cx("wrap")}>
        <div className={cx("premium-card")}>
          <div className={cx("premium-offer")}>
            <span className={cx("premium-label")}>PREMIUM</span>
            <h2 id="premium-title">기술로 살아남기<br /><span>Premium.</span></h2>
            <p className={cx("premium-intro")}>기본 과정에 밀착 지원을 더한 과정</p>
            <p className={cx("premium-price")} aria-label="프리미엄 수강료 990만 원">990<span>만 원</span></p>
          </div>
          <div className={cx("premium-care")}>
            <span className={cx("premium-care-label")}>매출 안정화 밀착 지원 · 케어</span>
            <h3>월 매출 <span>500만 원,</span><br /><span>2개월 안정화</span>까지.</h3>
            <p>월 매출 500만 원을 2개월간 안정적으로 유지할 때까지<br className={cx("premium-break")} /> 밀착 지원·케어합니다.</p>
            <ul className={cx("premium-inclusions")} aria-label="Premium 과정 구성"><li>기본 과정 포함</li><li>매출 안정화 지원</li><li>밀착 케어</li></ul>
            <EnrollButton className={cx("button button-green")}>1 : 1 무료 진단 시작하기 <span aria-hidden="true">↗</span></EnrollButton>
          </div>
        </div>
      </div>
    </section>

    <section className={cx("faq section-light")}><div className={cx("wrap faq-grid")}><div><span className={cx("kicker")}>BEFORE WE START</span><h2>궁금한 이야기.</h2></div><div className={cx("faq-items")}><details><summary>기술만 배우는 강의인가요?<span className={cx("expand")} aria-hidden="true"></span></summary><p>5주 동안 사업에 몰입하는 환경, 신념·사명·원칙, 브랜딩, 퍼널 마케팅, 바이브 코딩을 통한 사업 사이트 제작을 함께 배웁니다. 이 과정 내내 주 2회 현장 기술 수업을 진행합니다. 모든 기술은 실제 현장에서 직접 보고 배우며, 이론식 기술 강의는 진행하지 않습니다.</p></details><details><summary>언제 시작하고, 몇 명이 함께하나요?<span className={cx("expand")} aria-hidden="true"></span></summary><p>2026년 12월 1일 화요일 개강 예정이며, 5주 과정으로 진행합니다. 1기 모집 정원은 4명이며, 전 과정에 걸쳐 주 2회 실제 현장 기술 수업을 함께 진행합니다. 교육 장소와 세부 시간표는 추후 안내됩니다.</p></details><details><summary>5주가 끝나면 기술 교육도 끝나나요?<span className={cx("expand")} aria-hidden="true"></span></summary><p>아니요. 5주 사업 과정이 끝난 뒤에도 필요한 가구 수리·리폼 기술을 요청하면 계속 교육합니다. 배우고 싶은 항목을 요청하고 해당 작업 현장 일정을 조율해, 실제 현장에서 직접 보고 배웁니다.</p></details><details><summary>어떤 가구 수리·리폼 기술을 배울 수 있나요?<span className={cx("expand")} aria-hidden="true"></span></summary><p>상부장·하부장 수리, 싱크대 문짝 교체, 경첩·서랍 레일 교체, 슬라이딩 도어 수리, 의자·붙박이 소파 천갈이, 테이블 가죽 리폼, 소파 꺼짐·구조 복원, 생활 가구 수리와 주방 공간 리폼을 배울 수 있습니다. 필요한 기술에 맞는 실제 작업 현장에서 교육을 진행합니다.</p></details><details><summary>수강료와 신청 방법이 궁금해요.<span className={cx("expand")} aria-hidden="true"></span></summary><p>기본 과정의 정가는 1,000만 원이며 1기 특별 수강료는 490만 원입니다. Premium 과정은 990만 원으로, 기본 과정에 월 매출 500만 원을 2개월간 안정적으로 유지할 때까지 밀착 지원·케어를 더했습니다. ‘1 : 1 무료 진단 시작하기’ 버튼에서 온라인 무료 진단 또는 오프라인 상담(5만 원)을 신청할 수 있습니다. 상담 후 교육 과정과 신청 절차를 안내합니다.</p></details></div></div></section>
  </main>
  <footer><div className={cx("wrap footer-inner")}><a className={cx("brand")} href="#main"><span className={cx("brand-mark")}>기살<span>.</span></span><span className={cx("brand-name")}>기술로<br />살아남기</span></a><p>기술부터 사업까지, 행복하게 사업하는 법.</p><Link className={cx("restoryHome")} href="/">리스토리 스튜디오 ↗</Link><span>© 2026 GISAL.</span></div></footer>
  <div className={cx("mobile-apply")}><div><small>1기 특별가</small><strong>490만 원</strong></div><EnrollButton className={cx("button button-green")}>1 : 1 무료 진단 시작하기 <span aria-hidden="true">↗</span></EnrollButton></div>


  </EnrollmentProvider>;
}
