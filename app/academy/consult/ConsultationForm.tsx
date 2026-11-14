"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { communityClient } from "@/lib/community/client";
import { CALL_TIMES, CONSENT_VERSION, CONSULTATION_TYPES, SITUATIONS, REPAIR_EXPERIENCES, MARKETING_EXPERIENCES } from "@/lib/academy/consultation";
import { trackAcademy } from "@/lib/academy/analytics";
import { ACADEMY_OFFER as offer } from "@/lib/academy/offer";
import styles from "./consult.module.css";

const steps = ["상담 안내", "상황과 경험", "연락처"];
const emptyContact = { name: "", phone: "", email: "", region: "", age_range: "", repair_experience: "", marketing_experience: "", available_time: "", message: "", website: "" };

export default function ConsultationForm() {
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState("online");
  const [situation, setSituation] = useState("");
  const [contact, setContact] = useState(emptyContact);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submissionId = useRef<string | null>(null);
  const submitting = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const selection = CONSULTATION_TYPES.find(item => item.value === kind)!;
  const experienceReady = SITUATIONS.some(item => item.value === situation)
    && REPAIR_EXPERIENCES.some(item => item.value === contact.repair_experience)
    && MARKETING_EXPERIENCES.some(item => item.value === contact.marketing_experience);

  const started = useRef(false);
  useEffect(() => {
    if (!started.current) { trackAcademy("academy_consult_start"); started.current = true; }
  }, []);
  const trackedStep = useRef<number | null>(null);
  useEffect(() => {
    if (trackedStep.current !== step) {
      trackAcademy("academy_consult_step_view", { step: step + 1 });
      trackedStep.current = step;
    }
  }, [step]);

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
    trackAcademy("academy_consult_submit_attempt", { consultation_type: kind === "offline" ? "offline" : "online" });
    try {
      const { error: resultError } = await communityClient().rpc("submit_academy_consultation", {
        p_id: submissionId.current, p_data: { ...contact, consultation_type: kind, situation, consent, consent_version: CONSENT_VERSION },
      });
      if (resultError) {
        trackAcademy("academy_consult_submit_error", { reason: resultError.message.includes("rate_limit") ? "rate_limit" : resultError.message.includes("invalid_input") ? "invalid_input" : "server" });
        if (resultError.message.includes("rate_limit")) setError("신청이 여러 번 접수되었습니다. 잠시 후 다시 시도하거나 1688-2957로 문의해주세요.");
        else if (resultError.message.includes("invalid_input")) setError("입력 내용과 개인정보 수집 동의를 다시 확인해주세요.");
        else setError("신청을 접수하지 못했습니다. 입력 내용은 유지되니 잠시 후 다시 눌러주세요.");
        return;
      }
      trackAcademy("academy_consult_submit_success", { consultation_type: kind === "offline" ? "offline" : "online" });
      setSubmitted(true); setContact(emptyContact);
      requestAnimationFrame(() => heading.current?.focus());
    } catch { trackAcademy("academy_consult_submit_error", { reason: "network" }); setError("연결이 원활하지 않습니다. 입력 내용은 유지되니 다시 시도해주세요."); }
    finally { submitting.current = false; setBusy(false); }
  }

  if (submitted) return <main className={styles.success}>
    <span className={styles.successIcon} aria-hidden="true">✓</span><p className={styles.eyebrow}>APPLICATION RECEIVED</p>
    <h1 ref={heading} tabIndex={-1}>상담 신청이 접수되었습니다.</h1>
    <p>남겨주신 상황을 살펴보고,<br />알려주신 시간대에 연락드려 일정을 안내하겠습니다.</p>
    <div className={styles.receipt}><span>{selection.format} · {selection.label}</span><strong>{selection.price}</strong></div>
    {kind === "offline" && <p className={styles.muted}>상담 장소와 결제 방법은 연락드려 안내합니다.</p>}
    <Link href="/academy" className={styles.primary}>과정 소개 둘러보기 <span aria-hidden="true">↗</span></Link>
  </main>;

  return <main className={styles.layout}>
    <section className={styles.formSection} aria-label="상담 신청">
      <ol className={styles.progress} aria-label="신청 진행 단계">{steps.map((label, index) => <li key={label} aria-current={index === step ? "step" : undefined} data-active={index <= step}><span>{index < step ? "✓" : `0${index + 1}`}</span>{label}</li>)}</ol>
      <p className={styles.eyebrow}>{step + 1} / 3 · {steps[step]}</p>
      <h1 ref={heading} tabIndex={-1}>{step === 0 ? <>내 이름으로 사업하는 일,<br /><em>어디서 시작할지</em> 함께 살펴봐요.</> : step === 1 ? "지금의 상황과 경험을 알려주세요." : "연락받으실 정보를 알려주세요."}</h1>
      <p className={styles.intro}>{step === 0 ? "현재의 고민을 듣고, 이 과정이 내 사업 준비에 맞는지 함께 살펴보는 상담입니다." : step === 1 ? "각 질문에서 가장 가까운 항목을 하나씩 선택해주세요. 기술과 마케팅이 모두 처음이어도 괜찮습니다." : "알려주신 시간대에 연락드려 상담 일정을 조율합니다. 이름·전화번호·지역·나이·통화 시간과 동의는 필수이며, 이메일과 메시지는 선택입니다."}</p>
      {step === 0 && <>
        <div className={styles.consultPurpose}>
          <h2>진단에서 함께 살펴볼 내용</h2>
          <ol>{offer.consultationTopics.map(topic => <li key={topic}>{topic}</li>)}</ol>
          <p>신청은 교육 과정 등록이나 결제를 확정하지 않습니다.</p>
        </div>
        <fieldset className={styles.options}><legend className={styles.srOnly}>상담 방식 선택</legend>{CONSULTATION_TYPES.map(item => <label className={styles.choice} key={item.value} data-selected={kind === item.value}>
          <input type="radio" name="consultation-type" value={item.value} checked={kind === item.value} onChange={() => setKind(item.value)} />
          <span className={styles.choiceBody}><span className={styles.optionTag}>{item.value === "online" ? "먼저 만나보세요" : "직접 만나 이야기해요"}</span><span className={styles.choiceTitle}>{item.label}<b>{item.price}</b></span><span className={styles.format}>{item.format}</span><span className={styles.description}>{item.description}</span></span>
        </label>)}</fieldset>
        <div className={styles.notice}>신청 후 연락을 통해 일정을 조율합니다.{kind === "offline" && " 오프라인 상담 비용은 5만 원이며, 장소와 결제 방법은 별도로 안내합니다."}</div>
        <div className={styles.actions}><Link href="/academy" className={styles.secondary}>과정 소개</Link><button type="button" className={styles.primary} onClick={() => move(1)}>다음 <span aria-hidden="true">→</span></button></div>
      </>}
      {step === 1 && <>
        <p className={styles.learningFit}>{offer.applicantTitle} {offer.applicantMindset}</p>
        <fieldset className={`${styles.options} ${styles.situationOptions} ${styles.situationGrid}`}><legend>현재 상황 <span>*</span></legend>{SITUATIONS.map(item => <label className={styles.choice} key={item.value} data-selected={situation === item.value}><input type="radio" name="situation" value={item.value} checked={situation === item.value} onChange={() => setSituation(item.value)} /><span className={styles.choiceBody}><strong>{item.label}</strong><span className={styles.description}>{item.description}</span></span></label>)}</fieldset>
        <fieldset className={styles.experienceQuestion}><legend>집수리·가구수리 등 수리·시공 경험이 있으신가요? <span>*</span></legend><p className={styles.hint}>지금의 경험에 가장 가까운 항목을 골라주세요.</p><div className={styles.experienceOptions}>{REPAIR_EXPERIENCES.map(item => <label key={item.value} data-selected={contact.repair_experience === item.value}><input type="radio" name="repair_experience" required value={item.value} checked={contact.repair_experience === item.value} onChange={() => field("repair_experience", item.value)} />{item.label}</label>)}</div></fieldset>
        <fieldset className={styles.experienceQuestion}><legend>마케팅을 직접 해보신 적이 있으신가요? <span>*</span></legend><p className={styles.hint}>블로그에 일상글을 써본 경험도 포함해요.</p><div className={styles.experienceOptions}>{MARKETING_EXPERIENCES.map(item => <label key={item.value} data-selected={contact.marketing_experience === item.value}><input type="radio" name="marketing_experience" required value={item.value} checked={contact.marketing_experience === item.value} onChange={() => field("marketing_experience", item.value)} />{item.label}</label>)}</div></fieldset>
        <p className={styles.hint}>상황과 두 가지 경험을 선택하면 연락처 입력으로 넘어갑니다.</p>
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
          <div className={styles.consentBlock}><label className={styles.consent}><input name="consent" type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} /><span>개인정보 수집 및 이용에 동의합니다. <b>(필수)</b></span></label><details><summary>수집 및 이용 내용 보기</summary><div className={styles.consentDetails}><p>수집·이용 주체: 리스토리 스튜디오</p><p>필수 항목: 상담 방식, 현재 상황, 이름, 전화번호, 거주 지역, 나이, 수리·시공 경험, 마케팅 경험, 통화 가능 시간대, 동의 일시</p><p>선택 항목: 이메일, 미리 하고 싶은 말</p><p>이용 목적: 기살 1:1 기술 창업 상담 진행, 경험에 맞는 상담 준비 및 일정 안내</p><p>보유 기간: 접수일로부터 90일. 동의 철회 요청 시 지체 없이 삭제합니다.</p><p>동의를 거부하실 수 있으나, 동의하지 않으면 상담 신청이 어렵습니다. 선택 항목을 입력하지 않아도 신청할 수 있습니다.</p><p>동의 철회·삭제 문의: <a href="tel:16882957">1688-2957</a></p></div></details></div>
        </fieldset>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.actions}><button type="button" className={styles.secondary} disabled={busy} onClick={() => move(1)}>이전</button><button type="submit" className={styles.primary} disabled={busy}>{busy ? "접수 중…" : kind === "offline" ? "오프라인 상담 신청하기" : "1:1 무료 진단 신청하기"}<span aria-hidden="true">↗</span></button></div>
        <p className={styles.hint}>신청은 교육 과정 등록이나 결제를 확정하지 않습니다.</p>
      </form>}
    </section>
    <aside className={styles.summary} aria-label="선택한 상담 정보"><p className={styles.eyebrow}>YOUR NEXT CHAPTER</p><h2>기술에서<br /><span>내 사업으로.</span></h2><p>어디서 시작할지 막막하다면,<br />지금의 고민부터 들려주세요.</p><div className={styles.summarySelection}><span>선택한 상담</span><strong>{selection.label}</strong><div><span>{selection.format}</span><b>{selection.price}</b></div></div>{situation && <div className={styles.summarySituation}><span>현재 상황</span><strong>{SITUATIONS.find(item => item.value === situation)?.label}</strong></div>}<ul><li>지금의 상황과 고민을 먼저 듣습니다.</li><li>사업 교육과 현장 실습이 내 상황에 맞는지 살펴봅니다.</li><li>신청 후 연락드려 일정을 조율합니다.</li></ul><Link href="/academy#curriculum">과정이 궁금하다면 <span aria-hidden="true">↗</span></Link></aside>
  </main>;
}
