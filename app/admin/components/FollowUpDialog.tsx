"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { TECHS, type Tech } from "../lib/constants";
import type { FollowUpDraft, FollowUpKind } from "../lib/followUp";
import { getVisibleMemo } from "../lib/jobTechs";
import { shiftDay } from "../lib/schedule";
import type { Job } from "../lib/types";
import { formatFullDate, today } from "../lib/utils";
import ArrivalTime from "./ArrivalTime";
import JobDialog from "./JobDialog";
import common from "../operations.module.css";
import s from "./intake.module.css";

type Props = {
  kind: FollowUpKind;
  job: Job;
  onClose: () => void;
  onSave: (draft: FollowUpDraft, onError: (message: string) => void) => Promise<void>;
};

export default function FollowUpDialog({ kind, job, onClose, onSave }: Props) {
  const install = kind === "install";
  const title = install ? (job.install_date ? "시공 일정 변경" : "시공일 정하기") : "A/S 방문 등록";
  const titleId = useId();
  const formId = useId();
  const dateInput = useRef<HTMLInputElement>(null);
  const submitting = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const day = today();
  const [draft, setDraft] = useState<FollowUpDraft>(() => ({
    id: crypto.randomUUID(),
    date: install ? job.install_date || "" : day,
    time: install ? job.install_time?.slice(0, 5) || "" : "",
    tech: job.tech || "",
    memo: getVisibleMemo(job.memo),
  }));
  const change = <K extends keyof FollowUpDraft>(field: K, value: FollowUpDraft[K]) => {
    setDraft(previous => ({ ...previous, [field]: value }));
    setError("");
  };
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    if (!draft.date || (install && draft.date < job.visit_date)) {
      setError(!draft.date ? "방문할 날짜를 선택해 주세요." : "실측일과 같거나 이후인 날짜를 선택해 주세요.");
      dateInput.current?.focus();
      return;
    }
    submitting.current = true;
    setBusy(true);
    setError("");
    try {
      await onSave(draft, setError);
    } catch {
      setError("저장 결과를 확인하지 못했어요. 다시 저장해 주세요.");
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return (
    <JobDialog labelledBy={titleId} onClose={onClose} busy={busy}>
      <header className={common.modalHeader}>
        <h2 id={titleId}>{title}</h2>
        <button type="button" className={common.close} aria-label="창 닫기" disabled={busy} onClick={onClose}>×</button>
      </header>
      <form id={formId} className={s.body} noValidate onSubmit={submit} inert={busy} aria-busy={busy}>
        <section className={s.followUpContext} aria-label="기존 작업">
          <strong>{job.name} 고객님 · {job.symptom}</strong>
          <span>{job.region}{!install && job.phone && ` · ${job.phone}`}</span>
          <span>{formatFullDate(install ? job.visit_date : job.install_date || job.visit_date)} {install ? "실측 방문" : "기존 작업"}</span>
        </section>
        <div className={s.section}>
          <div className={s.pair}>
            <label className={common.field}>
              <span>{install ? "시공일" : "A/S 방문일"}</span>
              <input ref={dateInput} type="date" required min={install ? job.visit_date : undefined}
                value={draft.date} onChange={event => change("date", event.target.value)} />
            </label>
            <ArrivalTime name="time" label={install ? "시공 시각" : "방문 시각"} value={draft.time} onChange={value => change("time", value)} />
          </div>
          <div className={s.quickDates} role="group" aria-label="빠른 날짜 선택">
            {["오늘", "내일"].map((label, offset) => {
              const date = shiftDay(day, offset);
              return <button key={label} type="button" aria-pressed={date === draft.date} disabled={install && date < job.visit_date} onClick={() => change("date", date)}>{label}</button>;
            })}
          </div>
          {!install && <>
            <label className={common.field}>
              <span>주담당 기사</span>
              <select value={draft.tech} onChange={event => change("tech", event.target.value as Tech)}>
                <option value="">미배정</option>
                {TECHS.map(tech => <option key={tech}>{tech}</option>)}
              </select>
            </label>
            <label className={common.field}>
              <span>방문 메모 <small>선택</small></span>
              <textarea rows={2} value={draft.memo} placeholder="이번 방문에서 확인할 내용" onChange={event => change("memo", event.target.value)} />
            </label>
          </>}
          <p className={s.hint}>{install ? "시공을 완료하면 시공월 매출에 한 번 반영돼요." : "A/S 방문은 일정에 표시되고 매출과 기사 실적에서 제외돼요."}</p>
          {error && <p role="alert" className={s.fieldError}>{error}</p>}
        </div>
      </form>
      <footer className={common.modalFooter}>
        <button type="button" className={common.neutral} disabled={busy} onClick={onClose}>{install && !job.install_date ? "나중에 정하기" : "닫기"}</button>
        <button form={formId} type="submit" className={common.primary} disabled={busy}>
          {busy ? "저장 중…" : install ? "시공 일정 저장" : "A/S 방문 등록"}
        </button>
      </footer>
    </JobDialog>
  );
}
