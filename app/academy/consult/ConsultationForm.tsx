"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { communityClient } from "@/lib/community/client";
import { CALL_TIMES, CONSENT_VERSION, COACHING, COACHING_DIAGNOSES, COACHING_MATERIALS, TRADES, REPAIR_EXPERIENCES, MARKETING_EXPERIENCES } from "@/lib/academy/consultation";
import { trackAcademy } from "@/lib/academy/analytics";
import type { AcademyAttribution } from "@/lib/academy/attribution";
import { videoProperties, type VideoRecord } from "@/lib/academy/video-attribution";
import { ACADEMY_OFFER as offer } from "@/lib/academy/offer";
import styles from "./consult.module.css";

const steps = ["코칭 안내", "직종과 경험", "연락처"];
const emptyContact = { name: "", phone: "", email: "", region: "", age_range: "", repair_experience: "", marketing_experience: "", available_time: "", message: "", website: "" };

export default function ConsultationForm({ attribution: { source_plan, source_cta }, videoContext = null }: { attribution: AcademyAttribution; videoContext?: VideoRecord | null }) {
  // Freeze entry-time viewing history across steps, retries and a long form session.
  const videoAtEntry = useRef(videoProperties(videoContext));
  const [step, setStep] = useState(0);
  // One offer now: 2-hour 1:1 coaching. Trade replaces the old "current situation" question.
  const kind = COACHING.value;
  const [trade, setTrade] = useState("");
  const [contact, setContact] = useState(emptyContact);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submissionId = useRef<string | null>(null);
  const submitting = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const selection = COACHING;
  // This is entry interest, not a selected enrollment or a new form field.
  const courseName = source_plan === "basic" ? "기본 과정" : source_plan === "setup" ? offer.setupName : null;
  const courseContext = courseName ? <div className={styles.courseContext} role="note" aria-label="관심 과정"><span>관심 과정</span><strong>{courseName}</strong></div> : null;
  const experienceReady = TRADES.some(item => item.value === trade)
    && REPAIR_EXPERIENCES.some(item => item.value === contact.repair_experience)
    && MARKETING_EXPERIENCES.some(item => item.value === contact.marketing_experience);

  useEffect(() => {
    // A deep landing-page CTA must open at the consultation heading and course context.
    const frame = requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const started = useRef(false);
  useEffect(() => {
    if (!started.current) { trackAcademy("academy_consult_start", { source_plan, source_cta, ...videoAtEntry.current }); started.current = true; }
  }, [source_plan, source_cta]);
  const trackedStep = useRef<number | null>(null);
  useEffect(() => {
    if (trackedStep.current !== step) {
      trackAcademy("academy_consult_step_view", { source_plan, source_cta, ...videoAtEntry.current, step: step + 1 });
      trackedStep.current = step;
    }
  }, [step, source_plan, source_cta]);

  function move(next: number) {
    setStep(next); setError("");
    requestAnimationFrame(() => { heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ behavior: "instant", block: "start" }); });
  }
  function field(key: keyof typeof contact, value: string) { setContact(previous => ({ ...previous, [key]: value })); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    if (!consent) { setError("개인정보 수집 및 이용 동의를 확인해주세요."); return; }
    if (!/^[0-9+\s()-]+$/.test(contact.phone) || !/^0\d{8,10}$/.test(contact.phone.replace(/\D/g, ""))) { setError("연락받을 전화번호를 확인해주세요. 예: 010-1234-5678"); return; }
    if (!contact.name.trim() || !contact.available_time.trim()) { setError("이름과 통화 가능한 시간대를 입력해주세요."); return; }
    if (!contact.region.trim()) { setError("거주 지역을 입력해주세요."); return; }
    if (!/^[1-9][0-9]{0,2}$/.test(contact.age_range) || Number(contact.age_range) > 120) { setError("나이를 숫자로 입력해주세요. 예: 34"); return; }
    if (!REPAIR_EXPERIENCES.some(item => item.value === contact.repair_experience) || !MARKETING_EXPERIENCES.some(item => item.value === contact.marketing_experience)) { setError("수리·시공 경험과 마케팅 경험을 선택해주세요."); return; }
    submitting.current = true; setBusy(true); setError("");
    submissionId.current ??= crypto.randomUUID();
    trackAcademy("academy_consult_submit_attempt", { source_plan, source_cta, ...videoAtEntry.current, consultation_type: kind });
    try {
      const { error: resultError } = await communityClient().rpc("submit_academy_consultation", {
        p_id: submissionId.current, p_data: { ...contact, consultation_type: kind, trade, consent, consent_version: CONSENT_VERSION },
      });
      if (resultError) {
        trackAcademy("academy_consult_submit_error", { source_plan, source_cta, ...videoAtEntry.current, reason: resultError.message.includes("rate_limit") ? "rate_limit" : resultError.message.includes("invalid_input") ? "invalid_input" : "server" });
        if (resultError.message.includes("rate_limit")) setError("신청이 여러 번 접수되었습니다. 잠시 후 다시 시도하거나 1688-2957로 문의해주세요.");
        else if (resultError.message.includes("invalid_input")) setError("입력 내용과 개인정보 수집 동의를 다시 확인해주세요.");
        else setError("신청을 접수하지 못했습니다. 입력 내용은 유지되니 잠시 후 다시 눌러주세요.");
        return;
      }
      trackAcademy("academy_consult_submit_success", { source_plan, source_cta, ...videoAtEntry.current, consultation_type: kind });
      setSubmitted(true); setContact(emptyContact);
      requestAnimationFrame(() => heading.current?.focus());
    } catch { trackAcademy("academy_consult_submit_error", { source_plan, source_cta, ...videoAtEntry.current, reason: "network" }); setError("연결이 원활하지 않습니다. 입력 내용은 유지되니 다시 시도해주세요."); }
    finally { submitting.current = false; setBusy(false); }
  }

  if (submitted) return <main className={styles.success}>
    <span className={styles.successIcon} aria-hidden="true">✓</span><p className={styles.eyebrow}>APPLICATION RECEIVED</p>
    <h1 ref={heading} tabIndex={-1}>1:1 코칭 신청이 접수되었습니다.</h1>
    {courseContext}
    <p>남겨주신 상황을 살펴보고,<br />알려주신 시간대에 연락드려 일정을 안내하겠습니다.</p>
    <div className={styles.receipt}><span>{selection.format} · {selection.label}</span><strong>{selection.price}</strong></div>
    <p className={styles.muted}>코칭 일정과 결제 방법은 연락드려 안내합니다.</p>
    <Link href="/academy" className={styles.primary}>과정 소개 둘러보기 <span aria-hidden="true">↗</span></Link>
  </main>;

  return <main className={styles.layout}>
    <section className={styles.formSection} aria-label="상담 신청">
      <ol className={styles.progress} aria-label="신청 진행 단계">{steps.map((label, index) => <li key={label} aria-current={index === step ? "step" : undefined} data-active={index <= step}><span>{index < step ? "✓" : `0${index + 1}`}</span>{label}</li>)}</ol>
      <p className={styles.eyebrow}>{step + 1} / 3 · {steps[step]}</p>
      <h1 ref={heading} tabIndex={-1}>{step === 0 ? <>기술로 살아남기<br /><em>1:1 코칭</em>을 신청해요.</> : step === 1 ? "어떤 일을 하시는지 알려주세요." : "연락받으실 정보를 알려주세요."}</h1>
      {courseContext}
      <p className={styles.intro}>{step === 0 ? "2시간 동안 내 사업을 사업체와 마케팅 두 갈래로 진단하고, 지금 먼저 손볼 것을 함께 정합니다." : step === 1 ? "하시는 일(또는 준비 중인 일)과 경험에 가장 가까운 항목을 골라주세요. 아직 처음이어도 괜찮습니다." : "알려주신 시간대에 연락드려 상담 일정을 조율합니다. 이름·전화번호·지역·나이·통화 시간과 동의는 필수이며, 이메일과 메시지는 선택입니다."}</p>
      {step === 0 && <>
        <div className={`${styles.choice} ${styles.coachingCard}`} data-selected="true">
          <span className={styles.choiceBody}>
            <span className={styles.optionTag}>기술로 살아남기 1:1 코칭</span>
            <span className={styles.choiceTitle}>{COACHING.label}<b>{COACHING.price}</b></span>
            <span className={styles.format}>{COACHING.format}</span>
            <span className={styles.description}>{COACHING.description}</span>
          </span>
        </div>
        <div className={styles.consultPurpose}>
          <h2>코칭에서 함께 진단하는 것</h2>
          <ol>{COACHING_DIAGNOSES.map(item => <li key={item.title}><strong>{item.title}</strong> — {item.detail}</li>)}</ol>
        </div>
        <div className={styles.materials}>
          <h2>코칭 시 무료 제공 자료</h2>
          <ul>{COACHING_MATERIALS.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className={styles.notice}>신청 후 연락드려 코칭 일정과 결제 방법을 안내합니다. 신청만으로 결제되지 않습니다.</div>
        <div className={styles.actions}><Link href="/academy" className={styles.secondary}>과정 소개</Link><button type="button" className={styles.primary} onClick={() => move(1)}>다음 <span aria-hidden="true">→</span></button></div>
      </>}
      {step === 1 && <>
        <p className={styles.learningFit}>{offer.applicantTitle} {offer.applicantMindset}</p>
        <fieldset className={`${styles.options} ${styles.situationOptions} ${styles.situationGrid} ${styles.tradeGrid}`}><legend>어떤 일을 하시나요? <span>*</span></legend>{TRADES.map(item => <label className={styles.choice} key={item.value} data-selected={trade === item.value}><input type="radio" name="trade" value={item.value} checked={trade === item.value} onChange={() => setTrade(item.value)} /><span className={styles.choiceBody}><strong>{item.label}</strong></span></label>)}</fieldset>
        <fieldset className={styles.experienceQuestion}><legend>집수리·가구수리 등 수리·시공 경험이 있으신가요? <span>*</span></legend><p className={styles.hint}>지금의 경험에 가장 가까운 항목을 골라주세요.</p><div className={styles.experienceOptions}>{REPAIR_EXPERIENCES.map(item => <label key={item.value} data-selected={contact.repair_experience === item.value}><input type="radio" name="repair_experience" required value={item.value} checked={contact.repair_experience === item.value} onChange={() => field("repair_experience", item.value)} />{item.label}</label>)}</div></fieldset>
        <fieldset className={styles.experienceQuestion}><legend>마케팅을 직접 해보신 적이 있으신가요? <span>*</span></legend><p className={styles.hint}>블로그에 일상글을 써본 경험도 포함해요.</p><div className={styles.experienceOptions}>{MARKETING_EXPERIENCES.map(item => <label key={item.value} data-selected={contact.marketing_experience === item.value}><input type="radio" name="marketing_experience" required value={item.value} checked={contact.marketing_experience === item.value} onChange={() => field("marketing_experience", item.value)} />{item.label}</label>)}</div></fieldset>
        <p className={styles.hint}>직종과 두 가지 경험을 선택하면 연락처 입력으로 넘어갑니다.</p>
        <div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => move(0)}>이전</button><button type="button" className={styles.primary} disabled={!experienceReady} onClick={() => move(2)}>연락처 입력 <span aria-hidden="true">→</span></button></div>
      </>}
      {step === 2 && <form onSubmit={submit} className={styles.contactForm}>
        <fieldset disabled={busy} className={styles.contactFields}><legend className={styles.srOnly}>연락처와 상담 정보</legend>
          <div className={styles.fieldGrid}>
            <label>이름 <span>*</span><input name="name" autoComplete="name" required maxLength={50} value={contact.name} onChange={e => field("name", e.target.value)} placeholder="성함을 입력해주세요" /></label>
            <label>전화번호 <span>*</span><input name="phone" type="tel" autoComplete="tel" required maxLength={20} value={contact.phone} onChange={e => field("phone", e.target.value)} placeholder="010-0000-0000" /></label>
            <label className={styles.fullWidth}>이메일 <small>(선택)</small><input name="email" type="email" autoComplete="email" maxLength={254} value={contact.email} onChange={e => field("email", e.target.value)} placeholder="example@email.com" /></label>
            <label>거주 지역 <span>*</span><input name="region" required maxLength={80} value={contact.region} onChange={e => field("region", e.target.value)} placeholder="예) 서울 강남구 / 경기 성남시" /></label>
            <label>나이 <span>*</span><input name="age_range" required inputMode="numeric" pattern="[1-9][0-9]{0,2}" maxLength={3} value={contact.age_range} onChange={e => field("age_range", e.target.value)} placeholder="예) 34 (숫자만 입력)" /></label>
          </div>
          <fieldset className={styles.callTime}><legend>통화 가능 시간대 <span>*</span></legend><div className={styles.chips}>{CALL_TIMES.map(time => <button type="button" key={time} aria-pressed={contact.available_time === time} onClick={() => field("available_time", time)}>{time}</button>)}</div><input name="available_time" aria-label="통화 가능 시간대 직접 입력" required maxLength={150} value={contact.available_time} onChange={e => field("available_time", e.target.value)} placeholder="예) 평일 저녁 7시 이후 / 주말 오전이 편해요" /><p className={styles.hint}>버튼을 누르거나 편한 시간을 직접 적어주세요.</p></fieldset>
          <label>미리 하고 싶은 말 <small>(선택)</small><textarea name="message" rows={3} maxLength={2000} value={contact.message} onChange={e => field("message", e.target.value)} placeholder="어떤 일을 내 사업으로 만들고 싶은지, 지금 막막한 점이나 궁금한 점을 편하게 적어주세요." /></label>
          <div className={styles.honeypot} aria-hidden="true"><label>웹사이트<input name="website" tabIndex={-1} autoComplete="off" value={contact.website} onChange={e => field("website", e.target.value)} /></label></div>
          <div className={styles.consentBlock}><label className={styles.consent}><input name="consent" type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} /><span>개인정보 수집 및 이용에 동의합니다. <b>(필수)</b></span></label><details><summary>수집 및 이용 내용 보기</summary><div className={styles.consentDetails}><p>수집·이용 주체: 리스토리 스튜디오</p><p>필수 항목: 상담 방식, 직종, 이름, 전화번호, 거주 지역, 나이, 수리·시공 경험, 마케팅 경험, 통화 가능 시간대, 동의 일시</p><p>선택 항목: 이메일, 미리 하고 싶은 말</p><p>이용 목적: 기살 1:1 코칭 진행, 직종·경험에 맞는 코칭 준비 및 일정·결제 안내</p><p>보유 기간: 접수일로부터 90일. 동의 철회 요청 시 지체 없이 삭제합니다.</p><p>동의를 거부하실 수 있으나, 동의하지 않으면 상담 신청이 어렵습니다. 선택 항목을 입력하지 않아도 신청할 수 있습니다.</p><p>동의 철회·삭제 문의: <a href="tel:16882957">1688-2957</a></p></div></details></div>
        </fieldset>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.actions}><button type="button" className={styles.secondary} disabled={busy} onClick={() => move(1)}>이전</button><button type="submit" className={styles.primary} disabled={busy}>{busy ? "접수 중…" : "1:1 코칭 신청하기"}<span aria-hidden="true">↗</span></button></div>
        <p className={styles.hint}>신청만으로 결제되지 않습니다. 연락드려 일정과 결제 방법을 안내합니다.</p>
      </form>}
    </section>
    <aside className={styles.summary} aria-label="선택한 상담 정보"><p className={styles.eyebrow}>YOUR NEXT CHAPTER</p><h2>기술에서<br /><span>내 사업으로.</span></h2><p>어디서 시작할지 막막하다면,<br />지금의 고민부터 들려주세요.</p><div className={styles.summarySelection}><span>선택한 상담</span><strong>{selection.label}</strong><div><span>{selection.format}</span><b>{selection.price}</b></div></div>{trade && <div className={styles.summarySituation}><span>직종</span><strong>{TRADES.find(item => item.value === trade)?.label}</strong></div>}<ul><li>사업체 진단 + 마케팅 진단 (2시간)</li><li>코칭 시 강의·자료 무료 제공</li><li>신청 후 연락드려 일정을 조율합니다.</li></ul><Link href="/academy#curriculum">과정이 궁금하다면 <span aria-hidden="true">↗</span></Link></aside>
  </main>;
}
